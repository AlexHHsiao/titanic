import { Request as EXRequest } from "express";
import { Database } from "sqlite3";

export interface Request extends EXRequest {
    db: Database;
    sql: (query: string) => Promise<any[]>,
}