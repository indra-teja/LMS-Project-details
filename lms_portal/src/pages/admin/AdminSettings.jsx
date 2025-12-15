import "../../styles/admin/admin-settings.css";
import "../../styles/admin/admin-common.css";

function AdminSettings() {
  return (
    <div className="a-box admin-settings">

      <h2>Admin Settings</h2>
      <p className="settings-subtitle">
        Configure system-wide rules and preferences
      </p>

      {/* ================= Site Settings ================= */}
      <div className="settings-section">
        <h3>Site Settings</h3>

        <div className="form-group">
          <label>Site Name</label>
          <input type="text" placeholder="LMS Portal" />
        </div>

        <div className="form-group">
          <label>Support Email</label>
          <input type="email" placeholder="support@example.com" />
        </div>
      </div>

      {/* ================= User Rules ================= */}
      <div className="settings-section">
        <h3>User & Registration Rules</h3>

        <div className="toggle-row">
          <span>Allow student self-registration</span>
          <input type="checkbox" />
        </div>

        <div className="form-group">
          <label>Max login attempts</label>
          <input type="number" placeholder="5" />
        </div>
      </div>

      {/* ================= Course Rules ================= */}
      <div className="settings-section">
        <h3>Course Rules</h3>

        <div className="form-group">
          <label>Max courses per instructor</label>
          <input type="number" placeholder="10" />
        </div>

        <div className="toggle-row">
          <span>Course approval required</span>
          <input type="checkbox" />
        </div>
      </div>

      {/* ================= Certificate Rules ================= */}
      <div className="settings-section">
        <h3>Certificate Rules</h3>

        <div className="form-group">
          <label>Minimum completion %</label>
          <input type="number" placeholder="70" />
        </div>

        <div className="toggle-row">
          <span>Auto-generate certificates</span>
          <input type="checkbox" />
        </div>
      </div>

      {/* ================= Quiz Rules ================= */}
      <div className="settings-section">
        <h3>Quiz Rules</h3>

        <div className="form-group">
          <label>Default pass percentage</label>
          <input type="number" placeholder="50" />
        </div>

        <div className="form-group">
          <label>Max quiz attempts</label>
          <input type="number" placeholder="3" />
        </div>
      </div>

      {/* ================= Theme Settings ================= */}
      <div className="settings-section">
        <h3>Theme Settings</h3>

        <div className="toggle-row">
          <span>Enable dark mode by default</span>
          <input type="checkbox" />
        </div>
      </div>

      {/* ================= Actions ================= */}
      <div className="admin-actions">
        <button className="admin-btn">Save Settings</button>
        <button className="admin-btn secondary">Reset</button>
      </div>

    </div>
  );
}

export default AdminSettings;
