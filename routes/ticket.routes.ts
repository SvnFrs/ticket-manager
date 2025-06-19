import { Router } from "express";
import {
  createTicket,
  getTickets,
  getAvailableTickets,
  getUserTickets,
  bookTicket,
  cancelTicket
} from "../controllers/ticket.controllers";
import { authenticateToken, authorizeRoles, authorizeResourceOwner } from "../middleware/auth.middleware";
import { UserRole } from "../schema/user.schema";
import type { RequestHandler } from "../types/request.types";

const router = Router();

/**
 * @swagger
 * /api/v1/tickets:
 *   get:
 *     summary: Get all tickets (Admin/Staff only)
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error retrieving tickets
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new ticket (Admin/Staff only)
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketInput'
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error creating ticket
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/tickets",
  authenticateToken,
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF),
  getTickets
);

router.post("/tickets",
  authenticateToken,
  authorizeRoles(UserRole.ADMIN, UserRole.STAFF),
  createTicket
);

/**
 * @swagger
 * /api/v1/tickets/available:
 *   get:
 *     summary: Get all available tickets that are not booked yet
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of available tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No available tickets found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error retrieving available tickets
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/tickets/available",
  authenticateToken,
  authorizeRoles(UserRole.USER, UserRole.ADMIN, UserRole.STAFF),
  getAvailableTickets as RequestHandler
);

/**
 * @swagger
 * /api/v1/tickets/user/{userId}:
 *   get:
 *     summary: Get all tickets booked by a specific user
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User tickets found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error retrieving user tickets
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/tickets/user/:userId",
  authenticateToken,
  authorizeResourceOwner,
  getUserTickets
);

/**
 * @swagger
 * /api/v1/tickets/book:
 *   post:
 *     summary: Book a ticket for a user
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookTicketInput'
 *     responses:
 *       200:
 *         description: Ticket booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ticket booked successfully"
 *                 ticket:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Bad request - Ticket not available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error booking ticket
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/tickets/book",
  authenticateToken,
  authorizeRoles(UserRole.USER, UserRole.STAFF),
  bookTicket as RequestHandler
);

/**
 * @swagger
 * /api/v1/tickets/{id}/cancel:
 *   put:
 *     summary: Cancel a booked ticket
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ticket cancelled successfully"
 *       400:
 *         description: Bad request - Ticket not booked or can't be cancelled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Access denied - Can only cancel own tickets
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ticket not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error cancelling ticket
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/tickets/:id/cancel",
  authenticateToken,
  authorizeRoles(UserRole.USER, UserRole.ADMIN, UserRole.STAFF),
  cancelTicket as RequestHandler
);

export default router;
