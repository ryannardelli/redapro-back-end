const ProfileAdminProtectedDeleteError = require('../../exceptions/domain/profile/ProfileAdminProtectedDeleteError');
const ProfileAdminProtectedUpdateError = require('../../exceptions/domain/profile/ProfileAdminProtectedUpdateError');
const ProfileAlreadyExistsError = require('../../exceptions/domain/profile/ProfileAlreadyExistsError');
const ProfileDescriptionValidationError = require('../../exceptions/domain/profile/ProfileDescriptionValidationError');
const ProfileNameValidationError = require('../../exceptions/domain/profile/ProfileNameValidationError');
const ProfileNotFoundError = require('../../exceptions/domain/profile/ProfileNotFoundError');
const profileRepository = require('../../repositories/profileRepository');

async function getAllProfile() {
    return profileRepository.findAll();
}

async function getProfileById(id) {
    const profile = await profileRepository.findById(id);
    if(!profile) throw new ProfileNotFoundError();
    return profile;
}

async function createProfile(data) {
    const existing = await profileRepository.findByName(data.name);
    if(existing) throw new ProfileAlreadyExistsError(data.name);

    if(data.length > 50) throw new ProfileNameValidationError();
    if(data.description && data.description.length > 255) throw new ProfileDescriptionValidationError();

    return profileRepository.create(data);
}

async function updateProfile(updateDto) {
    const { id, ...updateData } = updateDto;
    const profile = await profileRepository.findById(id);


    if(!profile) throw new ProfileNotFoundError();
    if(profile.name === 'ADMIN') throw new ProfileAdminProtectedUpdateError();

    const existing = await profileRepository.findByName(updateData.name);
    if(existing) throw new ProfileAlreadyExistsError(updateData.name);

    if(updateData.length > 50) throw new ProfileNameValidationError();
    if(updateData.description && updateData.description.length > 255) throw new ProfileDescriptionValidationError();

    await profile.update(updateData);
    return profile.get({ plain: true });
}

async function deleteProfile(id) {
    const profile = await getProfileById(id);

     if(!profile) throw new ProfileNotFoundError();
     if(profile.name === 'ADMIN') throw new ProfileAdminProtectedDeleteError();


     await profile.destroy();
     return { message: "Perfil excluído com sucesso!" };
}

module.exports = { getAllProfile, getProfileById, createProfile, updateProfile, deleteProfile };