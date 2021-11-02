const topSide = document.querySelector('.top-side')
const bottomSide = document.querySelector('.bottom-side')
const homeButton = document.querySelector('.home-anchor')

const expenseButton = document.querySelector('.expense-anchor')
const expenseContainer = document.querySelector('.transactions-expense--container')
const expenseTableContainer = document.querySelector('.table-container--expenses')

const incomesButton = document.querySelector('.income-anchor')
const incomesContainer = document.querySelector('.transactions-income--container')
const incomesTableContainer = document.querySelector('.table-container--incomes')

incomesContainer.classList.add('hide')
expenseContainer.classList.add('hide')
savingsPage.classList.add('hide')

homeButton.addEventListener('click', () => {
  incomesContainer.classList.add('hide')
  expenseContainer.classList.add('hide')
  savingsPage.classList.add('hide')

  topSide.classList.remove('hide')
  bottomSide.classList.remove('hide')
  // topSide.style.display = 'grid'
  // bottomSide.style.display = 'grid'
})

expenseButton.addEventListener('click', () => {
  incomesContainer.classList.add('hide')
  topSide.classList.add('hide')
  bottomSide.classList.add('hide')
  savingsPage.classList.add('hide')

  expenseContainer.classList.remove('hide')
  expenseContainer.classList.add('d-flex')

  const getExpenses = transactions.filter(transaction => transaction.value < 0)

  expenseTableContainer.innerHTML = ''

  getExpenses.forEach(incomesTransaction => {
    expenseTableContainer.innerHTML += Utils.getTransactionHTMLTemplate(incomesTransaction)
  })
})

incomesButton.addEventListener('click', () => {
  expenseContainer.classList.add('hide')
  topSide.classList.add('hide')
  bottomSide.classList.add('hide')
  savingsPage.classList.add('hide')

  // incomesContainer.style.display = 'flex'
  incomesContainer.classList.remove('hide')
  incomesContainer.classList.add('d-flex')

  const getIncomes = transactions.filter(transaction => transaction.value > 0)

  incomesTableContainer.innerHTML = ''

  getIncomes.forEach(incomesTransaction => {
    incomesTableContainer.innerHTML += Utils.getTransactionHTMLTemplate(incomesTransaction)
  })
})

