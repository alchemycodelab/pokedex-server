const express = require('express');
const app = express();
const morgan = require('morgan');
var cors = require('cors');


// middleware
app.use(cors());
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.json());

const Pokemon = require('./models/pokemon');

app.get('/api/pokedex', (req, res) => {
    const { 
        page = 1, 
        perPage = 20, 
        sort, 
        direction = 'asc', 
        ...search 
    } = req.query;

    const find = Object.entries(search)
        .reduce((find, [key, value]) => {
            if(key === 'type') {
                find.$or = [
                    { type_1: value },
                    { type_2: value }
                ];  
            }
            else {
                const maybeInt = parseInt(value);
                find[key] = isNaN(maybeInt) 
                    ? new RegExp(value, 'ig')
                    : { $gte: maybeInt };
            }

            return find;
        }, {});

    let command = Pokemon.find(find)
        .skip(+perPage * (+page - 1))
        .limit(+perPage)
        .lean();
        
    if(sort) {
        const sortDir = direction.toLowerCase().startsWith('desc') ? -1 : 1;
        command = command.sort({ [sort]: sortDir });
    }
            
    Promise.all([
        Pokemon.find(find).countDocuments(),
        command
    ])
        .then(([count, results]) => {
            res.json({ 
                count,
                page,
                perPage,
                sort,
                search,
                results 
            });
        });
});

app.get('/api/pokedex/:id', (req, res) => {
    const { id } = req.params;

    Pokemon.findById(id)
        .lean()
        .then(pokemon => res.json(pokemon));

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
