import pg from "pg";

const pool = new pg.Pool();

export default async (req) => {
  const params = new URL(req.url).searchParams;
  const id = +params.get("id");
  console.log(id);
  const client = await pool.connect();
  const record = (
    await client.query("SELECT * FROM \"科目\" WHERE \"科目ID\" = $1", [id])
  ).rows[0];
  const plan = (
    await client.query(
      "SELECT * FROM \"授業計画\" WHERE \"科目ID\" = $1 ORDER BY \"回数\"",
      [id],
    )
  ).rows;
  record["授業計画"] = plan.map((row) => ({
    回数: row["回数"],
    内容: row["授業計画"],
  }));
  return new Response(JSON.stringify(record));
};
