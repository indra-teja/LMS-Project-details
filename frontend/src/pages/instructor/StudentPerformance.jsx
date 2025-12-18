import "../../styles/instructor/student-performance.css";

function StudentPerformance() {
  return (
    <div className="i-box">
      <h2>Student Performance</h2>

      <div className="performance-card">
        <table className="performance-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Course</th>
              <th>Quiz Score</th>
              <th>Attendance</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Indra Teja</td>
              <td>Python Full Stack</td>
              <td>82%</td>
              <td>90%</td>
              <td className="status good">Good</td>
            </tr>

            <tr>
              <td>Pavan</td>
              <td>Cyber Security</td>
              <td>68%</td>
              <td>75%</td>
              <td className="status average">Average</td>
            </tr>

            <tr>
              <td>Kotaiah</td>
              <td>Java Full Stack</td>
              <td>45%</td>
              <td>60%</td>
              <td className="status poor">Needs Improvement</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentPerformance;
