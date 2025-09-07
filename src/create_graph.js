import data from "./courses_jsons/courses_CS_morning_2026.json";

const semesterOrder = { א: 0, ב: 1, ג: 3 }; // סדר הסמסטרים

function getCourseLevel(course) {
  return (course.year - 1) * 2 + semesterOrder[course.semester];
}

export function getGraphData(coursesList = data.courses) {
  console.log(`Data= ${data.courses}`);
  // תמיכה במבנה חדש עם שדה courses
  if (coursesList.courses) {
    coursesList = coursesList.courses;
  }

  const nodes = coursesList.map((course) => ({
    id: course.code,
    label: `${course.name}\n${course.code}`,
    shape: "box",
    level: getCourseLevel(course),
    font: { multi: true, align: "center" },
  }));

  const edges = [];

  coursesList.forEach((course) => {
    course.prerequisites.forEach((prereqCode) => {
      edges.push({ from: prereqCode, to: course.code });
    });
  });

  return { nodes, edges };
}
