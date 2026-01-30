const userService = require("../services/userService");
const { toUserDto } = require("../dtos/users/toUserDto");
const { toUpdateDto } = require("../dtos/users/toUpdateDto");
const { toRoleUpdateDto } = require("../dtos/users/toRoleUpdateDto");

async function findAll(req, res, next) {
    try {
        const users = await userService.getAllUsers();
        const usersDto = users.map(toUserDto);
        return res.status(201).json(usersDto);
    } catch(err) {
        next(err);
    }
}

async function findById(req, res, next) {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        res.status(200).json(toUserDto(user));
    } catch(err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const updateDto = {
            id: req.params.id,
            ...toUpdateDto(req.body)
        };

        await userService.updateUser(updateDto);
        res.status(201).json({ message: "Usuário atualizado com sucesso!" });
    } catch (err) {
        next(err);
    }
}

async function updateUserProfile(req, res, next) {
    try {
        const { id } = req.params;
        const { profileId } = req.body;

        await userService.updateUserProfile(id, profileId);
        return res.status(201).json({ message: "Perfil associado ao usuário com sucesso!" });
    } catch(err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;

        await userService.deleteUser(id);

        return res.status(200).json({ message: "Usuário excluído com sucesso!" });
    } catch(e) {
        next(e);
    }
}

async function updateRole(req, res, next) {
  try {
    const dto = toRoleUpdateDto(req.body);

    await userService.updateRole(dto);

    return res.status(200).json({ message: "Permissão atualizada com sucesso!" });

  } catch (err) {
    next(err);
  }
}

module.exports = { findAll, findById, update, remove, updateRole, updateUserProfile};