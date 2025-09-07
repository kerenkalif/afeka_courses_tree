import React, { useEffect, useRef } from "react";
import { DataSet, Network } from "vis-network/standalone";
import { getGraphData } from "./create_graph";
import data from "./courses.json";

// פונקציה לתצוגת שם רמה (א1, א2, ב1...)
function levelToLabel(level) {
  const years = ["א", "ב", "ג", "ד"];
  const year = years[Math.floor(level / 2)] || "?";
  const sem = (level % 2) + 1;
  return `${year}${sem}`;
}

export default function App() {
  const containerRef = useRef(null);
  console.log("App: data::", data);
  console.log("App: data.name::", data.name);
  const { nodes, edges } = getGraphData(data.courses);
  console.log("nodes:", nodes);
  console.log("edges:", edges);

  // כל רמות השכבות לגרף התוויות הצמוד
  const allLevels = nodes.map((n) => n.level);
  const minLevel = Math.min(...allLevels);
  const maxLevel = Math.max(...allLevels);
  const totalHeight = 600;
  const labelHeight = totalHeight / (maxLevel - minLevel + 1);
  const graphWidth = "89%"; // מוודא שהתוויות הכי קרובות לגרף

  useEffect(() => {
    const data = {
      nodes: new DataSet(nodes),
      edges: new DataSet(edges),
    };
    const options = {
      layout: {
        hierarchical: {
          direction: "UD",
          sortMethod: "directed",
          levelSeparation: 115,
          nodeSpacing: 230, // ריווח אופקי רב למניעת חפיפות צמתים
        },
      },
      nodes: {
        shape: "box", // מלבן!
        margin: 10,
        font: { multi: true, size: 16, align: "center" },
        widthConstraint: { minimum: 120, maximum: 180 },
        heightConstraint: { minimum: 48 }, // מחזק צפיפות אנכית בריבועים
        borderWidth: 2,
      },
      edges: { arrows: "to" },
      physics: { enabled: false },
    };

    new Network(containerRef.current, data, options);
  }, [nodes, edges]);

  return (
    <div style={{ position: "relative", width: "100%", direction: "rtl" }}>
      <h1 style={{ textAlign: "center" }}>{data.name}</h1>
      {/* הגרף */}
      <div
        ref={containerRef}
        style={{
          height: totalHeight,
          width: graphWidth,
          border: "1px solid #ddd",
          display: "inline-block",
        }}
      />
      {/* תוויות של רמות מימין - קרוב לגרף, לא עולות על הצמתים */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: totalHeight,
          width: 48,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-end",
          pointerEvents: "none",
        }}
      >
        {Array.from({ length: maxLevel - minLevel + 1 }, (_, i) => (
          <div
            key={i}
            style={{
              height: labelHeight,
              lineHeight: `${labelHeight}px`,
              fontWeight: "bold",
              fontSize: 15,
              color: "#333",
              textShadow: "1px 1px 2px #FFF",
              borderBottom: i < maxLevel - minLevel ? "1px solid #eee" : "none",
              marginRight: 0,
              textAlign: "right",
              direction: "rtl",
            }}
          >
            {levelToLabel(minLevel + i)}
          </div>
        ))}
      </div>
    </div>
  );
}
