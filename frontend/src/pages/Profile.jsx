import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/Button.jsx';
import DummyProfile from '../assets/DummyProfile.png'; // Import the local image

const Profile = ({ onLogout }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [isEditing, setIsEditing] = useState(false);

    const [updatedName, setUpdatedName] = useState(user ? user.name : '');
    const [updatedEmail, setUpdatedEmail] = useState(user ? user.email : '');
    const [updatedPassword, setUpdatedPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const updateData = {};

        if (updatedName !== user.name) {
            updateData.name = updatedName;
        }

        if (updatedEmail !== user.email) {
            updateData.email = updatedEmail;
        }

        if (updatedPassword) {
            updateData.password = updatedPassword;
        }

        try {
            await axios.put('http://localhost:8080/api/auth/profile', updateData, config);

            const updatedUser = {
                ...user,
                name: updatedName,
                email: updatedEmail,
            };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setIsEditing(false);
            setUpdatedPassword('');
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Profile update error:', err);
            setError(err.response ? err.response.data.message : err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="page-container">Please log in to view your profile.</div>;
    }

    return (
        <div className="profile-page-container page-container">
            <div className="profile-header">
                <div className="profile-photo-placeholder">
                    {/* Use the imported image as the source */}
                    <img src={DummyProfile} alt="User Profile" style={{ borderRadius: '50%', width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h2 className="profile-username">{user.name}</h2>
            </div>

            <div className="profile-options">
                {isEditing ? (
                    <div className="profile-edit-form">
                        <label>
                            Name:
                            <input
                                type="text"
                                value={updatedName}
                                onChange={(e) => setUpdatedName(e.target.value)}
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                value={updatedEmail}
                                onChange={(e) => setUpdatedEmail(e.target.value)}
                            />
                        </label>
                        <label>
                            Password:
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={updatedPassword}
                                onChange={(e) => setUpdatedPassword(e.target.value)}
                            />
                        </label>
                        <div className="profile-action-buttons">
                            <Button onClick={handleSave} disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="profile-view-details">
                        <div className="profile-detail">
                            <span className="option-label">Name:</span>
                            <span className="option-value">{user.name}</span>
                        </div>
                        <div className="profile-detail">
                            <span className="option-label">Email:</span>
                            <span className="option-value">{user.email}</span>
                        </div>
                        <div className="profile-detail">
                            <span className="option-label">Password:</span>
                            <span className="option-value">••••••••</span>
                        </div>
                        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    </div>
                )}
            </div>

            {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
            <div className="profile-button-container">
                <Button onClick={onLogout} className="logout-button">Logout</Button>
            </div>
        </div>
    );
};

export default Profile;