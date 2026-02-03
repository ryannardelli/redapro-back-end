function toEssayDto(essay) {
    return {
        id: essay.id,
        title: essay.title,
        content: essay.content,
        note: essay.note,
        status: essay.status,
        userId: essay.user_id,
        category: essay.category_id,
    }
}

module.exports = { toEssayDto };