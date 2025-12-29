import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/instructor/manage-course-content.css";

function ManageCourseContent() {
  const { courseId } = useParams();

  const [contents, setContents] = useState([]);

  // form states
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState("VIDEO");
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  // edit mode
  const [editId, setEditId] = useState(null);

  /* ================= Fetch contents ================= */
  const fetchContents = () => {
    axios
      .get(`http://127.0.0.1:8000/courses/instructor/${courseId}/content/`)
      .then((res) => setContents(res.data))
      .catch(() => setContents([]));
  };

  useEffect(() => {
    fetchContents();
  }, [courseId]);

  /* ================= Reset form ================= */
  const resetForm = () => {
    setTitle("");
    setContentType("VIDEO");
    setFile(null);
    setVideoUrl("");
    setEditId(null);
  };

  /* ================= Upload / Update ================= */
  const submitContent = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    if (contentType === "LINK" && !videoUrl.trim()) {
      alert("Video URL is required");
      return;
    }

    if (contentType !== "LINK" && !file && !editId) {
      alert("File is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content_type", contentType);

    if (contentType === "LINK") {
      formData.append("video_url", videoUrl);
    } else if (file) {
      formData.append("file", file);
    }

    const url = editId
      ? `http://127.0.0.1:8000/courses/admin/content/${editId}/update/`
      : `http://127.0.0.1:8000/courses/instructor/${courseId}/content/upload/`;

    axios
      .post(url, formData)
      .then(() => {
        alert(editId ? "Content updated" : "Content added");
        resetForm();
        fetchContents();
      })
      .catch(() => alert("Upload failed"));
  };

  /* ================= Edit ================= */
  const editContent = (c) => {
    setEditId(c.id);
    setTitle(c.title);
    setContentType(c.content_type);
    setVideoUrl(c.video_url || "");
    setFile(null);
  };

  /* ================= Delete ================= */
  const deleteContent = (id) => {
    if (!window.confirm("Delete this content?")) return;

    axios
      .delete(
        `http://127.0.0.1:8000/courses/admin/content/${id}/delete/`
      )
      .then(() => {
        alert("Deleted");
        fetchContents();
      })
      .catch(() => alert("Delete failed"));
  };

  return (
    <div className="i-box">
      <h2>Manage Course Content</h2>

      {/* ================= FORM ================= */}
      <form className="content-form" onSubmit={submitContent}>
        <input
          placeholder="Content title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
        >
          <option value="VIDEO">Video</option>
          <option value="PDF">PDF</option>
          <option value="LINK">External Link</option>
        </select>

        {contentType === "LINK" ? (
          <input
            placeholder="Video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        ) : (
          <input
            type="file"
            accept="video/*,.pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
        )}

        <div className="form-actions">
          <button className="add-btn">
            {editId ? "Update Content" : "Add Content"}
          </button>

          {editId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ================= TABLE ================= */}
      <table className="content-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>View</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {contents.length === 0 ? (
            <tr>
              <td colSpan="4" align="center">
                No content uploaded
              </td>
            </tr>
          ) : (
            contents.map((c) => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>{c.content_type}</td>

                <td>
                  {c.content_type === "LINK" ? (
                    <a href={c.video_url} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  ) : (
                    <a
                      href={`http://127.0.0.1:8000${c.file}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  )}
                </td>

                <td className="action-btns">
                  <button
                    className="edit-btn"
                    onClick={() => editContent(c)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteContent(c.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageCourseContent;
