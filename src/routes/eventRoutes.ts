import "dotenv/config";
import { Router } from "express";
import bodyParser from "body-parser";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createEventService, deleteEventService, editEventService, getAllEventsService, getEventService, getMyEventsService, registerEventService } from "../service/campusevents/eventsService";

const router = Router();
router.use(bodyParser.json());

router.get('/all', authMiddleware, getAllEventsService);
router.get('/myEvents', authMiddleware, getMyEventsService);
router.post('/create', authMiddleware, createEventService);
router.get('/:id', authMiddleware, getEventService);
router.put('/edit', authMiddleware, editEventService);
router.delete('/delete', authMiddleware, deleteEventService);
router.post('/regiter', authMiddleware, registerEventService);

export default router;