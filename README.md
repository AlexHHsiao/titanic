## API Server

The API server is provided in the `./api` folder. The following routes are available:

`GET /passenger`
Returns a list of all passengers.

`GET /passenger/:id`
Returns a single passenger, located by id.

`GET /passenger/:id/note`
Returns a list of notes associated with a passenger.

`POST /passenger/:id/note`
Creates a new note and associates it with a passenger.

`PUT /note/:id`
Updates an existing note.

`DELETE /note/:id`
Deletes an existing note.

For more example usage of the apis, you can refer to the integration tests located in `./api/test/api.test.ts`.

### Running the server

**STEP 1.** Ensure you have Node.js installed (www.nodejs.org). Version 8 is recommended.
**STEP 2.** From the `./api` folder, run:
```
npm install
npm run build
npm run start
```

The server will start listening on port 8080. To test if it is working, open `http://localhost:8080/passenger` in your browser. You should see a long list of JSON objects returned.

To reset the database, you can run: `npm run reset-db`.
