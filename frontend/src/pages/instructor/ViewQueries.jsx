import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/instructor/view-queries.css";

const API_BASE = "http://127.0.0.1:8000";

function ViewQueries() {
  const [queries, setQueries] = useState([]);
  const [replyText, setReplyText] = useState({}); // 🔑 per query

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    const res = await axios.get(
      `${API_BASE}/notifications/instructor/queries/`
    );
    setQueries(res.data);
  };

  const sendReply = async (id) => {
    if (!replyText[id] || !replyText[id].trim()) return;

    await axios.post(
      `${API_BASE}/notifications/query/reply/${id}/`,
      { reply: replyText[id] }
    );

    setReplyText((prev) => ({ ...prev, [id]: "" }));
    fetchQueries();
  };

  return (
    <div className="i-box">
      <h2>Student Queries</h2>

      <div className="queries-wrapper">
        {queries.map((q) => (
          <div className="query-card" key={q.id}>
            <div className="query-header">
              <h4>{q.student}</h4>
              <span className={`status ${q.is_resolved ? "resolved" : "pending"}`}>
                {q.is_resolved ? "Resolved" : "Pending"}
              </span>
            </div>

            <p className="query-text">{q.question}</p>

            {q.reply ? (
              <div className="reply-box">
                <strong>Reply:</strong>
                <p>{q.reply}</p>
              </div>
            ) : (
              <>
                <textarea
                  className="reply-input"
                  placeholder="Type your reply here..."
                  value={replyText[q.id] || ""}
                  onChange={(e) =>
                    setReplyText({ ...replyText, [q.id]: e.target.value })
                  }
                />
                <button
                  className="reply-btn"
                  onClick={() => sendReply(q.id)}
                >
                  Send Reply
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewQueries;
