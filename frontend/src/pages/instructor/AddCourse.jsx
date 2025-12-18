import "../../styles/instructor/add-course.css";

function AddCourse() {
  return (
    <div className="i-box">
      <h2>Add New Course</h2>

      <div className="add-course-card">
        <form className="i-form">
          {/* Course title */}
          <div className="form-group">
            <label>Course Title</label>
            <input
              type="text"
              placeholder="Enter course title"
            />
          </div>

          {/* Course description */}
          <div className="form-group">
            <label>Course Description</label>
            <textarea
              placeholder="Enter course description"
            />
          </div>

          {/* File upload */}
          <div className="form-group">
            <label>Upload Course Files / Videos</label>

            <div className="upload-box">
              <label className="upload-label">
                📁 Choose Files
                <input
                  type="file"
                  multiple
                  accept="video/*,.pdf,.zip"
                />
              </label>

              <p className="upload-text">
                Upload videos, PDFs, or ZIP files (multiple allowed)
              </p>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="add-btn">
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCourse;
