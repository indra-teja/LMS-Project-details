import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/instructor/add-course.css";

function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/courses/admin/${courseId}/`)
      .then((res) => {
        setTitle(res.data.title);
        setDescription(res.data.description);
      })
      .catch(() => alert("Failed to load course"));
  }, [courseId]);

  const updateCourse = (e) => {
    e.preventDefault();

    axios
      .put(`http://127.0.0.1:8000/courses/admin/${courseId}/`, {
        title,
        description,
      })
      .then(() => {
        alert("Course updated successfully");
        navigate("/instructor/manage-courses");
      })
      .catch(() => alert("Update failed"));
  };

  return (
    <div className="i-box">
      <h2>Edit Course</h2>

      <form className="i-form" onSubmit={updateCourse}>
        <div className="form-group">
          <label>Course Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button className="add-btn">Update Course</button>
      </form>
    </div>
  );
}

export default EditCourse;
