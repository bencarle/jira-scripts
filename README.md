# Jira Scripts

## Installation

Install packages:
```shell script
npm install
```

Copy the example env file:
```shell script
cp .env.example .env
```

Add custom values to `.env`. [Generate an API token](https://id.atlassian.com/manage/api-tokens) and save 
with in `.env`.

## Run

```shell script
npm run fetch
```

This will retrieve issues and work logs from Jira, parse to CSV, and copy the data to the clipboard.

