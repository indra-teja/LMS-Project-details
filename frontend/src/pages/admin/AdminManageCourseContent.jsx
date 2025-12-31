import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/admin/admin-common.css";
import "../../styles/admin/manage-courses.css";

function AdminManageCourseContent() {
  const { courseId } = useParams();

  const [contents, setContents] = useState([]);

  // upload
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState("VIDEO");
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  // edit
  const [editingContent, setEditingContent] = useState(null);

  useEffect(() => {
    if (!courseId) return;
    fetchContents();
  }, [courseId]);

  const fetchContents = () => {
    axios
      .get(`http://127.0.0.1:8000/courses/admin/${courseId}/content/`)
      .then((res) => setContents(res.data));
  };

  const uploadContent = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content_type", contentType);

    if (contentType === "LINK") {
      formData.append("video_url", videoUrl);
    } else {
      formData.append("file", file);
    }

    axios
      .post(
        `http://127.0.0.1:8000/courses/admin/${courseId}/content/upload/`,
        formData
      )
      .then(() => {
        resetForm();
        fetchContents();
      });
  };

  const startEdit = (content) => {
    setEditingContent(content);
    setTitle(content.title);
    setContentType(content.content_type);
    setVideoUrl(content.video_url || "");
    setFile(null);
  };

  const updateContent = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content_type", contentType);

    if (contentType === "LINK") {
      formData.append("video_url", videoUrl);
    } else if (file) {
      formData.append("file", file);
    }

    axios
      .put(
        `http://127.0.0.1:8000/courses/admin/content/${editingContent.id}/update/`,
        formData
      )
      .then(() => {
        resetForm();
        fetchContents();
      });
  };

  const deleteContent = (id) => {
    if (!window.confirm("Delete this content?")) return;

    axios
      .delete(
        `http://127.0.0.1:8000/courses/admin/content/${id}/delete/`
      )
      .then(fetchContents);
  };

  const resetForm = () => {
    setTitle("");
    setContentType("VIDEO");
    setFile(null);
    setVideoUrl("");
    setEditingContent(null);
  };

  return (
    <div className="admin-box">
      <h2>Course Content</h2>

      {/* Upload / Edit Form */}
      <form
        className="admin-edit-box"
        onSubmit={editingContent ? updateContent : uploadContent}
      >
        <input
          placeholder="Lesson title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
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
            placeholder="Video link"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        ) : (
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        )}

        <button className="admin-btn">
          {editingContent ? "Update" : "Upload"}
        </button>

        {editingContent && (
          <button
            type="button"
            className="admin-btn secondary"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Content Table */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {contents.map((c) => (
            <tr key={c.id}>
              <td>{c.title}</td>
              <td>{c.content_type}</td>
              <td>
                <button
                  className="admin-btn secondary"
                  onClick={() => startEdit(c)}
                >
                  Edit
                </button>

                {c.content_type === "LINK" ? (
                  <a
                    href={c.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-btn secondary"
                  >
                    Open
                  </a>
                ) : (
                  <a
                    href={`http://127.0.0.1:8000${c.file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-btn secondary"
                  >
                    View
                  </a>
                )}

                <button
                  className="admin-btn danger"
                  onClick={() => deleteContent(c.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminManageCourseContent;
