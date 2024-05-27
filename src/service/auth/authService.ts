import { OAuth2Client } from "google-auth-library";
import {
  getUserInfoFromGoogle,
  generateJWT,
  storeUserData,
  verifyJWT,
} from "./authHelper";

const backendURL = process.env.BACKEND_URL;
const frontendURL = process.env.FRONTEND_URL;
const redirectURL = `${backendURL}/api/v1/user/oauth`;
const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  redirectURL
);

export const signinService = async (req: any, res: any) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  // Generate the URL for consent dialog
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid",
    prompt: "consent",
  });
  res.json({ url: authorizeUrl });
};

export const getTokensAndStoreDataService = async (req: any, res: any) => {
  const code = req.query.code;
  if (!code) {
    console.error("Code not found");
    return res.redirect(`${frontendURL}/login`);
  }
  try {
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
      } catch (error: any) {
        console.log("Error storing user data:", error);
        return res.status(500).json(error.message);
      }
      const verifyToken = generateJWT(userInfo);
      console.log("jwt", verifyToken);

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
      res.redirect(`${frontendURL}/projects`); // Redirect after setting the cookie // Redirect to dashboard
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
  console.log("Verifying token");
  const token = req.cookies.jwt;
  if (!token) {
    console.log("No token in the query");
    return res.status(400).json({ error: "No token provided" });
  }
  try {
    const decoded = await verifyJWT(token);
    if (decoded) {
      res.status(200).json({ decoded: decoded });
    }
  } catch (error) {
    res.status(500).json({ "Error in verify token service": error });
  }
};
