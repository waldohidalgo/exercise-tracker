import mongoose from "mongoose";
export function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function isValidDateFormat(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
}
export function isValidDate(dateString) {
  if (!isValidDateFormat(dateString)) {
    return false;
  }

  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return false;
  }

  return true;
}

export function filterLogsFromObjectUser(user, from, to, limit) {
  const log = user.log.sort((a, b) => new Date(b.date) - new Date(a.date));
  let newLog;

  if (limit) {
    newLog = log.slice(0, limit);
  } else {
    newLog = log;
  }

  if (from) {
    newLog = newLog.filter((log) => new Date(log.date) >= new Date(from));
  } else {
    newLog = newLog;
  }

  if (to) {
    newLog = newLog.filter((log) => new Date(log.date) <= new Date(to));
  } else {
    newLog = newLog;
  }

  const newUser = {
    _id: user._id,
    username: user.username,
    count: newLog.length,
    log: newLog.map(({ description, duration, date }) => ({
      description,
      duration,
      date: date.toDateString(),
    })),
  };
  console.log(newUser);
  return newUser;
}
