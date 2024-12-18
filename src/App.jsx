import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

async function fetchSubject(id) {
  const response = await fetch(`/.netlify/functions/subjects?id=${id}`);
  return response.json();
}

async function fetchSubjectIds(keyword) {
  const response = await fetch(`/.netlify/functions/search?q=${keyword}`);
  return response.json();
}

const categories = [
  "全学共通教育科目",
  "総合教育科目",
  "外国語科目",
  "ドイツ文学科、外国語科目",
  "コンピュータ科目",
  "健康・スポーツ教育科目",
  "コース科目",
  "哲学科",
  "史学科",
  "国文学科",
  "中国語中国文化学科",
  "英文学科",
  "ドイツ文学科",
  "社会学科",
  "社会福祉学科",
  "教育学科",
  "体育学科",
  "心理学科",
  "地理学科",
  "地球科学科",
  "数学科",
  "情報科学科",
  "物理学科",
  "生命科学科",
  "化学科",
];

function shorten(text, maxLength) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength - 1) + "…";
  }
  return text;
}

function DrawingContent({ data, onClickNode, target }) {
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  return (
    <>
      <g>
        {data.links.map((link) => {
          const line = d3
            .line()
            .x((key) => data.nodes[key].x)
            .y((key) => data.nodes[key].y);
          return (
            <path
              key={`${link.source}:${link.target}`}
              fill="none"
              stroke="#888"
              strokeWidth="3"
              opacity="0.5"
              d={line([link.source, link.target])}
            />
          );
        })}
      </g>
      <g>
        {Object.values(data.nodes).map((node) => {
          return (
            <g
              key={node.id}
              className="is-unselectable is-clickable"
              onClick={() => {
                if (onClickNode) {
                  onClickNode(node);
                }
              }}
            >
              <circle
                fill={color(node["科目群"])}
                cx={node.x}
                cy={node.y}
                r={node.r}
                opacity={target.includes(node["科目ID"]) ? 1 : 0.3}
              >
                <title>
                  {node["科目名"]}({node["科目群"]}):{node["教員名"]}
                </title>
              </circle>
            </g>
          );
        })}
      </g>
      <g>
        {Object.values(data.nodes).map((node) => {
          if (target.includes(node["科目ID"])) {
            return (
              <g key={node.id}>
                <text
                  className="is-unselectable is-clickable"
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="20"
                  fontWeight="bold"
                  onClick={() => {
                    if (onClickNode) {
                      onClickNode(node);
                    }
                  }}
                >
                  {shorten(node["科目名"], 8)}
                </text>
              </g>
            );
          }
        })}
      </g>
    </>
  );
}

function ZoomableSvg({ viewBox, children }) {
  const svgRef = useRef();
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  useEffect(() => {
    const zoom = d3.zoom().on("zoom", (event) => {
      const { x, y, k } = event.transform;
      setTransform({ k, x, y });
    });
    d3.select(svgRef.current).call(zoom);
  }, []);
  const { k, x, y } = transform;
  return (
    <svg ref={svgRef} viewBox={viewBox}>
      <g transform={`translate(${x},${y})scale(${k})`}>{children}</g>
    </svg>
  );
}

function Drawing({ data, target, onClickNode }) {
  const left = d3.min(Object.values(data.nodes), (d) => d.x - d.r);
  const right = d3.max(Object.values(data.nodes), (d) => d.x + d.r);
  const top = d3.min(Object.values(data.nodes), (d) => d.y - d.r);
  const bottom = d3.max(Object.values(data.nodes), (d) => d.y + d.r);
  const width = right - left;
  const height = bottom - top;
  const size = Math.max(width, height);
  return (
    <figure className="image is-square">
      <ZoomableSvg viewBox={`${left} ${top} ${size} ${size}`}>
        <DrawingContent data={data} onClickNode={onClickNode} target={target} />
      </ZoomableSvg>
    </figure>
  );
}

function SubjectDetail({ subject }) {
  return (
    <>
      <div className="field">
        <div className="label">科目名</div>
        <div className="control">
          <input
            className="input is-static"
            value={subject && subject["科目名"]}
            readOnly
          />
        </div>
      </div>
      <div className="field">
        <div className="label">教員名</div>
        <div className="control">
          <input
            className="input is-static"
            value={subject && subject["教員名"]}
            readOnly
          />
        </div>
      </div>
      <div className="field">
        <div className="label">科目群</div>
        <div className="control">
          <input
            className="input is-static"
            value={subject && subject["科目群"]}
            readOnly
          />
        </div>
      </div>
      <div className="field">
        <div className="label">授業形態</div>
        <div className="control">
          <input
            className="input is-static"
            value={subject && subject["授業形態"]}
            readOnly
          />
        </div>
      </div>
      <div className="field">
        <div className="label">授業概要</div>
        <div className="control">
          <textarea
            className="textarea"
            value={subject && subject["授業概要"]}
            readOnly
          />
        </div>
      </div>
      <div className="field">
        <div className="label">授業のねらい・到達目標</div>
        <div className="control">
          <textarea
            className="textarea"
            value={subject && subject["授業のねらい・到達目標"]}
            readOnly
          />
        </div>
      </div>
      <div className="field">
        <div className="label">授業の形式</div>
        <div className="control">
          <input
            className="input is-static"
            value={subject && subject["授業の形式"]}
            readOnly
          />
        </div>
      </div>
      <div className="field">
        <div className="label">授業の方法</div>
        <div className="control">
          <textarea
            className="textarea"
            value={subject && subject["授業の方法"]}
            readOnly
          />
        </div>
      </div>
      {subject &&
        subject["授業計画"].map((plan) => {
          return (
            <div key={plan["回数"]} className="field">
              <div className="label">第{plan["回数"]}回</div>
              <div className="control">
                <textarea className="textarea" value={plan["内容"]} readOnly />
              </div>
            </div>
          );
        })}
    </>
  );
}

export default function App() {
  const [data, setData] = useState();
  const [target, setTarget] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await fetch("syllabus-network.json");
      const data = await response.json();

      data.forEach((item, i) => {
        item.id = `${i}`;
        const { x, y, r } = d3.packEnclose(item.nodes);
        for (const node of item.nodes) {
          node.x -= x;
          node.y -= y;
        }
        item.r = r + 10;
      });
      data.sort((a, b) => b.r - a.r);
      d3.packSiblings(data);

      const nodes = {};
      const links = [];
      for (const item of data) {
        for (const node of item.nodes) {
          node.id = `${item.id}:${node.id}`;
          node.x += item.x;
          node.y += item.y;
          nodes[node.id] = node;
        }
        for (const link of item.links) {
          link.source = `${item.id}:${link.source}`;
          link.target = `${item.id}:${link.target}`;
          links.push(link);
        }
      }
      setData({ nodes, links });
    })();
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-9">
            <div className="field">
              <label className="label">科目群</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    onChange={(event) => {
                      setTarget(
                        Object.values(data.nodes)
                          .filter(
                            (node) => node["科目群"] === event.target.value,
                          )
                          .map((node) => node["科目ID"]),
                      );
                    }}
                  >
                    <option key="none" value=""></option>
                    {categories.map((item) => {
                      return (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">キーワード</label>
              <div className="control">
                <form
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const ids = await fetchSubjectIds(
                      event.target.elements.keyword.value,
                    );
                    setTarget(ids);
                  }}
                >
                  <input className="input" name="keyword" />
                </form>
              </div>
            </div>
            {data && (
              <Drawing
                data={data}
                target={target}
                onClickNode={async (item) => {
                  const subject = await fetchSubject(item["科目ID"]);
                  setSelectedSubject(subject);
                }}
              />
            )}
          </div>
          <div
            className="column is-3"
            style={{
              maxHeight: "1000px",
              overflowY: "scroll",
            }}
          >
            <SubjectDetail subject={selectedSubject} />
          </div>
        </div>
      </div>
    </section>
  );
}
