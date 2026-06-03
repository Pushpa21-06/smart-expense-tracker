let expenseChart = null;

function renderChart(transactions) {

    const ctx =
        document
            .getElementById("expenseChart")
            .getContext("2d");

    // destroy old chart
    if (expenseChart) {
        expenseChart.destroy();
    }

    // CATEGORY COLORS
    const categoryColors = {
        Food: "#4F86F7",
        Travel: "#FF9F1C",
        Groceries: "#7AC74F",
        Shopping: "#FFCA3A",
        Bills: "#8E44AD",
        Financial: "#D7263D",
        Entertainment: "#00B8A9",
        Health: "#F3722C",
        "Daily Use": "#43AA8B",
        Education: "#577590",
        Other: "#9E9E9E"
    };

    // GROUP BY DATE + CATEGORY
    const groupedData = {};

    transactions.forEach(transaction => {

        const date = transaction.date;
        const category =
            transaction.category;

        const amount =
            transaction.amount;

        if (!groupedData[date]) {
            groupedData[date] = {};
        }

        if (!groupedData[date][category]) {
            groupedData[date][category] = 0;
        }

        groupedData[date][category] += amount;
    });

    const labels =
        Object.keys(groupedData);

    const categories =
        Object.keys(categoryColors);

    const datasets = categories.map(category => {

        return {
            label: category,

            data: labels.map(date =>
                groupedData[date][category] || 0
            ),

            backgroundColor:
                categoryColors[category],

            borderRadius: 8
        };
    });

    expenseChart =
        new Chart(ctx, {

        type: "bar",

        data: {
            labels,
            datasets
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom"
                }
            },

            scales: {
                x: {
                    stacked: true
                },

                y: {
                    stacked: true,
                    beginAtZero: true
                }
            }
        }
    });
}

// INITIAL LOAD
const savedTransactions =
    JSON.parse(
        localStorage.getItem(
            "expenseIQTransactions"
        )
    ) || [];

renderChart(savedTransactions);