import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user.models";
import { generateToken } from "../utils/jwt.utils";
import type { IUser } from "../schema/user.schema";

const userModel = new UserModel();

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await userModel.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create new user
    const newUser = await userModel.create({
      name,
      email,
      password,
      phone,
      role
    });

    if (!newUser) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    // Generate token
    const token = generateToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      username: newUser.name,
      role: newUser.role
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVIP: newUser.isVIP
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await userModel.getByEmailWithPassword(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update last login
    await userModel.updateLastLogin(user._id.toString());

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      username: user.name,
      role: user.role
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVIP: user.isVIP
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Error during login", error });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('token');
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Error during logout", error });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    const user = await userModel.getByID(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        tickets: user.tickets?.map(ticket => ticket.toString()),
        isVIP: user.isVIP,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};
