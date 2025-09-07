import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";
import { getGraphData } from "./create_graph";

// דוגמאות לייבוא, אפשר להוסיף עוד קבצים
import CS_evening_2026 from "./courses_jsons/courses_CS_evening_2026.json";
import CS_morning_2026 from "./courses_jsons/courses_CS_morning_2026.json";

// פונקציה לתצוגת שם רמה (א1, א2, ב1...)
function levelToLabel(level) {
  const years = ["א", "ב", "ג", "ד"];
  const year = years[Math.floor(level / 2)] || "?";
  const sem = (level % 2) + 1;
  return `${year}${sem}`;
}

const availableTrees = [
  { label: CS_evening_2026.name, data: CS_evening_2026 },
  { label: CS_morning_2026.name, data: CS_morning_2026 },
];

export default function App() {
  const containerRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedTree = availableTrees[selectedIndex];
  const { nodes, edges } = getGraphData(selectedTree.data.courses);

  // כל רמות השכבות לגרף התוויות הצמוד
  const allLevels = nodes.map((n) => n.level);
  const minLevel = Math.min(...allLevels);
  const maxLevel = Math.max(...allLevels);

  const totalHeight = 600;
  const labelHeight = totalHeight / (maxLevel - minLevel + 1);
  const graphWidth = "89%";

  // שליפה מסודרת של כל הערכים הייחודיים של הרמות
  const levels = [...new Set(nodes.map((n) => n.level))].sort((a, b) => a - b);

  useEffect(() => {
    const dataSet = {
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

    new Network(containerRef.current, dataSet, options);
  }, [nodes, edges]);

  return (
    <div>
      {/* כותרת ממורכזת */}
      {/*<h1 style={{ textAlign: "center" }}>{selectedTree.label}</h1>*/ <br />}

      {/* רשימת בחירה */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <select
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
          value={selectedIndex}
          style={{ fontSize: "16px", padding: "8px" }}
        >
          {availableTrees.map((tree, idx) => (
            <option key={idx} value={idx}>
              {tree.label}
            </option>
          ))}
        </select>
      </div>

      {/* סרגל הסמסטרים + גרף */}
      <div style={{ display: "flex", direction: "rtl" }}>
        {/* סרגל הסמסטרים בצד ימין */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            height: totalHeight,
            width: "3em",
            fontSize: "18px",
            marginRight: "10px",
            marginTop: "0.5em",
          }}
        >
          {levels.map((level) => (
            <div
              key={level}
              style={{
                height: labelHeight,
                display: "flex",
                alignItems: "center",
              }}
            >
              {levelToLabel(level)}
            </div>
          ))}
        </div>

        {/* מיכל הגרף */}
        <div
          ref={containerRef}
          style={{ height: totalHeight, width: graphWidth, margin: "0 auto" }}
        />
      </div>
    </div>
  );
}
