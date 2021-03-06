/* eslint-disable no-unused-vars */
const Service = require('./Service');
var Camera = require('../database/sequelize').Camera
var Group = require('../database/sequelize').Group
var GroupNotify = require('../database/sequelize').GroupNotify;

function isAdmin(person) {
  //TODO verify user is admin, return true or false
  return true;
}

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
          if (!isAdmin) {
            resolve(Service.rejectResponse('Unauthorized', 401))
          }
          const camera = await Camera.findOne({
            where: {
              id: cameraId,
            },
          })
            .catch(err => {
              resolve(Service.rejectResponse('problem communicating with the db' + err));
            })

          if (camera == null) {
            resolve(Service.rejectResponse('Camera not found', 405));
          }

          camera.destroy()
            .then(() => {
              resolve(Service.successResponse('Successfully deleted camera'));
            })
            .catch(err => {
              resolve(Service.rejectResponse('problem communicating with the db' + err));
            })
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
   * camera Camera object to be added
   * no response value expected for this operation
   **/
  static cameraPOST(cameraObj) {
    return new Promise(
      async (resolve) => {
        try {
          if (!isAdmin) {
            resolve(Service.rejectResponse('Unauthorized', 401))
          }

          cameraObj = cameraObj.body
          if (cameraObj.id == undefined || cameraObj.id == null) {
            cameraObj.id = 0
          }

          Camera.findOne({
            where: {
              id: cameraObj.id,
            },
          })
            .then(camera => {
              if (camera != null) {
                resolve(Service.rejectResponse('Camera with that ID already exists', 405))
              } else {

                if (cameraObj.name == undefined || cameraObj.name == null) {
                  return resolve(Service.rejectResponse('name required', 400))
                }
                if (cameraObj.groupId == undefined || cameraObj.groupId == null) {
                  return resolve(Service.rejectResponse('groupId required', 400))
                }
                if (cameraObj.coordinates == undefined || cameraObj.coordinates == null) {
                  return resolve(Service.rejectResponse('coordinates required', 400))
                }
                if (cameraObj.ipAddress == undefined || cameraObj.ipAddress == null) {
                  return resolve(Service.rejectResponse('ipAddress required', 400))
                }
                if (cameraObj.directURL == undefined || cameraObj.directURL == null) {
                  return resolve(Service.rejectResponse('directURL (url of rtsp stream from camera) required', 400))
                }
                if (cameraObj.status == undefined || cameraObj.status == null) {
                  cameraObj.status = "good"
                }
                if (cameraObj.type == undefined || cameraObj.type == null) {
                  cameraObj.type = ""
                }

                Camera.create({
                  id: null,
                  name: cameraObj.name,
                  group_id: cameraObj.groupId,
                  coordinates: cameraObj.coordinates,
                  ip_address: cameraObj.ipAddress,
                  direct_url: cameraObj.directURL,
                  status: cameraObj.status,
                  camera_type: cameraObj.type
                }).then(() => {
                  resolve(Service.successResponse('Camera created'));
                })
                  .catch(err => {
                    resolve(Service.rejectResponse('problem communicating with database: ' + err, 500))
                  })
              }
            })
            .catch(err => {
              resolve(Service.rejectResponse('problem communicating with database: ' + err, 500))
            });
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
   * camera Camera to be updated
   * no response value expected for this operation
   **/
  static cameraPUT(cameraObj) {
    return new Promise(
      async (resolve) => {
        try {
          if (!isAdmin) {
            resolve(Service.rejectResponse('Unauthorized', 401))
          }

          cameraObj = cameraObj.body
          if (cameraObj.id == undefined || cameraObj.id == null) {
            cameraObj.id = 0
          }

          Camera.findOne({
            where: {
              id: cameraObj.id,
            },
          })
            .then(camera => {
              if (camera == null) {
                resolve(Service.rejectResponse('camera not found', 400))
              } else {
                if (cameraObj.name != undefined && cameraObj.name != null) {
                  camera.name = cameraObj.name
                }
                if (cameraObj.groupId != undefined && cameraObj.groupId != null) {
                  camera.group_id = cameraObj.groupId
                }
                if (cameraObj.coordinates != undefined && cameraObj.coordinates != null) {
                  camera.coordinates = cameraObj.coordinates
                }
                if (cameraObj.ipAddress != undefined && cameraObj.ipAddress != null) {
                  camera.ip_address = cameraObj.ipAddress
                }
                if (cameraObj.directURL != undefined && cameraObj.directURL != null) {
                  camera.direct_url = cameraObj.directURL
                }
                if (cameraObj.status != undefined && cameraObj.status != null) {
                  camera.status = cameraObj.status
                }
                if (cameraObj.type != undefined && cameraObj.type != null) {
                  camera.camera_type = cameraObj.type
                }
                camera.save().then(() => {
                  resolve(Service.successResponse('Camera updated'));
                })
                .catch(err => {
                  resolve(Service.rejectResponse('problem communicating with database: ' + err, 500)) 
                })
              }
            })
            .catch(err => {
              resolve(Service.rejectResponse('problem communicating with database: ' + err, 500))
            });
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
          if (!isAdmin) {
            resolve(Service.rejectResponse('Unauthorized', 401))
          }
          const group = await Group.findOne({
            where: {
              id: groupId,
            },
          })
            .catch(err => {
              resolve(Service.rejectResponse('problem communicating with the db' + err));
            })

          if (group == null) {
            resolve(Service.rejectResponse('Group not found', 405));
          }

          group.destroy()
            .then(() => {
              resolve(Service.successResponse('Successfully deleted group'))
            })
            .catch(err => {
              resolve(Service.rejectResponse('Error deleting group. Are there still users or cameras attached to the group?'));
            })
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
  static groupPOST(groupObj) {
    return new Promise(
      async (resolve) => {
        try {
          if (!isAdmin) {
            resolve(Service.rejectResponse('Unauthorized', 401))
          }

          groupObj = groupObj.body
          if (groupObj.id == undefined || groupObj.id == null) {
            groupObj.id = 0
          }

          Group.findOne({
            where: {
              id: groupObj.id,
            },
          })
            .then(group => {
              if (group != null) {
                resolve(Service.rejectResponse('group with that ID already exists', 405))
              } else {
                Group.create({
                  name: groupObj.name
                }).then((newGroup) => {
                  GroupNotify.create({
                    person_id: 1,
                    group_id: newGroup.id,
                    notification: true
                  })
                  resolve(Service.successResponse('Group Created'));
                });
              }
            })
            .catch(err => {
              resolve(Service.rejectResponse('problem communicating with database: ' + err, 500))
            });
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
  static groupPUT(groupObj) {
    return new Promise(
      async (resolve) => {
        try {
          if (!isAdmin) {
            resolve(Service.rejectResponse('Unauthorized', 401))
          }

          groupObj = groupObj.body
          if (groupObj.id == undefined || groupObj.id == null) {
            groupObj.id = 0
          }

          Group.findOne({
            where: {
              id: groupObj.id,
            },
          })
            .then(group => {
              if (group == null) {
                resolve(Service.rejectResponse('group not found', 400))
              } else {
                group.name = groupObj.name
                group.save().then(() => {
                  resolve(Service.successResponse(group));
                });
              }
            })
            .catch(err => {
              resolve(Service.rejectResponse('problem communicating with database: ' + err, 500))
            });
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
