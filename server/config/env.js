import dotenv from "dotenv";
import fs from "fs";
import path from "path";

if (process.env.NODE_ENV !== "production") {
  const envCandidates = [
    path.resolve(process.cwd(), "server/.env"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "server/.env.example"),
  ];

  const isFile = (filePath) => {
    try {
      return fs.statSync(filePath).isFile();
    } catch {
      return false;
    }
  };

  const configPath = envCandidates.find(isFile);
  if (configPath) {
    dotenv.config({ path: configPath });
    console.log(`Loaded env from ${configPath}`);
  } else {
    dotenv.config();
  }
}