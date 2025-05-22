import { Router, type NextFunction, type Request, type Response } from "express";
import {
  getUsers,
  getUserTickets,
  getUserById,
  createUser,
  getUserByName,
  updateUserStatus,
  deleteAllUserTickets,
  updateUserTickets
} from "../controllers/user.controllers";

const router = Router();

type RequestHandler = (
  req: Request, res: Response, next?: NextFunction) => Promise<void | any> | void | any;


router.get("/users", getUsers);
router.get("/users/id/:id", getUserById as RequestHandler);
router.get("/users/name/:name", getUserByName as RequestHandler);
router.get("/tickets/user/id/:id", getUserTickets as RequestHandler);

router.post("/users", createUser as RequestHandler);
router.patch("/users/id/:id/vip", updateUserStatus as RequestHandler);
router.post("/users/id/:userID/tickets/id/:ticketID", updateUserTickets as RequestHandler);
router.delete("/users/id/:id/tickets", deleteAllUserTickets as RequestHandler);

export default router;
