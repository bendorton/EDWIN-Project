const Controller = require('./Controller');

class SiteAdminController {
  constructor(Service) {
    this.service = Service;
  }

  async userAdminDELETE(request, response) {
    await Controller.handleRequest(request, response, this.service.userAdminDELETE);
  }

  async userAdminListGroupIdGET(request, response) {
    await Controller.handleRequest(request, response, this.service.userAdminListGroupIdGET);
  }

  async userAdminPOST(request, response) {
    await Controller.handleRequest(request, response, this.service.userAdminPOST);
  }

  async userAdminPUT(request, response) {
    await Controller.handleRequest(request, response, this.service.userAdminPUT);
  }

  async userAdminUserIdGET(request, response) {
    await Controller.handleRequest(request, response, this.service.userAdminUserIdGET);
  }

  async userAdminUserEmailGET(request, response) {
    await Controller.handleRequest(request, response, this.service.userAdminUserEmailGET);
  }

}

module.exports = SiteAdminController;
