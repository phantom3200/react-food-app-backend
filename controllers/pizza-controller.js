const config = require("config");
const pizzaService = require("../services/pizza-service");
const fs = require("fs");
const PizzaModel = require("../models/pizza-model");
class PizzaController {
  uploadPizza = async (req, res, next) => {
    try {
      const { name } = req.body;
      const file = req.files.file;
      const fileName = `pizza_${file.name}`;
      const path = `${config.get("staticPath")}/${fileName}`;

      if (fs.existsSync(path)) {
        return res.status(400).json({
          message: "File with current name already exist on current directory",
        });
      }

      file.mv(path);

      await pizzaService.createPizza(name, fileName);
      const data = await pizzaService.getAllPizzas()
      return res.json({data, message: 'Pizza was successfully uploaded'});
    } catch (e) {
      return res.status(500).json({ message: "Upload error" });
    }
  };

  removePizza = async (req, res, next) => {
    try {
      const { id } = req.body;
      const pizza = await PizzaModel.findById(id)
      const fileName = pizza.fileName
      const path = `${config.get("staticPath")}/${fileName}`;
      await pizzaService.deletePizza(id);
      const data = await pizzaService.getAllPizzas()
      fs.unlinkSync(path)
      return res
        .status(200)
        .json({ message: "Pizza was successfully removed", data });
    } catch (e) {
      return res.status(500).json({ message: "Remove error" });
    }
  };

  updatePizza = async (req, res, next) => {
    try {
      const { name, id } = req.body;
      const file = req.files.file;
      let fileName;
      if (file) {
        fileName = `pizza_${file.name}`;
        const path = `${config.get("staticPath")}/${fileName}`;

        if (fs.existsSync(path)) {
          return res.status(400).json({
            message:
              "File with current name already exist on current directory",
          });
        }

        file.mv(path);
      }

      const pizzaData = await pizzaService.editPizza(id, name, fileName);
      return res.json(pizzaData);
    } catch (e) {
      return res.status(500).json({ message: "Edit error" });
    }
  };

  getPizzas = async (req, res, next) => {
    try {
      const pizzas = await pizzaService.getAllPizzas();
      console.log(pizzas)
      return res.json(pizzas);
    } catch (e) {
      return res.status(500).json({ message: "Server error" });
    }
  };
}

module.exports = new PizzaController();
