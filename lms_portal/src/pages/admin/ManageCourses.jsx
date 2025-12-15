import "../../styles/admin/manage-courses.css";
import '../../styles/admin/admin-common.css'


function ManageCourses() {
  return (
    <div className="admin-box">
      <h2>Manage Courses</h2>

      <div className="admin-actions">
        <button className="admin-btn">Add Course</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Instructor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Python</td>
            <td>Koti</td>
            <td>
              <button className="admin-btn secondary">Edit</button>{" "}
              <button className="admin-btn danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ManageCourses;
