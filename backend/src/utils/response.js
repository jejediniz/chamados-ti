function sendSuccess(res, data, message = 'OK', meta = null) {
  const payload = {
    success: true,
    message,
    data
  }

  if (meta) {
    payload.meta = meta
  }

  return res.status(200).json(payload)
}

function sendCreated(res, data, message = 'Criado com sucesso') {
  return res.status(201).json({
    success: true,
    message,
    data
  })
}

function sendNoContent(res) {
  return res.status(204).send()
}

module.exports = {
  sendSuccess,
  sendCreated,
  sendNoContent
}
