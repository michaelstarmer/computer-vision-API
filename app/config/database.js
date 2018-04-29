require('dotenv').config();
module.exports = {
  "connection": {
    "host": process.env.MYSQL_HOST,
    "user": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD
  },
  "database": "d1",
  "users_table": "users"
}