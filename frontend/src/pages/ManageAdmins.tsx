import React, { useEffect, useState } from 'react';
import { getAllAdmins, getAdminRequests, approveAdmin, revokeAdmin, getProfile } from '../services/api';
import type { User } from '../types';
import { Shield, UserCheck, UserX, AlertCircle } from 'lucide-react';

const ManageAdmins = () => {
    const [admins, setAdmins] = useState<User[]>([]);
    const [requests, setRequests] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const [adminsRes, requestsRes] = await Promise.all([
                getAllAdmins(),
                getAdminRequests()
            ]);
            setAdmins(adminsRes.data || []);
            setRequests(requestsRes.data || []);
        } catch (err) {
            console.error('Failed to load admin data', err);
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
            await loadData();
        })();
    }, []);

    const handleApprove = async (id: number) => {
        if (window.confirm('Are you sure you want to approve this admin?')) {
            try {
                await approveAdmin(id);
                await loadData();
            } catch (err) {
                alert('Failed to approve admin');
            }
        }
    };

    const handleRevoke = async (id: number) => {
        if (window.confirm('Are you sure you want to revoke admin access?')) {
            try {
                await revokeAdmin(id);
                await loadData();
            } catch (err) {
                alert('Failed to revoke admin access');
            }
        }
    };

    if (currentUser?.role !== 'OWNER') {
        return <div className="p-8 text-center text-red-600">Access Denied. Only Owner can view this page.</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <Shield className="text-blue-600" size={32} />
                <h1 className="text-3xl font-bold text-gray-900">Manage Admins</h1>
            </div>

            {/* Pending Requests Section */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertCircle className="text-orange-500" size={24} />
                    Pending Approval Requests
                </h2>
                {requests.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500 border border-gray-200">
                        No pending admin requests.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {requests.map(req => (
                            <div key={req.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">{req.username}</h3>
                                        <p className="text-gray-500 text-sm">{req.email}</p>
                                    </div>
                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">Pending</span>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleApprove(req.id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <UserCheck size={18} />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleRevoke(req.id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                        <UserX size={18} />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Current Admins Section */}
            <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Shield className="text-blue-600" size={24} />
                    Current Admins
                </h2>
                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : admins.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500 border border-gray-200">
                        No active admins found.
                    </div>
                ) : (
                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {admins.map(admin => (
                                    <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                    {admin.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{admin.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {admin.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleRevoke(admin.id)}
                                                className="text-red-600 hover:text-red-900 flex items-center justify-end gap-1 ml-auto"
                                            >
                                                <UserX size={16} />
                                                Revoke Access
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ManageAdmins;
