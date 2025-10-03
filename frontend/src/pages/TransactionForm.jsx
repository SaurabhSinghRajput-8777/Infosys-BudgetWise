import React, { useState } from 'react';
import Button from '../components/Button.jsx';

const TransactionForm = ({ onSave, initialData, onCancel }) => {
    const [description, setDescription] = useState(initialData?.description || '');
    const [amount, setAmount] = useState(initialData?.amount || '');
    const [category, setCategory] = useState(initialData?.category || '');
    const [type, setType] = useState(initialData?.type || 'EXPENSE');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            id: initialData?.id,
            description,
            amount,
            category,
            type,
            date: new Date().toISOString().split('T')[0]
        });
        if (!initialData) {
            setDescription('');
            setAmount('');
            setCategory('');
        }
    };

    const categories = ['Food', 'Transport', 'Bills', 'Rent', 'Shopping', 'Miscellaneous', 'Salary'];

    return (
        <div className="transaction-form-card">
            <h3 className="card-title">{initialData ? 'Edit Transaction' : 'Add New Transaction'}</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Select a Category</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                </select>
                <Button type="submit">
                    {initialData ? 'Save Changes' : 'Add Transaction'}
                </Button>
                {initialData && <Button type="button" onClick={onCancel} style={{ marginTop: '0.5rem' }}>Cancel</Button>}
            </form>
        </div>
    );
};

export default TransactionForm;