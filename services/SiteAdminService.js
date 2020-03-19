/* eslint-disable no-unused-vars */
const Service = require('./Service');

class SiteAdminService {

  /**
   * admin - delete user
   *
   * userId Integer Numeric ID of the user to delete
   * no response value expected for this operation
   **/
  static userAdminDELETE({ userId }) {
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
   * admin - get group user list
   *
   * groupId Integer group Id of user list
   * returns List
   **/
  static userAdminListGroupIdGET({ groupId }) {
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
   * admin - create user
   *
   * person Person Person object to be added
   * no response value expected for this operation
   **/
  static userAdminPOST({ person }) {
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
   * admin - update user
   *
   * person Person Person object to be updated
   * no response value expected for this operation
   **/
  static userAdminPUT({ person }) {
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
   * admin - get user
   *
   * userId Integer ID of user to return
   * returns person
   **/
  static userAdminUserIdGET({ userId }) {
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

module.exports = SiteAdminService;
