import "../../styles/student/profile.css";

function Profile() {
  return (
    <div>
      <h1>Update Profile</h1>

      <div className="card profile-form">
        <label>Name</label>
        <input type="text" />

        <label>Email</label>
        <input type="email" />

        <label>Phone</label>
        <input type="text" />

        <button>Save</button>
      </div>
    </div>
  );
}

export default Profile;
