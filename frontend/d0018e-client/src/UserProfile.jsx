import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function UserProfile() {

    const [profile, syncProfile] = useState(null);
    const [newEmail, syncEmail] = useState("");
    const [newName, syncName] = useState("");
    const [oldPassword, syncOldPassword] = useState("");
    const [newPassword, syncNewPassword] = useState("");
    const [emailMessage, syncEmailMsg] = useState("");
    const [nameMessage, syncNameMsg] = useState("");
    const [passwordMessage, syncPasswordMsg] = useState("");
    const [editing, syncEditing] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("http://localhost:5000/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            syncProfile(data);
        })
        .catch(err => console.error(err));
    }, [token]);

    const emailUpdate = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:5000/profile/email", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ email: newEmail })
        });

        const data = await res.json();

        if (data.error) {
            syncEmailMsg(data.error);
        } else {
            syncEmailMsg(data.message);
            syncProfile({ ...profile, Email: newEmail });
        }

        syncEmail("");
    };

    const pwdUpdate = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:5000/profile/password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                oldPassword,
                newPassword
            })
        });

        const data = await res.json();

        if (data.error) {
            syncPasswordMsg(data.error);
        } else {
            syncPasswordMsg(data.message);
        }

        syncOldPassword("");
        syncNewPassword("");
    };

    const nameUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/profile/name", {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName })
    });

    const data = await res.json();

    if (data.error) {
        syncNameMsg(data.error);
    } else {
        syncNameMsg(data.message);
        syncProfile({ ...profile, Name: newName });
    }

    syncName("");
    };

    if (!profile) return <p></p>;

    return (
        <div>
            <p><b>{profile.Name}</b></p>
            <p><b>Email:</b> {profile.Email}</p>
            <p><Link to="/user" className="nav-button">Orderhistorik</Link></p>

            {!editing && (
                <button onClick={() => syncEditing(true)}>
                    Ändra användarinformation
                </button>
            )}
            {editing && (
                <>
                    <h3>Ändra användarnamn</h3>
                        { nameMessage && <p className="profile-message">{nameMessage}</p> }
                        <form onSubmit={nameUpdate}>
                        <input
                            type="name"
                            placeholder="Nytt användarnamn"
                            value={newName}
                            onChange={(e) => syncName(e.target.value)}
                        />
                        <button type="submit">✓</button>
                    </form>
                    
                    <h3>Ändra mejladress</h3>
                    {emailMessage && <p className="profile-message">{emailMessage}</p>}
                    <form onSubmit={emailUpdate}>
                        <input
                            type="email"
                            placeholder="Ny mejladress"
                            value={newEmail}
                            onChange={(e) => syncEmail(e.target.value)}
                        />
                        <button type="submit">✓</button>
                    </form>

                    <h3>Ändra lösenord</h3>
                    {passwordMessage && <p className="profile-message">{passwordMessage}</p>}
                    <form onSubmit={pwdUpdate}>
                        <input
                            type="password"
                            placeholder="Nuvarande lösenord"
                            value={oldPassword}
                            onChange={(e) => syncOldPassword(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Nytt lösenord"
                            value={newPassword}
                            onChange={(e) => syncNewPassword(e.target.value)}
                        />

                        <button type="submit">✓</button>
                    </form>

                    <button onClick={() => syncEditing(false)}>Avbryt</button>
                </>
            )}
        </div>
    );
}

export default UserProfile;