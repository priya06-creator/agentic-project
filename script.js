// Expense Tracker JavaScript
// Handles transactions, balance updates, and LocalStorage

const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// Get transactions from LocalStorage or initialize empty
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Add Transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please enter description and amount');
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value
  };

  transactions.push(transaction);
  updateLocalStorage();
  addTransactionDOM(transaction);
  updateValues();

  text.value = '';
  amount.value = '';
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 1000000);
}

// Add transaction to DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  item.classList.add(transaction.amount < 0 ? 'expense' : 'income');
  item.innerHTML = `
    ${transaction.text} <span>${sign}$${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">×</button>
  `;

  list.appendChild(item);
}

// Update balance, income, and expense
function updateValues() {
  const amounts = transactions.map(t => t.amount);

  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const incomeTotal = amounts.filter(item => item > 0)
    .reduce((acc, item) => acc + item, 0).toFixed(2);
  const expenseTotal = (
    amounts.filter(item => item < 0)
    .reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  income.innerText = `$${incomeTotal}`;
  expense.innerText = `$${expenseTotal}`;
}

// Remove transaction
function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

// Update LocalStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

// Event Listener
form.addEventListener('submit', addTransaction);
