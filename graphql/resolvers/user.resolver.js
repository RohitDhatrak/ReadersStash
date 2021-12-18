const { encrypt, decrypt } = require("../../utils/hashOperations");
const { signToken, verifyToken } = require("../../utils/tokenOperations");
const { User } = require("../../models/user.model");
const { UserInputError } = require("apollo-server");

const userResolvers = {
    Mutation: {
        async signup(parent, args) {
            const {
                signupInput: { userName, password, email, name },
            } = args;
            const user = await User.findOne({ userName }).exec();
            if (user) {
                throw new UserInputError("Username is taken", {
                    errors: {
                        username: "This username is already taken",
                    },
                });
            } else {
                const encryptedPassword = await encrypt(password);
                const newUser = new User({
                    userName,
                    password: encryptedPassword,
                    email,
                    name,
                });
                await newUser.save();
                const jwt = signToken(newUser._id);
                return { ...newUser._doc, jwt };
            }
        },
        async login(parent, args) {
            const { userName, password } = args;
            const user = await User.findOne({ userName }).exec();

            if (user) {
                const doesMatch = await decrypt(user.password, password);
                if (doesMatch) {
                    const jwt = signToken(user.id);
                    return { ...user._doc, jwt };
                } else {
                    throw new UserInputError("Password does not match", {
                        errors: {
                            password: "The password is incorrect",
                        },
                    });
                }
            } else {
                throw new UserInputError("This user is not registered", {
                    errors: {
                        username: "This user is not registered",
                    },
                });
            }
        },
    },
};

module.exports = { userResolvers };
