var Sequelize = require('sequelize');
var PersonModel = require('../models/PersonModel');
var CameraModel = require('../models/CameraModel');
var AlertModel = require('../models/AlertModel');
var GroupModel = require('../models/GroupModel');
var GroupNotifyModel = require('../models/GroupNotifyModel')

// TODO make this what we use
// let username = process.env.MARIADB_USER
// let password = process.env.MARIADB_PASSWORD
// let dbName = process.env.MARIADB_DATABASE
// let host = process.env.MARIADB_HOST

let username = 'smokey'
let password = 'bear'
let dbName = 'edwin'
let host = 'localhost'

const conn = new Sequelize(dbName, username, password, {
    host: host,
    dialect: 'mariadb'
});

const Person = PersonModel(conn, Sequelize);
const Camera = CameraModel(conn, Sequelize);
const Alert = AlertModel(conn, Sequelize);
const Group = GroupModel(conn, Sequelize);
const GroupNotify = GroupNotifyModel(conn, Sequelize);

try {
    conn.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

conn.sync().then(() => {
    console.log(`****SEQUELITE SYNCED****`);
  });

module.exports = {
    conn,
    Person,
    Camera,
    Alert,
    Group,
    GroupNotify
};


// JUST IN CASE I NEED THIS
// const mariadb = require('mariadb');

// const pool = mariadb.createPool({
//   user: process.env.MARIADB_USER,
//   password: process.env.MARIADB_PASSWORD,
//   host: process.env.MARIADB_HOST,
//   database: process.env.MARIADB_DATABASE,
//   connectionLimit: 10
// });

// module.exports = pool;