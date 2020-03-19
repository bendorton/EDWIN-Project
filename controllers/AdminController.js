const Controller = require('./Controller');

class AdminController {
  constructor(Service) {
    this.service = Service;
  }

  async cameraDELETE(request, response) {
    await Controller.handleRequest(request, response, this.service.cameraDELETE);
  }

  async cameraPOST(request, response) {
    await Controller.handleRequest(request, response, this.service.cameraPOST);
  }

  async cameraPUT(request, response) {
    await Controller.handleRequest(request, response, this.service.cameraPUT);
  }

  async groupDELETE(request, response) {
    await Controller.handleRequest(request, response, this.service.groupDELETE);
  }

  async groupPOST(request, response) {
    await Controller.handleRequest(request, response, this.service.groupPOST);
  }

  async groupPUT(request, response) {
    await Controller.handleRequest(request, response, this.service.groupPUT);
  }

}

module.exports = AdminController;
