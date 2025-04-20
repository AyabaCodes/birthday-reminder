require("dotenv").config();

module.exports = {
  db: {
    uri: process.env.MONGODB_URI,
  },
  email: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  
};
