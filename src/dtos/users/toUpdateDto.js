function toUpdateDto(body) {
    return {
        name: body.name,
    }
}

module.exports = { toUpdateDto }