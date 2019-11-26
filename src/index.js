import JiraClient from 'jira-connector';
import { parser } from './csv';

require('dotenv').config();

const pbcopy = data => {
  const proc = require('child_process').spawn('pbcopy');
  proc.stdin.write(data);
  proc.stdin.end();
};

const startedBreakout = started => {
  const match = started.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/);
  return {
    date: match[1],
    time: match[2],
  };
};

const secondsToHours = seconds => seconds / 3600.0;

(async () => {
  const jira = new JiraClient({
    host: process.env.HOST,
    basic_auth: {
      email: process.env.EMAIL,
      api_token: process.env.API_TOKEN,
    },
  });

  const project = process.env.PROJECT_KEY;
  const sprint = process.env.SPRINT_ID;
  const maxResults = 50;
  let startAt = 0;
  let total = 1;
  let issues = [];

  for (let response; startAt < total; startAt += maxResults) {
    response = await jira.search.search({
      jql: `project = ${project} AND Sprint = ${sprint}`,
      fields: ['id', 'key', 'issuetype', 'parent', 'worklog'],
      maxResults,
      startAt,
    });

    total = response.total;
    issues = [...issues, ...response.issues];
  }

  console.log(`Found ${issues.length} issues.`);

  const worklogs = issues.reduce(
    (worklogs, { id, key, fields: { issuetype, parent, worklog } }) => [
      ...worklogs,
      ...worklog.worklogs.map(
        ({
          author: { key: authorKey, displayName },
          started,
          timeSpentSeconds,
        }) => ({
          authorKey,
          name: displayName,
          key,
          issuetype,
          parent,
          started: startedBreakout(started),
          timeSpentSeconds,
          timeSpentHours: secondsToHours(timeSpentSeconds),
        })
      ),
    ],
    []
  );

  const csv = parser.parse(worklogs);

  pbcopy(csv);

  console.log(`Copied ${worklogs.length} worklogs to clipboard.`);
})();
