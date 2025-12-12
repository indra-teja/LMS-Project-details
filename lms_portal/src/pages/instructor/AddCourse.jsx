import "../../styles/instructor/add-course.css";

function AddCourse() {
  return (
    <div className="i-box">
      <h2>Add New Course</h2>
      <form className="i-form">
        <input placeholder="Course Title" />
        <textarea placeholder="Course Description"></textarea>
        <button>Add Course</button>
      </form>
    </div>
  );
}
export default AddCourse;
