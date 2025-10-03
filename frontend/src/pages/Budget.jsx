import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button.jsx';

const Budget = ({ onBudgetSetupComplete }) => {
    // Default initial state for easy resetting
    const initialCategoryExpenses = {
        "Food": '',
        "Transport": '',
        "Bills": '',
        "Rent": '',
        "Shopping": '',
        "Miscellaneous": ''
    };
    
    const [income, setIncome] = useState('');
    const [savingGoal, setSavingGoal] = useState('');
    const [targetExpenses, setTargetExpenses] = useState(null);
    const [categoryExpenses, setCategoryExpenses] = useState(initialCategoryExpenses);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);

    // Calculate sum of all manually entered allocations
    const manuallyAllocatedTotal = Object.values(categoryExpenses)
        .reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    
    // Calculate remaining funds based on the target and manual allocations
    const remainingExpenses = targetExpenses !== null ? targetExpenses - manuallyAllocatedTotal : null;

    // Effect to calculate target expenses in real-time
    useEffect(() => {
        const incomeVal = parseFloat(income) || 0;
        const savingGoalVal = parseFloat(savingGoal) || 0;
        const calculatedTarget = incomeVal - savingGoalVal;

        setTargetExpenses(calculatedTarget);
    }, [income, savingGoal]);


    // --- Handlers ---

    const handleCategoryChange = (e, category) => {
        const value = e.target.value === '' ? '' : parseFloat(e.target.value);
        
        // Ensure input is non-negative
        if (value < 0) return;

        setCategoryExpenses(prevExpenses => ({
            ...prevExpenses,
            [category]: value
        }));
    };
    
    const handleClearAll = () => {
        // Reset all state variables
        setIncome('');
        setSavingGoal('');
        setTargetExpenses(null);
        setCategoryExpenses(initialCategoryExpenses);
        setError(null);
        setNotification(null);
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

        const currentRemaining = targetExpenses - manuallyAllocatedTotal;
        
        // Prepare data for submission: start with all manual allocations
        const dataForSubmission = { ...categoryExpenses };

        // Auto-assign any positive remainder to Miscellaneous
        if (currentRemaining > 0) {
            dataForSubmission["Miscellaneous"] = parseFloat(currentRemaining.toFixed(2));
        } else if (currentRemaining < 0) {
            // If negative, use what the user entered for Miscellaneous (if anything)
            dataForSubmission["Miscellaneous"] = parseFloat(categoryExpenses["Miscellaneous"] || 0);
        } else {
            // If perfectly balanced (currentRemaining is ~0)
             dataForSubmission["Miscellaneous"] = parseFloat(categoryExpenses["Miscellaneous"] || 0);
        }

        const budgetData = {
            monthlyIncome: parseFloat(income) || 0,
            savingGoal: parseFloat(savingGoal) || 0,
            targetExpenses: parseFloat(targetExpenses) || 0,
            categoryExpenses: Object.fromEntries(
                Object.entries(dataForSubmission)
                    .filter(([, val]) => val !== null && parseFloat(val) > 0)
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
    
    // --- Render Helpers ---
    
    const renderRemainingMessage = () => {
        if (remainingExpenses === null || targetExpenses <= 0) return null;
        
        const fixedRemaining = Math.abs(remainingExpenses).toFixed(2);
        
        let message, className;

        // Check for deficit (over-allocation) - red
        if (remainingExpenses < -0.01) {
            message = `You have over-allocated by $${fixedRemaining}. Please reduce your spending plans.`;
            className = 'deficit';
        // Check for perfect balance - green (using surplus styling)
        } else if (Math.abs(remainingExpenses) < 0.01) {
             message = 'Budget is perfectly balanced!';
             className = 'surplus'; // Use surplus class for green color
        } else {
            // Do not show message for surplus, as requested, only show for deficit or balance
            return null;
        }
        
        return <div className={`remaining-message ${className}`}>{message}</div>;
    };
    
    const overallProgress = targetExpenses > 0 
        ? Math.min((manuallyAllocatedTotal / targetExpenses) * 100, 100) 
        : 0;

    const isSaveDisabled = loading || income === '' || savingGoal === '';

    return (
        <div className="budget-page-container">
            <div className="budget-setup-card">
                <h2>Set Your Financial Goals</h2>
                <p>Define your monthly income and savings first. Expenses will be auto-calculated.</p>
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

                    {targetExpenses !== null && targetExpenses > 0 && (
                        <div className="budget-progress-section">
                            {renderRemainingMessage()}

                            {/* Overall Allocation Progress Bar */}
                            <div className="budget-progress-container">
                                <div className="progress-label">
                                    <span>Overall Expense Allocation</span>
                                    <span>${manuallyAllocatedTotal.toFixed(2)} / ${targetExpenses.toFixed(2)}</span>
                                </div>
                                <div className="progress-bar-wrapper">
                                    <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }}></div>
                                </div>
                            </div>
                            
                            {/* Category Allocations */}
                            <div className="category-allocation">
                                {Object.keys(categoryExpenses).map(category => (
                                    <div key={category} className="category-item">
                                        <label>{category}:</label>
                                        <input
                                            type="number"
                                            placeholder={`Amount for ${category}`}
                                            value={
                                                category === "Miscellaneous" 
                                                ? (remainingExpenses > 0.01 ? remainingExpenses.toFixed(2) : (Math.abs(remainingExpenses) < 0.01 ? '0' : categoryExpenses[category]))
                                                : categoryExpenses[category]
                                            }
                                            onChange={(e) => handleCategoryChange(e, category)}
                                            min="0"
                                            // The input field is marked readOnly and styled differently when auto-filling the surplus
                                            readOnly={category === "Miscellaneous" && remainingExpenses > 0}
                                            style={category === "Miscellaneous" && remainingExpenses > 0 ? {backgroundColor: '#2D3748'} : {}}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="profile-action-buttons" style={{ marginTop: '30px' }}>
                        <Button type="button" onClick={handleClearAll} style={{ backgroundColor: '#4A5568', color: '#F8F9FA', flex: '1' }}>
                            Clear All
                        </Button>
                        <Button type="submit" disabled={isSaveDisabled} style={{ flex: '2' }}>
                            {loading ? 'Saving...' : 'Save Budget'}
                        </Button>
                    </div>
                </form>
                {notification && <div className="notification-message success-message">{notification}</div>}
                {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
            </div>
        </div>
    );
};

export default Budget;