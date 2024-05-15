import pg from "pg";

const pool = new pg.Pool();

export default async (req) => {
  const params = new URL(req.url).searchParams;
  const keyword = `%${params.get("q")}%`;
  const client = await pool.connect();
  const result = (
    await client.query(
      'SELECT DISTINCT "科目"."科目ID" FROM "科目" JOIN "授業計画" ON "科目"."科目ID" = "授業計画"."科目ID" WHERE "科目名" LIKE $1 OR "授業概要" LIKE $1 OR "授業のねらい・到達目標" LIKE $1 OR "内容" LIKE $1',
      [keyword],
    )
  ).rows.map((row) => +row["科目ID"]);
  return new Response(JSON.stringify(result));
};
