const { toProfileDto } = require('../dtos/profile/toProfileDto');
const { toUpdateDto } = require('../dtos/profile/toUpdateDto');
const { toMenuDto } = require('../dtos/menu/toMenuDto');

const profileSerive = require('../services/profileService');

async function findAll(req, res, next) {
    try {
         const profile = await profileSerive.getAllProfile();
         const profileDto = profile.map(toProfileDto);
         return res.status(200).json(profileDto);
    } catch(err) {
        next(err);
    } 
}

async function findById(req, res, next) {
    try {
        const { id } = req.params;
        const profile = await profileSerive.getProfileById(id);
        res.status(200).json(toProfileDto(profile));
    } catch(err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        await profileSerive.createProfile(req.body);
        res.status(201).json({ message: "Perfil criado com sucesso!" });
    } catch(err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const updateDto = {
            id: req.params.id,
            ...toUpdateDto(req.body)
        }

        await profileSerive.updateProfile(updateDto);
        res.status(200).json({ message: "Perfil atualizado com sucesso!" });
    } catch(err) {
        next(err);
    }
}

async function associateMenuToProfile(req, res, next) {
    try {
        const { id: profileId } = req.params;
        const { menuId } = req.body;

        await profileSerive.associateMenuToProfile(profileId, menuId);
        return res.status(201).json({ message: "Perfil associado ao menu com sucesso!" });
    } catch(err) {
        next(err);
    }
}

async function findMenusByProfile(req, res, next) {
    try {
        const { id } = req.params;
        const menus = await profileSerive.getMenusByProfile(id);

        return res.status(200).json(menus.map(toMenuDto));
    } catch(err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        await profileSerive.deleteProfile(id);

        return res.status(200).json({ message: "Perfil excluído com sucesso!" });
    } catch(err) {
        next(err);
    }
}

module.exports = { findAll, findById, update, remove, create, associateMenuToProfile, findMenusByProfile };