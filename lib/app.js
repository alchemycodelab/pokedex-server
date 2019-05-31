const express = require('express');
const app = express();
const morgan = require('morgan');
var cors = require('cors');


// middleware
app.use(cors());
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.json());

const pokedex = require('./routes/pokedex');
app.use('/api/pokedex', pokedex);

const { handler, api404 } = require('./util/errors');

// api 404
app.use('/api', api404);
// general 404
app.use((req, res) => {
    res.sendStatus(404);
});

// error handler (goes last!)
// eslint-disable-next-line
app.use(handler);

module.exports = app;
