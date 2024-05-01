import { verifyJWT } from "../auth/authHelper";

export const viewProfileService = async (req: any, res: any) => {
  const token = req.cookies.jwt;
  if (!token) {
    console.log("No token in the query");
    return res.status(400).json("No token provided");
  }
  const status = await verifyJWT(token);
  if (status) {

  } else {
    res.status(401).json("Unauthorized");
  }
};
