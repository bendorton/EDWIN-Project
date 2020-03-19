/* eslint-disable no-unused-vars */
const Service = require('./Service');

class AdminService {

  /**
   * admin - delete camera
   * deletes cameraStream object from database
   *
   * cameraId Integer Numeric ID of the camera to delete
   * no response value expected for this operation
   **/
  static cameraDELETE({ cameraId }) {
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
   * admin - create camera
   *
   * cameraStream CameraStream Camera object to be added
   * no response value expected for this operation
   **/
  static cameraPOST({ cameraStream }) {
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
   * admin - update camera
   *
   * cameraStream CameraStream camera to be updated
   * no response value expected for this operation
   **/
  static cameraPUT({ cameraStream }) {
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
   * admin - delete group
   * deletes group object from database
   *
   * groupId Integer Numeric ID of the group to delete
   * no response value expected for this operation
   **/
  static groupDELETE({ groupId }) {
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
   * admin - create group
   *
   * group Group group object to be added
   * no response value expected for this operation
   **/
  static groupPOST({ group }) {
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
   * admin - update group
   *
   * group Group group to be updated
   * no response value expected for this operation
   **/
  static groupPUT({ group }) {
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

module.exports = AdminService;
