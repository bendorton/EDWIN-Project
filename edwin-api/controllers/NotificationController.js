const Controller = require('./Controller');

class NotificationController {
  constructor(Service) {
    this.service = Service;
  }

  async alertEmailsCameraIdGET(request, response) {
    await Controller.handleRequest(request, response, this.service.alertEmailsCameraIdGET);
  }

  async alertPOST(request, response) {
    await Controller.handleRequest(request, response, this.service.alertPOST);
  }

  async cameraGetbyipGET(request, response) {
    await Controller.handleRequest(request, response, this.service.cameraGetbyipGET);
  }

}

module.exports = NotificationController;
