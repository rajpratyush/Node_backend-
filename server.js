require('dotenv').config();
const cors = require('cors');
const express = require('express');
const routes = require('./routes');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5000', // Adjust this to match your frontend URL
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(function (req, res, next) {
   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
   next();
});

const PORT = process.env.PORT || 5000;

app.use('/api', routes); // Use the 'routes' variable here

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Use backticks here
});
