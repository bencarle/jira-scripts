import { Parser } from 'json2csv';

const fields = [
  { value: 'authorKey', label: 'Author Key' },
  { value: 'name', label: 'Author' },
  { value: 'key', label: 'Issue Key' },
  { value: 'issuetype.name', label: 'Issue Type' },
  { value: 'parent.key', label: 'Parent Key' },
  { value: 'parent.fields.issuetype.name', label: 'Parent Type' },
  { value: 'started.date', label: 'Date' },
  { value: 'started.time', label: 'Time' },
  { value: 'timeSpentSeconds', label: 'Seconds' },
  { value: 'timeSpentHours', label: 'Hours' },
];

export const parser = new Parser({ fields, delimiter: '\t' });
