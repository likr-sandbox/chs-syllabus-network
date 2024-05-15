import { useState, useEffect } from "react";
import * as d3 from "d3";

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

function Drawing({ data, target, onClickNode }) {
  const left = d3.min(Object.values(data.nodes), (d) => d.x - d.r);
  const right = d3.max(Object.values(data.nodes), (d) => d.x + d.r);
  const top = d3.min(Object.values(data.nodes), (d) => d.y - d.r);
  const bottom = d3.max(Object.values(data.nodes), (d) => d.y + d.r);
  const width = right - left;
  const height = bottom - top;
  const size = Math.max(width, height);
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  return (
    <figure className="image is-square">
      <svg
        viewBox={`${left} ${top} ${size} ${size}`}
        style={{
          display: "block",
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
        }}
      >
        <g transform="scale(1)">
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
                <g key={node.id}>
                  <circle
                    fill={color(node["科目群"])}
                    cx={node.x}
                    cy={node.y}
                    r={node.r}
                    opacity={node["科目群"] === target ? 1 : 0.5}
                  >
                    <title>
                      {node["令和２年度以降入学者"]}({node["科目群"]}):
                      {node["教員名"]}
                    </title>
                  </circle>
                </g>
              );
            })}
          </g>
          <g>
            {Object.values(data.nodes).map((node) => {
              if (node["科目群"] === target) {
                return (
                  <g key={node.id}>
                    <text
                      className="is-unselectable is-clickable"
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontWeight="bold"
                      onClick={() => {
                        if (onClickNode) {
                          onClickNode(node);
                        }
                      }}
                    >
                      {node["令和２年度以降入学者"]}
                    </text>
                  </g>
                );
              }
            })}
          </g>
        </g>
      </svg>
    </figure>
  );
}

export default function App() {
  const [data, setData] = useState();
  const [target, setTarget] = useState();
  const [selectedNode, setSelectedNode] = useState(null);
  useEffect(() => {
    (async () => {
      const response = await fetch("syllabus-network.json");
      const data = await response.json();
      const nodes = {};
      for (const node of data.nodes) {
        nodes[node.id] = node;
      }
      data.nodes = nodes;
      console.log(data);
      setData(data);
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
                    value={target}
                    onChange={(event) => {
                      setTarget(event.target.value);
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
            {data && (
              <Drawing
                data={data}
                target={target}
                onClickNode={(item) => {
                  setSelectedNode(item);
                }}
              />
            )}
          </div>
          <div className="column is-3">
            <div className="field">
              <div className="label">科目名</div>
              <div className="control">
                <input
                  className="input"
                  value={selectedNode && selectedNode["令和２年度以降入学者"]}
                  readOnly
                />
              </div>
            </div>
            <div className="field">
              <div className="label">教員名</div>
              <div className="control">
                <input
                  className="input"
                  value={selectedNode && selectedNode["教員名"]}
                  readOnly
                />
              </div>
            </div>
            <div className="field">
              <div className="label">授業形態</div>
              <div className="control">
                <input
                  className="input"
                  value={selectedNode && selectedNode["授業形態"]}
                  readOnly
                />
              </div>
            </div>
            <div className="field">
              <div className="label">授業概要</div>
              <div className="control">
                <textarea
                  className="textarea"
                  value={selectedNode && selectedNode["授業概要"]}
                  readOnly
                />
              </div>
            </div>
            <div className="field">
              <div className="label">授業のねらい・到達目標</div>
              <div className="control">
                <textarea
                  className="textarea"
                  value={selectedNode && selectedNode["授業のねらい・到達目標"]}
                  readOnly
                />
              </div>
            </div>
            <div className="field">
              <div className="label">授業の形式</div>
              <div className="control">
                <input
                  className="input"
                  value={selectedNode && selectedNode["授業の形式"]}
                  readOnly
                />
              </div>
            </div>
            <div className="field">
              <div className="label">授業の方法</div>
              <div className="control">
                <textarea
                  className="textarea"
                  value={selectedNode && selectedNode["授業の方法"]}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
