const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')
console.log({ inputTransactionName, inputTransactionAmount });

const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))//resulta no valor da propriedade transactions do objeto da localStorage 
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = Id => {
    transactions = transactions.filter(transaction =>
        transaction.id !== Id)
    updateLocalStorage()
    init()
}

const addTransactionIntoDOM = ({ amount, name, id }) => {

    const operator = amount < 0 ? '-' : '+'//condição para pegar o operador do valor
    const CSSclas = amount < 0 ? 'minus' : 'plus'//condição para adicionar o nome da classe na li
    const amountWithoutOperator = Math.abs(amount)//obter o amount sem o sinal
    const li = document.createElement('li')//cria o elemento li

    li.classList.add(CSSclas)//adiciona a classe no elemento li
    li.innerHTML = `
        ${name}
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
    ` //setar a marcação interna da li
    transactionsUl.append(li)//adiciona a li
}

const getExpenses = transactionsAmount =>
    Math.abs(transactionsAmount
        .filter(value => value < 0)
        .reduce((acumulator, value) => acumulator + value, 0))
        .toFixed(2)

const getIncome = transactionsAmount => transactionsAmount
    .filter(value => value > 0)
    .reduce((acumulator, value) => acumulator + value, 0)
    .toFixed(2)

const getTotal = transactionsAmount => transactionsAmount
    .reduce((acumulator, transaction) => acumulator + transaction, 0)
    .toFixed(2)

const updateBalanceValues = () => {
    const transactionsAmount = transactions.map(({ amount }) => amount)
    const total = getTotal(transactionsAmount)
    const income = getIncome(transactionsAmount)
    const expense = getExpenses(transactionsAmount)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`

}

const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
} //executar o preenchimento das informações do estado da aplicação quando a página for carregada, ou seja, vai carregar as informações no DOM

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))//salva ma informação no localStorage
}

const generatorId = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generatorId(),
        name: transactionName,
        amount: Number(transactionAmount)
    })
}

const cleanInputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

const handleFormSubmit = event => {
    //impedindo que o form seja enviado e a página seja recarregada
    event.preventDefault()
    //criando duas const com os valores inseridos no input
    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    //verificando se algum dos inputs forma preenchidos e exibindo uma mensagem na tela
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''
    if (isSomeInputEmpty) {
        alert('Por favor, preencha tanto o nome quanto o valor da transação')
        return
    }
    //criando a transação e adicionando em um array de transações
    addToTransactionsArray(transactionName, transactionAmount)
    //invoca a init para atualizar as transações na tela
    init()
    //atualiza o localStorage
    updateLocalStorage()
    //limpa os inputs
    cleanInputs()

}

form.addEventListener('submit', handleFormSubmit)