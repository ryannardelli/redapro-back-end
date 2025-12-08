const UserNotFoundError = require("../../exceptions/domain/auth/UserNotFoundError");
const User = require("../../models/User");

async function getAllUsers() {
    const users = await User.findAll({ raw: true });
    return users;
}

async function getUserById(id) {
    const user = await User.findByPk(id);
    if(!user) throw new UserNotFoundError();
    
    return user;
}

async function updateUser(updateDto) {
    const { id, ...updatedData } = updateDto;
    const user = await User.findByPk(id);

    if(!user) throw new UserNotFoundError();

    await user.update(updatedData);
    return user.get({ plain: true });
}

async function deleteUser(id) {
    const user = await User.findByPk(id);

    if(!user) throw new UserNotFoundError();

    await user.destroy();
    return { message: "Usuário excluído com sucesso!" };
}

// async function updateRole(updateRoleDto) {
//     const { id, ...updateDataRole } = updateRoleDto;
//     const user = await User.findByPk(id);

//     if(!user) throw UserNotFoundError();

//     const validateRoles = ["student", "corrector", "admin"];
    
//     if(!validateRoles.includes(updateRoleDto.role)) {
//         throw new InvalidRoleUserError();
//     }

//     user.role = updateDataRole.role;
//     await user.save();

//     return { message: "Permissão atualizada com sucesso!" };
// }

async function updateRole(updateRoleDto) {
    const { id, role } = updateRoleDto;

    const user = await User.findByPk(id);

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