const PizzaModel = require("../models/pizza-model");
const PizzaDto = require('../dtos/pizza-dto')

class PizzaService {
    async createPizza(name, fileName) {
        const pizza = await PizzaModel.create({name, fileName})
        const data = new PizzaDto(pizza)
        return data
    }

    async deletePizza(id) {
        const data = await PizzaModel.deleteOne({_id: id})
        return data
    }

    async editPizza(id, name, fileName) {
        const data = await PizzaModel.findByIdAndUpdate(id, {name, fileName})
        const pizzaDto = new PizzaDto(data)
        return {
            data: pizzaDto
        }
    }

    async getAllPizzas() {
        const pizzas = PizzaModel.find()
        return pizzas
    }
}

module.exports = new PizzaService()
