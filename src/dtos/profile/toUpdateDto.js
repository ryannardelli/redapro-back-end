function toUpdateDto(body) {
    return {
        name: body.name,
        description: body.description,
    }
}

module.exports = { toUpdateDto };