# Repartition Quebec

This is a mono repo containing app/services for `https://rq.ms`.

## What's inside?

This turborepo uses [pnpm](https://pnpm.io) as a packages manager. It includes the following packages/apps:

### Apps and Packages

- `frontend`: [Next.js](https://nextjs.org) app
- `backend`: Simple HTTP server for `socket.io` and other stuff
- `cms`: `Directus` cms for managing the database

### Build

To build all apps and packages, run the following command:

```
pnpm run build
```

### Develop

To develop all apps and packages, run the following command:

```
pnpm run dev
```
