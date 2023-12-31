import "./initializers";
import express from "express";
import cors from "cors";
import userRouter from "./routers/user.routers";
import authRouter from "./routers/auth.routers";
import coinsRouter from "./routers/coins.routers";
import emailRouter from "./routers/email.routers";
import { authMiddleware } from "./middleware/auth.middleware";

const app = express();

// configure express to accept json requests and cors
app.use(express.json());
app.use(
  cors({
    origin: ["https://cryptotracker.sankalpmukim.dev", "http://localhost:3000"],
    optionsSuccessStatus: 200,
  })
);

// setup routes
app.use(`/auth`, authRouter);

app.use(`/coins`, coinsRouter);
app.use(`/emails`, emailRouter);
// require authentication for all routes defined after this
app.use(`/users`, authMiddleware, userRouter);

app.get(`/`, (req, res) => {
  res.json({ message: `Hello World` });
});
const port = process.env.PORT || 8000;
app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
