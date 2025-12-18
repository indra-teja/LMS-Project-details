import "../../styles/student/courses.css";

function Courses() {
  const courses = [
    { id: 1, name: "Python Full Stack", progress: "60%" },
    { id: 2, name: "React + Django", progress: "40%" }
  ];

  return (
    <div>
      <h1>My Courses</h1>

      <div className="dashboard-cards">
        {courses.map(c => (
          <div key={c.id} className="course-card card">
            <h3>{c.name}</h3>
            <p>Progress: {c.progress}</p>
            <button>Continue</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;
