// LOGIN PROTECTION
if (
    localStorage.getItem(
        "isLoggedIn"
    ) !== "true"
) {
    window.location.href =
        "login.html";
}

// STORAGE KEY
const STORAGE_KEY =
    "expenseIQTransactions";

// DOM ELEMENTS
const categoryInput =
    document.getElementById(
        "category"
    );

const descriptionInput =
    document.getElementById(
        "description"
    );

const amountInput =
    document.getElementById(
        "amount"
    );

const addExpenseBtn =
    document.getElementById(
        "addExpenseBtn"
    );

const transactionTableBody =
    document.getElementById(
        "transactionTableBody"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

const exportBtn =
    document.getElementById(
        "exportBtn"
    );

// LOAD TRANSACTIONS
let transactions =
    JSON.parse(
        localStorage.getItem(
            STORAGE_KEY
        )
    ) || [];

// ADD EXPENSE
addExpenseBtn.addEventListener(
    "click",
    () => {

    const category =
        categoryInput.value;

    const description =
        descriptionInput
            .value
            .trim();

    const amount =
        parseFloat(
            amountInput.value
        );

    // VALIDATION
    if (!category) {
        alert(
            "Please select expense type"
        );
        return;
    }

    if (
        !amount ||
        amount <= 0
    ) {
        alert(
            "Enter valid amount"
        );
        return;
    }

    const transaction = {
        id: Date.now(),

        date:
            new Date()
            .toLocaleDateString(),

        category,

        description:
            description ||
            "No Description",

        amount
    };

    transactions.push(
        transaction
    );

    saveTransactions();

    renderTransactions();

    if (
        typeof renderChart
        === "function"
    ) {
        renderChart(
            transactions
        );
    }

    categoryInput.value = "";
    descriptionInput.value = "";
    amountInput.value = "";
});

// SAVE
function saveTransactions() {

    localStorage.setItem(
        STORAGE_KEY,

        JSON.stringify(
            transactions
        )
    );
}

// RENDER TABLE
function renderTransactions() {

    transactionTableBody
        .innerHTML = "";

    transactions
        .slice()
        .reverse()
        .forEach(
            transaction => {

        const row =
            document
            .createElement(
                "tr"
            );

        row.innerHTML = `
            <td>
                ${transaction.date}
            </td>

            <td>
                ${transaction.category}
            </td>

            <td>
                ${transaction.description}
            </td>

            <td>
                ₹${transaction.amount}
            </td>

            <td>
                <button
                    class="delete-btn"

                    onclick=
                    "deleteTransaction(${transaction.id})"
                >
                    🗑
                </button>
            </td>
        `;

        transactionTableBody
            .appendChild(row);
    });
}

// DELETE
function deleteTransaction(id) {

    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );

    saveTransactions();

    renderTransactions();

    if (
        typeof renderChart
        === "function"
    ) {
        renderChart(
            transactions
        );
    }
}

// EXPORT TO EXCEL
exportBtn.addEventListener(
    "click",
    () => {

    if (
        transactions.length === 0
    ) {
        alert(
            "No transactions to export"
        );
        return;
    }

    const excelData =
        transactions.map(
            item => ({
                Date:
                    item.date,

                Category:
                    item.category,

                Description:
                    item.description,

                Amount:
                    item.amount
            })
        );

    const worksheet =
        XLSX.utils
        .json_to_sheet(
            excelData
        );

    const workbook =
        XLSX.utils
        .book_new();

    XLSX.utils
    .book_append_sheet(
        workbook,
        worksheet,
        "Expenses"
    );

    XLSX.writeFile(
        workbook,
        "ExpenseIQ_Data.xlsx"
    );
});

// LOGOUT
logoutBtn
.addEventListener(
    "click",
    () => {

    localStorage.removeItem(
        "isLoggedIn"
    );

    window.location.href =
        "login.html";
});

// INITIAL LOAD
renderTransactions();