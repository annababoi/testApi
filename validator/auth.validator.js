const Joi = require("joi");

const regexp = require("../config/regexp.enum");

module.exports = {
    authValidator: Joi.object({
        mongoId: Joi.string().regex(regexp.MONGO_ID),
        // id: Joi.string().regex(regexp.ID).lowercase().trim(),
        password: Joi.string().regex(regexp.PASSWORD).required(),
    }),
}