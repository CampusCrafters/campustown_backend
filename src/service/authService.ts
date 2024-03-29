import { OAuth2Client } from 'google-auth-library';
import {getUserInfoFromGoogle, generateJWT, storeUserData, verifyJWT} from '../service/contentService';

export const signinService = async (req: any, res: any) => {
    // Headers setup
    res.header("Access-Control-Allow-Origin", 'http://localhost:5173');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header("Referrer-Policy", "no-referrer-when-downgrade");
    
    const redirectURL = 'http://localhost:5173/login';
  
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
    //res.redirect(authorizeUrl);
    res.json({url: authorizeUrl});
};

export const getTokensAndStoreDataService = async (req: any, res: any) => {
    console.log('reached getTokensAndStoreDataService');
    const code = req.query.code;
    console.log('Authorization code:', code);
    try {
        const redirectURL = "http://localhost:5173/login";
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectURL
        );
        const r = await oAuth2Client.getToken(code);  // Get token
        await oAuth2Client.setCredentials(r.tokens);   // Set credentials
        console.info('Tokens acquired.');
        
        if (r.tokens && r.tokens.access_token) {
            const userInfo = await getUserInfoFromGoogle(r.tokens.access_token);
            await storeUserData(userInfo);
            console.log(userInfo);
            const verifyToken = generateJWT(userInfo);  
            console.log(verifyToken);

            // Set JWT as HTTP-only cookie
            res.cookie('jwt', verifyToken, {
                httpOnly: true,
            });

            // Redirect to the frontend 
            res.redirect(`http://localhost:5173/dashboard`);
        } else {
            console.error('Access token not found');
        }
    } catch (err: any) {
        console.log('Error in getTokenAndStoreDataService', err);
        res.status(500).json({ error: err.message }); 
    } 
};

export const verifyTokenService = async (req: any, res: any) => {
    console.log("reached verifyTokenService");
    //console.log('request query: ',req.query);

    //const token = req.query.token;
    const jwtCookie = req.headers.cookie?.split(';').find((cookie: string) => cookie.trim().startsWith('jwt='));
    const token = jwtCookie ? jwtCookie.split('=')[1] : null;
    // console.log(jwtCookie, 'jwtCookie');
    // console.log(token, 'token');
    if (!token) {
        console.log("No token in the query");
        return res.status(400).json({ error: 'No token provided' });
    }
    try {
        const status = await verifyJWT(token);
        if(status){
            res.status(200).json({success: status});
        } else {
            res.status(401).json({success: status});
        }
    } catch (error) {
        res.status(503).json({ 'Error in verify token service': error});
    }
};





