const UserNotFoundError = require("../../exceptions/domain/auth/UserNotFoundError");
const InvalidRoleUserError = require("../../exceptions/domain/users/InvalidRoleUserError");

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

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, updateRole };