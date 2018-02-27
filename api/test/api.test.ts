import "mocha";
import { assert } from "chai";
import { GET, PUT, POST, DELETE } from "./request";
import { test } from "./async";

describe("API integration tests", () => {
    describe("GET /passenger", () => {
        it("should return all passengers", test(async () => {
            const passengers = await GET("/passenger");
            assert.equal(passengers.json.length, 891);
        }));
    });

    describe("GET /passenger/:id", () => {
        it("should return correct passenger", test(async () => {
            const { json } = await GET("/passenger/1");
            assert.deepEqual(
                json,
                {
                    age: 22,
                    id: 1,
                    name: "Braund, Mr. Owen Harris",
                    sex: "male",
                    survived: false,
                    ticket_fare: 7.25,
                    ticket_number: "A/5 21171",
                    ticket_type: 3,
                }
            );
        }));

        it("should return a 404", test(async () => {
            const result = await GET("/passenger/99999999");
            assert.equal(result.res.statusCode, 404);
        }));

        it("should return a 400", test(async () => {
            const result = await GET("/passenger/abc");
            assert.equal(result.res.statusCode, 400);
        }));
    });

    describe("GET /passenger/:id/note", () => {
        it("should return list of notes", test(async () => {
            // Create a note
            await POST("/passenger/1/note", {
                body: JSON.stringify({
                    message: "a test note"
                })
            });

            // Test number of notes
            const { json } = await GET("/passenger/1/note");
            assert.equal(json.length, 1);

            // Clean up by deleting note
            const { res } = await DELETE(`/note/${json[0].id}`);
            assert.equal(res.statusCode, 200);
        }));
    });

    describe("POST /passenger/:id/note", () => {
        it("should return list of notes", test(async () => {
            // Create a note
            await POST("/passenger/1/note", {
                body: JSON.stringify({
                    message: "a test note"
                })
            });

            // Test number of notes
            const { json } = await GET("/passenger/1/note");
            assert.equal(json.length, 1);

            // Clean up by deleting note
            const { res } = await DELETE(`/note/${json[0].id}`);
            assert.equal(res.statusCode, 200);
        }));
    });

    describe("PUT /note/:id", () => {
        it("should update a note", test(async () => {
            // Create a note
            const note = await POST("/passenger/1/note", {
                body: JSON.stringify({
                    message: "a test note"
                })
            });

            // Update the note
            const updatedNote = await PUT(`/note/${note.json.id}`, {
                body: JSON.stringify({
                    message: "an updated message"
                })
            });
            assert.equal(updatedNote.json.message, "an updated message");

            // Clean up by deleting note
            const { res } = await DELETE(`/note/${note.json.id}`);
            assert.equal(res.statusCode, 200);
        }));
    });

    describe("DELETE /note/:id", () => {
        it("should delete the note", test(async () => {
            // Create a note
            const note = await POST("/passenger/1/note", {
                body: JSON.stringify({
                    message: "a test note"
                })
            });

            // Delete the note
            const { res } = await DELETE(`/note/${note.json.id}`);
            assert.equal(res.statusCode, 200);
        }));
    });
});