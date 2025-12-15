import "../../styles/admin/manage-students.css";
import '../../styles/admin/admin-common.css'


function ManageStudents() {
  return (
    <div className="admin-box">
      <h2>Manage Students</h2>

      <div className="admin-actions">
        <button className="admin-btn">Add Student</button>
        <button className="admin-btn secondary">Import CSV</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>jeswanth</td>
            <td>jashu@mail.com</td>
            <td>
              <button className="admin-btn secondary">Edit</button>{" "}
              <button className="admin-btn danger">Delete</button>
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>prabhu</td>
            <td>prabhu@mail.com</td>
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
export default ManageStudents;
