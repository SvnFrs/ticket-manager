import type { Request, Response, NextFunction } from "express";
import { verifyToken, type JWTPayload } from "../utils/jwt.utils";
import { UserRole } from "../schema/user.schema";

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: "Access token required" });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token", error: error });
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    if (!roles.includes(req.user.role as UserRole)) {
      res.status(403).json({
        message: "Insufficient permissions",
        requiredRoles: roles,
        userRole: req.user.role
      });
      return;
    }

    next();
  };
};

// Middleware to check if user owns the resource or is admin/staff
export const authorizeResourceOwner = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const userId = req.params.userId || req.params.id;
  const isOwner = req.user.userId === userId;
  const isAdminOrStaff = [UserRole.ADMIN, UserRole.STAFF].includes(req.user.role as UserRole);

  if (!isOwner && !isAdminOrStaff) {
    res.status(403).json({ message: "Access denied. You can only access your own resources." });
    return;
  }

  next();
};
