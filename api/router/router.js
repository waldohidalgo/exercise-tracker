import { Router } from "express";
import path from "path";
import UserModel from "../models/User.js";
import { checkValidQueryParameters } from "../middlewares/checkValidQueryParameters.js";
import { isValidObjectId, filterLogsFromObjectUser } from "../utils/utils.js";
const router = Router();

router.get("/", (req, res) => {
  res.sendFile(path.resolve("api", "views", "index.html"));
});

router.get("/api/users", async (req, res) => {
  try {
    const users = await UserModel.find({}, "-__v -log");
    res.json(users);
  } catch (error) {
    res.send(error);
  }
});
router.post("/api/users", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.send("username is required");
  try {
    const user = await UserModel.findOne({ username });
    console.log(user);
    if (user) return res.json({ username: user.username, _id: user._id });
    const newUser = new UserModel({ username });
    await newUser.save();
    res.send({ username: newUser.username, _id: newUser._id });
  } catch (error) {
    res.send(error);
  }
});

router.post("/api/users/:_id/exercises", async (req, res) => {
  const { description, duration } = req.body;
  const { _id } = req.params;
  const date = req.body.date ? new Date(req.body.date) : new Date();

  try {
    if (!isValidObjectId(_id)) {
      res.send("id is not valid");
      return;
    }
    const user = await UserModel.findByIdAndUpdate(
      _id,
      {
        $push: {
          log: {
            description,
            duration,
            date,
          },
        },
      },
      { new: true, upsert: false }
    );
    if (!user) return res.send("user not found");

    res.json({
      _id: user._id,
      username: user.username,
      description,
      duration: Number(duration),
      date: date.toDateString(),
    });
  } catch (error) {
    res.json(error);
  }
});

router.get(
  "/api/users/:_id/logs",
  checkValidQueryParameters,
  async (req, res) => {
    const { from, to, limit } = req.query;

    const { _id } = req.params;
    try {
      if (!isValidObjectId(_id)) {
        res.send("id is not valid");
        return;
      }
      const user = await UserModel.findById(_id, "-__v");
      if (!user) return res.send("user not found");
      const newUser = filterLogsFromObjectUser(user, from, to, limit);

      res.json(newUser);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
);

export default router;
