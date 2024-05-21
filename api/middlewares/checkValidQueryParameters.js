import { isValidDate } from "../utils/utils.js";

export function checkValidQueryParameters(req, res, next) {
  const { from, to, limit } = req.query;

  if (!isNaN(Number(limit))) {
    req.query.limit = Number(limit);
  } else {
    req.query.limit = null;
  }

  if (isValidDate(from)) {
    req.query.from = new Date(from);
  } else {
    req.query.from = null;
  }

  if (isValidDate(to)) {
    req.query.to = new Date(to);
  } else {
    req.query.to = null;
  }

  next();
}
