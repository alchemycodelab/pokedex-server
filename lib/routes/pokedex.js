const router = require('express').Router();
const Pokemon = require('../models/pokemon');
const { getParam, respond } = require('./route-helpers');
const createFind = require('./create-find');
const createSort = require('./create-sort');

module.exports = router

    .param('id', getParam)

    .get('/:id', respond(
        ({ id }) => Pokemon.findById(id).lean()
    ))

    .get('/', respond(
        ({ query }) => {
            const { 
                page = 1, 
                perPage = 20, 
                sort: sortField, 
                direction = 'asc', 
                ...search 
            } = query;

            let find = createFind(search);
            let sort = createSort(sortField, direction);
                    
            return Promise.all([
                Pokemon.find(find).countDocuments(),
                Pokemon.find(find)
                    .skip(+perPage * (+page - 1))
                    .limit(+perPage)
                    .lean()
                    .sort(sort)
            ])
                .then(([count, results]) => ({ 
                    count,
                    page,
                    perPage,
                    sort: {
                        by: sort || '_id',
                        direction
                    },
                    search,
                    results 
                }));
        }
    ));
