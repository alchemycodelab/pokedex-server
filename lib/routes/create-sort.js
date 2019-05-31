
const isDescending = direction => direction && direction.toLowerCase().startsWith('des');

const createSort = (sortField, direction) => {
    if(!sortField) return {};
    return { 
        [sortField]: isDescending(direction) ? -1 : 1 
    };
};

module.exports = createSort;