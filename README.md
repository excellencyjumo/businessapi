Business API
This is a RESTful API for managing businesses. It allows you to create, read, update and delete businesses.

Getting Started
Prerequisites
Node.js
MongoDB
Installing
Clone the repository
bash
Copy code
git clone https://github.com/your-username/business-api.git
Install dependencies
bash
Copy code
cd business-api
npm install
Create a .env file and set the following variables
bash
Copy code
MONGODB_URI=mongodb://localhost:27017/business
PORT=3000
Start the application
sql
Copy code
npm start
API Endpoints
GET /businesses - Get all businesses
POST /businesses - Create a new business
GET /businesses/:id - Get a business by ID
PUT /businesses/:id - Update a business by ID
DELETE /businesses/:id - Delete a business by ID
Testing
Make sure the MongoDB server is running
Run the tests
bash
Copy code
npm test
- Built With
Node.js
Express
MongoDB

