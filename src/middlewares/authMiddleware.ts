import { verifyJWT } from "../service/auth/authHelper";

export const authMiddleware = async (req: any, res: any, next: any) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(400).json("No token provided");
    }
    try {
        const decoded = await verifyJWT(token);
        if (decoded) {
            req.decoded = decoded; // Add this line to store the decoded value in the request object
            next();
        }
    } catch (error: any) {
        res.status(401).json(error.message);
    }
}
