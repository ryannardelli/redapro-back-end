function toReferenceEssayDto(essay) {
    return {
        id: essay.id,
        title: essay.title,
        content: essay.content,
        year: essay.year,
        pdf_url: essay.pdf_url,
        categoryId: essay.categoryId ?? null,
        createdAt: essay.createdAt ?? null,
        updatedAt: essay.updatedAt ?? null
    }
}

module.exports = { toReferenceEssayDto };