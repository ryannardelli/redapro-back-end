function toReferenceEssayDto(essay) {
    return {
        id: essay.id,
        title: essay.title,
        authorName: essay.authorName,
        content: essay.content,
        year: essay.year,
        pdf_url: essay.pdf_url,

        category: essay.category ? {
            id: essay.category.id,
            name: essay.category.name,
            description: essay.category.description
        } : null,
        
        createdAt: essay.createdAt ?? null,
        updatedAt: essay.updatedAt ?? null
    }
}

module.exports = { toReferenceEssayDto };