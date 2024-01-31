import argparse
import json
import sqlite3


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('input')
    parser.add_argument('output')
    args = parser.parse_args()
    db = sqlite3.connect(args.output)
    for i, row in enumerate(open(args.input)):
        record = json.loads(row.strip())
        db.execute('INSERT INTO 科目 VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            i,
            record.get('令和２年度以降入学者'),
            record.get('令和元年度以前入学者'),
            record['教員名'],
            record['単位数'],
            record['学年'],
            record['開講区分'],
            record.get('科目群'),
            record['学期'],
            record['履修区分'],
            record['授業形態'],
            record['授業概要'],
            record['授業のねらい・到達目標'],
            record['授業の形式'],
            record['授業の方法'],
            record['教科書'],
            record['参考書'],
            record['成績評価の方法及び基準'],
            record['オフィスアワー'],
        ])
        for j, text in enumerate(record['授業計画']):
            db.execute('INSERT INTO 授業計画 VALUES(?, ?, ?)', [
                i,
                j + 1,
                text,
            ])
    db.commit()
    db.close()


if __name__ == '__main__':
    main()
