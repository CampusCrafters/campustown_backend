import axios from 'axios';
import jwt from 'jsonwebtoken';
import { createUsersTable, addUser, checkEmailExists } from '../DB/db';

export const getUserInfoFromGoogle = async (access_token: string) => {
    const response = await axios.post(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    return response.data;
};

export const generateJWT = (userInfo: any) => {
    const user = {
        email: userInfo.email,
        name: userInfo.name,
        rollNumber: userInfo.rollNumber,
        batch: userInfo.batch,
        branch: userInfo.branch
    };

    if (!process.env.JWT_SECRET_KEY) {
        throw new Error('JWT secret key is not defined');
    }

    return jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '1h' }); 
};

export const verifyJWT = async (sessionToken: string) => {
    try {
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('JWT secret key is not defined');
        }    
        const decoded = await jwt.verify(sessionToken, process.env.JWT_SECRET_KEY);
        return decoded;
    } catch (error) {
        throw error;
    }
};

export const storeUserData = async (userInfo: any) => {
    try {
        const email = userInfo.email;
        if (!validateEmailDomain(email)) {
            throw new Error('Unauthorized email domain');
        }

        const exists = await checkEmailExists(email);
        if (!exists) {
            const [rollNumber, year, branch] = await generateRollNumber(email);
            const Name = `${userInfo.name.replace(/ -IIITK$/, '').replace(/"/g, '')}`;
            const Email = email;
            const RollNumber = rollNumber;
            const Batch = parseInt(year, 10); // Convert year to a number
            const Branch = branch;

            await createUsersTable(); 
            await addUser(Name, Email, RollNumber, Batch, Branch); 
        }
    } catch (error) {
        console.error('Error handling request:', error);
        throw error; 
    }
};

export const generateRollNumber = async (email: string) => {
    const parts = email.split('@');   // Extracting relevant parts from the email
    if (parts.length !== 2) {
        throw new Error('Invalid email format');
    }   // Ensure email format is valid
    const username = parts[0];   // Extracting the branch  from the username
    const branchMatch = username.match(/\d{2}([a-zA-Z]+)/);
    const branch = branchMatch ? branchMatch[1].toUpperCase() : '';
    if (!branch) {
        throw new Error('Branch not found in username');
    }   // Ensure branch is extracted
    const yearMatch = username.match(/\d{2}/);  // Extracting the year from the username
    const year = yearMatch ? `20${yearMatch[0]}` : '';
    if (!year) {
        throw new Error('Year not found in username');
    }   // Ensure year is extracted
    const rollNumberMatch = username.match(/\d{1,4}$/);   // Extracting the roll number suffix from the username
    if (!rollNumberMatch) {
        throw new Error('Roll number suffix not found in username');
    }   // Ensure roll number suffix is extracted
    const rollNumberSuffix = rollNumberMatch[0];
    const rollNumber = `${year}${branch}${rollNumberSuffix.padStart(4, '0')}`;   // Formatting the roll number
    return [rollNumber, year, branch];
}

export const validateEmailDomain = (email: string) => {
    const allowedDomain = 'iiitkottayam.ac.in';
    return email.endsWith('@' + allowedDomain);
};