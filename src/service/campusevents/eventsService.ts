import { checkEventOwner, createEvent, deleteEvent, getAllEvents, getEvent, getMyEvents, registerEvent, updateEvent } from "../../repositories/eventDbFunctions";
import { getUserProfile } from "../../repositories/userDbFunctions";

export const getAllEventsService = async (req: any, res: any) => {
    try {
        const allEvents = await getAllEvents();
        res.status(200).json(allEvents);
    } catch (err: any) {
        res.status(401).json(err.message);
    }
};

export const getMyEventsService = async (req: any, res: any) => {
    try {
        const { user_id } = await getUserProfile(req.decoded.email);
        const myEvents = await getMyEvents(user_id);
        res.status(200).json(myEvents);
    } catch (err: any) {
        res.status(401).json(err.message);
    }
}

export const getEventService = async (req: any, res: any) => {
    try {
        const event = await getEvent(req.params.id);
        res.status(200).json(event);
    } catch (err: any) {
        res.status(401).json(err.message);
    }
};

export const createEventService = async (req: any, res: any) => {
    try {
        const { user_id } = await getUserProfile(req.decoded.email);
        const eventInfo = req.body;
        await createEvent(eventInfo, user_id);
        res.status(200).json("Event created successfully");
    } catch (err: any) {
        res.status(401).json(err.message);
    }
};

export const editEventService = async (req: any, res: any) => {
    try {
        const { user_id } = await getUserProfile(req.decoded.email);
        const event_id = req.query.event_id;
        if ((await checkEventOwner(user_id, event_id)) === false) {
            res.status(401).json("You are not authorized to edit this event");
            return;
        }
        const updatedEventInfo = req.body;
        await updateEvent(event_id, updatedEventInfo);
        res.status(200).json("Event updated successfully");
    } catch (err: any) {
        res.status(401).json(err.message);
    }
};

export const deleteEventService = async (req: any, res: any) => {
    try {
        const { user_id } = await getUserProfile(req.decoded.email);
        const event_id = req.query.event_id;
        if ((await checkEventOwner(user_id, event_id)) === false) {
            res.status(401).json("You are not authorized to delete this event");
            return;
        }
        await deleteEvent(event_id);
        res.status(200).json("Event deleted successfully");
    } catch (err: any) {
        res.status(401).json(err.message);
    }
};

export const registerEventService = async (req: any, res: any) => {
    try {
        const { user_id } = await getUserProfile(req.decoded.email);
        const event_id = req.query.event_id;
        await registerEvent(user_id, event_id);
        res.status(200).json("Event registered successfully");
    } catch (err: any) {
        res.status(401).json(err.message);
    }
};


