let transactions = [
  { category: "Comida", name: "Hamburguer", value: 1500, id: 0 },
  { category: "Fitness", name: "Academia", value: 400, id: 1 },
  { category: "Transporte", name: "Uber", value: -400, id: 2 },
  { category: "Trabalho", name: "Salário", value: 3000, id: 3 },
  { category: "Comida", name: "Pizza", value: -1000, id: 4 },
];

const menu = document.querySelector(".menu");
const sidebar = document.querySelector(".sidebar");
const totalMoney = document.querySelector(".total");
const expenseMoney = document.querySelector(".expense");
const incomeMoney = document.querySelector(".income");
const openModalButton = document.querySelector(".modal-open");
const closeTransactionModalButton = document.querySelector(".transaction-close");
const closeSavingModalButton = document.querySelector(".saving-close");
const formModal = document.querySelector(".modal");
const tableContainer = document.querySelector(".table-container");
const modalOverlayTransaction = document.querySelector(".modal-overlay--transaction");

let chartElementContext = document.getElementById("myChart").getContext("2d");

const Utils = {
  formatCurrency(value) {
    const options = { style: "currency", currency: "BRL" };
    return value.toLocaleString("pt-BR", options);
  },

  formatSavingsCurrency (value) {
    return Math.abs(value) > 999 
      ? `R$ ${Math.sign(value) * ((Math.abs(value) / 1000).toFixed(1))}K`
      : `R$ ${Math.sign(value) * Math.abs(value)}`
  },

  getProgressBarWidth (currentMoney, value) {
    const percentage = (currentMoney / value) * 100
    return (percentage * 19.5) / 100
  },

  getTransactionHTMLTemplate(transaction) {
    return `
    <div data-transaction="${transaction.id}" class="table-row">
      <div class="table-icon">${Utils.getCategoryIcon(transaction.category)}</div>
      <div class="table-category">${transaction.category}</div>
      <div class="table-name">${transaction.name}</div>
      <div class="table-price">${Utils.formatCurrency(transaction.value)}</div>
      <button data-trash="${transaction.id}" class="table-delete">Apagar</button>
    </div>
    `;
  },

  getCategoryIcon (category) {
    switch (category) {
      case 'Comida':
        return '<img src="./imgs/fastfood.svg" alt=""></img>'
        break;
      case 'Trabalho':
        return '<img src="./imgs/work.svg" alt=""></img>'
        break;
      case 'Fitness':
        return '<img src="./imgs/fitness.svg" alt=""></img>'
        break;
      case 'Transporte':
        return '<img src="./imgs/transport.svg" alt=""></img>'
        break;
      default:
        break;
    }
  },

  getSavingHTMLTemplate (saving) {
    return `
    <div data-saving="${saving.id}" class="saving">
      <div class="saving-name">${saving.name}</div>
      <div class="saving-progression--container">
          <div class="saving-progression--bar"">
              <div class="saving-progression--bar__done" style="width: ${Utils.getProgressBarWidth(saving.currentMoney, saving.value)}rem"></div>
          </div>

          <div class="saving-progression-money">
              <span class="currentMoney">${Utils.formatSavingsCurrency(saving.currentMoney)}</span>
              <span class="totalValue">/${Utils.formatSavingsCurrency(saving.value)}</span>
          </div>
      </div>
      <button data-edit="${saving.id}" class="saving-edit">Editar</button>
    </div>
  `
  },

  getRandomSavingItem () {
    return savings[Math.floor(Math.random() * savings.length)]
  }
};

formModal.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = event.target.name.value;
  const value = Number(event.target.value.value);
  const category = event.target.category.value;
  const id = transactions.length + 1;

  if (name && value && category) {
    const transaction = { category, name, value, id };

    tableContainer.innerHTML += Utils.getTransactionHTMLTemplate(transaction);
    transactions.push(transaction);

    updateUI.updateChart();
    updateUI.updateBalance();

    event.target.reset();
    modalOverlayTransaction.classList.remove("active");
  }
});

tableContainer.addEventListener("click", (event) => {
  const clickedElement = event.target;

  if (clickedElement.dataset.trash) {
    const datasetOfClickedElement = clickedElement.dataset.trash;
    const findTransaction = transactions.find(
      (transaction) => transaction.id === Number(datasetOfClickedElement)
    );

    transactions.splice(transactions.indexOf(findTransaction), 1);

    tableContainer.innerHTML = "";

    transactions.forEach(transaction => {
      tableContainer.innerHTML += Utils.getTransactionHTMLTemplate(transaction);
    });

    updateUI.updateChart()
    updateUI.updateBalance()
  }
});

const updateUI = {
  updateBalance() {
    const sumOfIncomes = transactions
      .filter((transaction) => transaction.value > 0)
      .reduce((acc, transaction) => acc + transaction.value, 0);

    const sumOfExpenses = transactions
      .filter((transaction) => transaction.value < 0)
      .reduce((acc, transaction) => acc + transaction.value, 0);

    let total = sumOfIncomes + sumOfExpenses;

    incomeMoney.textContent = Utils.formatCurrency(sumOfIncomes);
    expenseMoney.textContent = Utils.formatCurrency(sumOfExpenses);
    totalMoney.textContent = Utils.formatCurrency(total);
  },

  updateChart() {
    const jobCategoryValue = transactions
      .filter((transaction) => transaction.category === "Trabalho")
      .reduce((acc, transaction) => acc + transaction.value, 0);

    const fitnessCategoryValue = transactions
      .filter((transaction) => transaction.category === "Fitness")
      .reduce((acc, transaction) => acc + transaction.value, 0);

    const transportCategoryValue = transactions
      .filter((transaction) => transaction.category === "Transporte")
      .reduce((acc, transaction) => acc + transaction.value, 0);

    const foodCategoryValue = transactions
      .filter((transaction) => transaction.category === "Comida")
      .reduce((acc, transaction) => acc + transaction.value, 0);

    const labels = ["Trabalho", "Fitness", "Transporte", "Comida"];

    const values = [
      jobCategoryValue,
      fitnessCategoryValue,
      transportCategoryValue,
      foodCategoryValue,
    ];

    addData(myChart, labels, values);
  },
};

// Chart
var myChart = new Chart(chartElementContext, {
  type: "doughnut",
  data: {
    datasets: [
      {
        label: "My First Dataset",
        data: [0, 0, 0, 0],
        backgroundColor: ["#2F2F2F", "#3C3C3C", "#222222", "#606060"],
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        display: false,
      },
    },
  },
});

const addData = (chart, label, data) => {
  chart.data.labels = label;
  chart.data.datasets.forEach((dataset) => {
    dataset.data = data;
  });
  chart.update();
};


// Modal
closeTransactionModalButton.addEventListener("click", () => {
  modalOverlayTransaction.classList.remove("active");
});

closeSavingModalButton.addEventListener("click", () => {
  modalOverlaySaving.classList.remove("active");
});

openModalButton.addEventListener("click", () => {
  modalOverlayTransaction.classList.add("active");
});

document.querySelector('.addsaving-close').addEventListener('click', () => {
  modalOverlayAddSaving.classList.remove('active')
})

menu.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});



// Start
transactions.forEach(transaction => {
  tableContainer.innerHTML += Utils.getTransactionHTMLTemplate(transaction);
  updateUI.updateChart()
});
updateUI.updateBalance();

