# Viaplay Assignment

This is the technical assignment for the Backend Engineering position at Viaplay Group.

## Project Overview

The project is a simple Node.js server that provides an API endpoint for retrieving the trailer URL of a movie. It takes a Viaplay movie URL as input and returns the URL of the trailer on YouTube.

The project uses the following technologies:

- Typescript
- Node.js
- Express.js
- Axios
- Nock
- Jest
- Supertest

## Project Setup

To set up the project, you need to do the following:

1. Clone the repository: `git clone git@github.com:psalqvist/viaplay-assignment.git`

2. Install the dependencies:

```
cd viaplay-assignment
npm install
```

3. Create a `.env` file with the following environment variables: `TMDB_API_KEY=<your TMDb API key>`

4. Start the server: `npm start`

5. The server is now running on `http://localhost:8080`.

6. Send a get request to try the api: `GET /v1/movies/trailer?url=https://content.viaplay.se/pc-se/film/arrival-2016`

## Running Tests

To run the tests, use the following command: `npm test`

## Production readiness

While the solution is not yet production-ready, the following steps can be taken to improve it:

- Containerization: Docker can be used to create lightweight containers for the application, which can be easily scaled horizontally.
- Cotainer Orchestration: Kubernetes can be used to manage containers at scale and ensure that requests are distributed evenly across nodes using load balancers. Can also enable us to develop a micro service architecture rather than a monolith, and thus create seperation of concern across teams.
- Metrics and performance monitoring: Prometheus and Grafana can be used to monitor the application's metrics and performance.
- CI/CD: CI should be implemented to make sure that all tests are run on every pull request. CD should be implemented to get more control of the deployment process.
- Create seperate branches for development and production and only run the CD pipeline when changes are integrated into the development branch.




