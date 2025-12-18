import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/admin-settings.css";
import "../../styles/admin/admin-common.css";

function AdminSettings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/settings/")
      .then((res) => setSettings(res.data))
      .catch(() => alert("Failed to load settings"));
  }, []);

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  const saveSettings = () => {
    axios
      .put("http://127.0.0.1:8000/settings/update/", settings)
      .then(() => alert("Settings saved successfully"))
      .catch(() => alert("Failed to save settings"));
  };

  if (!settings) return <p>Loading settings...</p>;

  return (
    <div className="a-box admin-settings">
      <h2>Admin Settings</h2>
      <p className="settings-subtitle">
        Configure system-wide rules and preferences
      </p>

      <div className="settings-section">
        <h3>Site Settings</h3>
        <input
          value={settings.site_name}
          onChange={(e) => handleChange("site_name", e.target.value)}
          placeholder="Site Name"
        />
        <input
          value={settings.support_email}
          onChange={(e) => handleChange("support_email", e.target.value)}
          placeholder="Support Email"
        />
      </div>

      <div className="settings-section">
        <h3>User Rules</h3>
        <label>
          <input
            type="checkbox"
            checked={settings.allow_self_registration}
            onChange={(e) =>
              handleChange("allow_self_registration", e.target.checked)
            }
          />
          Allow self registration
        </label>

        <input
          type="number"
          value={settings.max_login_attempts}
          onChange={(e) =>
            handleChange("max_login_attempts", e.target.value)
          }
        />
      </div>

      <div className="settings-section">
        <h3>Course Rules</h3>
        <input
          type="number"
          value={settings.max_courses_per_instructor}
          onChange={(e) =>
            handleChange("max_courses_per_instructor", e.target.value)
          }
        />

        <label>
          <input
            type="checkbox"
            checked={settings.course_approval_required}
            onChange={(e) =>
              handleChange("course_approval_required", e.target.checked)
            }
          />
          Course approval required
        </label>
      </div>

      <div className="settings-section">
        <h3>Certificate Rules</h3>
        <input
          type="number"
          value={settings.min_completion_percent}
          onChange={(e) =>
            handleChange("min_completion_percent", e.target.value)
          }
        />

        <label>
          <input
            type="checkbox"
            checked={settings.auto_generate_certificates}
            onChange={(e) =>
              handleChange("auto_generate_certificates", e.target.checked)
            }
          />
          Auto generate certificates
        </label>
      </div>

      <div className="settings-section">
        <h3>Quiz Rules</h3>
        <input
          type="number"
          value={settings.quiz_pass_percent}
          onChange={(e) =>
            handleChange("quiz_pass_percent", e.target.value)
          }
        />
        <input
          type="number"
          value={settings.max_quiz_attempts}
          onChange={(e) =>
            handleChange("max_quiz_attempts", e.target.value)
          }
        />
      </div>

      <div className="settings-section">
        <h3>Theme</h3>
        <label>
          <input
            type="checkbox"
            checked={settings.default_dark_mode}
            onChange={(e) =>
              handleChange("default_dark_mode", e.target.checked)
            }
          />
          Enable dark mode by default
        </label>
      </div>

      <div className="admin-actions">
        <button className="admin-btn" onClick={saveSettings}>
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default AdminSettings;
