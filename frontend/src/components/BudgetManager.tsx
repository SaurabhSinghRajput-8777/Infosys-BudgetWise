import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  getBudgets, 
  createBudget, 
  updateBudget, 
  deleteBudget, 
  getBudgetProgress 
} from '../services/api';
import type { Budget, BudgetRequest, BudgetProgress } from '../types/index';

const categories = [
  'Housing', 'Food', 'Transportation', 'Utilities', 
  'Healthcare', 'Entertainment', 'Shopping', 'Education', 'Other'
];

const BudgetManager: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [progress, setProgress] = useState<BudgetProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const { register, handleSubmit, reset, setValue } = useForm<BudgetRequest>();

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const [budgetsRes, progressRes] = await Promise.all([
        getBudgets(selectedMonth, selectedYear),
        getBudgetProgress(selectedMonth, selectedYear)
      ]);
      setBudgets(budgetsRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth, selectedYear]);

  const onSubmit = async (data: BudgetRequest) => {
    try {
      // Use custom category if "Other" is selected and custom category is provided
      const finalCategory = showCustomCategory && customCategory.trim()
        ? customCategory.trim()
        : selectedCategory;
      
      if (!finalCategory) {
        alert('Please select or enter a category');
        return;
      }
      
      const dataToSubmit = { ...data, category: finalCategory };
      
      if (editingId) {
        await updateBudget(editingId, dataToSubmit);
      } else {
        await createBudget({
          ...dataToSubmit,
          month: selectedMonth,
          year: selectedYear
        });
      }
      reset();
      setEditingId(null);
      setShowCustomCategory(false);
      setCustomCategory('');
      setSelectedCategory('');
      fetchBudgets();
    } catch (error) {
      console.error('Error saving budget:', error);
      alert(error instanceof Error ? error.message : 'Failed to save budget');
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingId(budget.id);
    const isCustomCategory = !categories.includes(budget.category);
    if (isCustomCategory) {
      setSelectedCategory('Other');
      setShowCustomCategory(true);
      setCustomCategory(budget.category);
    } else {
      setSelectedCategory(budget.category);
      setShowCustomCategory(false);
      setCustomCategory('');
    }
    setValue('amount', budget.amount);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(id);
        fetchBudgets();
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const getProgressForCategory = (category: string) => {
    return progress.find(p => p.category === category) || 
      { category, budgeted: 0, spent: 0, remaining: 0, percentage: 0 };
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Monthly Budget Manager</h2>
      
      {/* Month/Year Selector */}
      <div className="mb-6 flex gap-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="p-2 border rounded"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
            <option key={month} value={month}>
              {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="p-2 border rounded w-24"
        />
      </div>

      {/* Budget Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCategory(value);
              if (value === 'Other') {
                setShowCustomCategory(true);
              } else {
                setShowCustomCategory(false);
                setCustomCategory('');
              }
            }}
            className="p-2 border rounded"
            disabled={!!editingId}
            required={!showCustomCategory}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount"
            {...register('amount', { required: true, min: 0 })}
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {editingId ? 'Update Budget' : 'Add Budget'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                reset();
                setEditingId(null);
                setShowCustomCategory(false);
                setCustomCategory('');
                setSelectedCategory('');
              }}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
        {showCustomCategory && (
          <div className="mb-4">
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter custom category name"
              className="w-full p-2 border rounded"
              required
              autoFocus
            />
          </div>
        )}
      </form>

      {/* Budget List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading budgets...</div>
        ) : budgets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No budgets set for this month. Add one above to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budgeted
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spent
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remaining
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {budgets.map(budget => {
                  const progress = getProgressForCategory(budget.category);
                  const isOverBudget = progress.remaining < 0;
                  
                  return (
                    <tr key={budget.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{budget.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        ₹{budget.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        ₹{progress.spent.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right ${
                        isOverBudget ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ₹{Math.abs(progress.remaining).toFixed(2)} {isOverBudget ? 'Over' : 'Left'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              progress.percentage > 100 ? 'bg-red-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 text-right mt-1">
                          {Math.round(progress.percentage)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(budget)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(budget.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetManager;
