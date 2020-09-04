// next argument sends request to the next middleware
module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in' });
  }

  next();
};
