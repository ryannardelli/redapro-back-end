const { toProfileDto } = require('../dtos/profile/toProfileDto');
const { toUpdateDto } = require('../dtos/profile/toUpdateDto');
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
        const profile = profileSerive.getProfileById(id);
        res.status(200).json(toProfileDto(profile));
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

async function remove(req, res, next) {
    try {
        const { id } = req.params;
        await profileSerive.deleteProfile(id);

        return res.status(200).json({ message: "Perfil excluído com sucesso!" });
    } catch(err) {
        next(err);
    }
}

module.exports = { findAll, findById, update, remove };