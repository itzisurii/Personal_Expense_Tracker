const expenseForm = document.getElementById('expense-form');
const expenseTable = document.querySelector('#expense-table tbody');
const totalSpan = document.getElementById('total');
const categorySelect = document.getElementById('category');
const otherCategoryInput = document.getElementById('other-category');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Show "Other" category input when selected
categorySelect.addEventListener('change', () => {
    if (categorySelect.value === "Other") {
        otherCategoryInput.classList.remove("hidden");
        otherCategoryInput.required = true;
    } else {
        otherCategoryInput.classList.add("hidden");
        otherCategoryInput.required = false;
        otherCategoryInput.value = "";
    }
});

// Render expenses in the table
function renderExpenses() {
    expenseTable.innerHTML = '';
    let total = 0;
    expenses.forEach((exp, index) => {
        total += exp.amount;
        const row = `
      <tr>
        <td>${exp.date}</td>
        <td>${exp.category}</td>
        <td>${exp.description}</td>
        <td>${exp.amount.toFixed(2)}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteExpense(${index})">Delete</button>
        </td>
      </tr>
    `;
        expenseTable.innerHTML += row;
    });
    totalSpan.textContent = total.toFixed(2);
}

// Delete expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
}
window.deleteExpense = deleteExpense; // expose globally for inline onclick

// Add expense
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let category = categorySelect.value;
    if (category === "Other" && otherCategoryInput.value.trim() !== "") {
        category = otherCategoryInput.value.trim();
    }

    const expense = {
        date: document.getElementById('date').value,
        category: category,
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value)
    };

    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
    expenseForm.reset();
    otherCategoryInput.classList.add("hidden");
    otherCategoryInput.required = false;
});

// Initial render
renderExpenses();

// Initialize flatpickr calendar
flatpickr("#date", {
    dateFormat: "Y-m-d",
    defaultDate: "today"
});
