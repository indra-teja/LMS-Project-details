import "../../styles/instructor/add-course.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("All fields are required");
      return;
    }

    axios
      .post(
        "http://127.0.0.1:8000/courses/instructor/add-course/",
        { title, description }
      )
      .then((res) => {
        alert("Course created successfully");
        navigate(
          `/instructor/manage-course-content/${res.data.course_id}`
        );
      })
      .catch((err) => {
        console.error(err.response || err);
        alert(
          err.response?.data?.error ||
          "Failed to create course"
        );
      });
  };

  return (
    <div className="i-box">
      <h2>Add New Course</h2>

      <div className="add-course-card">
        <form className="i-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course Title</label>
            <input
              type="text"
              placeholder="Enter course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Course Description</label>
            <textarea
              placeholder="Enter course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button className="add-btn">Create Course</button>
        </form>
      </div>
    </div>
  );
}

export default AddCourse;
