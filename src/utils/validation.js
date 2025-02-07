const validator = require('validator');

const validateSignUpData = (req) =>{
    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName ){
        throw new Error('First name and last name are required');
    } else if (!validator.isEmail(email)){
        throw new Error('Invalid email');
    } else if (!validator.isStrongPassword(password)){
        throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter');
    }
};

module.exports = {validateSignUpData};