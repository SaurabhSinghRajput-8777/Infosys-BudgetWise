import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionForm from './TransactionForm.jsx';
import TransactionList from './TransactionList.jsx';

const Transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token not found. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://localhost:8080/api/transactions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(response.data);
        } catch (err) {
            console.error('Failed to fetch transactions:', err);
            setError('Failed to load transactions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleSaveTransaction = async (transactionData) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setLoading(true);
        setError(null);
        try {
            if (transactionData.id) {
                await axios.put(`http://localhost:8080/api/transactions/${transactionData.id}`, transactionData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Transaction updated successfully!');
            } else {
                await axios.post('http://localhost:8080/api/transactions', transactionData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Transaction added successfully!');
            }
            setEditingTransaction(null);
            fetchTransactions();
        } catch (err) {
            console.error('Error saving transaction:', err);
            setError('Failed to save transaction. Please check your data.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (transaction) => {
        setEditingTransaction(transaction);
    };

    const handleCancelEdit = () => {
        setEditingTransaction(null);
    };

    if (loading) {
        return <div className="page-container">Loading transactions...</div>;
    }

    if (error) {
        return <div className="page-container" style={{ color: 'red' }}>Error: {error}</div>;
    }

    return (
        <div className="page-container">
            <div className="transactions-content">
                <TransactionForm
                    onSave={handleSaveTransaction}
                    initialData={editingTransaction}
                    onCancel={handleCancelEdit}
                />
                <TransactionList
                    transactions={transactions}
                    onEdit={handleEditClick}
                    onDelete={fetchTransactions}
                    onTransactionChange={fetchTransactions}
                />
            </div>
        </div>
    );
};

export default Transaction;