import React from 'react';
import axios from 'axios';

const TransactionList = ({ transactions, onEdit, onDelete, onTransactionChange }) => {
    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await axios.delete(`http://localhost:8080/api/transactions/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Transaction deleted successfully!');
                onTransactionChange(); // Trigger a re-fetch of transactions
            } catch (error) {
                console.error('Failed to delete transaction:', error);
                alert('Failed to delete transaction.');
            }
        }
    };

    return (
        <div className="transaction-list-card">
            <h3 className="card-title">Recent Transactions</h3>
            {transactions.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t.id}>
                                <td>{t.date}</td>
                                <td>{t.description}</td>
                                <td>{t.category}</td>
                                <td>${t.amount.toFixed(2)}</td>
                                <td>{t.type}</td>
                                <td>
                                    <button onClick={() => onEdit(t)}>Edit</button>
                                    <button onClick={() => handleDelete(t.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No transactions found for the current month.</p>
            )}
        </div>
    );
};

export default TransactionList;