const Joi = require('joi');
const express = require('express');
const { json } = require('express/lib/response');
const app = express();

app.use(express.json());

const accounts = [
    {
        accountNumber: 1,
        currencyCode: 'TRY',
        ownerName: 'Asu Inc.',
        accountType: 'corporate',
        balance: 1000
    },
    {
        accountNumber: 2,
        currencyCode: 'TRY',
        ownerName: 'Asu',
        accountType: 'individual',
        balance: 150
    },
    {
        accountNumber: 3,
        currencyCode: 'EUR',
        ownerName: 'Asu EUR',
        accountType: 'individual',
        balance: 200
    },
    {
        accountNumber: 4,
        currencyCode: 'EUR',
        ownerName: 'Asu Inc. EUR',
        accountType: 'corporate',
        balance: 500
    }
];

const transactions = [];


// 1- Account Create Route
app.post('/account', (req, res) => {

    // Method to check if an accountNumber is used by another account.
    const uniqueIdMethod = (value, helpers) => {

        const account = accounts.find(a => a.accountNumber === value);

        if (!account) {
            return value;
        }
        
        throw new Error('This Account ID is being used by another account.');
    };

    // account details data type etc. validation schema
    const schema = Joi.object({
        accountNumber: Joi.number().required().integer().custom(uniqueIdMethod),
        currencyCode: Joi.string().required().valid('TRY', 'USD', 'EUR'),
        ownerName: Joi.string().required(),
        accountType: Joi.string().required().valid('individual', 'corporate')
    });

    // checks if given info is valid
    const result = schema.validate(req.body);

    // if there's an error validating types, shows it
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    // if the code can come this far, this means given data is valid
    // and we can add this new account to the account list
    const account = {
        accountNumber: parseInt(req.body.accountNumber),
        currencyCode: req.body.currencyCode,
        ownerName: req.body.ownerName,
        accountType: req.body.accountType,
        balance: 0
    };

    accounts.push(account);
    res.status(201).send('The account has been created.');
});


// 2- Account Info Route
app.get('/account/:accountNumber', (req, res) => {
    // find account with given id
    const account = accounts.find(a => a.accountNumber === parseInt(req.params.accountNumber));

    // respond with 404 not found if there's no matching account.
    if (!account) res.status(404).send('The account with the given Account Number was not found.');

    // send account info
    res.send(account)
});


// 3- Payment Route
app.post('/payment', (req, res) => {
    // check if sender account is individual
    // AND if receiver account is corporate
    // AND if amount is valid.
    const schema = Joi.object({
        senderAccount: Joi.number().required().integer().custom(isIndividual),
        receiverAccount: Joi.number().required().integer().custom(isCorporate),
        amount: Joi.number().precision(2).required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    // both should be same currency
    const senderAccount = accounts.find(a => a.accountNumber === parseInt(req.body.senderAccount));
    const receiverAccount = accounts.find(a => a.accountNumber === parseInt(req.body.receiverAccount));

    if (senderAccount.currencyCode != receiverAccount.currencyCode) {
        res.status(400).send('Sender\'s currency and receiver\'s currency does not match.');
    }

    // check sender balance
    if (senderAccount.balance < parseFloat(req.body.amount)) {
        res.status(400).send('Sender\'s balance is not enough for this transfer.');
    }

    // do the transfer
    senderAccount.balance -= parseFloat(req.body.amount);
    receiverAccount.balance += parseFloat(req.body.amount);

    // add transaction to history for both accounts
    let tranDate = new Date(Date.now()).toUTCString();
    addTransaction(senderAccount.accountNumber, parseFloat(req.body.amount), "payment", tranDate);
    addTransaction(receiverAccount.accountNumber, parseFloat(req.body.amount), "payment", tranDate);

    res.status(200).send('The payment has been completed succesfully.');
});


// 4- Deposit Route
app.post('/deposit', (req, res) => {

    // check if account is individual
    const schema = Joi.object({
        accountNumber: Joi.number().required().integer().custom(isIndividual),
        amount: Joi.number().precision(2).required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    // deposit money
    const acc = accounts.find(a => a.accountNumber === parseInt(req.body.accountNumber));
    acc.balance += parseFloat(req.body.amount);

    // add transaction to history
    let tranDate = new Date(Date.now()).toUTCString();
    addTransaction(acc.accountNumber, parseFloat(req.body.amount), "deposit", tranDate);

    res.status(200).send(`The deposit has been done succesfully. New balance is: ${acc.balance}`);
});


// 5- Withdraw Route
app.post('/withdraw', (req, res) => {

    // check if account is individual
    const schema = Joi.object({
        accountNumber: Joi.number().required().integer().custom(isIndividual),
        amount: Joi.number().precision(2).required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    // witdraw money
    const acc = accounts.find(a => a.accountNumber === parseInt(req.body.accountNumber));
    acc.balance -= parseFloat(req.body.amount);

    // add transaction to history
    let tranDate = new Date(Date.now()).toUTCString();
    addTransaction(acc.accountNumber, parseFloat(req.body.amount), "withdraw", tranDate);

    res.status(200).send(`The deposit has been done succesfully. New balance is: ${acc.balance}`);
});


// 6- Transaction History
app.get('/accounting/:accountNumber', (req, res) => {

    let trans = [];

    // find transactions with the given account number
    for (let i = 0; i < transactions.length; i++) {
        if (parseInt(transactions[i].accountNumber) === parseInt(req.params.accountNumber)) {
            trans.push(transactions[i]);
        }
    }

    res.send(trans);
});


// Method to check if the account is individual
const isIndividual = (value, helpers) => {

    const account = accounts.find(a => a.accountNumber === value);

    if (!account) {
        throw new Error('No account found.');
    }

    if (account.accountType != 'individual'){
        throw new Error('This account is not an individual account.');
    }
    
    return value;
};


// Method to check if the account is individual
const isCorporate = (value, helpers) => {

    const account = accounts.find(a => a.accountNumber === value);

    if (!account) {
        throw new Error('No account found.');
    }

    if (account.accountType != 'corporate'){
        throw new Error('This account is not a corporate account.');
    }
    
    return value;
};


function addTransaction (accNo, moneyAmount, type, creationTime){
    const transaction = {
        accountNumber: accNo,
        amount: moneyAmount,
        transactionType: type,
        createdAt: creationTime
    };

    transactions.push(transaction);
}


app.listen(5050, () => console.log('Listening on port 5050...'));