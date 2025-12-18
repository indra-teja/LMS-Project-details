import "../../styles/instructor/instructor-profile.css";

function InstructorProfile() {
  return (
    <div className="i-box">
      <h2>Instructor Profile</h2>

      <div className="profile-card">
        <div className="profile-section">
          <img
            src="https://via.placeholder.com/150"
            alt="Instructor"
            className="profile-img"
          />

          <div className="profile-details">
            <h3>Indra Teja</h3>
            <p><strong>Email:</strong> indra@example.com</p>
            <p><strong>Role:</strong> Instructor</p>
            <p><strong>Specialization:</strong> Cyber Security</p>

            <button className="update-btn">Update Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorProfile;
