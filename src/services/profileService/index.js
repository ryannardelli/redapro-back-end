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

async function updateProfile(id, data) {
    const profile = await getProfileById(id);

    if(profile.name === 'ADMIN') throw new ProfileAdminProtectedUpdateError();

    const existing = await profileRepository.findByName(data.name);
    if(existing) throw new ProfileAlreadyExistsError(data.name);

     if(data.length > 50) throw new ProfileNameValidationError();
    if(data.description && data.description.length > 255) throw new ProfileDescriptionValidationError();

    return profileRepository.update(id, data);
}

async function deleteProfile(id) {
    const profile = await getProfileById(id);

     if(!profile) throw new ProfileNotFoundError();
     if(profile.name === 'ADMIN') throw new ProfileAdminProtectedDeleteError();

      // Verificar se existem usuários vinculados
    // const users = await profileRepository.getUsersByProfile(id);
    // if (users.length > 0) throw new ProfileInUseError('Não é possível deletar perfil que possui usuários vinculados.');

     await profile.destroy();
      return { message: "Perfil excluído com sucesso!" };

    //  return profileRepository.delete(id);
}

module.exports = { getAllProfile, getProfileById, createProfile, updateProfile, deleteProfile };