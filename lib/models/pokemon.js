const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    pokemon: String,
    id: Number,
    species_id: Number,
    height: Number,
    weight: Number,
    base_experience: Number,
    type_1: String,
    type_2: String,
    attack: Number,
    defense: Number,
    hp: Number,
    special_attack: Number,
    special_defense: Number,
    speed: Number,
    ability_1: String,
    ability_2: String,
    ability_hidden: String,
    color_1: String,
    color_2: String,
    color_f: String,
    egg_group_1: String,
    egg_group_2: String,
    url_image: String,
    generation_id: Number,
    evolves_from_species_id: String,
    evolution_chain_id: Number,
    shape_id: Number,
    shape: String,
    pokebase: String,
    pokedex: String
});

const toTitleCase = name => name[0].toUpperCase() + name.slice(1);

function addDistinctGet(name, fields, plural = `${name}s`) {
    schema.static(`get${toTitleCase(plural)}`, function() {
        const distinctTypes = getDistinct(name, fields);
        return this.aggregate(distinctTypes);
    });
}

addDistinctGet('type', ['$type_1', '$type_2']);
addDistinctGet('eggGroup', ['$egg_group_1', '$egg_group_2']);
addDistinctGet('shape', '$shape');
addDistinctGet('ability', ['$ability_1', '$ability_2', '$ability_hidden'], 'abilities');

module.exports = mongoose.model('Pokemon', schema);

function getDistinct(name, fields) {
    return [
        {
            $project: {
                [name]: fields
            }
        },
        {
            $unwind: '$' + name
        },
        {
            $match: {
                [name]: { $ne: 'NA' }
            }
        },
        {
            $group: {
                _id: '$' + name,
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                [name]: '$_id',
                count: 1
            }
        },
        {
            $sort: { [name]: 1 }
        }
    ];
}
