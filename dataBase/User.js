const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    id: {type: String, required:true, unique:true},
    password: {type: String, required:true},
    id_type: {type: String}
}, {
    timestamps:true
});

module.exports = model('User', userSchema);