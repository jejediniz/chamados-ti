const Joi = require('joi')

const registerSchema = Joi.object({
  nome: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().max(160).required(),
  senha: Joi.string().min(6).max(120).required(),
  tipo: Joi.string().valid('comum', 'ti').optional(),
  admin: Joi.boolean().optional(),
  ativo: Joi.boolean().optional()
})

const loginSchema = Joi.object({
  email: Joi.string().email().max(160).required(),
  senha: Joi.string().min(6).max(120).required()
})

module.exports = {
  registerSchema,
  loginSchema
}
