import { useState } from "react";
import axios from "axios";
import Snowfall from "react-snowfall";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/accounts/login/",
        { email, password }
      );

      // 🔽 ADDED: extract name
      const { user_id, role, name } = res.data;

      if (!user_id || !role) {
        alert("Invalid login response");
        return;
      }

      // ✅ REMOVE ONLY AUTH RELATED KEYS (NOT clear)
      localStorage.removeItem("user_id");
      localStorage.removeItem("role");
      localStorage.removeItem("student_id");
      localStorage.removeItem("instructor_id");
      localStorage.removeItem("user_name"); // 🔽 ADDED

      // ✅ STORE COMMON DATA
      localStorage.setItem("user_id", String(user_id));
      localStorage.setItem("role", role);

      // 🔽 ADDED: store logged-in user's name
      localStorage.setItem("user_name", name);

      // ✅ ROLE-SPECIFIC STORAGE
      if (role === "STUDENT") {
        localStorage.setItem("student_id", String(user_id));
        navigate("/student/dashboard");
        return;
      }

      if (role === "INSTRUCTOR") {
        localStorage.setItem("instructor_id", String(user_id));
        navigate("/instructor/dashboard");
        return;
      }

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
        return;
      }

    } catch {
      alert("Invalid login credentials");
    }
  };

  return (
    <div className="login-container">
      <Snowfall
        snowflakeCount={120}
        speed={[0.3, 1.2]}
        radius={[0.6, 1.5]}
        wind={[-0.2, 0.5]}
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 0,
        }}
      />

      <form className="login-card" onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-input">
          <input
            className="login-input"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button className="login-btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
