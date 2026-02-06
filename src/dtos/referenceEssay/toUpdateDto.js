function toUpdateDto(body) {
    return{
        title: body.title,
        content: body.content,
        year: body.year,
        pdf_url: body.pdf_url,
        category_id: body.category_id,
    };
}

module.exports = { toUpdateDto };