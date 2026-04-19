const UserNotFoundError = require("../../exceptions/domain/auth/UserNotFoundError");
const ProfileNotFoundError = require("../../exceptions/domain/profile/ProfileNotFoundError");
const AdminUserDeleteError = require("../../exceptions/domain/users/AdminUserDeleteError");
const profileRepository = require("../../repositories/profileRepository");

const userRepository = require('../../repositories/userRepository');

const cloudinary = require("../../config/cloudinary");
const { FileNotProvided } = require("../../exceptions/common/FileNotProvided");

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

    if (user.Profile?.name === "Administrador") {
        throw new AdminUserDeleteError();
    }

    await user.destroy();
    return { message: "Usuário excluído com sucesso!" };
}

async function updateUserProfile(userId, profileId) {
    const user = await userRepository.findById(userId);
    if(!user) throw new UserNotFoundError();

    const profile = await profileRepository.findById(profileId);
    if(!profile) throw new ProfileNotFoundError();

    user.profileId = profile.id;

    switch(profile.name) {
        case 'Administrador':
            user.role = 'admin';
            break;
        case 'Corretor':
            user.role = 'corrector';
            break;
        default:
            user.role = 'student';
    }

    await userRepository.save(user);

    return user;

}

async function uploadUserProfileImage(userId, file) {
  if (!file) {
    throw new FileNotProvided();
  }

  const user = await userRepository.findById(userId);

  if (!user) throw new UserNotFoundError();

  if (user.picturePublicId) {
    await cloudinary.uploader.destroy(user.picturePublicId);
  }

  const result = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
    {
      folder: "users/profile",
      resource_type: "image",
    }
  );

  user.pictureUrl = result.secure_url;
  user.picturePublicId = result.public_id;

  await userRepository.save(user);

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, updateUserProfile, uploadUserProfileImage };