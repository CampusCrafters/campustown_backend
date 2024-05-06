import axios from "axios";
import jwt from "jsonwebtoken";
import { addUser, checkEmailExists } from "../../DB/userDbFunctions";
import {
  createUsersTable,
  createUserProjectsTable,
  createUserExperienceTable,
  createProjectsTable,
  createProjectApplicationsTable,
} from "../../DB/tables";

export const getUserInfoFromGoogle = async (access_token: string) => {
  const response = await axios.post(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );
  return response.data;
};

export const generateJWT = (userInfo: any) => {
  const user = {
    email: userInfo.email,
    name: userInfo.name,
    rollNumber: userInfo.rollNumber,
    batch: userInfo.batch,
    branch: userInfo.branch,
  };

  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT secret key is not defined");
  }

  return jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: "12h" });
};

export const verifyJWT = async (sessionToken: string) => {
  try {
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT secret key is not defined");
    }
    const decoded = await jwt.verify(sessionToken, process.env.JWT_SECRET_KEY);
    if (decoded) {
      return decoded;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error("Error verifying JWT (Unauthorized)");
  }
};

export const storeUserData = async (userInfo: any) => {
  try {
    await createUsersTable();
    await createUserProjectsTable();
    await createUserExperienceTable();
    await createProjectsTable();
    await createProjectApplicationsTable();

    const Email = userInfo.email;
    const exists = await checkEmailExists(Email);

    if (!exists) {
      const [rollNumber, year, Branch] = await generateRollNumber(Email);
      const name = `${userInfo.name.replace(/ -IIITK$/, "").replace(/"/g, "")}`;
      const email = Email;
      const rollnumber = rollNumber;
      const batch = parseInt(year, 10); // Convert year to a number
      const branch = Branch;

      await addUser(name, email, rollnumber, batch, branch);
    }
  } catch (error) {
    console.error("Error storing user data:", error);
    throw new Error("Error storing user data");
  }
};

export const generateRollNumber = async (email: string) => {
  const parts = email.split("@"); // Extracting relevant parts from the email
  if (parts.length !== 2) {
    throw new Error("Invalid email format");
  } // Ensure email format is valid
  const username = parts[0]; // Extracting the branch  from the username
  const branchMatch = username.match(/\d{2}([a-zA-Z]+)/);
  const branch = branchMatch ? branchMatch[1].toUpperCase() : "";
  if (!branch) {
    throw new Error("Branch not found in username");
  } // Ensure branch is extracted
  const yearMatch = username.match(/\d{2}/); // Extracting the year from the username
  const year = yearMatch ? `20${yearMatch[0]}` : "";
  if (!year) {
    throw new Error("Year not found in username");
  } // Ensure year is extracted
  const rollNumberMatch = username.match(/\d{1,4}$/); // Extracting the roll number suffix from the username
  if (!rollNumberMatch) {
    throw new Error("Roll number suffix not found in username");
  } // Ensure roll number suffix is extracted
  const rollNumberSuffix = rollNumberMatch[0];
  const rollNumber = `${year}${branch}${rollNumberSuffix.padStart(4, "0")}`; // Formatting the roll number
  return [rollNumber, year, branch];
};
