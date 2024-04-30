import { OAuth2Client } from "google-auth-library";
import {
  getUserInfoFromGoogle,
  generateJWT,
  storeUserData,
  verifyJWT,
} from "./authHelper";

const backendURL = process.env.BACKEND_URL;
const frontendURL = process.env.FRONTEND_URL;

export const signinService = async (req: any, res: any) => {
  // Headers setup
  //res.header("Access-Control-Allow-Origin", 'http://localhost:5173');
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const redirectURL = `${backendURL}/api/v1/user/oauth`;

  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectURL
  );

  // Generate the URL for consent dialog
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid",
    prompt: "consent",
  });
  //res.redirect(authorizeUrl);
  res.json({ url: authorizeUrl });
};

export const getTokensAndStoreDataService = async (req: any, res: any) => {
  console.log("reached getTokensAndStoreDataService");
  const code = req.query.code;
  console.log("Authorization code:", code);
  try {
    const redirectURL = `${backendURL}/api/v1/user/oauth`;
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectURL
    );
    const r = await oAuth2Client.getToken(code); // Get token
    await oAuth2Client.setCredentials(r.tokens); // Set credentials
    console.info("Tokens acquired.");

    if (r.tokens && r.tokens.access_token) {
      const userInfo = await getUserInfoFromGoogle(r.tokens.access_token);
      const email = userInfo.email;
      if (!email.endsWith("@iiitkottayam.ac.in")) {
        console.log("Unauthorized email domain");
        return res.redirect(`${frontendURL}/login?error=unauthorized`);
      }
      try {
        await storeUserData(userInfo);
      } catch (error) {
        console.log("Error storing user data:", error);
        return res.status(500).send("Error storing user data");
      }
      const verifyToken = generateJWT(userInfo);
      console.log("jwt", verifyToken);

      // Set JWT as HTTP-only cookies // not working
      try {
        // Set the cookie
        await res.cookie("jwt", verifyToken, {
          //httpOnly: true,
          secure: true,
          sameSite: "none",
        });
      } catch (error) {
        console.error("Error setting cookie:", error);
        res.status(500).send("Error setting cookie");
      }
      // Redirect after setting the cookie
      res.redirect(`${frontendURL}/dashboard`);
      
    } else {
      console.error("Access token not found");
      return res.status(500).send("Access token not found");
    }
  } catch (err: any) {
    console.log("Error in getTokenAndStoreDataService", err);
    return res.status(500).json({ error: err.message });
  }
};

export const verifyTokenService = async (req: any, res: any) => {
  console.log("reached verifyTokenService");
  const token = req.cookies.jwt;
  //console.log('token', token);
  if (!token) {
    console.log("No token in the query");
    return res.status(400).json({ error: "No token provided" });
  }
  try {
    const status = await verifyJWT(token);
    if (status) {
      res.status(200).json({ success: status, decoded: status });
    } else {
      res.status(401).json({ success: status });
    }
  } catch (error) {
    res.status(503).json({ "Error in verify token service": error });
  }
};
