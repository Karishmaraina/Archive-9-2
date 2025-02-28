import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Or from cookies
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId);
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
  };

export default authMiddleware;
