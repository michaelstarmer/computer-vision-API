const mysql = require('mysql');
require('dotenv').config();
const pool = mysql.createPool({
    "host": process.env.MYSQL_HOST,
    "user": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD,
    "database": "d1"
});

pool.getConnection((err, connection) => {
    if(err) {
        console.log(err);
        return;
    }
    console.log("Database pool is created.");
});

const queryPromise = (sql, args) => new Promise((resolve, reject) => {
    pool.query(sql, args, function(error, result, fields) {
        if(error) reject(error);
        else resolve(result, fields);
    });
});

const query = async function(sql, args) {
    try {
        return await queryPromise(sql, args);
    } catch (e) {
        console.log(e);
        console.log("Failed SQL query",{sql:sql,args:args});
        throw new Error("An internal error occured.");
    }
};

module.exports = {pool, query};