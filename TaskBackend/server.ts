import express from 'express';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express'; 
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { taskRouter } from './Router';
import cors from "cors";


dotenv.config();

mongoose
  .connect(process.env.uri || "", {})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err: Error) => console.error("MongoDB connection error:", err));

const t = initTRPC.create();

const app = express();
app.use(express.json());
app.use(
  cors()
);
const createContext = ({ req, res }: { req: express.Request; res: express.Response }) => {
  console.log('Context initialized');
  return {};
};

const appRouter = t.router({
  task: taskRouter, 
});

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`Server running on Port:${PORT}`);
});
