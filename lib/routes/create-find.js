
const defaultFinder = (find, [key, value]) => {
    const maybeInt = parseInt(value);
    find[key] = isNaN(maybeInt)
        ? new RegExp(value, 'i')
        : { $gte: maybeInt };
};

const orFinder = fields => (find, [, value]) => {
    const $inValues = {
        $in: value.split(',').map(s => s.trim())
    };

    find.$or = fields.map(field => ({ [field]: $inValues }));
};

const finders = {
    type: orFinder(['type_1', 'type_2']),
    ability: orFinder(['ability_1', 'ability_2', 'ability_hidden']),
    eggGroup: orFinder(['egg_group_1', 'egg_group_2'])
};

const addSearchTerm = (find, entry) => {
    const [key] = entry;
    const finder = finders[key] || defaultFinder;
    finder(find, entry);
    return find;
};

const createFind = (search) => Object
    .entries(search)
    .reduce(addSearchTerm, Object.create(null));

module.exports = createFind;
