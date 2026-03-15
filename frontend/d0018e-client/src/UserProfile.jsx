import { useEffect, useState } from "react";
import api from "./api";

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [nameMessage, setNameMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await api.get("/profile");
      setProfile(res.data);
    } catch (err) {
      console.error("fetchProfile error:", err);
    }
  }

  async function updateEmail(e) {
    e.preventDefault();
    try {
      const res = await api.put("/profile/email", { email: newEmail });
      if (res.data.error) {
        setEmailMessage(res.data.error);
      } else {
        setEmailMessage(res.data.message);
        setProfile({ ...profile, Email: newEmail });
      }
      setNewEmail("");
    } catch (err) {
      console.error("updateEmail error:", err);
      setEmailMessage("Server error. Please try again later.");
    }
  }

  async function updateName(e) {
    e.preventDefault();
    try {
      const res = await api.put("/profile/name", { name: newName });
      if (res.data.error) {
        setNameMessage(res.data.error);
      } else {
        setNameMessage(res.data.message);
        setProfile({ ...profile, Name: newName });
      }
      setNewName("");
    } catch (err) {
      console.error("updateName error:", err);
      setNameMessage("Server error. Please try again later.");
    }
  }

  async function updatePassword(e) {
    e.preventDefault();
    try {
      const res = await api.put("/profile/password", {
        oldPassword,
        newPassword
      });
      if (res.data.error) {
        setPasswordMessage(res.data.error);
      } else {
        setPasswordMessage(res.data.message);
      }
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("updatePassword error:", err);
      setPasswordMessage("Server error. Please try again later.");
    }
  }

  if (!profile) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <p><b>{profile.Name}</b></p>
      <p><b>Email:</b> {profile.Email}</p>

      {!editing && (
        <button onClick={() => setEditing(true)}>Ändra användarinformation</button>
      )}

      {editing && (
        <>
          <h3>Ändra användarnamn</h3>
          {nameMessage && <p className="profile-message">{nameMessage}</p>}
          <form onSubmit={updateName}>
            <input
              type="text"
              placeholder="Nytt användarnamn"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button type="submit">✓</button>
          </form>

          <h3>Ändra mejladress</h3>
          {emailMessage && <p className="profile-message">{emailMessage}</p>}
          <form onSubmit={updateEmail}>
            <input
              type="email"
              placeholder="Ny mejladress"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <button type="submit">✓</button>
          </form>

          <h3>Ändra lösenord</h3>
          {passwordMessage && <p className="profile-message">{passwordMessage}</p>}
          <form onSubmit={updatePassword}>
            <input
              type="password"
              placeholder="Nuvarande lösenord"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Nytt lösenord"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit">✓</button>
          </form>

          <button onClick={() => setEditing(false)}>Avbryt</button>
        </>
      )}
    </div>
  );
}

export default UserProfile;