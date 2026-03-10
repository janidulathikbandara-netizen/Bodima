// Data retrieval with defaults to match script.js
const boarders = JSON.parse(localStorage.getItem('bodima_boarders')) || [
    { id: 1, name: "Janidu", rent: 15000 },
    { id: 2, name: "Manitha", rent: 15000 },
    { id: 3, name: "Minuga", rent: 15000 },
    { id: 4, name: "Oshada", rent: 15000 },
    { id: 5, name: "Venuja", rent: 15000 }
];
const expenses = JSON.parse(localStorage.getItem('bodima_expenses')) || [];

// DOM Elements
const boarderFilter = document.getElementById('boarder-filter');

// Chart Instances
let monthlyChart;
let dailyChart;

function init() {
    populateFilter();
    
    // Check for boarder ID in URL (passed from main page)
    const urlParams = new URLSearchParams(window.location.search);
    const boarderId = urlParams.get('boarder');
    
    const initialSelection = boarderId || 'all';
    boarderFilter.value = initialSelection;
    updateCharts(initialSelection);
    
    boarderFilter.addEventListener('change', (e) => {
        updateCharts(e.target.value);
    });
}

function populateFilter() {
    // Clear existing (except "All")
    boarderFilter.innerHTML = '<option value="all">All Boarders</option>';
    boarders.forEach(boarder => {
        const option = document.createElement('option');
        option.value = boarder.id;
        option.textContent = boarder.name;
        boarderFilter.appendChild(option);
    });
}

function updateCharts(boarderId) {
    const filteredExpenses = boarderId === 'all' 
        ? expenses 
        : expenses.filter(e => e.boarderId == boarderId);

    const selectedBoarder = boarderId === 'all' 
        ? null 
        : boarders.find(b => b.id == boarderId);

    // Update Heading
    const title = document.querySelector('header h1');
    title.textContent = selectedBoarder 
        ? `📊 Analysis: ${selectedBoarder.name}` 
        : '📊 Expense Analysis';

    renderMonthlyChart(filteredExpenses);
    renderDailyChart(filteredExpenses);
}

function renderMonthlyChart(data) {
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    
    const monthlyData = {};
    data.forEach(e => {
        const month = new Date(e.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        monthlyData[month] = (monthlyData[month] || 0) + e.amount;
    });

    const labels = Object.keys(monthlyData);
    const values = Object.values(monthlyData);

    if (monthlyChart) monthlyChart.destroy();

    monthlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Monthly Expense Flow (LKR)',
                data: values,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBorderWidth: 2,
                pointBackgroundColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (ctx) => `Spent: LKR ${ctx.raw.toLocaleString()}`
                    }
                }
            }
        }
    });
}

function renderDailyChart(data) {
    const ctx = document.getElementById('dailyChart').getContext('2d');
    
    const now = new Date();
    const currentMonthData = data.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const dailyData = {};
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    for(let i=1; i<=daysInMonth; i++) dailyData[i] = 0;

    currentMonthData.forEach(e => {
        const day = new Date(e.date).getDate();
        dailyData[day] += e.amount;
    });

    const labels = Object.keys(dailyData);
    const values = Object.values(dailyData);

    if (dailyChart) dailyChart.destroy();

    dailyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Daily Breakdown (LKR)',
                data: values,
                backgroundColor: '#2ecc71',
                hoverBackgroundColor: '#27ae60',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { 
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => 'LKR ' + value
                    }
                }
            }
        }
    });
}

function handleBackToDashboard(event) {
    event.preventDefault();
    if (window.opener && !window.opener.closed) {
        window.close();
    } else {
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', init);
