const connectToMongo = require('./db');
const express = require('express');
const app = express()
const port = 5000

connectToMongo();

app.use(express.json()) // it is middleware used to get json data using POST 

//Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));



app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
// connectToMongo();

// console.log("Hello World");