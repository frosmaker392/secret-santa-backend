# Secret Santa (backend)

## About

The backend project for the Secret Santa project I'm currently working on.
Built using Apollo and Nexus for the server part, and Prisma for the
database part. Still a work in progress.

## Running the project

1. Install dependencies using `pnpm i`.
2. Create `.env` file according to the `.env.template` given.
3. Make sure postgres is running in the background at port 5432.
4. Run database migrations using `npx prisma migrate dev`.
5. Start server in development mode using `npm run dev`.

### Running the database container

Use the following command to initialize and start a postgres docker container:

```
docker run -d \
  --name secret-santa-db \
  -p 5432:5432 \
  --env-file .env \
  -v secret-santa-db:var/lib/postgresql/data \
  postgres
```

Afterwards, the container can be started again using `docker start secret-santa-db`.
