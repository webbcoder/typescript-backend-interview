# Goji Labs Interview Take-Home Project


## Overview
For our technical interview, we want you to build the foundation for a university course scheduling system. There should be teachers, subjects, classrooms, students, and another model called sections. A section represents a teacher teaching a subject in a specific classroom at a specfic time with students who attend the class. Think of it like the join model between all the other entities, and with specific times. Some sections are taught only on Monday, Wednesday, and Friday, others are only taught on Tuesdays and Thursdays, and some are every day. Sections typically are 50 minutes long, but they can also be 80 minutes. The earliest sections start at 7:30am and the latest ones end at 10pm.

## Goals
1. Students should be able to add/remove sections to their schedule
  - A student cannot be in two sections that overlap
  - For instance, if I add General Chemistry 1 to my schedule, and it's on MWF from 8:00 to 8:50am, I cannot enroll in any other sections between 8:00 and 8:50am on Mondays, Wednesdays, or Fridays.
2. Students should be able to download a PDF of their schedule.
  - For each section include subject, start time, end time, teacher name, and classroom name

## Guidelines
This is meant as a backend-only take home test project. You will not be scored on any styling or frontend choices. The entire application can be API-only, unless you're able to quickly set up a dashboard scaffold. This project is based on [NestJS](https://nestjs.com/) and [Prisma](https://prisma.io/). You can [seed](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding) the database with the provided seed.cjs (you can replace it with seed.ts if you prefer) file. Some default configuration has been provided. Please make sure to use Postgres as your database (we've provided a docker-compose file).

## Time Constraints
Do not spend more than 4 hours implementing the goals above. It's not mandatory that the goals above are 100% working, due to the time constraint, we're most interested in seeing your best work. Write this code as if you're contributing to a larger project with multiple developers who will critique your work. If you're running out of time and something isn't funcional yet, that's okay, make sure that whatever is functional is both complete and polished.
If you’d like to build a more feature-rich application to better showcase your skills, feel free to spend more than 8 hours. This is entirely up to you and not a requirement. We’ve found that many candidates appreciate the opportunity to demonstrate their abilities in more depth.

## Setup
The application is already scaffolded for you, you can start by running `docker-compose up`. This will start the database. The backend is in the `api` folder. Before running `npm start` or `npm start:dev` in the `api` folder you should run `npm run prisma:generate:client`, `npm run prisma:migrate:deploy`, and `npx prisma db seed` to seed the db with default data. First command will create all of the Prisma types for you, the second will create the database schema, and the third will seed the database with some initial data.

## Postman
To use Postman set up `Authorization` `Auth Type` `Basic Auth` `Username: testuser@example.com` `Password: testpassword`, or any other data from the user after running `seeds`
