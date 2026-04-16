// this archive contains all associations of tables
const User = require("./User");
const Profile = require("./Profile");
const Menu = require("./Menu");
const ProfileMenu = require("./ProfileMenu");

Profile.hasMany(User, {
    foreignKey: "profileId",
    as: "users"
});

User.belongsTo(Profile, {
    foreignKey: "profileId",
    as: "profile"
});

Profile.belongsToMany(Menu, {
    through: ProfileMenu,
    foreignKey: "profileId",
    otherKey: "menuId",
    as: "menu"
});

Menu.belongsToMany(Profile, {
    through: ProfileMenu,
    foreignKey: "menuId",
    otherKey: "profileId",
    as: "profile"
})

module.exports = { User, Menu, Profile, ProfileMenu };
