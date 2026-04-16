const ReferenceEssay = require("../models/ReferenceEssay");
const { Op } = require("sequelize");

module.exports = {
    findAll: async (filters = {}) => {
        const { year, categoryId, search } = filters;
        const where = {};

        if(year) where.year = year;
        if(categoryId) where.categoryId = categoryId;
        if(search) {
            where.title = { [Op.iLike]: `%${search}%` };
        }

        return await ReferenceEssay.findAll({
      where,
      order: [["year", "DESC"], ["title", "ASC"]],
      include: ["category"] 
    });
    },

    findById: async(id) => {
        return await ReferenceEssay.findByPk(id);
    },

    create: async (data) => {
        return ReferenceEssay.create(data);
    },

    update: async(id, data) => {
        const essay = await ReferenceEssay.findByPk(id);
        if(!essay) return null;
        return await essay.update(data);
    },

    delete: async (id) => {
        const essay = await ReferenceEssay.findByPk(id);
        if(!essay) return null;
        return essay.destroy();
    }
}