import express from "express";
import { isAuthenticated } from "../middleware/firebase.js";

const router = express.Router();

router.post("/", isAuthenticated, (req, res) => {
  const { email, name, uid } = req.user;

  res.status(200).json({
    message: "Login successful",
    user: { email, name, uid },
  });
});

export default router;
