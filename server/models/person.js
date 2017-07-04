var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var personSchema = new Schema({
  name: String,
  lastName: String
});


module.exports = mongoose.model('persons', personSchema);
