import axios from "axios";
import jwt from "jsonwebtoken";
import { addUser, checkEmailExists } from "../../repositories/userDbFunctions";
import {
  createUsersTable,
  createUserProjectsTable,
  createUserExperienceTable,
  createProjectsTable,
  createProjectApplicationsTable,
} from "../../repositories/tables";

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

  return jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
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
      let name = userInfo.name;
      if (Email.endsWith("@student.nitw.ac.in")) {
        name = userInfo.name;
      } else if (Email.endsWith("@iiitkottayam.ac.in")) {
        name = `${userInfo.name.replace(/ -IIITK$/, "").replace(/"/g, "")}`;
      }
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
  if (email.endsWith("@iiitkottayam.ac.in")) {
    const parts = email.split("@");
    if (parts.length !== 2) {
      throw new Error("Invalid email format");
    }
    const username = parts[0];
    const branchMatch = username.match(/\d{2}([a-zA-Z]+)/);
    const branch = branchMatch ? branchMatch[1].toUpperCase() : "";
    if (!branch) {
      throw new Error("Branch not found in username");
    }
    const yearMatch = username.match(/\d{2}/);
    const year = yearMatch ? `20${yearMatch[0]}` : "";
    if (!year) {
      throw new Error("Year not found in username");
    }
    const rollNumberMatch = username.match(/\d{1,4}$/);
    if (!rollNumberMatch) {
      throw new Error("Roll number suffix not found in username");
    }
    const rollNumberSuffix = rollNumberMatch[0];
    const rollNumber = `${year}${branch}${rollNumberSuffix.padStart(4, "0")}`;
    return [rollNumber, year, branch];
  } else if (email.endsWith("@student.nitw.ac.in")) {
    const parts = email.split("@");
    if (parts.length !== 2) {
      throw new Error("Invalid email format");
    }
    const username = parts[0];
    const rollNumberMatch = username.match(
      /\d{2}[a-zA-Z]{3}\d{2}[a-zA-Z]{1}\d{2}/
    );
    if (!rollNumberMatch) {
      throw new Error("Roll number not found in username");
    }
    const rollNumber = rollNumberMatch[0];
    const yearMatch = rollNumber.match(/^\d{2}/);
    const branchMatch = rollNumber.match(/\d{2}([a-zA-Z]{3})/);
    const year = yearMatch ? `20${yearMatch[0]}` : "";
    const branch = branchMatch ? branchMatch[1].toUpperCase() : "";
    return [rollNumber, year, branch];
  } else {
    throw new Error("Unsupported email domain");
  }
};
