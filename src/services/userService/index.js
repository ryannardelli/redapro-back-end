const UserNotFoundError = require("../../exceptions/domain/auth/UserNotFoundError");
const ProfileNotFoundError = require("../../exceptions/domain/profile/ProfileNotFoundError");
const InvalidRoleUserError = require("../../exceptions/domain/users/InvalidRoleUserError");
const profileRepository = require("../../repositories/profileRepository");

const userRepository = require('../../repositories/userRepository');

async function getAllUsers() {
    return userRepository.findAll();
}

async function getUserById(id) {
    const user = await userRepository.findById(id);
    if(!user) throw new UserNotFoundError();
    
    return user;
}

async function updateUser(updateDto) {
    const { id, ...updatedData } = updateDto;
    const user = await userRepository.findById(id);

    if(!user) throw new UserNotFoundError();

    await user.update(updatedData);
    return user.get({ plain: true });
}

async function deleteUser(id) {
    const user = await userRepository.findById(id);

    if(!user) throw new UserNotFoundError();

    await user.destroy();
    return { message: "Usuário excluído com sucesso!" };
}

async function updateRole(dto) {
    const { idUser, role } = dto;

    const user = await userRepository.findById(idUser);

    if (!user) {
        throw new UserNotFoundError();
    }

    const validRoles = ["student", "corrector", "admin"];

    if (!validRoles.includes(role)) {
        throw new InvalidRoleUserError();
    }

    user.role = role;
    await user.save();

    return { message: "Permissão atualizada com sucesso!" };
}

async function updateUserProfile(userId, profileId) {
    const user = await userRepository.findById(userId);
    if(!user) throw new UserNotFoundError();

    const profile = await profileRepository.findById(profileId);
    if(!profile) throw new ProfileNotFoundError();

    user.profileId = profile.id;
    await userRepository.save(user);

    return user;

}

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, updateRole, updateUserProfile };