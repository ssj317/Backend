
---

#  Backend – README.md


# Pastebin Backend

This is the backend service for a Pastebin-like application.  
It provides APIs to create and fetch pastes and an HTML view for shared links.

---

##  How to Run Locally


npm install
npm run dev

## Create a .env file in the backend root:

MONGO_URI=use your local mongo string to run it locally
BASE_URL=http://localhost:3000
PORT=3000
TEST_MODE=1


## The server runs on:

http://localhost:3000

## Persistence Layer

The backend uses MongoDB (via Mongoose) for persistence.

Stores paste content, expiry time, and view counts

Ensures data survives across requests and deployments

Works well with serverless environments

## Important Design Decisions

Built with Express and deployed as a serverless function on Vercel

Uses atomic database updates to safely enforce view limits

Supports time-based expiry (TTL) and view-count limits

Includes a health check endpoint to verify database connectivity

Implements deterministic time handling (TEST_MODE) for automated testing

Paste content is rendered safely to prevent script execution

Backend URL
https://backend-h4frmd8zg-subhams-projects-b1afa338.vercel.app

Health Check
https://backend-h4frmd8zg-subhams-projects-b1afa338.vercel.app/api/healthz

If /api/healthz returns something like:

{ "ok": true }


then:

 Backend is live

Express app is wired correctly

Database connectivity is working

Ready for automated tests
