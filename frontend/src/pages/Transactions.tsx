import { useState, useEffect } from 'react';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../services/api';
import type { Transaction, TransactionRequest } from '../types/index';
import { Plus, Edit2, Trash2, X, TrendingUp, TrendingDown } from 'lucide-react';

const CATEGORIES = {
    EXPENSE: ['Rent', 'Food', 'Travel', 'Entertainment', 'Shopping', 'Healthcare', 'Utilities', 'Other'],
    INCOME: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other']
};

const Transactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [showCustomCategory, setShowCustomCategory] = useState(false);
    const [customCategory, setCustomCategory] = useState('');
    const [formData, setFormData] = useState<TransactionRequest>({
        type: 'EXPENSE',
        amount: 0,
        category: '',
        description: '',
        transactionDate: new Date().toISOString().slice(0, 16)
    });

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const response = await getTransactions();
            setTransactions(response.data);
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Use custom category if "Other" is selected and custom category is provided
            const finalCategory = showCustomCategory && customCategory.trim() 
                ? customCategory.trim() 
                : formData.category;
            
            if (!finalCategory) {
                alert('Please select or enter a category');
                return;
            }
            
            const dataToSubmit = { ...formData, category: finalCategory };
            
            if (editingTransaction) {
                await updateTransaction(editingTransaction.id, dataToSubmit);
            } else {
                await createTransaction(dataToSubmit);
            }
            await loadTransactions();
            closeModal();
        } catch (error) {
            console.error('Error saving transaction:', error);
            alert('Failed to save transaction');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await deleteTransaction(id);
                await loadTransactions();
            } catch (error) {
                console.error('Error deleting transaction:', error);
            }
        }
    };

    const openModal = (transaction?: Transaction) => {
        if (transaction) {
            setEditingTransaction(transaction);
            const isCustomCategory = !CATEGORIES.EXPENSE.includes(transaction.category) && !CATEGORIES.INCOME.includes(transaction.category);
            setFormData({
                type: transaction.type,
                amount: transaction.amount,
                category: isCustomCategory ? 'Other' : transaction.category,
                description: transaction.description || '',
                transactionDate: new Date(transaction.transactionDate).toISOString().slice(0, 16)
            });
            if (isCustomCategory) {
                setShowCustomCategory(true);
                setCustomCategory(transaction.category);
            } else {
                setShowCustomCategory(false);
                setCustomCategory('');
            }
        } else {
            setEditingTransaction(null);
            setFormData({
                type: 'EXPENSE',
                amount: 0,
                category: '',
                description: '',
                transactionDate: new Date().toISOString().slice(0, 16)
            });
            setShowCustomCategory(false);
            setCustomCategory('');
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTransaction(null);
        setShowCustomCategory(false);
        setCustomCategory('');
    };

    const filterByType = (type: 'INCOME' | 'EXPENSE' | 'ALL') => {
        return type === 'ALL' 
            ? transactions 
            : transactions.filter(t => t.type === type);
    };

    const [filter, setFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
    const filteredTransactions = filterByType(filter);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Transactions</h1>
                    <p className="text-lg text-gray-600 mt-1">Manage your income and expenses</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg font-semibold transition-all shadow-lg"
                >
                    <Plus size={20} />
                    Add Transaction
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setFilter('ALL')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        filter === 'ALL'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('INCOME')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        filter === 'INCOME'
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    Income
                </button>
                <button
                    onClick={() => setFilter('EXPENSE')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        filter === 'EXPENSE'
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    Expenses
                </button>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {filteredTransactions.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {filteredTransactions.map((transaction) => (
                            <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg ${
                                            transaction.type === 'INCOME' 
                                                ? 'bg-green-100' 
                                                : 'bg-red-100'
                                        }`}>
                                            {transaction.type === 'INCOME' ? (
                                                <TrendingUp className="text-green-600" size={24} />
                                            ) : (
                                                <TrendingDown className="text-red-600" size={24} />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">{transaction.category}</h3>
                                            <p className="text-gray-600 text-sm">{transaction.description || 'No description'}</p>
                                            <p className="text-gray-500 text-xs mt-1">
                                                {new Date(transaction.transactionDate).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`text-2xl font-bold ${
                                            transaction.type === 'INCOME' 
                                                ? 'text-green-600' 
                                                : 'text-red-600'
                                        }`}>
                                            {transaction.type === 'INCOME' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openModal(transaction)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                aria-label="Edit transaction"
                                                title="Edit transaction"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(transaction.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                aria-label="Delete transaction"
                                                title="Delete transaction"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No transactions found</p>
                        <button
                            onClick={() => openModal()}
                            className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Add Your First Transaction
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    aria-label="Close modal"
                                    title="Close"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Type
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'INCOME', category: '' })}
                                            className={`p-4 rounded-lg font-medium transition-all ${
                                                formData.type === 'INCOME'
                                                    ? 'bg-green-600 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            Income
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'EXPENSE', category: '' })}
                                            className={`p-4 rounded-lg font-medium transition-all ${
                                                formData.type === 'EXPENSE'
                                                    ? 'bg-red-600 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            Expense
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        required={!showCustomCategory}
                                        value={formData.category}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFormData({ ...formData, category: value });
                                            if (value === 'Other') {
                                                setShowCustomCategory(true);
                                            } else {
                                                setShowCustomCategory(false);
                                                setCustomCategory('');
                                            }
                                        }}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        aria-label="Transaction category"
                                    >
                                        <option value="">Select a category</option>
                                        {CATEGORIES[formData.type].map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {showCustomCategory && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Custom Category Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={customCategory}
                                            onChange={(e) => setCustomCategory(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter custom category name"
                                            autoFocus
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={3}
                                        placeholder="Add a note..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.transactionDate}
                                        onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        aria-label="Transaction date and time"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                                    >
                                        {editingTransaction ? 'Update' : 'Add'} Transaction
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
