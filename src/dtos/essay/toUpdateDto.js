function toUpdateDto(body) {
    return{
        title: body.title,
        content: body.content,
        category_id: body.category_id,
    };
}

module.exports = { toUpdateDto };