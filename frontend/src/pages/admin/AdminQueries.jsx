import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/admin-queries.css";
import "../../styles/admin/admin-common.css";

const API_BASE = "http://127.0.0.1:8000";

function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [activeQuery, setActiveQuery] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/notifications/admin/queries/`
      );
      setQueries(res.data);
    } catch {
      setQueries([]);
    }
  };

  const sendReply = async () => {
    console.log("Send Reply clicked", activeQuery, replyText);

    if (!replyText.trim()) {
      alert("Reply cannot be empty");
      return;
    }

    try {
      setSending(true);

      await axios.post(
        `${API_BASE}/notifications/query/reply/${activeQuery}/`,
        { reply: replyText }
      );

      alert("Reply sent successfully");

      setReplyText("");
      setActiveQuery(null);
      fetchQueries();
    } catch (err) {
      console.error(err);
      alert("Failed to send reply");
    } finally {
      setSending(false);
    }
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
              <td colSpan="4" align="center">
                No queries found
              </td>
            </tr>
          ) : (
            queries.map((q) => (
              <tr key={q.id}>
                <td>{q.student}</td>
                <td>{q.question}</td>
                <td className={q.is_resolved ? "resolved" : "pending"}>
                  {q.is_resolved ? "Resolved" : "Pending"}
                </td>
                <td>
                  {!q.is_resolved && (
                    <button
                      type="button"
                      className="admin-btn"
                      onClick={() => {
                        console.log("Reply clicked for query:", q.id);
                        setActiveQuery(q.id);
                        setReplyText("");
                      }}
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
                type="button"
                onClick={() => alert("SEND CLICK WORKS")}
                style={{
                  position: "relative",
                  zIndex: 99999,
                  pointerEvents: "auto",
                  background: "red",
                  color: "white",
                  padding: "10px",
                }}
              >
                TEST SEND
              </button>

            <button
              type="button"
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
