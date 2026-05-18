import "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";
import cors from "cors"


app.use(cors({
  origin: 'https://your-app.vercel.app', // update after deploying frontend
  credentials: true
}));
const PORT = process.env.PORT || 5000;


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
