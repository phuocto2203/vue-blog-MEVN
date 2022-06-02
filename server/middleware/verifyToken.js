const jwt = require("jsonwebtoken");

//Authorization: Bearer <ACCESS TOKEN>
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Access token not found!" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.body.userId = decoded.userId;
    next();
    
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

module.exports = verifyToken;
