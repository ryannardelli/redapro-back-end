// this archive contains all associations of tables

const User = require("./User");
const Profile = require("./Profile");

Profile.hasMany(User, {
    foreignKey: "profileId",
    as: "users"
});

User.belongsTo(Profile, {
    foreignKey: "profileId",
    as: "profile"
});

module.exports = { User, Profile };
