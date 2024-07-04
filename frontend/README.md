# Repartition Quebec Frontend

Web app interface for Repartition Quebec built with [Next.js](https://nextjs.org).

## Requirements

- `pnpm` package manager
- `Node.js` version 22+
- `PostgreSQL` database version 16+

## Setup

### 1) Dependencies

- `pnpm install` to install dependencies

### 2) Environment

- Use `.env.example` to create your own `.env` file.

### 3) Database setup (skip if it's done already)

- `pnpm run db:migrate` to apply migrations to your database
- `pnpm run db:seed` to seed your database with initial data

## Development

- `pnpm run dev` to start the development server

## Production Build

- `pnpm run build` to create a production build
- `pnpm run start` to start the production build
