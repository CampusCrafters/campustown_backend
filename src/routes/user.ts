import 'dotenv/config';
import { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { createUsersTable, addUser, checkEmailExists } from '../DB/db';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const router = Router();
router.use(bodyParser.json());

router.post('/request', async function(req, res, next) {
  // Headers setup
  res.header("Access-Control-Allow-Origin", 'http://localhost:5173');
  res.header("Access-Control-Allow-Credentials", 'true');
  res.header("Referrer-Policy","no-referrer-when-downgrade");
  
  // Redirect URL
  const redirectURL = 'http://127.0.0.1:5000/api/v1/user';

  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectURL
  );

  // Generate the URL for consent dialog
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
    prompt: 'consent'
  });

  res.json({url:authorizeUrl});
});

function generateRollNumber(email: string): [string, number, string]  {
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
  return [rollNumber, parseInt(year), branch];
}

const getAndStoreUserData = async (access_token: string) => {
  const response = await axios.post(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
  const data = response.data;
  console.log('data', data);
  const email = data.email;
  console.log('Email', email);
  const exists = await checkEmailExists(email);
  if(!exists){
    const [rollNumber, year, branch] = generateRollNumber(email);
    const Name = `${data.name.replace(/ -IIITK$/, '').replace(/"/g, '')}`;
    const Email = email;
    const RollNumber = rollNumber;
    const Batch = year;
    const Branch = branch;
    //const { Name, Email, RollNumber, Batch, Branch } = req.body;
    try {
      await createUsersTable();
      await addUser(Name, Email, RollNumber, Batch, Branch);
      //res.status(201).send('User added successfully');
    } catch (error) {
      console.error('Error handling request:', error);
      //res.status(500).send('Internal Server Error');
    }
  }
}

router.get('/', async function(req, res, next) {
  const code: string = req.query.code as string; // Asserting 'code' to be a string

  try {
    const redirectURL = "http://127.0.0.1:5000/api/v1/user";
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectURL
    );

    // Get token
    const r =  await oAuth2Client.getToken(code);
    
    // Set credentials
    await oAuth2Client.setCredentials(r.tokens);
    console.info('Tokens acquired.');

    // Check if access_token exists before calling getUserData
    if (r.tokens && r.tokens.access_token) {
      // Get user data
      await getAndStoreUserData(r.tokens.access_token);
    } else {
      console.error('Access token not found');
    }
  } catch (err) {
    console.log('Error logging in with OAuth2 user', err);
  }
  
  res.redirect(303, 'http://localhost:5173/');
});

export default router;
