/* eslint-disable no-unused-vars */
const Service = require('./Service');

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
   * update alert
   *
   * alert Alert alert to be updated
   * no response value expected for this operation
   **/
  static alertPUT({ alert }) {
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
   * get camera object
   *
   * cameraId Integer camera ID
   * returns camera
   **/
  static cameraCameraIdGET({ cameraId }) {
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
   * get a list of cameras user has permissions to see
   *
   * userId Integer user ID
   * returns List
   **/
  static cameraListUserIdGET({ userId }) {
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
   * login
   *
   * body Object not totally sure yet, probably encrypted username and password
   * no response value expected for this operation
   **/
  static loginPOST({ body }) {
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
   * get logged in user information
   *
   * userId Integer ID of user to return
   * returns person
   **/
  static userUserIdGET({ userId }) {
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
   * update logged in user
   *
   * userId Integer Person ID
   * person Person Updated Person Object
   * no response value expected for this operation
   **/
  static userUserIdPUT({ userId, person }) {
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

module.exports = GeneralService;
