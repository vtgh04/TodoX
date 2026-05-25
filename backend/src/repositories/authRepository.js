import User from "../model/user.js";

class AuthRepository {
    async findUserByEmail(email) {
        return await User.findOne({ email });
    }

    async findUserByUsername(username) {
        return await User.findOne({ username });
    }

    async findUserByIdentifier(identifier) {
        return await User.findOne({
            $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
        });
    }

    async findUserByResetToken(hashedToken) {
        return await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
    }

    async createUser(userData) {
        return await User.create(userData);
    }

    async saveUser(user) {
        return await user.save();
    }
}

export default new AuthRepository();
