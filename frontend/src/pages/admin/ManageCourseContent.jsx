import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/admin/admin-common.css";
import "../../styles/admin/manage-courses.css";

function ManageCourseContent() {
  const { courseId } = useParams();

  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState("VIDEO");
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [contents, setContents] = useState([]);

  // Fetch existing contents
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/courses/admin/${courseId}/content/`)
      .then((res) => setContents(res.data))
      .catch(() => console.log("No content yet"));
  }, [courseId]);

  // Upload content
  const uploadContent = (e) => {
    e.preventDefault();

    if (!title) {
      alert("Title required");
      return;
    }

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
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(() => {
        alert("Content uploaded");
        setTitle("");
        setFile(null);
        setVideoUrl("");

        return axios.get(
          `http://127.0.0.1:8000/courses/admin/${courseId}/content/`
        );
      })
      .then((res) => setContents(res.data))
      .catch(() => alert("Upload failed"));
  };
  const deleteContent = (contentId) => {
  if (!window.confirm("Delete this content?")) return;

  axios
    .delete(
      `http://127.0.0.1:8000/courses/admin/content/${contentId}/delete/`
    )
    .then(() => {
      setContents(contents.filter((c) => c.id !== contentId));
    })
    .catch(() => {
      alert("Failed to delete content");
    });
};


  return (
    <div className="admin-box">
      <h2>Course Content</h2>

      {/* Upload Form */}
      <form className="admin-edit-box" onSubmit={uploadContent}>
        <input
          type="text"
          placeholder="Lesson Title"
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
            type="text"
            placeholder="YouTube / Drive Link"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        ) : (
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        )}

        <button className="admin-btn">Upload</button>
      </form>

      {/* Content List */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {contents.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
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
                        style={{ marginLeft: "8px" }}
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
