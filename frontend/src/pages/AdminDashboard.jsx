import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button.jsx';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
    const [creationLoading, setCreationLoading] = useState(false);
    const [creationError, setCreationError] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token not found.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://localhost:8080/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to load user data. Please ensure you have admin privileges.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        const token = localStorage.getItem('token');
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:8080/api/admin/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('User deleted successfully!'); 
                fetchUsers(); // Refresh the list
            } catch (error) {
                console.error('Failed to delete user:', error);
                alert('Failed to delete user.');
            }
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setCreationLoading(true);
        setCreationError(null);
        const token = localStorage.getItem('token');
        
        try {
            await axios.post('http://localhost:8080/api/admin/users/create-admin', newAdmin, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('New admin user created successfully!');
            // This is the crucial line that clears the state, and thus the form inputs
            setNewAdmin({ name: '', email: '', password: '' }); 
            fetchUsers(); // Refresh user list
        } catch (err) {
            console.error('Failed to create admin:', err);
            setCreationError(err.response?.data?.message || 'Failed to create admin.');
        } finally {
            setCreationLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="content-card-wrapper">
            <h2>Admin Dashboard</h2>
            <div className="admin-content-card">
                <h3 className="card-title">User Management</h3>
                <div className="admin-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5">Loading users...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="5" style={{ color: 'red' }}>{error}</td></tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <Button 
                                                onClick={() => handleDeleteUser(user.id)} 
                                                className="delete-button"
                                                style={{ width: 'auto', padding: '8px 12px' }}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="admin-content-card" style={{ marginTop: '2rem' }}>
                <h3 className="card-title">Create New Admin</h3>
                <form className="create-admin-form" onSubmit={handleCreateAdmin}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={newAdmin.name}
                        onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newAdmin.password}
                        onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                        required
                    />
                    <Button type="submit" disabled={creationLoading}>
                        {creationLoading ? 'Creating...' : 'Create Admin'}
                    </Button>
                    {creationError && <p style={{ color: 'red' }}>{creationError}</p>}
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;