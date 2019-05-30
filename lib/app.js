const express = require('express');
const app = express();
const morgan = require('morgan');
var cors = require('cors')


// middleware
app.use(cors());
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.json());

const Pokemon = require('./models/pokemon');

app.get('/api/pokedex', (req, res) => {
    const { page = 1, perPage = 20, ...search } = req.query;

    const find = Object.entries(search)
        .reduce((find, [key, value]) => {
            const maybeInt = parseInt(value);
            find[key] = isNaN(maybeInt) 
                ? new RegExp(value, 'ig')
                : { $gte: maybeInt };
            return find;
        }, {});
            
    Promise.all([
        Pokemon.find(find).countDocuments(),
        Pokemon.find(find)
            .skip(+perPage * (+page - 1))
            .limit(+perPage)
            .lean()
    ])
        .then(([count, results]) => {
            res.json({ 
                count,
                page,
                perPage,
                results 
            });
        });
});

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
