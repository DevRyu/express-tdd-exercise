require("dotenv").config();
const express = require('express');

const PORT = 5000;
const app = express();
const productRoutes = require('./routes');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://' + process.env.MONGO_ID + ':' + process.env.MONGO_PASSWORD + '@' + process.env.MONGO_ADDRESS + '/' + process.env.MONGO_DB + 'retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDb Connected...'))
    .catch(err => console.log(err));

app.use(express.json());

app.use("/api/products", productRoutes)

app.get('/', (req, res) => {
    res.send('Health Check');
});


app.use((error, req, res, next) => {
    res.status(500).json({ message: error.message })
})
app.listen(PORT);
console.log(`Running on port ${PORT}`)
app.use(async (error, req, res, next) => {
    res.status(500).json({        message: error.message})
});

module.exports = app;
