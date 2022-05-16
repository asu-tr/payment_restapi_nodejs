const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const accounts = [
    {
        accountNumber: 1,
        currencyCode: 'TRY',
        ownerName: 'Asu',
        accountType: 'corporate',
        balance: 100
    }
];

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

    // returning account details that has been added
    res.send(account);
});

// Account Info Route
app.get('/account/:id', (req, res) => {
    // find account with given id
    const account = accounts.find(a => a.id === parseInt(req.params.id));
    if (!account) res.status(404).send('The account with the given ID was not found.');

    // send account info
    res.send(account)
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