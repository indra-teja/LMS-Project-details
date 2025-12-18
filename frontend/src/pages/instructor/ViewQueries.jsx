import "../../styles/instructor/view-queries.css";

function ViewQueries() {
  return (
    <div className="i-box">
      <h2>Student Queries</h2>

      <div className="queries-wrapper">
        {/* Query card */}
        <div className="query-card">
          <div className="query-header">
            <h4>Prabhu</h4>
            <span className="course-tag">Python Full Stack</span>
          </div>

          <p className="query-text">
            Sir, I am not able to understand decorators properly. Can you
            explain with a simple example?
          </p>

          <textarea
            className="reply-input"
            placeholder="Type your reply here..."
          />

          <button className="reply-btn">Send Reply</button>
        </div>

        {/* Query card */}
        <div className="query-card">
          <div className="query-header">
            <h4>Sankar</h4>
            <span className="course-tag">Cyber Security</span>
          </div>

          <p className="query-text">
            I missed yesterday’s class. Will the recording be uploaded?
          </p>

          <textarea
            className="reply-input"
            placeholder="Type your reply here..."
          />

          <button className="reply-btn">Send Reply</button>
        </div>
      </div>
    </div>
  );
}

export default ViewQueries;
