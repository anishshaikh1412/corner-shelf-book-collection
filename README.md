# Corner Shelf

A simple book collection CRUD application built with Express, EJS and MongoDB.

## Setup

1. Create a `.env` file from `.env.example`.
2. Put your MongoDB connection string in `MONGO_URI`.
3. Run `npm i`.
4. Run `node seed-books.js` once if you want to replace the existing Product collection with the sample book records.
5. Run `node app.js`.
6. Open http://localhost:5000

The app supports adding, editing, deleting, searching and sorting books by price.
