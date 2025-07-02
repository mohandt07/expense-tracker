// Select elements
const form = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');

// Load from localStorage on page load
document.addEventListener('DOMContentLoaded', loadExpenses);

// Form Submit Handler
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const amount = document.getElementById('expenseamount').value.trim();
  const movie = document.getElementById('movie').value.trim();
  const category = document.getElementById('category').value;

  if (!amount || !movie) {
    alert('Please fill in all fields');
    return;
  }

  const expense = {
    id: Date.now(),
    amount,
    movie,
    category,
  };

  addExpenseToDOM(expense);
  saveExpenseToStorage(expense);
  form.reset();
});

// Add to DOM
function addExpenseToDOM(expense) {
  const li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-center';
  li.setAttribute('data-id', expense.id);
  li.innerHTML = `
    ${expense.amount} - ${expense.category} - ${expense.movie}
    <div>
      <button class="btn btn-sm btn-warning me-2 edit">Edit</button>
      <button class="btn btn-sm btn-danger delete">Delete</button>
    </div>
  `;

  expenseList.appendChild(li);
}

// Save to localStorage
function saveExpenseToStorage(expense) {
  let expenses = getExpensesFromStorage();
  expenses.push(expense);
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Get expenses
function getExpensesFromStorage() {
  return localStorage.getItem('expenses') ? JSON.parse(localStorage.getItem('expenses')) : [];
}

// Load on DOM load
function loadExpenses() {
  const expenses = getExpensesFromStorage();
  expenses.forEach(addExpenseToDOM);
}

// Delete or Edit handler
expenseList.addEventListener('click', function (e) {
  const li = e.target.closest('li');
  const id = Number(li.getAttribute('data-id'));

  if (e.target.classList.contains('delete')) {
    deleteExpense(id, li);
  }

  if (e.target.classList.contains('edit')) {
    editExpense(id, li);
  }
});

// Delete Expense
function deleteExpense(id, li) {
  li.remove();
  let expenses = getExpensesFromStorage();
  expenses = expenses.filter(exp => exp.id !== id);
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Edit Expense
function editExpense(id, li) {
  const expenses = getExpensesFromStorage();
  const exp = expenses.find(exp => exp.id === id);

  document.getElementById('expenseamount').value = exp.amount;
  document.getElementById('movie').value = exp.movie;
  document.getElementById('category').value = exp.category;

  deleteExpense(id, li);
}
