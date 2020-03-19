const Controller = require('./Controller');

class ServerController {
  constructor(Service) {
    this.service = Service;
  }

  async camerastreamCameraIdGET(request, response) {
    await Controller.handleRequest(request, response, this.service.camerastreamCameraIdGET);
  }

  async camerastreamListGET(request, response) {
    await Controller.handleRequest(request, response, this.service.camerastreamListGET);
  }

}

module.exports = ServerController;
