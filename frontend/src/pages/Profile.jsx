import React, { useState } from 'react';

const Profile = ({ onLogout }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userName = user ? user.name : 'User';
    const userEmail = user ? user.email : 'user@example.com';

    // State to toggle editing mode for all fields
    const [isEditing, setIsEditing] = useState(false);

    const [currentName, setCurrentName] = useState(userName);
    const [currentEmail, setCurrentEmail] = useState(userEmail);
    const [newPassword, setNewPassword] = useState('');

    const handleSave = () => {
        // Here you would implement the API call to update the user data
        console.log("Saving user details...", {
            name: currentName,
            email: currentEmail,
            password: newPassword
        });

        // Simulating API success by updating localStorage
        const updatedUser = { ...user, name: currentName, email: currentEmail };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setNewPassword(''); // Clear the password field after saving
        setIsEditing(false); // Exit editing mode
    };

    return (
        <div className="profile-page-container page-container">
            <div className="profile-header">
                <div className="profile-photo-placeholder">
                    {/* You can add an image here later */}
                </div>
                <h2 className="profile-username">{userName}</h2>
            </div>

            <div className="profile-options">
                {isEditing ? (
                    <div className="profile-edit-form">
                        <label>
                            Name:
                            <input
                                type="text"
                                value={currentName}
                                onChange={(e) => setCurrentName(e.target.value)}
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                value={currentEmail}
                                onChange={(e) => setCurrentEmail(e.target.value)}
                            />
                        </label>
                        <label>
                            Password:
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </label>
                    </div>
                ) : (
                    <div className="profile-view-details">
                        <div className="profile-detail">
                            <span className="option-label">Name:</span>
                            <span className="option-value">{currentName}</span>
                        </div>
                        <div className="profile-detail">
                            <span className="option-label">Email:</span>
                            <span className="option-value">{currentEmail}</span>
                        </div>
                        <div className="profile-detail">
                            <span className="option-label">Password:</span>
                            <span className="option-value">••••••••</span>
                        </div>
                    </div>
                )}
                
                <div className="profile-action-buttons">
                    <button onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                    <button onClick={onLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;