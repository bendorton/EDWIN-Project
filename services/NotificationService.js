/* eslint-disable no-unused-vars */
const Service = require('./Service');

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
  static alertPOST({ alert }) {
    return new Promise(
      async (resolve) => {
        try {
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
   * get camera by IP Address
   *
   * ipAddress String IP address of camera
   * returns camera
   **/
  static cameraGetbyipGET({ ipAddress }) {
    return new Promise(
      async (resolve) => {
        try {
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

}

module.exports = NotificationService;
