import { Router, type NextFunction, type Request, type Response } from "express";
import { createTicket, getTickets, getUnbookedTickets } from "../controllers/ticket.controllers";

const router = Router();

type RequestHandler = (
  req: Request, res: Response, next?: NextFunction) => Promise<void | any> | void | any;


router.get("/tickets", getTickets);
router.get("/tickets/available", getUnbookedTickets as RequestHandler);

router.post("/tickets", createTicket as RequestHandler);

export default router;
