import "../../styles/admin/admin-queries.css";
import '../../styles/admin/admin-common.css'


function AdminQueries() {
  return (
    <div className="admin-box">
      <h2>Student Queries</h2>

      <div className="admin-actions">
        <button className="admin-btn secondary">Filter</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Question</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ravi</td>
            <td>Course access issue</td>
            <td>
              <button className="admin-btn">Reply</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AdminQueries;
