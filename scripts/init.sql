DROP TABLE IF EXISTS 科目;
CREATE TABLE 科目 (
  科目ID INTEGER PRIMARY KEY,
  科目名 TEXT,
  旧科目名 TEXT,
  教員名 TEXT,
  単位数 TEXT,
  学年 TEXT,
  開講区分 TEXT,
  科目群 TEXT,
  学期 TEXT,
  履修区分 TEXT,
  授業形態 TEXT,
  授業概要 TEXT,
  授業のねらい・到達目標 TEXT,
  授業の形式 TEXT,
  授業の方法 TEXT,
  教科書 TEXT,
  参考書 TEXT,
  成績評価の方法及び基準 TEXT,
  オフィスアワー TEXT
);

DROP TABLE IF EXISTS 授業計画;
CREATE TABLE 授業計画 (
  科目ID INTEGER,
  回数 INTEGER,
  内容 TEXT,
  PRIMARY KEY (科目ID, 回数)
);