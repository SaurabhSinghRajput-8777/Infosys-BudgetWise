import React from 'react';
import axios from 'axios';
import { FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import './Transaction.css';

const TransactionList = ({ transactions, onEdit, onTransactionChange }) => {
    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await axios.delete(`http://localhost:8080/api/transactions/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Transaction deleted successfully!');
                onTransactionChange();
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
                <div className="transaction-list">
                                                {transactions.map(t => (<div className="transaction-card" key={t.id}>
  <div className="transaction-left">
    <div className="transaction-icon">
      {t.type === 'EXPENSE' ? <FaCreditCard /> : <FaMoneyBillWave />}
    </div>

    {/* Horizontal Info Row (Fixed Columns) */}
    <div className="transaction-info-row">
      <div className="transaction-category">{t.category || 'General'}</div>
      <div className="transaction-description">{t.description || 'No Description'}</div>
      <div className="transaction-date">{new Date(t.date).toLocaleDateString()}</div>
    </div>
  </div>

  <div className="transaction-right">
    <div className={`transaction-amount ${t.type.toLowerCase()}`}>
      {t.type === 'EXPENSE' ? '-' : '+'}${parseFloat(t.amount).toFixed(2)}
    </div>
    <div className="transaction-actions">
      <button onClick={() => onEdit(t)} className="action-button edit-button">Edit</button>
      <button onClick={() => handleDelete(t.id)} className="action-button delete-button">Delete</button>
    </div>
  </div>
</div>

                    ))}
                </div>
            ) : (
                <p>No transactions found for the current month.</p>
            )}
        </div>
    );
};

export default TransactionList;
