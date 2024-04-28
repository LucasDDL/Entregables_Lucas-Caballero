import bcrypt from 'bcrypt'
import User from '../dao/models/userModel.js';


export const hashPassword = async password =>{ 
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt)
}

export const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword)
        if (!isMatch) {
            throw new Error('Invalid password')
        }
        return isMatch
    } catch (error) {
        console.error(error);        
    }
}