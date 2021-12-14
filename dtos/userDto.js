class UserDto {
    _id;
    phone;
    activated;
    name;
    username;
    avatar;
    constructor(user) {
        this._id = user._id;
        this.phone = user.phone;
        this.activated = user.activated;
        this.name = user.name;
        this.username = user.username;
        this.avatar = user.avatar
    }
}

module.exports = UserDto