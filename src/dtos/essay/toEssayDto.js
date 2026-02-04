function toEssayDto(essay) {
    return {
        id: essay.id,
        title: essay.title,
        content: essay.content,
        note: essay.note ?? null,
        status: essay.status ?? null,
        userId: essay.userId ?? null,
        c1: essay.c1 ?? null,
        c2: essay.c2 ?? null,
        c3: essay.c3 ?? null,
        c4: essay.c4 ?? null,
        c5: essay.c5 ?? null,
        generalFeedback: essay.generalFeedback ?? null,
        categoryId: essay.categoryId ?? null,
        reviewerId: essay.reviewerId ?? null,
        createdAt: essay.createdAt ?? null,
        updatedAt: essay.updatedAt ?? null
    }
}

module.exports = { toEssayDto };