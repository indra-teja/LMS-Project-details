import "../../styles/instructor/manage-courses.css";

function ManageCourses() {
  return (
    <div className="i-box">
      <h2>Manage Courses</h2>

      <table className="course-table">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Python Full Stack</td>
            <td>Development</td>
            <td>Active</td>
            <td className="action-btns">
              <button className="view-btn">View</button>
              <button className="edit-btn">Edit</button>
              <button className="delete-btn">Delete</button>
            </td>
          </tr>

          <tr>
            <td>Cyber Security</td>
            <td>Security</td>
            <td>Inactive</td>
            <td className="action-btns">
              <button className="view-btn">View</button>
              <button className="edit-btn">Edit</button>
              <button className="delete-btn">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ManageCourses;
