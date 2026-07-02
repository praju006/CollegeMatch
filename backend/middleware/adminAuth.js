import jwt from "jsonwebtoken";

// Verifies the token and attaches { role: "super"|"college", collegeId? } to req.admin
export const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Restricts a route to the super admin only (must run after adminAuth)
export const requireSuperAdmin = (req, res, next) => {
  if (req.admin?.role !== "super") {
    return res.status(403).json({ message: "Super admin access required" });
  }
  next();
};

// Restricts college admins to their own college's :id param; super admin passes through
export const scopeToOwnCollege = (req, res, next) => {
  if (req.admin?.role === "college" && req.admin.collegeId !== req.params.id) {
    return res.status(403).json({ message: "You can only manage your own college" });
  }
  next();
};
