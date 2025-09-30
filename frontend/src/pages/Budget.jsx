import React, { useState } from 'react';

const Budget = ({ onBudgetSetupComplete }) => {
    const [income, setIncome] = useState('');
    const [savingGoal, setSavingGoal] = useState('');
    const [targetExpenses, setTargetExpenses] = useState('');

    const handleBudgetSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send this data to your backend API.
        console.log("Budget data submitted:", { income, savingGoal, targetExpenses });

        // For now, we'll just simulate a successful save.
        localStorage.setItem('userBudget', JSON.stringify({ income, savingGoal, targetExpenses }));
        
        alert('Your budget has been set successfully!');
        onBudgetSetupComplete();
    };

    return (
        <div className="budget-page-container page-container">
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
                    <input
                        type="number"
                        placeholder="Target Expenses"
                        value={targetExpenses}
                        onChange={(e) => setTargetExpenses(e.target.value)}
                        required
                    />
                    <button type="submit">Save Budget</button>
                </form>
            </div>
        </div>
    );
};

export default Budget;