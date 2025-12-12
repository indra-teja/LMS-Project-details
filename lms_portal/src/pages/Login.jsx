import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/login.css'

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student"); // default role
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Later this will call Django backend API
    // TEMPORARY FRONTEND REDIRECT
    if (role === "student") navigate("/student/dashboard");
    if (role === "instructor") navigate("/instructor/dashboard");
    if (role === "admin") navigate("/admin/dashboard");
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form className="login-form" onSubmit={handleLogin}>
        {/* ROLE DROPDOWN */}
        <select value={role} onChange={(e) => setRole(e.target.value)} className="login-select">
          <option value="student">I am a Student</option>
          <option value="instructor">I am an Instructor</option>
          <option value="admin">I am an Admin</option>
        </select>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
