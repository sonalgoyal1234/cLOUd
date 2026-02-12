module.exports = (req, res, next) => {
  const user = req.headers["x-user-id"];

  if (!user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  req.user = { _id: user };
  next();
};
