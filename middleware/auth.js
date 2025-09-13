const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
  protect: async (req, res, next) => {
    let token = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token)
      return res.status(401).json({ message: "Not authorized, token missing" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id)
        .select("-password")
        .populate("role");
      if (!user)
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token invalid" });
    }
  },

  authorizeRoles: (...roles) => {
    return (req, res, next) => {
      const userRole = req.user && req.user.role && req.user.role.name;
      if (!userRole || !roles.includes(userRole)) {
        return res
          .status(403)
          .json({ message: "Forbidden: insufficient privileges" });
      }
      next();
    };
  },
};
