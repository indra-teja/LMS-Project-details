import "../../styles/student/profile.css";

function Profile() {
  return (
    <div className="student-profile">
      <h1>Update Profile</h1>
      <p className="profile-subtitle">
        Keep your personal information up to date
      </p>

      <div className="profile-card">
        {/* Profile Photo Section */}
        <div className="profile-photo-section">
          <img
            src="https://via.placeholder.com/120"
            alt="Profile"
            className="profile-photo"
          />

          <label className="photo-upload-btn">
            Change Photo
            <input type="file" accept="image/*" />
          </label>
        </div>

        {/* Profile Form */}
        <form className="profile-form">
          <div className="form-group">
            <label>Name</label>
            <input type="text" placeholder="Enter your name" />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input type="text" placeholder="Enter your phone number" />
          </div>

          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
