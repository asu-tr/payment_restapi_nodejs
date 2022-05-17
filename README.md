# Payment REST API Project

In this project, users can create an account (individual or corporate), deposit/withdraw money, make a payment and see transaction history.

JSON is used for data exchange.

NPM: joi, express

<br/>

### Limitations
- Account numbers should be a positive integer and unique.
- Supported currencies are: TRY, USD, EUR.
- Account types are: individual, corporate.
- Balances cannot be negative.
- Only individual accounts can deposit or withdraw.
- Payments can only be wired from an individual account to a corporate account.

<br/>

## Wanna Check Routes Using Postman?

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/644725196f7003fdd000?action=collection%2Fimport)
