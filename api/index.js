import express from "express";
import cors from "cors";
import router from "./router/router.js";
import connectDB from "./config/db.js";
const app = express();

connectDB();

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

export default app;
