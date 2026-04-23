function toEssayDto(essay) {
    const hasFeedback = essay.generalFeedback !== null || essay.c1 !== null;

    return {
        id: essay.id,
        title: essay.title,
        content: essay.content,
        note: essay.note ?? null,
        status: essay.status ?? null,
        createdAt: essay.createdAt ?? null,
        updatedAt: essay.updatedAt ?? null,
        attachmentUrl: essay.attachmentUrl ?? null,
        attachmentOriginalName: essay.attachmentOriginalName ?? null,

        category: essay.category ? {
            id: essay.category.id,
            name: essay.category.name,
            description: essay.category.description
        } : null,

        feedback: hasFeedback ? {
            c1: essay.c1,
            c2: essay.c2,
            c3: essay.c3,
            c4: essay.c4,
            c5: essay.c5,
            general: essay.generalFeedback
        } : null,

        user: essay.user ? {
            id: essay.user.id,
            name: essay.user.name,
            email: essay.user.email
        } : null,
        
        reviewerId: essay.reviewerId ?? null,
    }
}

module.exports = { toEssayDto };