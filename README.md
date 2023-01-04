This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Copy `.env.local.sample` to `.env.local` and change the values as needed:

```bash
NODE_ENV="development"
DB_NAME="awesome-default-db"
MONGODB_URI="mongodb://127.0.0.1:27017"
JWT_SECRET="jwt-super-secret"
NEXTAUTH_SECRET="some-super-secret"
HOST="http://localhost:3000"
NEXTAUTH_URL="${HOST}"
AWS_APP_ACCESS_KEY=testkey
AWS_APP_SECRET_KEY=testsecretkey
AWS_APP_DEFAULT_REGION=us-east-1
AWS_APP_BUCKET=my-bucket
AWS_APP_ENDPOINT=http://localhost:9000
```

Optionally, spin up the external resources (mongo database and minio for s3 services).  This will spin up a server at `mongodb://127.0.0.1:27017`:

```bash
npm run dev:services
```

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
