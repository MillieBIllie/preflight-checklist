import 'dotenv/config';
console.log(process.env.DATABASE_URL);
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function main() {
  try {
    const rows = await sql`select now() as now`;
    console.log(rows);
  } catch (err) {
    console.error('DB ERROR >>>', err);
  }
}

main();
