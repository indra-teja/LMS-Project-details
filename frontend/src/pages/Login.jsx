import { useState } from "react";
import axios from "axios";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/accounts/login/",
        { email, password }
      );

      const role = res.data.role;

      if (role === "ADMIN") 
          navigate("/admin/dashboard");
      else if (role === "INSTRUCTOR") 
          navigate("/instructor/dashboard");
      else if (role === "STUDENT") 
          navigate("/student/dashboard");
    } catch (error) {
      alert("Invalid login");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn">Login</button>
      </form>
    </div>
  );
}

export default Login;





// Admin : admin@gmail.com (admin123)  --> SuperUser
// Instructor : instructor@gmail.com (inst123)   -->  instructor
// Student  :  student@gmail.com   (stud123)  --> student