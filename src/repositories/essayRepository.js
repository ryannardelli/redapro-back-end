const Essay = require("../models/Essay");
const User = require("../models/User");
const { Op, fn, col } = require("sequelize");

module.exports = {
    findAll: (filters = {}) => {
    const where = {};

    if (filters.status) {
        where.status = filters.status;
    }

    if (filters.userId) {
        where.userId = filters.userId;
    }
    
    return Essay.findAll({
        where,
        order: [["id", "ASC"]],
        include: [
            "category",
            {
                model: User,
                as: "user",
                attributes: ["id", "name", "email"]
            }
        ]
    });
},

    findById: (id) =>
    Essay.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"]
        },
        "category"
      ]
    }),

    findByTitle(title, userId, categoryId) {
        const where = { title };

        if (userId) where.userId = userId;
        if (categoryId) where.categoryId = categoryId;

        return Essay.findOne({ where });
    },

    findByWithUsers: (id) => {
    return User.findByPk(id, {
        include: [{
            model: Essay,
            as: "essay",
            include: ["category"]
        }]
    });
},

    countByUser(userId) {
    return Essay.count({
      where: { userId }
    });
  },

  averageScoreByUser(userId) {
    return Essay.findOne({
      attributes: [
        [fn("AVG", col("note")), "avgScore"]
      ],
      where: {
        userId,
        status: "CORRIGIDA"
      },
      raw: true
    });
  },

  lastEssayByUser(userId) {
    return Essay.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]],
      attributes: ["createdAt"]
    });
  },

  findRecentByUser(userId, limit = 5) {
    return Essay.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit,
      include: ["category"]
    });
  },

   countByReviewer(reviewerId) {
    return Essay.count({
      where: { reviewerId }
    });
  },

    countByReviewerAndStatus(reviewerId, status) {
    return Essay.count({
      where: {
        reviewerId,
        status
      }
    });
  },

  averageScoreByReviewer(reviewerId) {
    return Essay.findOne({
      attributes: [[fn("AVG", col("note")), "avgScore"]],
      where: {
        reviewerId,
        status: "CORRIGIDA"
      },
      raw: true
    });
  },

  lastEssayByReviewer(reviewerId) {
    return Essay.findOne({
      where: { reviewerId },
      order: [["updatedAt", "DESC"]],
      attributes: ["updatedAt"]
    });
  },

  findRecentByReviewer(reviewerId, limit = 5) {
    return Essay.findAll({
      where: { reviewerId },
      order: [["updatedAt", "DESC"]],
      limit,
      include: ["category", "user"]
    });
  },

    create: (data) => Essay.create(data),
    update: (essay, data) => essay.update(data),
    delete: (essay) => essay.destroy(),
    save: (essay) => essay.save(),
    count: (filters = {}) => {
    const where = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.reviewerId !== undefined) where.reviewerId = filters.reviewerId;
    if (filters.status) where.status = filters.status;
    if (filters.updatedAt) where.updatedAt = { [Op.gte]: filters.updatedAt };

    return Essay.count({ where });
  }
}