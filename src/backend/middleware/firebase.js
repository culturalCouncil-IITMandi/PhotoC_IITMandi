import admin from "../helpers/firebaseConfig.js";

export const isAuthenticated = async (req, res, next) => {
  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (!decodedToken.email.endsWith("@iitmandi.ac.in")) {
      return res.status(403).json({ message: "Forbidden: Invalid email domain" });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
