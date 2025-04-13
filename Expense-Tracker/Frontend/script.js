// DOM Elements
const backendUrl = 'http://localhost:5000';
const dashboardContent = document.getElementById('dashboardContent');
const authContent = document.getElementById('authContent');
const loginContainer = document.getElementById('loginContainer');
const signupContainer = document.getElementById('signupContainer');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const expenseList = document.getElementById('expenseList');
const expenseModal = document.getElementById('expenseModal');
const closeModal = document.getElementById('closeModal');
const expenseForm = document.getElementById('expenseForm');
const modalTitle = document.getElementById('modalTitle');
const expenseAmountInput = document.getElementById('expenseAmountInput');
const expenseDescription = document.getElementById('expenseDescription');
const expenseCategory = document.getElementById('expenseCategory');
const expenseDate = document.getElementById('expenseDate');
const expenseId = document.getElementById('expenseId');
const incomeAmount = document.getElementById('incomeAmount');
const expenseAmount = document.getElementById('expenseAmount');
const balanceAmount = document.getElementById('balanceAmount');
const incomeChange = document.getElementById('incomeChange');
const expenseChange = document.getElementById('expenseChange');
const balanceChange = document.getElementById('balanceChange');
const categoryTabs = document.querySelectorAll('.tab');
const categoryTabContents = document.querySelectorAll('.tab-content');

// Chart instances
let categoryChart, monthlyChart;

// Sample data (in a real app, this would come from a backend)
let users = [];
let currentUser = null;
let expenses = [];

// Initialize the app
function init() {
    // Load sample data
    loadSampleData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Show auth content by default
    showAuthContent();
}

function loadSampleData() {
    // Sample users
    users = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            currency: 'USD',
            monthlyBudget: 3000
        }
    ];
    
    // Sample expenses
    expenses = [
        { id: 1, userId: 1, amount: 1200, description: 'Salary', category: 'Income', date: '2023-06-01', type: 'income' },
        { id: 2, userId: 1, amount: 65.50, description: 'Groceries', category: 'Food', date: '2023-06-02', type: 'expense' },
        { id: 3, userId: 1, amount: 120, description: 'Electric Bill', category: 'Housing', date: '2023-06-05', type: 'expense' },
        { id: 4, userId: 1, amount: 45, description: 'Dinner with friends', category: 'Food', date: '2023-06-08', type: 'expense' },
        { id: 5, userId: 1, amount: 35, description: 'Gas', category: 'Transportation', date: '2023-06-10', type: 'expense' },
        { id: 6, userId: 1, amount: 25, description: 'Movie tickets', category: 'Entertainment', date: '2023-06-12', type: 'expense' },
        { id: 7, userId: 1, amount: 80, description: 'Internet Bill', category: 'Housing', date: '2023-06-15', type: 'expense' },
        { id: 8, userId: 1, amount: 1200, description: 'Salary', category: 'Income', date: '2023-07-01', type: 'income' },
        { id: 9, userId: 1, amount: 70, description: 'Groceries', category: 'Food', date: '2023-07-03', type: 'expense' },
        { id: 10, userId: 1, amount: 150, description: 'New shoes', category: 'Shopping', date: '2023-07-05', type: 'expense' }
    ];
}

function setupEventListeners() {
    // Auth navigation
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.style.display = 'none';
        signupContainer.style.display = 'block';
    });
    
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });
    
    loginBtn.addEventListener('click', () => {
        showAuthContent();
        loginContainer.style.display = 'block';
        signupContainer.style.display = 'none';
    });
    
    signupBtn.addEventListener('click', () => {
        showAuthContent();
        signupContainer.style.display = 'block';
        loginContainer.style.display = 'none';
    });
    
    // Auth forms
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    
    // Expense modal
    addExpenseBtn.addEventListener('click', () => {
        showExpenseModal();
    });
    
    closeModal.addEventListener('click', () => {
        hideExpenseModal();
    });
    
    // Expense form
    expenseForm.addEventListener('submit', handleSaveExpense);
    
    // Tab navigation
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) throw new Error('Invalid credentials');
        const user = await res.json();
        currentUser = user;
        showDashboard();
        await fetchUserExpenses();
    } catch (err) {
        alert('Login error: ' + err.message);
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const currency = document.getElementById('signupCurrency').value;

    try {
        const res = await fetch(`${backendUrl}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, currency })
        });

        if (!res.ok) throw new Error('Signup failed');
        alert('Signup successful! You can now login.');
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    } catch (err) {
        alert('Signup error: ' + err.message);
    }
}


function showAuthContent() {
    dashboardContent.style.display = 'none';
    authContent.style.display = 'block';
}

function showDashboard() {
    authContent.style.display = 'none';
    dashboardContent.style.display = 'block';
}

function showExpenseModal(expense = null) {
    if (expense) {
        // Edit mode
        modalTitle.textContent = 'Edit Expense';
        expenseId.value = expense.id;
        document.querySelector(`input[name="type"][value="${expense.type}"]`).checked = true;
        expenseAmountInput.value = expense.amount;
        expenseDescription.value = expense.description;
        expenseCategory.value = expense.category;
        expenseDate.value = expense.date;
    } else {
        // Add mode
        modalTitle.textContent = 'Add New Expense';
        expenseId.value = '';
        document.querySelector('input[name="type"][value="expense"]').checked = true;
        expenseAmountInput.value = '';
        expenseDescription.value = '';
        expenseCategory.value = 'Food';
        expenseDate.value = new Date().toISOString().split('T')[0];
    }
    
    expenseModal.classList.add('show');
}

function hideExpenseModal() {
    expenseModal.classList.remove('show');
}

async function handleSaveExpense(e) {
    e.preventDefault();

    const type = document.querySelector('input[name="type"]:checked').value;
    const amount = parseFloat(expenseAmountInput.value);
    const description = expenseDescription.value;
    const category = expenseCategory.value;
    const date = expenseDate.value;
    const id = expenseId.value;

    try {
        if (id) {
            await fetch(`${backendUrl}/api/expenses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, description, category, date, type })
            });
        } else {
            await fetch(`${backendUrl}/api/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser._id,
                    amount,
                    description,
                    category,
                    date,
                    type
                })
            });
        }
        hideExpenseModal();
        await fetchUserExpenses();
    } catch (err) {
        alert('Error saving expense: ' + err.message);
    }
}

function updateDashboard() {
    if (!currentUser) return;
    
    // Filter expenses for current user
    const userExpenses = expenses.filter(e => e.userId === currentUser._id);

    
    // Update summary cards
    updateSummaryCards(userExpenses);
    
    // Update expense list
    updateExpenseList(userExpenses);
    
    // Update charts
    updateCharts(userExpenses);
}

function updateSummaryCards(expenses) {
    // Calculate totals for current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const currentMonthExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear;
    });
    
    const currentIncome = currentMonthExpenses
        .filter(e => e.type === 'income')
        .reduce((sum, e) => sum + e.amount, 0);
    
    const currentExpenses = currentMonthExpenses
        .filter(e => e.type === 'expense')
        .reduce((sum, e) => sum + e.amount, 0);
    
    const currentBalance = currentIncome - currentExpenses;
    
    // Calculate totals for previous month
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const prevMonthExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate.getMonth() === prevMonth && 
               expenseDate.getFullYear() === prevYear;
    });
    
    const prevIncome = prevMonthExpenses
        .filter(e => e.type === 'income')
        .reduce((sum, e) => sum + e.amount, 0);
    
    const prevExpenses = prevMonthExpenses
        .filter(e => e.type === 'expense')
        .reduce((sum, e) => sum + e.amount, 0);
    
    const prevBalance = prevIncome - prevExpenses;
    
    // Calculate percentage changes
    const incomeChangePercent = prevIncome ? ((currentIncome - prevIncome) / prevIncome * 100) : 0;
    const expenseChangePercent = prevExpenses ? ((currentExpenses - prevExpenses) / prevExpenses * 100) : 0;
    const balanceChangePercent = prevBalance ? ((currentBalance - prevBalance) / prevBalance * 100) : 0;
    
    // Update DOM
    incomeAmount.textContent = formatCurrency(currentIncome, currentUser.currency);
    expenseAmount.textContent = formatCurrency(currentExpenses, currentUser.currency);
    balanceAmount.textContent = formatCurrency(currentBalance, currentUser.currency);
    
    incomeChange.textContent = `${incomeChangePercent >= 0 ? '+' : ''}${incomeChangePercent.toFixed(1)}% from last month`;
    expenseChange.textContent = `${expenseChangePercent >= 0 ? '+' : ''}${expenseChangePercent.toFixed(1)}% from last month`;
    balanceChange.textContent = `${balanceChangePercent >= 0 ? '+' : ''}${balanceChangePercent.toFixed(1)}% from last month`;
    
    // Update change colors
    incomeChange.className = `summary-card-change ${incomeChangePercent >= 0 ? 'change-up' : 'change-down'}`;
    expenseChange.className = `summary-card-change ${expenseChangePercent >= 0 ? 'change-down' : 'change-up'}`;
    balanceChange.className = `summary-card-change ${balanceChangePercent >= 0 ? 'change-up' : 'change-down'}`;
}

async function fetchUserExpenses() {
    try {
        const res = await fetch(`${backendUrl}/api/expenses/${currentUser._id}`);
        expenses = await res.json();
        updateDashboard();
    } catch (err) {
        alert('Error loading expenses: ' + err.message);
    }
}

async function deleteExpense(id) {
    try {
        await fetch(`${backendUrl}/api/expenses/${id}`, { method: 'DELETE' });
        await fetchUserExpenses();
    } catch (err) {
        alert('Error deleting expense: ' + err.message);
    }
}

function updateExpenseList(expenses) {
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentExpenses = sortedExpenses.slice(0, 10);

    expenseList.innerHTML = recentExpenses.length
        ? ''
        : '<li class="expense-item">No expenses found</li>';

    recentExpenses.forEach(expense => {
        const li = document.createElement('li');
        li.className = 'expense-item';
        li.innerHTML = `
            <div class="expense-info">
                <div class="expense-category">${expense.category.charAt(0)}</div>
                <div class="expense-details">
                    <h4>${expense.description}</h4>
                    <p>${formatDate(expense.date)} • ${expense.category}</p>
                </div>
            </div>
            <div class="expense-amount ${expense.type}">${formatCurrency(expense.amount, currentUser.currency)}</div>
            <div class="expense-actions">
                <button class="edit-btn" data-id="${expense._id}"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" data-id="${expense._id}"><i class="fas fa-trash"></i></button>
            </div>`;
        expenseList.appendChild(li);
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const expense = expenses.find(e => e._id === id);
            if (expense) showExpenseModal(expense);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            if (confirm('Delete this expense?')) deleteExpense(id);
        });
    });
}

function updateCharts(expenses) {
    // Update category chart
    updateCategoryChart(expenses);
    
    // Update monthly chart
    updateMonthlyChart(expenses);
}

function updateCategoryChart(expenses) {
    // Filter expenses (only expenses, not income) for current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const currentMonthExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear &&
               e.type === 'expense';
    });
    
    // Group by category
    const categories = {};
    currentMonthExpenses.forEach(expense => {
        if (!categories[expense.category]) {
            categories[expense.category] = 0;
        }
        categories[expense.category] += expense.amount;
    });
    
    // Prepare data for chart
    const labels = Object.keys(categories);
    const data = Object.values(categories);
    
    // Get or create chart
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    if (categoryChart) {
        categoryChart.data.labels = labels;
        categoryChart.data.datasets[0].data = data;
        categoryChart.update();
    } else {
        categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#4361ee',
                        '#3f37c9',
                        '#4cc9f0',
                        '#f72585',
                        '#f8961e',
                        '#4895ef',
                        '#7209b7',
                        '#b5179e'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
}

function updateMonthlyChart(expenses) {
    // Get last 6 months
    const currentDate = new Date();
    const months = [];
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() - i);
        months.push({
            month: date.getMonth(),
            year: date.getFullYear(),
            label: date.toLocaleString('default', { month: 'short', year: '2-digit' })
        });
    }
    
    // Calculate income and expenses per month
    const incomeData = [];
    const expenseData = [];
    
    months.forEach(m => {
        const monthExpenses = expenses.filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate.getMonth() === m.month && 
                   expenseDate.getFullYear() === m.year;
        });
        
        const income = monthExpenses
            .filter(e => e.type === 'income')
            .reduce((sum, e) => sum + e.amount, 0);
        
        const expense = monthExpenses
            .filter(e => e.type === 'expense')
            .reduce((sum, e) => sum + e.amount, 0);
        
        incomeData.push(income);
        expenseData.push(expense);
    });
    
    // Get or create chart
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    const labels = months.map(m => m.label);
    
    if (monthlyChart) {
        monthlyChart.data.labels = labels;
        monthlyChart.data.datasets[0].data = incomeData;
        monthlyChart.data.datasets[1].data = expenseData;
        monthlyChart.update();
    } else {
        monthlyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Income',
                        data: incomeData,
                        backgroundColor: '#4cc9f0',
                        borderColor: '#4cc9f0',
                        borderWidth: 1
                    },
                    {
                        label: 'Expenses',
                        data: expenseData,
                        backgroundColor: '#f72585',
                        borderColor: '#f72585',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: false,
                    },
                    y: {
                        stacked: false,
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function switchTab(tabId) {
    // Update active tab
    categoryTabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === tabId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Update active content
    categoryTabContents.forEach(content => {
        if (content.id === `${tabId}Tab`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

function formatCurrency(amount, currency) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);