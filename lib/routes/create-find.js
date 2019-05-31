
const addSearchTerm = (find, [key, value]) => {
    if(key === 'type') {
        find.$or = [
            { type_1: value },
            { type_2: value }
        ];
    }
    else {
        const maybeInt = parseInt(value);
        find[key] = isNaN(maybeInt)
            ? new RegExp(value, 'i')
            : { $gte: maybeInt };
    }
    return find;
};

const createFind = (search) => Object
    .entries(search)
    .reduce(addSearchTerm, Object.create(null));

module.exports = createFind;
