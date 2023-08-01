import "./initializers/dotenv";
import "./initializers/prisma";
import express from "express";
import cors from "cors";
import userRouter from "./routers/user.routers";
import authRouter from "./routers/auth.routers";

const app = express();

// configure express to accept json requests and cors
app.use(express.json());
app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

// setup routes
app.use(`/users`, userRouter);
app.use(`/auth`, authRouter);

app.get(`/`, (req, res) => {
  res.json({ message: `Hello World` });
});
const port = process.env.PORT || 8000;
const server = app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
