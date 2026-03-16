import { useEffect, useState } from "react";
import api from "./api";
import { Link } from "react-router-dom"
import "./UserProfile.css"

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
      setEmailMessage("Server error. Försök igen senare.");
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
      setNameMessage("Server error. Försök igen senare.");
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
      setPasswordMessage("Server error. Försök igen senare.");
    }
  }

  if (!profile) return <p>Hämtar profil...</p>;

  return (
    <div>
      <p><b>{profile.Name}</b></p>
      <p><b>Email:</b> {profile.Email}</p>

        <p>
        <Link to="/orders" className="nav-button">
          Orderhistorik
        </Link>
      </p>

      {!editing && (
        <button onClick={() => setEditing(true)}>Ändra användarinformation</button>
      )}

      {editing && (
        <>
          <div className="editCustomerInfo">
            Ändra användarnamn
          </div>
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

          <div className="editCustomerInfo">
            Ändra mejladress
          </div>
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

          <div className="editCustomerInfo">
            Ändra lösenord
          </div>
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