import { readFileSync } from 'node:fs';

const token = (process.env.SUPABASE_ACCESS_TOKEN || readFileSync(0, 'utf8')).trim();
const file = process.argv[2];
if (!token || !file) throw new Error('Provide a SQL file and SUPABASE_ACCESS_TOKEN or token on stdin.');
const response = await fetch('https://api.supabase.com/v1/projects/nwuanuqblzzikhrpwzwd/database/query', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: readFileSync(file, 'utf8'), read_only: !process.argv.includes('--apply') }),
});
if (!response.ok) {
  console.error(`SQL request failed: HTTP ${response.status}`, await response.text());
  process.exitCode = 1;
} else {
  console.log(JSON.stringify(await response.json()));
}
