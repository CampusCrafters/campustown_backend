import { OAuth2Client } from 'google-auth-library';
import {getUserInfoFromGoogle, generateJWT, storeUserData, verifyJWT} from '../service/contentService';

export const signinService = async (req: any, res: any) => {
    // Headers setup
    res.header("Access-Control-Allow-Origin", 'http://localhost:5173');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header("Referrer-Policy", "no-referrer-when-downgrade");
    
    // Redirect URL
    const redirectURL = 'http://127.0.0.1:5000/api/v1/user/oauth';
  
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
  
    res.json({url: authorizeUrl});
};

export const getTokensAndStoreDataService = async (req: any, res: any) => {
    const code: string = req.query.code as string; // Asserting 'code' to be a string
    try {
        const redirectURL = "http://127.0.0.1:5000/api/v1/user/oauth";
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectURL
        );
        const r = await oAuth2Client.getToken(code);  // Get token
        await oAuth2Client.setCredentials(r.tokens);   // Set credentials
        console.info('Tokens acquired.');
        
        // Check if access_token exists before proceeding
        if (r.tokens && r.tokens.access_token) {
            const userInfo = await getUserInfoFromGoogle(r.tokens.access_token);
            await storeUserData(userInfo);
            const accessToken = generateJWT(userInfo);  
            console.log(accessToken);
{/****/}
            res.status(200).json({ success: true, accessToken: accessToken });

            res.redirect('http://localhost:5173/auth');
        } else {
            console.error('Access token not found');
            res.status(400).send('Access token not found'); // Respond with an error if access token is missing
        }
    } catch (err: any) {
        console.log('Error logging in with OAuth2 user', err);
        res.status(500).json({ error: err.message }); // Respond with a server error for other exceptions
    } 
};

export const verifyTokenService = async (req: any, res: any) => {
    console.log("reached verify");

    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);
    if (!token) {
        console.log("reched not token");
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        const decoded = await verifyJWT(token);
        req.user = decoded; // Store decoded user information in the request object
        res.status(200).json({ success: true, user: decoded }); // Send success response with user information
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};





