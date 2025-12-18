import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/admin-queries.css";
import "../../styles/admin/admin-common.css";

function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [activeQuery, setActiveQuery] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Fetch all student queries
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/notifications/admin/")
      .then((res) => {
        setQueries(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch queries", err);
      });
  }, []);

  // Send reply
  const sendReply = (id) => {
    if (!replyText.trim()) {
      alert("Reply cannot be empty");
      return;
    }

    axios
      .post(
        `http://127.0.0.1:8000/notifications/admin/${id}/reply/`,
        { reply: replyText }
      )
      .then(() => {
        setQueries(
          queries.map((q) =>
            q.id === id
              ? { ...q, is_resolved: true, reply: replyText }
              : q
          )
        );
        setReplyText("");
        setActiveQuery(null);
      })
      .catch((err) => {
        console.error("Failed to send reply", err);
        alert("Error sending reply");
      });
  };

  return (
    <div className="admin-box">
      <h2>Student Queries</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Question</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {queries.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No queries found
              </td>
            </tr>
          ) : (
            queries.map((q) => (
              <tr key={q.id}>
                <td>{q.student}</td>
                <td>{q.question}</td>

                {/* STATUS COLUMN */}
                <td className={q.is_resolved ? "resolved" : "pending"}>
                  {q.is_resolved ? "Resolved" : "Pending"}
                </td>

                <td>
                  {!q.is_resolved && (
                    <button
                      className="admin-btn"
                      onClick={() => setActiveQuery(q.id)}
                    >
                      Reply
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Reply Box */}
      {activeQuery && (
        <div className="admin-edit-box">
          <h3>Reply to Query</h3>

          <textarea
            placeholder="Type your reply here..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />

          <div className="admin-actions">
            <button
              className="admin-btn"
              onClick={() => sendReply(activeQuery)}
            >
              Send Reply
            </button>

            <button
              className="admin-btn secondary"
              onClick={() => {
                setActiveQuery(null);
                setReplyText("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminQueries;
