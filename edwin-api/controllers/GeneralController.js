const Controller = require('./Controller');

class GeneralController {
  constructor(Service) {
    this.service = Service;
  }

  async alertListCameraIdGET(request, response) {
    await Controller.handleRequest(request, response, this.service.alertListCameraIdGET);
  }

  async alertPUT(request, response) {
    await Controller.handleRequest(request, response, this.service.alertPUT);
  }

  async cameraCameraIdGET(request, response) {
    await Controller.handleRequest(request, response, this.service.cameraCameraIdGET);
  }

  async cameraListUserIdGET(request, response) {
    await Controller.handleRequest(request, response, this.service.cameraListUserIdGET);
  }

  async loginPOST(request, response) {
    await Controller.handleRequest(request, response, this.service.loginPOST);
  }

  async userUserIdGET(request, response) {
    await Controller.handleRequest(request, response, this.service.userUserIdGET);
  }

  async userUserIdPUT(request, response) {
    await Controller.handleRequest(request, response, this.service.userUserIdPUT);
  }

}

module.exports = GeneralController;
