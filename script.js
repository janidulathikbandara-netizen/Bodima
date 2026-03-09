// Initial Boarders Data
let boarders = JSON.parse(localStorage.getItem('bodima_boarders')) || [
    { id: 1, name: "Alice Smith", rent: 500 },
    { id: 2, name: "Bob Jones", rent: 450 },
    { id: 3, name: "Charlie Brown", rent: 600 }
];

let expenses = JSON.parse(localStorage.getItem('bodima_expenses')) || [];

// DOM Elements
const boarderSelect = document.getElementById('boarder-select');
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
    boarderSelect.innerHTML = '<option value="">Select a boarder</option>';
    boarders.forEach(boarder => {
        const option = document.createElement('option');
        option.value = boarder.id;
        option.textContent = boarder.name;
        boarderSelect.appendChild(option);
    });
}

// Render Rent Info Table
function renderRentTable() {
    rentTableBody.innerHTML = '';
    boarders.forEach(boarder => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${boarder.name}</td>
            <td class="amount">$${boarder.rent.toFixed(2)}</td>
        `;
        rentTableBody.appendChild(row);
    });
}

// Render Expense History Table
function renderExpenseTable() {
    expenseTableBody.innerHTML = '';
    expenses.forEach((expense, index) => {
        const boarder = boarders.find(b => b.id == expense.boarderId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${boarder ? boarder.name : 'Unknown'}</td>
            <td>${expense.description}</td>
            <td class="amount">$${expense.amount.toFixed(2)}</td>
            <td><button class="delete-btn" onclick="deleteExpense(${index})">Delete</button></td>
        `;
        expenseTableBody.appendChild(row);
    });
}

// Render Final Summary Table
function renderSummaryTable() {
    summaryTableBody.innerHTML = '';
    let grandTotal = 0;

    boarders.forEach(boarder => {
        const boarderExpenses = expenses
            .filter(e => e.boarderId == boarder.id)
            .reduce((sum, e) => sum + e.amount, 0);
        
        const total = boarder.rent + boarderExpenses;
        grandTotal += total;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${boarder.name}</td>
            <td class="amount">$${boarder.rent.toFixed(2)}</td>
            <td class="amount">$${boarderExpenses.toFixed(2)}</td>
            <td class="amount">$${total.toFixed(2)}</td>
        `;
        summaryTableBody.appendChild(row);
    });

    // Add Grand Total Row
    const totalRow = document.createElement('tr');
    totalRow.className = 'total-row';
    totalRow.innerHTML = `
        <td colspan="3">Overall Monthly Collection</td>
        <td class="amount">$${grandTotal.toFixed(2)}</td>
    `;
    summaryTableBody.appendChild(totalRow);
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

// Delete Expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    saveData();
    renderExpenseTable();
    renderSummaryTable();
}

// Save to LocalStorage
function saveData() {
    localStorage.setItem('bodima_expenses', JSON.stringify(expenses));
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
