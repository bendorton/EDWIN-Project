/* eslint-disable no-unused-vars */
const Service = require('./Service');

class ServerService {

  /**
   * get direct camera stream URLs
   *
   * cameraId Integer ID of camera
   * returns List
   **/
  static camerastreamCameraIdGET({ cameraId }) {
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
   * get list of cameras and their direct stream URLs
   *
   * returns List
   **/
  static camerastreamListGET() {
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

module.exports = ServerService;
