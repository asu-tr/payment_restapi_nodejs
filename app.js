const express = require('express');
const app = express();

app.use(express.json());

const accounts = []

// Account Create Route
app.post('/account', (req, res) => {
    const account = {
        accountNumber: accounts.length + 1,
        currencyCode: req.body.currencyCode,
        ownerName: req.body.ownerName,
        accountType: req.body.accountType
    };

    accounts.push(account);

    res.send(account);
});

// Account Info Route
app.get('/account/:id', (req, res) => {
    // find account with given id.

    // send account info

});

// Payment Route
app.post('payment', (req, res) => {
    // check if sender account is individual
    // AND if receiver account is corporate

    // both should be same currency

    // check sender balance

    // do the transfer

    // add transaction to history for both accounts
});

// Deposit Route
app.post('deposit', (req, res) => {
    // check if account is individual

    // deposit money

    // add transaction to history

});

// Withdraw Route
app.post('withdraw', (req, res) => {
    // check if account is individual

    // witdraw money

    // add transaction to history

});

// Transaction History
app.get('/accounting/:id', (req, res) => {
    // find account with given id

    // get transaction history for the account with given id
});


app.listen(5050, () => console.log('Listening on port 5050...'));