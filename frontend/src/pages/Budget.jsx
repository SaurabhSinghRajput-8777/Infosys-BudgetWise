import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/Button.jsx';

const Budget = ({ onBudgetSetupComplete }) => {
    const [income, setIncome] = useState('');
    const [savingGoal, setSavingGoal] = useState('');
    const [targetExpenses, setTargetExpenses] = useState(null);
    const [categoryExpenses, setCategoryExpenses] = useState({
        "Food": '',
        "Transport": '',
        "Bills": '',
        "Rent": '',
        "Shopping": '',
        "Miscellaneous": ''
    });
    const [remainingExpenses, setRemainingExpenses] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);

    const handleCalculateBudget = () => {
        const incomeVal = parseFloat(income) || 0;
        const savingGoalVal = parseFloat(savingGoal) || 0;
        const calculatedTarget = incomeVal - savingGoalVal;
        
        setTargetExpenses(calculatedTarget);
        setRemainingExpenses(calculatedTarget);
        
        // Reset category expenses when recalculating
        setCategoryExpenses({
            "Food": '',
            "Transport": '',
            "Bills": '',
            "Rent": '',
            "Shopping": '',
            "Miscellaneous": ''
        });
    };

    const handleCategoryChange = (e, category) => {
        const value = e.target.value === '' ? '' : parseFloat(e.target.value);
        const newExpenses = { ...categoryExpenses, [category]: value };
        setCategoryExpenses(newExpenses);

        const currentTotal = Object.values(newExpenses).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
        const newRemaining = targetExpenses - currentTotal;
        setRemainingExpenses(newRemaining);
    };

    const handleBudgetSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setNotification(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token not found. Please log in again.');
            setLoading(false);
            return;
        }

        // Use a small epsilon for float comparison
        if (remainingExpenses !== null && Math.abs(remainingExpenses) > 0.01) {
            setError('Please allocate all remaining funds. Remaining: $' + remainingExpenses.toFixed(2));
            setLoading(false);
            return;
        }

        const budgetData = {
            monthlyIncome: parseFloat(income),
            savingGoal: parseFloat(savingGoal),
            targetExpenses: parseFloat(targetExpenses),
            categoryExpenses: Object.fromEntries(
                Object.entries(categoryExpenses)
                    .filter(([key, val]) => val !== '' && val !== null)
                    .map(([key, val]) => [key, parseFloat(val)])
            )
        };

        try {
            await axios.post('http://localhost:8080/api/budgets', budgetData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            setNotification('Budget saved successfully!');
            setTimeout(() => {
                setNotification(null);
            }, 3000);
            onBudgetSetupComplete();
        } catch (err) {
            console.error('Budget submission error:', err);
            setError(err.response ? err.response.data.message : 'Failed to save budget. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const isSavable = targetExpenses !== null && Math.abs(remainingExpenses) < 0.01;

    return (
        <div className="budget-page-container">
            <div className="budget-setup-card">
                <h2>Set Your Financial Goals</h2>
                <p>Please enter your monthly financial details to get started.</p>
                <form onSubmit={handleBudgetSubmit}>
                    <input
                        type="number"
                        placeholder="Monthly Income"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Saving Goal"
                        value={savingGoal}
                        onChange={(e) => setSavingGoal(e.target.value)}
                        required
                    />
                    <Button type="button" onClick={handleCalculateBudget}>Calculate Target Expenses</Button>
                    
                    {targetExpenses !== null && (
                        <div style={{ marginTop: '20px' }}>
                            <p>Calculated Target Expenses: **${targetExpenses.toFixed(2)}**</p>
                            <p className={remainingExpenses !== 0 ? 'remaining-negative' : ''}>Remaining to Allocate: **${remainingExpenses.toFixed(2)}**</p>
                            
                            <div className="category-allocation">
                                {Object.keys(categoryExpenses).map(category => (
                                    <div key={category} className="category-item">
                                        <label>{category}:</label>
                                        <input
                                            type="number"
                                            placeholder={`Allocated to ${category}`}
                                            value={categoryExpenses[category]}
                                            onChange={(e) => handleCategoryChange(e, category)}
                                            min="0"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <Button type="submit" disabled={loading || !isSavable}>
                        {loading ? 'Saving...' : 'Save Budget'}
                    </Button>
                </form>
                {notification && <div className="notification-message success-message">{notification}</div>}
                {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
            </div>
        </div>
    );
};

export default Budget;