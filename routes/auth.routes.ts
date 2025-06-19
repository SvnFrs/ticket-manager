import { Router } from "express";
import { signup, login, logout, getProfile } from "../controllers/auth.controllers";
import { authenticateToken } from "../middleware/auth.middleware";
import type { RequestHandler } from "../types/request.types";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     SignupInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           description: User's full name
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           minLength: 6
 *           description: User's password
 *           example: "password123"
 *         phone:
 *           type: string
 *           description: User's phone number
 *           example: "+1234567890"
 *         role:
 *           type: string
 *           enum: [User, Admin, Staff]
 *           description: User's role
 *           default: User
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           example: "password123"
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the user
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         phone:
 *           type: string
 *           description: User's phone number
 *         role:
 *           type: string
 *           enum: [User, Admin, Staff]
 *           description: User's role
 *         isVIP:
 *           type: boolean
 *           description: Indicates if the user has VIP status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Time when the user was created
 *     Ticket:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the ticket
 *         movieTitle:
 *           type: string
 *           description: Title of the movie
 *         cinema:
 *           type: string
 *           description: Name of the cinema
 *         showTime:
 *           type: string
 *           format: date-time
 *           description: Date and time of the movie show
 *         seatNumber:
 *           type: string
 *           description: Seat number in the cinema
 *         price:
 *           type: number
 *           description: Price of the ticket
 *         status:
 *           type: string
 *           enum: [Available, Booked, Cancelled]
 *           description: Current status of the ticket
 *         bookedBy:
 *           type: string
 *           description: ID of the user who booked the ticket
 *         bookedAt:
 *           type: string
 *           format: date-time
 *           description: Time when the ticket was booked
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Time when the ticket was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Time when the ticket was last updated
 *     TicketInput:
 *       type: object
 *       required:
 *         - movieTitle
 *         - cinema
 *         - showTime
 *         - seatNumber
 *         - price
 *       properties:
 *         movieTitle:
 *           type: string
 *           description: Title of the movie
 *           example: "Inception"
 *         cinema:
 *           type: string
 *           description: Name of the cinema
 *           example: "Cinema City"
 *         showTime:
 *           type: string
 *           format: date-time
 *           description: Date and time of the movie show
 *           example: "2023-08-15T19:30:00Z"
 *         seatNumber:
 *           type: string
 *           description: Seat number in the cinema
 *           example: "A12"
 *         price:
 *           type: number
 *           description: Price of the ticket
 *           example: 15.50
 *     BookTicketInput:
 *       type: object
 *       required:
 *         - ticketId
 *       properties:
 *         ticketId:
 *           type: string
 *           description: ID of the ticket to book
 *           example: "60d21b4667d0d8992e610c85"
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *         error:
 *           type: object
 *           description: Additional error details
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Bad request - User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/signup", signup as RequestHandler);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate a user and return a token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Bad request - Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid credentials or account deactivated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/login", login as RequestHandler);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Access token required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/profile", authenticateToken, getProfile as RequestHandler);

export default router;
