import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/Button.jsx'; // New import

const Profile = ({ onLogout }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const [newName, setNewName] = useState(user ? user.name : '');
    const [newEmail, setNewEmail] = useState(user ? user.email : '');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSave = async (field) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const updateData = {};
        let updatedUser = { ...user };

        try {
            switch(field) {
                case 'name':
                    updateData.name = newName;
                    await axios.put('http://localhost:8080/api/auth/profile', updateData, config);
                    updatedUser.name = newName;
                    setIsEditingName(false);
                    break;
                case 'email':
                    updateData.email = newEmail;
                    await axios.put('http://localhost:8080/api/auth/profile', updateData, config);
                    updatedUser.email = newEmail;
                    setIsEditingEmail(false);
                    break;
                case 'password':
                    updateData.password = newPassword;
                    await axios.put('http://localhost:8080/api/auth/profile', updateData, config);
                    setNewPassword('');
                    setIsEditingPassword(false);
                    break;
                default:
                    break;
            }
            
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
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
                    {/* You can add an image here later */}
                </div>
                <h2 className="profile-username">{user.name}</h2>
            </div>

            <div className="profile-options">
                <div className="profile-option">
                    <span className="option-label">Name:</span>
                    {isEditingName ? (
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    ) : (
                        <span className="option-value">{user.name}</span>
                    )}
                    <Button onClick={() => isEditingName ? handleSave('name') : setIsEditingName(true)} disabled={loading}>
                        {isEditingName ? 'Save' : 'Edit'}
                    </Button>
                </div>

                <div className="profile-option">
                    <span className="option-label">Email:</span>
                    {isEditingEmail ? (
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                    ) : (
                        <span className="option-value">{user.email}</span>
                    )}
                    <Button onClick={() => isEditingEmail ? handleSave('email') : setIsEditingEmail(true)} disabled={loading}>
                        {isEditingEmail ? 'Save' : 'Edit'}
                    </Button>
                </div>
                
                <div className="profile-option">
                    <span className="option-label">Password:</span>
                    {isEditingPassword ? (
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    ) : (
                        <span className="option-value">••••••••</span>
                    )}
                    <Button onClick={() => isEditingPassword ? handleSave('password') : setIsEditingPassword(true)} disabled={loading}>
                        {isEditingPassword ? 'Save' : 'Edit'}
                    </Button>
                </div>
            </div>

            {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
            <Button onClick={onLogout} className="logout-button">Logout</Button>
        </div>
    );
};

export default Profile;