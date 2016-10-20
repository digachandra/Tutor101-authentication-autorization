var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var fruitSchema = mongoose.Schema({
    name: String
});

module.exports= mongoose.model('fruits', fruitSchema)
