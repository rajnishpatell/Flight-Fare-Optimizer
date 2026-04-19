import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No or invalid token format" });
  }

  const token = authHeader.split(" ")[1]; // Extract only the JWT part

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // Set user ID to req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
