import * as express from "express";
import * as path from "path";
import { Database } from "sqlite3";
import { Request } from "./request";
import * as passengers from "./controllers/passengers";
import * as bodyParser from "body-parser";

let db: Database;
const server = express();

// Add database to all requests
server.use((req: Request, res: express.Response, next: express.NextFunction) => {
    req.db = db;

    // Helper method to run simple sql queries
    req.sql = (query: string) => {
        return new Promise((resolve, reject) => {
            db.all(query, (err, rows) => {
                if (err) {
                    return reject(err);
                }

                resolve(rows);
            })
        });
    };

    next();
});

// Parse all bodies as JSON
server.use(bodyParser.json({
    type: () => true,
    strict: true,
}));

// Return body parser errors as json
server.use((error, req, res, next) => {
    if (error) {
        if (error instanceof SyntaxError) {
            res.status(400).json({
                error: {
                    message: 'Invalid Json Body',
                    code: 'invalid_json'
                }
            });
            return;
        } else {
            res.status(500).json({
                error: {
                    message: 'Server Error',
                    code: 'server_error'
                }
            });

            return;
        }
    }

    next();
});

// Define routes
server.get("/passenger", passengers.getAll);
server.get("/passenger/:id", passengers.getByID);
server.post("/passenger/:id/note", passengers.addNote);
server.get("/passenger/:id/note", passengers.getPassengerNotes);
server.put("/note/:id", passengers.updateNote);
server.delete("/note/:id", passengers.deleteNote);

// Connect to database and then start the server
const dbPath = path.resolve(__dirname, "..", "data", "titanic.db");
db = new Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }

    console.log("Connected to database");
    server.listen(8080, () => console.log("API server is running on port 8080"));
});
