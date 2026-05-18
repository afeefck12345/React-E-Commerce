import "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";
import cors from "cors"

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://react-e-commerce-omega-three.vercel.app",
    "https://react-e-commerce-git-main-afeef-ck-s-projects.vercel.app"
  ],
  credentials: true
}));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});