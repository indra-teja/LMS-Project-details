import "../../styles/admin/manage-instructors.css";
import '../../styles/admin/admin-common.css'


function ManageInstructors() {
  return (
    <div className="admin-box">
      <h2>Manage Instructors</h2>

      <div className="admin-actions">
        <button className="admin-btn">Add Instructor</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jane Smith</td>
            <td>React</td>
            <td>
              <button className="admin-btn secondary">Edit</button>{" "}
              <button className="admin-btn danger">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ManageInstructors;
