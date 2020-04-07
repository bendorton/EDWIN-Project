/* eslint-disable no-unused-vars */
const Service = require('./Service');
var Alert = require('../database/sequelize').Alert;
var Camera = require('../database/sequelize').Camera;
var Alert = require('../database/sequelize').Alert;
var conn = require('../database/sequelize').conn;

const QueryTypes = require('sequelize');

function isAdmin(person) {
  //TODO verify user is admin, return true or false
  return true;
}

class NotificationService {

  /**
   * get list of emails for camera alerts
   *
   * cameraId Integer camera ID
   * returns List
   **/
  static alertEmailsCameraIdGET({ cameraId }) {
    return new Promise(
      async (resolve) => {
        try {
          if (!isAdmin) {
            resolve(Service.rejectResponse('Unauthorized', 401))
          }
          const response = await conn.query(
            'SELECT p.email FROM person p JOIN person_group pg ON p.id = pg.person_id JOIN camera c ON c.group_id = pg.group_id WHERE c.id = :camId',
            {
              replacements: { camId: cameraId },
              type: QueryTypes.SELECT
            })
            .catch(err => {
              resolve(Service.rejectResponse('error communicating with database', 500))
            })

            let emails = []
            response[0].forEach(email => {
              emails.push(email['email'])
            })
          resolve(Service.successResponse(emails));
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
   * create alert
   *
   * alert Alert alert object to be added
   * no response value expected for this operation
   **/
  static alertPOST(alertObj) {
    return new Promise(
      async (resolve) => {
        try {
          if (!isAdmin) {
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
              if (alert != null) {
                resolve(Service.rejectResponse('alert already exists', 400))
              } else {

                if(alertObj.cameraId == undefined || alertObj.cameraId == null) {
                  return resolve(Service.rejectResponse('cameraId required', 400))
                }
                if(alertObj.status == undefined || alertObj.status == null) {
                  return resolve(Service.rejectResponse('status required', 400))
                }
                if(alertObj.alertType == undefined || alertObj.alertType == null) {
                  return resolve(Service.rejectResponse('alertType required', 400))
                }
                if(alertObj.filePath == undefined || alertObj.filePath == null) {
                  return resolve(Service.rejectResponse('filePath required', 400))
                }
                if(alertObj.message == undefined || alertObj.message == null) {
                  alertObj.message = ""
                }

                Alert.create({
                  id: null,
                  camera_id: alertObj.cameraId,
                  alert_status: alertObj.status,
                  alert_type: alertObj.alertType,
                  message: alertObj.message,
                  filepath: alertObj.filePath,
                }).then(() => {
                  resolve(Service.successResponse('Created Alert'));
                })
                  .catch(err => {
                    resolve(Service.rejectResponse('error creating alert: (make sure filepath is unique?): ' + err, 500))
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
   * get camera by IP Address
   *
   * ipAddress String IP address of camera
   * returns camera
   **/
  static cameraGetbyipGET({ipAddress}) {
    return new Promise(
      async (resolve) => {
        try {
          const camera = await Camera.findOne({
            where: {
              ip_address: ipAddress
            }
          })

          if (camera != null) {
            var cameraObj = {
              id: camera.id,
              name: camera.name,
              status: camera.status,
            }
            resolve(Service.successResponse(JSON.stringify(cameraObj)))
          } else {
            resolve(Service.successResponse('Invalid IP: No camera found'))
          }
        } catch (e) {
          resolve(Service.rejectResponse(
            e.message || 'Invalid input',
            e.status || 405,
          ));
        }
      },
    );
  }

}

module.exports = NotificationService;
