import { Request } from "src/request";
import { Response } from "express";

export interface Passenger {
    id: number,
    name: string,
    survived: boolean,
    sex: string,
    age: number,
    ticket_type: string,
    ticket_number: string,
    ticket_fare: number,
};

const mapRowToPassenger = (row: any) => (
    {
        id: parseInt(row.id, 10),
        name: row.name,
        survived: row.survived === "1",
        sex: row.sex,
        age: parseInt(row.age, 10),
        ticket_type: parseInt(row.passenger_class, 10),
        ticket_number: row.ticket,
        ticket_fare: parseFloat(row.fare),
    }
);

export interface Note {
    id: number;
    passenger_id: number;
    timestamp: number;
    message: string;
}

const mapRowToNote = (row: any) => (
    {
        id: row.id,
        passenger_id: parseInt(row.passenger_id, 10),
        timestamp: row.timestamp,
        message: row.message,
    }
);

export const getAll = async (req: Request, res: Response) => {
    let rows;

    try {
        rows = await req.sql("SELECT * from passengers ORDER BY name;");
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e });
    }

    let passengers: Passenger[] = rows.map(mapRowToPassenger);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Content-Type', 'application/json');
    res.json(passengers);
};

export const getByID = async (req: Request, res: Response) => {
    const idParam = req.params.id;
    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
        return res.status(400).json({ error: "Please provide an integer id" });
    }

    if (!id) {
        return res.status(400).json({ error: "Please provide an id" });
    }

    let rows;

    try {
        rows = await req.sql(`SELECT * from passengers WHERE id = ${id};`);
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }

    if (rows.length === 0) {
        return res.status(404).json({ error: "Passenger not found" });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Content-Type', 'application/json');
    return res.json(mapRowToPassenger(rows[0]));
};

export const addNote = async (req: Request, res: Response) => {
    let body: Note = req.body;
    const passengerIDParam = req.params.id;
    const passengerID = parseInt(passengerIDParam, 10);

    if (isNaN(passengerID)) {
        return res.status(400).json({ error: "Please provide an integer id" });
    }

    // validate fields
    if (!body.message) {
        return res.status(400).json({ error: "message field required" });
    }

    try {
        await req.sql(`INSERT INTO notes (timestamp, message, passenger_id) values (${new Date().getTime()}, "${body.message}", ${passengerID});`);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e });
    }

    let row;
    try {
        row = await req.sql(`SELECT * FROM notes WHERE id = last_insert_rowid();`);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e });
    }

    if (row.length === 0) {
        return res.status(500).json({ error: "Unable to get last inserted row" });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json(mapRowToNote(row[0]));
};

export const getPassengerNotes = async (req: Request, res: Response) => {
    const passengerIDParam = req.params.id;
    const passengerID = parseInt(passengerIDParam, 10);

    if (isNaN(passengerID)) {
        return res.status(400).json({ error: "Please provide an integer id" });
    }

    let rows;
    try {
        rows = await req.sql(`SELECT * FROM notes WHERE passenger_id = ${passengerID};`);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Content-Type', 'application/json');
    res.json(rows.map(mapRowToNote));
};

export const updateNote = async (req: Request, res: Response) => {
    let body: Note = req.body;
    const noteIDParam = req.params.id;
    const noteID = parseInt(noteIDParam, 10);

    if (isNaN(noteID)) {
        return res.status(400).json({ error: "Please provide an integer id" });
    }

    // validate fields
    if (!body.message) {
        return res.status(400).json({ error: "message field required" });
    }

    try {
        await req.sql(`UPDATE notes SET timestamp = ${new Date().getTime()}, message = "${body.message}" WHERE id = ${noteID};`);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e });
    }

    let rows;
    try {
        rows = await req.sql(`SELECT * from notes WHERE id = ${noteID};`);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Content-Type', 'application/json');
    res.json(mapRowToNote(rows[0]));
};

export const deleteNote = async (req: Request, res: Response) => {
    const noteIDParam = req.params.id;
    const noteID = parseInt(noteIDParam, 10);

    if (isNaN(noteID)) {
        return res.status(400).json({ error: "Please provide an integer id" });
    }

    // first make sure note exists
    try {
        let rows = await req.sql(`SELECT id from notes WHERE id = ${noteID};`);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Note does not exist" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e });
    }

    try {
        await req.sql(`DELETE from notes WHERE id = ${noteID};`);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e });
    }

    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // res.setHeader('Content-Type', 'application/json');
    res.sendStatus(200);
};