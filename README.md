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

## How to Run?

- Download node.js from [the official website](https://nodejs.org/en/).
- Open terminal and move to this folder.
- Type `node app.js`.
- Now it's running on port 5050.
- There are some example accounts. You can delete them and leave the list empty, if you want.
- I prefer Postman but you can use anything you want to send requests or test. Here are some requests on Postman:  
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/21002803-af5b4a8d-1e51-4638-9d1e-49d9efd306b8?action=collection%2Ffork&collection-url=entityId%3D21002803-af5b4a8d-1e51-4638-9d1e-49d9efd306b8%26entityType%3Dcollection%26workspaceId%3D363d43f1-c887-427a-8646-675637d58b57)

<br/>

## How-Tos ^.^


### How to create a new account:

- HTTP Method: POST  
- Route: /account  
- Request template:  
```
  {  
    "accountNumber": "number",  
    "currencyCode": { enum: ["TRY", "USD", "EUR"] },  
    "ownerName": "string",  
    "accountType": { enum: ["individual", "corporate"] }  
  }
```

<br/>

### How to get account info:

- HTTP Method: GET
- Route: /account/{accountNumber}

<br/>

### How to make a payment:

- HTTP Method: POST
- Route: /payment
- Request template:
```
  {
    "senderAccount": "number",
    "receiverAccount": "number",
    "amount": "number",
  }
```

<br/>

### How to deposit money:

- HTTP Method: POST
- Route: /deposit
- Request template:
```
  {
    "accountNumber": "number",
    "amount": "number"
  }
```

<br/>

### How to withdraw money:

- HTTP Method: POST  
- Route: /withdraw  
- Request template:
```
  {
    "accountNumber": "number",
    "amount": "number"
  }
```

<br/>

### How to get the transaction history:

- HTTP Method: GET
- Route: accounting/{accountNumber}

<br/>
