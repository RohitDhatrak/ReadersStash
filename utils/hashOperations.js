const bcrypt = require("bcrypt");

async function encrypt(password) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
}

async function decrypt(encryptedPassword, password) {
    return bcrypt.compare(password, encryptedPassword);
}

module.exports = { encrypt, decrypt };
