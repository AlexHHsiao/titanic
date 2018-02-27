# Instructions

The goal of this exercise is to develop a small single page application which will display data about passengers on the Titanic (https://en.wikipedia.org/wiki/RMS_Titanic).

Write the code to fulfill the requirements listed below. Create a zip file with your code and submit it via email, along with instructions on how to build and run your app. This exercise is expected to take between 4-8 hours, but you may spend more or less time on it, as you see fit.

## Functional Requirements

You must support these scenarios:

* Display a list of all the passengers on board the ship
* Allow the user to search for a passenger by name
* Allow the user to create notes about a passenger. These notes should be saved using the API, so that they are persisted in the database.

Bonus scenario:

* Visualize the passenger data in some interesting chart
** This could be a pie chart showing males vs. females, etc.

## Technical Requirements

* Use JavaScript or TypeScript (preferred) to implement your solution
* You may use React, Vue, or any other web framework you are familiar with
* At a minimum, your app must be compatible with the latest version of Chrome
* You may modify the API server if you wish, but this should not be required

## Evaluation criteria

In order of importance:

* Functionality: are the scenarios described above all implemented and working properly?
* Documentation: are instructions for building and running the code included and easy to follow?
* Code quality: is the code clean and maintainable?
* Design asthetics: is the UI visually pleasing?

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