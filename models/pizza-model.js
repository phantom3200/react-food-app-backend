const {Schema, model} = require('mongoose')

const PizzaSchema = new Schema({
    name: {type: String, unique: true, required: true},
    fileName: {type: String, required: true},
})

module.exports = model('Pizza', PizzaSchema)
