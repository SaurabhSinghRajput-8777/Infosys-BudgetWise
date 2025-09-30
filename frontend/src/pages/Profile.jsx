import React, { useState } from 'react';

const Profile = ({ onLogout }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userName = user ? user.name : 'User';
    const userEmail = user ? user.email : 'user@example.com';

    // State for editing fields
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const [newName, setNewName] = useState(userName);
    const [newEmail, setNewEmail] = useState(userEmail);
    const [newPassword, setNewPassword] = useState('');

    const handleSave = (field) => {
        // Here you would implement the API call to update the user data
        console.log(`Saving new ${field}...`);
        
        switch(field) {
            case 'name':
                console.log(`New name: ${newName}`);
                setIsEditingName(false);
                break;
            case 'email':
                console.log(`New email: ${newEmail}`);
                setIsEditingEmail(false);
                break;
            case 'password':
                console.log(`New password: ${newPassword}`);
                setIsEditingPassword(false);
                setNewPassword(''); // Clear the password field after saving
                break;
            default:
                break;
        }
        // Assuming the API call is successful, you would update localStorage here
        // For now, we'll just log the changes.
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
                <div className="profile-option">
                    <span className="option-label">Name:</span>
                    {isEditingName ? (
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    ) : (
                        <span className="option-value">{newName}</span>
                    )}
                    <button onClick={() => isEditingName ? handleSave('name') : setIsEditingName(true)}>
                        {isEditingName ? 'Save' : 'Edit'}
                    </button>
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
                        <span className="option-value">{newEmail}</span>
                    )}
                    <button onClick={() => isEditingEmail ? handleSave('email') : setIsEditingEmail(true)}>
                        {isEditingEmail ? 'Save' : 'Edit'}
                    </button>
                </div>
                
                <div className="profile-option">
                    <span className="option-label">Password:</span>
                    {isEditingPassword ? (
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    ) : (
                        <span className="option-value">••••••••</span>
                    )}
                    <button onClick={() => isEditingPassword ? handleSave('password') : setIsEditingPassword(true)}>
                        {isEditingPassword ? 'Save' : 'Edit'}
                    </button>
                </div>
            </div>

            <button onClick={onLogout} className="logout-button">Logout</button>
        </div>
    );
};

export default Profile;