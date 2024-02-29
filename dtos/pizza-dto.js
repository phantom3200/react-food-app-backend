module.exports = class PizzaDto {
    name;
    fileName;

    constructor(model) {
        this.name = model.name
        this.id = model._id
        this.fileName = model.fileName
    }

}
