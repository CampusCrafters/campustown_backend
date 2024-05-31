const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS options
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://campus-connect-frontend-xi.vercel.app",
    "https://campusconnect-frontend.onrender.com",
    "http://ec2-13-233-31-62.ap-south-1.compute.amazonaws.com:5173",
  ],
  credentials: true,
};
app.options("*", cors(corsOptions));

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Logging middleware to log request origin
app.use((req: any, res: any, next: any) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});

// Routes
app.get("/", (req: any, res: any) => {
  res.send(
    "<h1>Hello, you are in the root path of campus connect backend</h1>"
  );
});

app.get("/health", (req: any, res: any) => {
  res.status(200).json(`Server healthy on port ${PORT}.`);
  console.log(`Server healthy on port ${PORT}.`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
