var Sequelize = require('sequelize');
var AlertModel = require('../models/AlertModel');
var CameraModel = require('../models/CameraModel');
var GroupModel = require('../models/GroupModel');
var GroupNotifyModel = require('../models/GroupNotifyModel')
var PersonModel = require('../models/PersonModel');
var StreamModel = require('../models/StreamModel');

let username = process.env.MARIADB_USER
let password = process.env.MARIADB_PASSWORD
let dbName = process.env.MARIADB_DATABASE
let host = process.env.MARIADB_HOST

const conn = new Sequelize(dbName, username, password, {
    host: host,
    dialect: 'mariadb'
});

const Person = PersonModel(conn, Sequelize);
const Camera = CameraModel(conn, Sequelize);
const Alert = AlertModel(conn, Sequelize);
const Group = GroupModel(conn, Sequelize);
const GroupNotify = GroupNotifyModel(conn, Sequelize);
const Stream = StreamModel(conn, Sequelize);

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
    GroupNotify,
    Stream
};