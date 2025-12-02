import React, { useEffect, useState } from 'react';
import { getAllUsers, banUser, unbanUser, getProfile } from '../services/api';
import type { User } from '../types';
import { Users, Search, Ban, CheckCircle } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // UI state
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await getAllUsers();
            setUsers(res.data || []);
        } catch (err) {
            console.error('Failed to load users', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const profile = await getProfile(localStorage.getItem('token') || '');
                setCurrentUser(profile.data);
            } catch (e) {
                // ignore
            }
            await loadUsers();
        })();
    }, []);

    const handleBan = async (id: number) => {
        if (window.confirm('Are you sure you want to ban this user?')) {
            try {
                await banUser(id);
                await loadUsers();
            } catch (err) {
                alert('Failed to ban user');
            }
        }
    };

    const handleUnban = async (id: number) => {
        if (window.confirm('Are you sure you want to unban this user?')) {
            try {
                await unbanUser(id);
                await loadUsers();
            } catch (err) {
                alert('Failed to unban user');
            }
        }
    };

    const filtered = users.filter(u => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (u.username || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

    if (currentUser?.role !== 'ADMIN' && currentUser?.role !== 'OWNER') {
        return <div className="p-8 text-center text-red-600">Access Denied.</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Users className="text-blue-600" size={32} />
                    <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
                        placeholder="Search users..."
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                    />
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={4} className="px-6 py-4 text-center">Loading...</td></tr>
                        ) : pageItems.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No users found.</td></tr>
                        ) : (
                            pageItems.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                                                {u.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{u.username}</div>
                                                <div className="text-sm text-gray-500">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${u.role === 'OWNER' ? 'bg-purple-100 text-purple-800' :
                                                u.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {u.banned ? (
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Banned</span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {u.role !== 'OWNER' && (
                                            u.banned ? (
                                                <button onClick={() => handleUnban(u.id)} className="text-green-600 hover:text-green-900 flex items-center justify-end gap-1 ml-auto">
                                                    <CheckCircle size={16} /> Unban
                                                </button>
                                            ) : (
                                                <button onClick={() => handleBan(u.id)} className="text-red-600 hover:text-red-900 flex items-center justify-end gap-1 ml-auto">
                                                    <Ban size={16} /> Ban
                                                </button>
                                            )
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 px-4">
                <div className="text-sm text-gray-600">
                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} results
                </div>
                <div className="flex gap-2">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
