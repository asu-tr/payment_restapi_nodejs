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
    // Send account info
});

// Payment Route
app.post('payment', (req, res) => {
    // Make payment
});

// Deposit Route
app.post('deposit', (req, res) => {
    // Deposit money
});

// Withdraw Route
app.post('withdraw', (req, res) => {
    // Withdraw money
});

// Transaction History
app.get('/accounting/:id', (req, res) => {
    // Get transaction history
});


app.listen(5050, () => console.log('Listening on port 5050...'));