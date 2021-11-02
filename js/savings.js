const savingsButton = document.querySelector('.saving-anchor')
const savingsPage = document.querySelector('.savings-page')
const savingsContainer = document.querySelector('.savings-container')
const modalOverlaySaving = document.querySelector('.modal-overlay--saving')
const modalSaving = document.querySelector('.modal-saving')

const modalOverlayAddSaving = document.querySelector('.modal-overlay--addsaving')
const modalAddSaving = document.querySelector('.modal-addsaving')

const savings = [
  { id: 0, name: 'Playstation 5', value: 15000, currentMoney: 10000 },
  { id: 1, name: 'Ignite', value: 1000, currentMoney: 900 }
]

savingsButton.addEventListener('click', () => {
  incomesContainer.classList.add('hide')
  expenseContainer.classList.add('hide')
  topSide.classList.add('hide')
  bottomSide.classList.add('hide')

  savingsPage.classList.remove('hide')
  savingsPage.classList.add('d-flex')

  savingsContainer.innerHTML = ''

  savings.forEach(saving => {
    savingsContainer.innerHTML += Utils.getSavingHTMLTemplate(saving)
  })
})

savingsContainer.addEventListener('click', event => {
  const clickedElement = event.target

  if (clickedElement.dataset.edit) {
    const clickedSaving = savings.find(saving => saving.id === Number(clickedElement.dataset.edit))

    modalOverlaySaving.classList.add('active')

    const modal = document.querySelector('.modal-saving')

    modal.setAttribute('data-saving', clickedSaving.id)

    modal.querySelector('.input-saving--name').value = clickedSaving.name
    modal.querySelector('.input-saving--currentMoney').value = clickedSaving.currentMoney
    modal.querySelector('.input-saving--value').value = clickedSaving.value
  }
})

modalSaving.addEventListener('submit', event => {
  event.preventDefault()

  const datasetOfModalSaving = event.target.dataset.saving
  const modalSavingIndex = savings.findIndex(saving => saving.id === Number(datasetOfModalSaving))

  const name = event.target.name.value
  const currentMoney = Number(event.target.currentMoney.value)
  const value = Number(event.target.value.value)

  if (name && currentMoney && value) {
    const progressBar = Utils.getProgressBarWidth(currentMoney, value)
  
    savings[modalSavingIndex].name = name
    savings[modalSavingIndex].currentMoney = currentMoney
    savings[modalSavingIndex].value = value
  
    const savingElement = document.querySelector(`[data-saving="${datasetOfModalSaving}"]`)
  
    if (currentMoney === value) {
      savings.splice(savings[datasetOfModalSaving], 1)
      savingElement.remove()
      console.log(savings)
    }
  
    savingElement.querySelector('.saving-name').textContent = name
    savingElement.querySelector('.currentMoney').textContent = Utils.formatSavingsCurrency(currentMoney)
    savingElement.querySelector('.totalValue').innerHTML = '/' + Utils.formatSavingsCurrency(value)
    
    savingElement.querySelector('.saving-progression--bar__done').style.width = `${progressBar}rem`
  
    modalOverlaySaving.classList.remove('active')   
  }
})

const generateRandomSaving = () => {
    const randomSaving = Utils.getRandomSavingItem()
    const homeSaving = document.querySelector('.saving.home')
    const progressBar = Utils.getProgressBarWidth(randomSaving.currentMoney, randomSaving.value)
    
    homeSaving.querySelector('.saving-name').innerHTML = randomSaving.name
    homeSaving.querySelector('.currentMoney').innerHTML = Utils.formatSavingsCurrency(randomSaving.currentMoney)
    homeSaving.querySelector('.totalValue').innerHTML = Utils.formatSavingsCurrency(randomSaving.value)
    
    homeSaving.querySelector('.saving-progression--bar__done').style.width = `${progressBar}rem`
}

generateRandomSaving()

document.querySelector('.savings-button').addEventListener('click', () => {
  modalOverlayAddSaving.classList.add('active')
})

modalAddSaving.addEventListener('submit', event => {
  event.preventDefault()

  const name = event.target.name.value
  const currentMoney = Number(event.target.currentMoney.value)
  const value = Number(event.target.value.value)

  if (name && currentMoney && value) {
    const savingObj = { id: savings.length + 1, name, currentMoney, value }

    savings.push(savingObj)
  
    savingsContainer.innerHTML += Utils.getSavingHTMLTemplate(savingObj)
    modalOverlayAddSaving.classList.remove('active')
  }
})

