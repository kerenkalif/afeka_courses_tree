import React, { useState } from "react";
import ReactDOM from "react-dom";

// כאן מכניסים את הנתונים, לדוגמה ממסד נתונים או מקובץ JSON
const initialCourses = [
  {
    id: 1,
    name: "מבוא לתכנות",
    code: "10101",
    department: "מדעי המחשב",
    year: 1,
    semester: "א",
    prerequisites: [],
    syllabus: "/syllabus/10101.pdf",
  },
  {
    id: 2,
    name: "אלגוריתמים",
    code: "10210",
    department: "מדעי המחשב",
    year: 2,
    semester: "ב",
    prerequisites: ["10101"],
    syllabus: "/syllabus/10210.pdf",
  },
  {
    id: 3,
    name: "מערכות הפעלה",
    code: "20313",
    department: "מדעי המחשב",
    year: 3,
    semester: "א",
    prerequisites: ["10210"],
    syllabus: "/syllabus/20313.pdf",
  },
];

function filterCourses(courses, query) {
  query = query.trim();
  if (!query) return courses;
  return courses.filter(
    (course) =>
      course.name.includes(query) ||
      course.code.includes(query) ||
      String(course.year) === query
  );
}

// פונקציה לעץ קדם
function CourseTree({ courses, parentId = null }) {
  // סינון קורסים שהם לא קדם של אף אחד (שורשים)
  const roots =
    parentId === null
      ? courses.filter((c) =>
          courses.every((other) => !other.prerequisites.includes(c.code))
        )
      : courses.filter((c) => c.prerequisites.includes(parentId));
  return (
    <ul>
      {roots.map((course) => (
        <li key={course.id}>
          <span style={{ fontWeight: "bold" }}>{course.name}</span> (
          {course.code}) - {course.department}, שנה {course.year} סמסטר{" "}
          {course.semester}{" "}
          <a href={course.syllabus} target="_blank" rel="noopener noreferrer">
            סילבוס
          </a>
          {courses.some((c) => c.prerequisites.includes(course.code)) && (
            <CourseTree courses={courses} parentId={course.code} />
          )}
        </li>
      ))}
    </ul>
  );
}

function App() {
  const [courses] = useState(initialCourses);
  const [query, setQuery] = useState("");
  const filtered = filterCourses(courses, query);

  return (
    <div style={{ maxWidth: 700, margin: "auto" }}>
      <h2>עץ קדימויות קורסים</h2>
      <input
        style={{ width: "100%", marginBottom: 12 }}
        placeholder="חפש לפי שם, קוד, שנה"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query ? (
        <ul>
          {filtered.map((course) => (
            <li key={course.id}>
              <b>{course.name}</b> ({course.code})<br />
              מחלקה: {course.department}
              <br />
              שנה: {course.year} סמסטר: {course.semester}
              <br />
              קדם קורסים:{" "}
              {course.prerequisites.length
                ? course.prerequisites.join(", ")
                : "אין"}
              <br />
              <a
                href={course.syllabus}
                target="_blank"
                rel="noopener noreferrer"
              >
                סילבוס
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <CourseTree courses={data.courses} />
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
