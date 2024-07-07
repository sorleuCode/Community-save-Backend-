const jwt = require('jsonwebtoken');
require('dotenv')

const createToken = (adminId) => {
    if (!adminId) {
        throw new Error('adminId is required to generate a token');
    }
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
    }

    return jwt.sign({ id: adminId }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1d' });
};

module.exports = createToken;
