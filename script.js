// Initial Boarders Data
let boarders = JSON.parse(localStorage.getItem('bodima_boarders')) || [
    { id: 1, name: "Janidu", rent: 15000 },
    { id: 2, name: "Manitha", rent: 15000 },
    { id: 3, name: "Minuga", rent: 15000 },
    { id: 4, name: "Oshada", rent: 15000 },
    { id: 5, name: "Venuja", rent: 15000 }
];

let expenses = JSON.parse(localStorage.getItem('bodima_expenses')) || [];

// DOM Elements
const boarderSelect = document.getElementById('boarder-select');
const filterBoarder = document.getElementById('filter-boarder');
const filterDesc = document.getElementById('filter-desc');
const expenseForm = document.getElementById('expense-form');
const expenseTableBody = document.getElementById('expense-table-body');
const summaryTableBody = document.getElementById('summary-table-body');
const rentTableBody = document.getElementById('rent-table-body');

// Initialize
function init() {
    populateBoarderSelect();
    renderRentTable();
    renderExpenseTable();
    renderSummaryTable();
}

// Populate Boarder Selection Dropdown
function populateBoarderSelect() {
    const options = boarders.map(boarder => `<option value="${boarder.id}">${boarder.name}</option>`).join('');
    boarderSelect.innerHTML = '<option value="">Select a boarder</option>' + options;
    filterBoarder.innerHTML = '<option value="">All Boarders</option>' + options;
}

// Render Rent Info Table
function renderRentTable() {
    rentTableBody.innerHTML = '';
    boarders.forEach(boarder => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${boarder.name}</td>
            <td class="amount">LKR ${boarder.rent.toFixed(2)}</td>
        `;
        rentTableBody.appendChild(row);
    });
}

// Render Expense History Table
function renderExpenseTable() {
    expenseTableBody.innerHTML = '';
    
    const selectedBoarderId = filterBoarder.value;
    const searchDesc = filterDesc.value.toLowerCase();

    const filteredExpenses = expenses.filter(expense => {
        const boarderMatch = !selectedBoarderId || expense.boarderId == selectedBoarderId;
        const descMatch = !searchDesc || expense.description.toLowerCase().includes(searchDesc);
        return boarderMatch && descMatch;
    });

    filteredExpenses.forEach((expense) => {
        const boarder = boarders.find(b => b.id == expense.boarderId);
        const row = document.createElement('tr');
        const formattedDate = new Date(expense.date).toLocaleDateString();
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${boarder ? boarder.name : 'Unknown'}</td>
            <td>${expense.description}</td>
            <td class="amount">LKR ${expense.amount.toFixed(2)}</td>
        `;
        expenseTableBody.appendChild(row);
    });
}

// Render Final Summary Table
function renderSummaryTable() {
    summaryTableBody.innerHTML = '';

    boarders.forEach(boarder => {
        const boarderExpenses = expenses
            .filter(e => e.boarderId == boarder.id)
            .reduce((sum, e) => sum + e.amount, 0);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${boarder.name}</td>
            <td class="amount">LKR ${boarderExpenses.toFixed(2)}</td>
        `;
        summaryTableBody.appendChild(row);
    });
}

// Handle Form Submission
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const boarderId = boarderSelect.value;
    const description = document.getElementById('expense-desc').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);

    if (!boarderId || !description || isNaN(amount)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    const newExpense = {
        boarderId: parseInt(boarderId),
        description,
        amount,
        date: new Date().toISOString()
    };

    expenses.push(newExpense);
    saveData();
    renderExpenseTable();
    renderSummaryTable();
    expenseForm.reset();
});

// Event Listeners for Filters
filterBoarder.addEventListener('change', () => {
    const val = filterBoarder.value;
    const analyzeLink = document.querySelector('.nav-link');
    if (analyzeLink) {
        analyzeLink.href = val ? `analysis.html?boarder=${val}` : 'analysis.html';
    }
    renderExpenseTable();
});
filterDesc.addEventListener('input', renderExpenseTable);

// Save to LocalStorage
function saveData() {
    localStorage.setItem('bodima_expenses', JSON.stringify(expenses));
    localStorage.setItem('bodima_boarders', JSON.stringify(boarders));
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    init();
    saveData(); // Ensure defaults are in localStorage
});
