/* eslint-disable no-unused-vars */
const Service = require('./Service');
var Alert = require('../database/sequelize').Alert;
var Camera = require('../database/sequelize').Camera;
var Alert = require('../database/sequelize').Alert;
var Stream = require('../database/sequelize').Stream

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
                    resolve(Service.rejectResponse('error creating alert: make sure filepath is unique?: ' + err, 500))
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
