
# Business API


- This is a RESTful API for managing businesses. 
- It allows you to create, read, update and delete businesses.

# Features

- Accepts a Business Profile JSON data
- Validate the input data, accepting emails that ends with .com only
- Generate a unique 7 character id for the business
- Generate a qrcode using the unique id that you just generated
- Save the qrcode image to a folder named qrcodes
- Save the record to your database
- Send a message back to the user as a json response containing
- // response = { "link": "http://bus.me/[id]" } where the unique-id is [id] on the link


## Installation

Installing
- Clone the repository
```bash
git clone
https://github.com/your-username/business-api.git
cd my-project
```
Install dependencies
```bash
cd business-api
npm install
```
Create a .env file and set the following variables
```bash
MONGODB_URI=mongodb://localhost:27017/business
PORT=3000
```
Start the application
```bash
Start the application
```

    
## Documentation

[Documentation](https://linktodocumentation)

# API Endpoints
- GET /business/all - Get all businesses
- POST /business/create - Create a new business
- GET /business/:id - Get a business by ID
- PUT /business/:id - Update a business by ID
- DELETE /business/:id - Delete a business by ID


## Built With
* Node.js
* Express
* MongoDB


## Tech Stack

**Database:** Mongodb

**Server:** Node, Express

**APITESTER:** PostMan
 
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB URI`

`API-KEY`

`PORT`
