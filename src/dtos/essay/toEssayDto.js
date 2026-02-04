function toEssayDto(essay) {
    return {
        id: essay.id,
        title: essay.title,
        content: essay.content,
        note: essay.note ?? null,
        status: essay.status ?? null,
        userId: essay.userId ?? null,
        categoryId: essay.categoryId ?? null,
        createdAt: essay.createdAt ?? null,
        updatedAt: essay.updatedAt ?? null
    }
}

module.exports = { toEssayDto };