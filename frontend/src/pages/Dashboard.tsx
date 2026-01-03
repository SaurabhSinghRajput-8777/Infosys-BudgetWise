import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getProfile, 
  getTransactions, 
  getSavingsGoalProgress, 
  predictNextMonthExpenses, 
  getAnalytics 
} from '../services/api';
import type { User, Transaction, SavingsGoalProgress } from '../types/index';
import { TrendingUp, TrendingDown, Wallet, ArrowRight, Lock, Download } from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, 
  BarChart, Bar, Legend, ReferenceDot, PieChart, Pie, Cell 
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

const CHART_COLORS = ["#FF8042", "#00C49F", "#8884d8", "#82ca9d", "#a4de6c"];

// FIX: Explicitly define gradient classes so Tailwind can detect them
const CARD_STYLES: { [key: string]: string } = {
    blue: "bg-gradient-to-br from-blue-500 to-blue-600",
    red: "bg-gradient-to-br from-red-500 to-red-600",
    purple: "bg-gradient-to-br from-purple-500 to-purple-600",
    green: "bg-gradient-to-br from-green-500 to-green-600",
};

const TEXT_STYLES: { [key: string]: { label: string; subtext: string } } = {
    blue: { label: "text-blue-100", subtext: "text-blue-200" },
    red: { label: "text-red-100", subtext: "text-red-200" },
    purple: { label: "text-purple-100", subtext: "text-purple-200" },
    green: { label: "text-green-100", subtext: "text-green-200" },
};

const Dashboard = () => {
    const [profile, setProfile] = useState<User | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [savingsGoals, setSavingsGoals] = useState<SavingsGoalProgress[]>([]);
    
    const [incomeExpenseData, setIncomeExpenseData] = useState<{ month: string; income: number; expenses: number }[]>([]);
    const [categoryBreakdown, setCategoryBreakdown] = useState<{ category: string; amount: number }[]>([]);
    
    const [prediction, setPrediction] = useState<number | null>(null);
    const [historyMonths, setHistoryMonths] = useState<string[]>([]);
    const [historyTotals, setHistoryTotals] = useState<number[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [predicting, setPredicting] = useState(false);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const [profileRes, transactionsRes, savingsRes] = await Promise.all([
                getProfile(token),
                getTransactions(),
                getSavingsGoalProgress().catch(() => ({ data: [] }))
            ]);

            setProfile(profileRes.data);
            setTransactions(transactionsRes.data || []);
            setSavingsGoals(savingsRes.data || []);
            
            try {
                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth() + 1;
                const ares = await getAnalytics(year, month);
                
                const iv = ares.data.incomeVsExpenses || [];
                setIncomeExpenseData(iv.map((d: any) => ({ 
                    month: d.month, 
                    income: d.totalIncome || 0, 
                    expenses: d.totalExpenses || 0 
                })));
                
                const cb = ares.data.categoryBreakdown || [];
                setCategoryBreakdown(cb.map((c: any) => ({ 
                    category: c.category, 
                    amount: c.totalAmount || c.total || 0 
                })));
            } catch (e) {
                console.warn('Unable to fetch income/expense analytics', e);
            }

            try {
                const predRes = await predictNextMonthExpenses(12);
                setPrediction(predRes.data.predictedAmount);
                setHistoryMonths(predRes.data.historyMonths || []);
                setHistoryTotals(predRes.data.historyTotals || []);
            } catch (e) {
                console.warn('Unable to fetch initial prediction', e);
            }

        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = async () => {
        try {
            setExporting(true);
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            let currentY = 20;

            doc.setFontSize(20);
            doc.text('BudgetWise Financial Snapshot', 14, currentY);
            currentY += 10;
            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()} for ${profile?.firstName || 'User'}`, 14, currentY);
            currentY += 15;

            const graphsElement = document.getElementById('dashboard-graphs');
            if (graphsElement) {
                const canvas = await html2canvas(graphsElement, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                const imgProps = doc.getImageProperties(imgData);
                const pdfImgHeight = (imgProps.height * (pageWidth - 28)) / imgProps.width;

                if (currentY + pdfImgHeight > pageHeight) { doc.addPage(); currentY = 20; }
                doc.addImage(imgData, 'PNG', 14, currentY, pageWidth - 28, pdfImgHeight);
                currentY += pdfImgHeight + 10;
            }

            const analyticsElement = document.getElementById('ai-analytics');
            if (analyticsElement) {
                const canvas = await html2canvas(analyticsElement, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                const imgProps = doc.getImageProperties(imgData);
                const pdfImgHeight = (imgProps.height * (pageWidth - 28)) / imgProps.width;

                if (currentY + pdfImgHeight > pageHeight) { doc.addPage(); currentY = 20; }
                doc.text("AI Insights", 14, currentY - 2);
                doc.addImage(imgData, 'PNG', 14, currentY, pageWidth - 28, pdfImgHeight);
                currentY += pdfImgHeight + 15;
            }

            const tableRows = transactions.slice(0, 50).map((t: any) => [
                new Date(t.transactionDate).toLocaleDateString(),
                t.type,
                t.category,
                t.description || '-',
                `${t.amount}`
            ]);

            if (currentY > pageHeight - 40) { doc.addPage(); currentY = 20; }
            doc.text("Recent Transactions", 14, currentY);
            
            autoTable(doc, {
                head: [['Date', 'Type', 'Category', 'Description', 'Amount']],
                body: tableRows,
                startY: currentY + 5,
                styles: { fontSize: 10 },
                headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            });

            doc.save(`budgetwise_dashboard_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("Export failed", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setExporting(false);
        }
    };

    const handleManualPrediction = async () => {
        try {
            setPredicting(true);
            const res = await predictNextMonthExpenses(12);
            setPrediction(res.data.predictedAmount);
            setHistoryMonths(res.data.historyMonths || []);
            setHistoryTotals(res.data.historyTotals || []);
        } catch (err) {
            console.error('Prediction error', err);
            alert('Unable to get prediction.');
        } finally {
            setPredicting(false);
        }
    };

    const calculateTotals = () => {
        const safeTrans = Array.isArray(transactions) ? transactions : [];
        const totalIncome = safeTrans.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + (t.amount || 0), 0);
        const totalExpenses = safeTrans.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + (t.amount || 0), 0);
        const totalSavings = savingsGoals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0);
        return { totalIncome, totalExpenses, totalSavings, netBalance: totalIncome - totalExpenses - totalSavings };
    };

    const lastSixMonthsData = incomeExpenseData.slice(Math.max(0, incomeExpenseData.length - 6)).map((d) => {
        const date = new Date(d.month);
        return {
            month: isNaN(date.getTime()) ? d.month : date.toLocaleString('default', { month: 'short' }),
            income: d.income,
            expenses: d.expenses
        };
    });

    const lineChartData = historyMonths.map((monthStr, index) => {
        const date = new Date(monthStr);
        return {
            month: isNaN(date.getTime()) ? monthStr : date.toLocaleString('default', { month: 'short' }),
            amount: historyTotals[index] || 0
        };
    });

    if (historyMonths.length > 0 && prediction !== null) {
        const lastMonthStr = historyMonths[historyMonths.length - 1];
        const lastDate = new Date(lastMonthStr);
        const nextDate = new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, 1);
        const nextLabel = nextDate.toLocaleString('default', { month: 'short' });
        lineChartData.push({ month: nextLabel, amount: prediction });
    }

    const lastTwelve = incomeExpenseData.slice(Math.max(0, incomeExpenseData.length - 12));
    const avgMonthlySpending = lastTwelve.length > 0 ? (lastTwelve.reduce((s, m) => s + m.expenses, 0) / lastTwelve.length) : 0;
    const totalIncomeYear = lastTwelve.reduce((s, m) => s + m.income, 0);
    const totalExpenseYear = lastTwelve.reduce((s, m) => s + m.expenses, 0);

    const { totalIncome, totalExpenses, totalSavings, netBalance } = calculateTotals();
    const recentTransactions = transactions.slice(0, 7);

    const totalCategoryAmount = categoryBreakdown.reduce((s, c) => s + c.amount, 0);
    const topCategories = [...categoryBreakdown].sort((a, b) => b.amount - a.amount).slice(0, 3);
    const monthlyInsightsText = topCategories.length > 0 
        ? topCategories.map(c => `${c.category}: ₹${c.amount.toLocaleString()} (${((c.amount/totalCategoryAmount)*100).toFixed(0)}%)`).join(' • ')
        : 'No spending breakdown available yet.';

    const savingTips = topCategories.length > 0 && totalExpenses > 0 && (topCategories[0].amount / totalExpenses > 0.3)
        ? [`Reduce ${topCategories[0].category} by 10% to save approx ₹${Math.round(topCategories[0].amount * 0.10)}.`]
        : ['Spending looks reasonably distributed.'];

    const savingAlerts = savingsGoals.length === 0 
        ? ['No savings goals set.'] 
        : savingsGoals.filter(g => (g.currentAmount / g.targetAmount) < 0.5).map(g => `${g.name} is behind schedule.`);
    if (savingAlerts.length === 0 && savingsGoals.length > 0) savingAlerts.push('All goals on track.');

    // --- RE-ADDED: Prediction Badge Logic ---
    const predictedBadge = (() => {
        if (prediction === null || !Array.isArray(historyTotals) || historyTotals.length === 0) return null;
        const last = historyTotals[historyTotals.length - 1] || 0;
        if (last === 0) return { pct: null, last };
        const diff = (prediction || 0) - last;
        const pct = (diff / last) * 100;
        return { pct, last };
    })();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.firstName || profile?.username || 'User'}</h1>
                        <p className="text-sm text-gray-600 mt-1">Here's your financial snapshot</p>
                    </div>
                    {/* Export button and Net Balance removed from here */}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <SummaryCard icon={TrendingUp} color="blue" label="Total Income" amount={totalIncome} />
                <SummaryCard icon={TrendingDown} color="red" label="Total Expenses" amount={totalExpenses} />
                <SummaryCard icon={Lock} color="purple" label="Frozen Savings 🔒" amount={totalSavings} subtext={`Locked in ${savingsGoals.length} goals`} />
                <SummaryCard icon={Wallet} color="green" label="Available Balance" amount={netBalance} subtext="After expenses & savings" />
            </div>
        {/* left part div of ai and recent transaction */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 mb-6">
                <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-4 h-full">
                    <div id="ai-analytics" className="bg-gray-50 border rounded-lg p-3 mb-4">
                        <h3 className="font-semibold text-lg">AI Analytics</h3>
                        <p className="text-base font-medium text-gray-700 mb-2">{monthlyInsightsText}</p>
                        
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleManualPrediction}
                                className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-sm"
                            >
                                {predicting ? 'Predicting...' : 'Recalculate'}
                            </button>
                            {prediction !== null && (
                                <div className="text-sm text-gray-700">Next month predicted: <strong>₹{prediction.toFixed(0)}</strong></div>
                            )}
                        </div>
                        
                        <div className="mt-2 text-base text-gray-800">
                            <div><strong>Tip:</strong> {savingTips[0]}</div>
                            <div className="mt-1 text-sm text-gray-600">Alerts: {savingAlerts.slice(0, 2).join(' • ')}</div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-2xl font-bold text-gray-900">Recent Transactions</h2>
                        <Link to="/transactions" className="text-blue-600 hover:text-blue-700 font-semibold text-base flex items-center gap-1">
                            View All <ArrowRight size={18} />
                        </Link>
                    </div>

                    {recentTransactions.length === 0 ? (
                        <div className="text-center py-6">
                            <p className="text-gray-500 text-lg mb-3">No transactions yet</p>
                            <Link to="/transactions" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">
                                Add Your First Transaction <ArrowRight size={18} />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentTransactions.map((t) => (
                                <TransactionRow key={t.id} transaction={t} />
                            ))}
                        </div>
                    )}
                </div>
            {/* right part div of financial analytics , graphs and charts */}
                <div id="dashboard-graphs" className="lg:col-span-7 bg-white rounded-xl shadow-lg p-5 h-full flex flex-col">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Financial Analytics</h2>
                    <div className="flex-1 grid grid-rows-2 gap-1">
                        <div className="row-span-1 p-1">
                            <h3 className="font-semibold mb-2">Income vs Expenses (last 6 months)</h3>
                            <div className="w-full h-80">
                                <ResponsiveContainer>
                                    <BarChart data={lastSixMonthsData} margin={{ top: 0, right: 6, left: 0, bottom: 2 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip formatter={(val: number) => `₹${val.toFixed(2)}`} />
                                        <Legend height={24} />
                                        <Bar dataKey="income" fill="#00C49F" name="Income" />
                                        <Bar dataKey="expenses" fill="#FF8042" name="Expenses" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="row-span-1 p-1">
                            <h3 className="font-semibold mb-2 flex items-center gap-3">
                                <span>Expense History & Prediction</span>
                                {/* --- RE-ADDED: Prediction Badge Display --- */}
                                {prediction !== null && predictedBadge && (
                                    <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-800 px-2 py-1 rounded text-sm font-normal ml-3">
                                        <strong className="text-orange-900">Predicted:</strong>
                                        <span className="font-semibold">₹{prediction.toFixed(0)}</span>
                                        {predictedBadge.pct !== null && (
                                            <span className={predictedBadge.pct >= 0 ? 'text-red-600' : 'text-green-600'}>
                                                {predictedBadge.pct >= 0 ? '▲' : '▼'} {Math.abs(predictedBadge.pct).toFixed(1)}%
                                            </span>
                                        )}
                                    </span>
                                )}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="w-full h-80">
                                    <ResponsiveContainer>
                                        <LineChart data={lineChartData} margin={{ top: 0, right: 10, left: 0, bottom: 2 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip formatter={(val: number) => `₹${val.toFixed(2)}`} />
                                            <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={3} dot={{ r: 3 }} />
                                            {lineChartData.length > 0 && prediction !== null && (
                                                <ReferenceDot x={lineChartData[lineChartData.length - 1].month} y={prediction} r={6} fill="#FF8042" stroke="#FF8042" />
                                            )}
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="w-full h-80">
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                dataKey="value"
                                                data={categoryBreakdown.map(c => ({ name: c.category, value: c.amount }))}
                                                outerRadius={96}
                                                innerRadius={40}
                                                label={({ name, value }) => `${name} (${value ? Math.round((value / (totalCategoryAmount || 1)) * 100) : 0}%)`}
                                            >
                                                {categoryBreakdown.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <SimpleStatCard color="blue" title="Avg Monthly Spending (12m)" value={avgMonthlySpending} />
                <SimpleStatCard color="green" title="Total Income (12m)" value={totalIncomeYear} />
                <SimpleStatCard color="red" title="Total Expenses (12m)" value={totalExpenseYear} />
            </div>
        </div>
    );
};

const SummaryCard = ({ icon: Icon, color, label, amount, subtext }: any) => (
    <div className={`${CARD_STYLES[color]} rounded-xl shadow-lg p-6 text-white`}>
        <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg"><Icon size={28} /></div>
            <div>
                <p className={`text-sm ${TEXT_STYLES[color].label}`}>{label}</p>
                <p className="text-4xl font-extrabold">₹{amount.toLocaleString()}</p>
                {subtext && <p className={`text-sm ${TEXT_STYLES[color].subtext} mt-1`}>{subtext}</p>}
            </div>
        </div>
    </div>
);

const SimpleStatCard = ({ color, title, value }: any) => (
    <div className={`${CARD_STYLES[color]} p-4 rounded-lg shadow text-white`}>
        <h3 className={`text-sm opacity-90 mb-2 ${TEXT_STYLES[color].label}`}>{title}</h3>
        <p className="text-2xl font-bold">₹{value.toFixed(2)}</p>
    </div>
);

const TransactionRow = ({ transaction }: { transaction: any }) => (
    <div className={`p-2 rounded-lg border-l-4 ${transaction.type === 'INCOME' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    {transaction.type === 'INCOME' ? <TrendingUp className="text-green-600" size={18} /> : <TrendingDown className="text-red-600" size={18} />}
                    <h4 className="font-semibold text-base text-gray-900">{transaction.category}</h4>
                </div>
                <p className="text-xs text-gray-500 mt-1">{new Date(transaction.transactionDate).toLocaleDateString('en-IN')}</p>
            </div>
            <div className={`text-xl font-bold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'INCOME' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
            </div>
        </div>
    </div>
);

export default Dashboard;