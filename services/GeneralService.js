/* eslint-disable no-unused-vars */
const Service = require('./Service');
var conn = require('../database/sequelize').conn;
var Person = require('../database/sequelize').Person;
var GroupNotify = require('../database/sequelize').GroupNotify;
var Alert = require('../database/sequelize').Alert;
var Stream = require('../database/sequelize').Stream
var Camera = require('../database/sequelize').Camera

const QueryTypes = require('sequelize');

function isLoggedIn(personId) {
  //TODO verify user is admin, return true or false
  return true
}

function isSelf(personId) {
  //TODO verify user is same as one logged in
  return true
}

class GeneralService {

  /**
   * get list of alerts for camera
   *
   * cameraId Integer camera ID
   * returns List
   **/
  static alertListCameraIdGET({ cameraId }) {
    return new Promise(
      async (resolve) => {
        try {
          Alert.findAll({
            where: {
              camera_id: cameraId
            }
          })
            .then(alerts => {
              resolve(Service.successResponse(alerts, 200))
            })
            .catch(err => {
              resolve(Service.rejectResponse('problem communicating with the db' + err));
            })
        } catch (e) {
          resolve(Service.rejectResponse(
            e.message || 'Invalid input',
            e.status || 405,
          ));
        }
      },
    );
  }

  /**
   * update alert
   *
   * alert Alert alert to be updated
   * no response value expected for this operation
   **/
  static alertPUT( alertObj ) {
    return new Promise(
      async (resolve) => {
        try {
          if (!isLoggedIn(alertObj)) {
            resolve(Service.rejectResponse('Unauthorized', 401))
          }

          alertObj = alertObj.body
          if (alertObj.id == undefined || alertObj.id == null) {
            alertObj.id = 0
          }

          Alert.findOne({
            where: {
              id: alertObj.id,
            },
          })
            .then(alert => {
              if (alert == null) {
                resolve(Service.rejectResponse('alert not found', 400))
              } else {
                alert.alert_status = alertObj.status
                alert.alert_type = alertObj.alertType
                alert.message = alertObj.message
                alert.save().then(() => {
                  resolve(Service.successResponse('Alert Updated'));
                })
                  .catch(err => {
                    resolve(Service.rejectResponse(err))
                  })
              }
            })
            .catch(err => {
              resolve(Service.rejectResponse('problem communicating with database: ' + err, 500))
            });
        } catch (e) {
          resolve(Service.rejectResponse(
            e.message || 'Invalid input',
            e.status || 405,
          ));
        }
      },
    );
  }

  /**
   * get camera object
   *
   * cameraId Integer camera ID
   * returns camera
   **/
  static cameraCameraIdGET({ cameraId }) {
    return new Promise(
      async (resolve) => {
        try {
          const streams = await Stream.findAll({
            where: {
              camera_id: cameraId
            }
          })
            .catch(err => {
              resolve(Service.rejectResponse('error retrieving streams' + err, 500))
            })

          const alerts = await Alert.findAll({
            where: {
              camera_id: cameraId
            }
          })
            .catch(err => {
              resolve(Service.rejectResponse('error retrieving alerts' + err, 500))
            })

          Camera.findOne({
            where: {
              id: cameraId
            }
          })
            .then(camera => {
              if (camera != null) {
                var cameraObj = {
                  id: camera.id,
                  name: camera.name,
                  groupId: camera.group_id,
                  coordinates: camera.coordinates,
                  ipAddress: camera.ip_address,
                  status: camera.status,
                  alerts: alerts,
                  streams: streams
                }
                resolve(Service.successResponse(JSON.stringify(cameraObj)))
              } else {
                resolve(Service.successResponse('Invalid ID: No camera found'))
              }
            })
            .catch(err => {
              resolve(Service.successResponse('problem communicating with db: ' + err))
            });
        } catch (e) {
          resolve(Service.rejectResponse(
            e.message || 'Invalid input',
            e.status || 405,
          ));
        }
      },
    );
  }

  /**
   * get a list of cameras user has permissions to see
   *
   * userId Integer user ID
   * returns List
   **/
  static cameraListUserIdGET({ userId }) {
    return new Promise(
      async (resolve) => {
        try {
          if (!isLoggedIn(userId)) {
            resolve(Service.rejectResponse('Unauthorized', 401))
          }

          const cameras = await conn.query(
            'SELECT c.id, c.name, c.ip_address, c.group_id, c.coordinates, c.status FROM camera c JOIN person_group pg ON c.group_id = pg.group_id WHERE pg.person_id = :personId',
            {
              replacements: { personId: userId },
              type: QueryTypes.SELECT
            })

          const allCameras = []
          for (const camera of cameras[0]) {
            const streams = await Stream.findAll({
              where: {
                camera_id: camera.id
              }
            })
              .catch(err => {
                resolve(Service.rejectResponse('error retrieving streams' + err, 500))
              })

            const alerts = await Alert.findAll({
              where: {
                camera_id: camera.id
              }
            })
              .catch(err => {
                resolve(Service.rejectResponse('error retrieving alerts' + err, 500))
              })

            let cameraObj = {
              id: camera.id,
              name: camera.name,
              groupId: camera.group_id,
              coordinates: camera.coordinates,
              ipAddress: camera.ip_address,
              status: camera.status,
              alerts: await alerts,
              streams: await streams
            }
            allCameras.push(cameraObj)
          }

          resolve(Service.successResponse(allCameras, 200))
        } catch (e) {
          resolve(Service.rejectResponse(
            e.message || 'Invalid input',
            e.status || 405,
          ));
        }
      },
    );
  }

  /**
   * login
   *
   * body Object not totally sure yet, probably encrypted username and password
   * no response value expected for this operation
   **/
  static loginPOST({ body }) {
    return new Promise(
      async (resolve) => {
        try {
          //TODO login method
          resolve(Service.successResponse(''));
        } catch (e) {
          resolve(Service.rejectResponse(
            e.message || 'Invalid input',
            e.status || 405,
          ));
        }
      },
    );
  }

  /**
   * get logged in user information
   *
   * userId Integer ID of user to return
   * returns person
   **/
  static userUserIdGET({ userId }) {
    return new Promise(
      async (resolve) => {
        try {
          if (!isLoggedIn(userId) || !isSelf(userId)) {
            resolve(Service.rejectResponse('Unauthorized', 401))
          }

          const groups = await conn.query(
            'SELECT g.id, g.name, pg.notification FROM groups g JOIN person_group pg ON g.id = pg.group_id AND pg.person_id = :personId',
            {
              replacements: { personId: userId },
              type: QueryTypes.SELECT
            })

          Person.findOne({
            where: {
              id: userId,
            },
          })
            .then(user => {
              if (user != null) {
                var userObj = {
                  id: user.id,
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  groups: [""]
                }
                userObj.groups = groups[0];

                resolve(Service.successResponse(JSON.stringify(userObj)))
              } else {
                resolve(Service.rejectResponse('Invalid ID: No user found', 405))
              }
            })
            .catch(err => {
              resolve(Service.rejectResponse('problem communicating with db: ' + err))
            });
        } catch (e) {
          resolve(Service.rejectResponse(
            e.message || 'Invalid input',
            e.status || 405,
          ));
        }
      },
    );
  }

  /**
   * update logged in user
   *
   * userId Integer Person ID
   * person Person Updated Person Object
   * no response value expected for this operation
   **/
  static userUserIdPUT(request) {
    return new Promise(
      async (resolve) => {
        try {
          if (!isLoggedIn(request.userId) || !isSelf(request.userId)) {
            resolve(Service.rejectResponse('Unauthorized', 401))
          }

          let person = request.body
          if (person.id == undefined || person.id == null) {
            person.id = 0
          }

          Person.findOne({
            where: {
              id: person.id,
            },
          })
            .then(user => {
              if (user == null) {
                resolve(Service.rejectResponse('user not found', 400))
              } else {
                user.firstname = person.firstName
                user.lastname = person.lastName
                user.email = person.email
                if(person.password !== undefined && person.password != null) {
                  user.password = person.password
                }
                user.save().then(() => {
                  person.groups.forEach((group) => {
                    GroupNotify.findOne({
                      where: {
                        person_id: user.id,
                        group_id: group.id
                      },
                    })
                      .then(groupNotify => {
                        if (groupNotify != null) {
                          if(group.notification == "false" || group.notification == 0) {
                            group.notification = 0
                          }
                          else {
                            group.notification = 1
                          }
                          groupNotify.notification = group.notification
                          groupNotify.save()
                        }
                      })
                      .catch(err => {
                        resolve(Service.rejectResponse('error updating person group settings: ' + err))
                      })
                  })
                  resolve(Service.successResponse('Updated Self'))
                })
              }
            })
            .catch(err => {
              resolve(Service.rejectResponse('problem communicating with database: ' + err, 500))
            })
        } catch (e) {
          resolve(Service.rejectResponse(
            e.message || 'Invalid input',
            e.status || 405,
          ))
        }
      },
    )
  }

}

module.exports = GeneralService;
