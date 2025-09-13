exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    req.user = await User.findById(decoded.id);
    console.log("User found:", req.user);

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
};
