/* eslint-disable no-unused-vars */
const Service = require('./Service');
var conn = require('../database/sequelize').conn;
var Person = require('../database/sequelize').Person;
var GroupNotify = require('../database/sequelize').GroupNotify;

const QueryTypes = require('sequelize');

const ADMIN_ROLE = 1;
const GROUP_ADMIN_ROLE = 2;
const VIEWER_ROLE = 3;

function isSiteAdmin(person) {
  //TODO verify user is admin, return true or false
  return true;
}

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
          if (!isSiteAdmin) {
            resolve(Service.rejectResponse('Unauthorized', 401))
          }

          const person = await Person.findOne({
            where: {
              id: userId,
            },
          })
            .catch(err => {
              resolve(Service.rejectResponse('problem communicating with the db' + err));
            })

          if (person == null) {
            resolve(Service.rejectResponse('Person not found', 405));
          }
          person.destroy()
            .then(() => {
              resolve(Service.successResponse('Successfully deleted person'));
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
   * admin - get group user list
   *
   * groupId Integer group Id of user list
   * returns List
   **/
  static userAdminListGroupIdGET({ groupId }) {
    return new Promise(
      async (resolve) => {
        try {
          if (!isSiteAdmin) {
            resolve(Service.rejectResponse('Unauthorized', 401))
          }
          let response = "["
          const people = await conn.query(
            'SELECT DISTINCT p.id, p.firstname, p.lastname, p.email, g.name, pg.notification FROM person p JOIN `person_group` pg ON p.id = pg.person_id JOIN `groups` g ON pg.group_id = g.id WHERE g.id = :group_Id AND p.role_id NOT IN (1,2)',
            {
              replacements: { group_Id: groupId },
              type: QueryTypes.SELECT
            }
          )
          .catch(err => {
            resolve(Service.rejectResponse('ERROR: error connecting to database'))
          })

          people[0].forEach((person) => {
            let personObj = {
              id: person['id'],
              firstName: person['firstname'],
              lastName: person['lastname'],
              email: person['email'],
              groups: {
                id: groupId,
                name: person['name'],
                notification: person['notification']
              }
            }
            response += JSON.stringify(personObj) + ","
          })
          response = response.replace(/.$/, "]")
          resolve(Service.successResponse(response, 200))
        } catch (e) {
          resolve(Service.rejectResponse(
            e.message || 'Invalid input',
            e.status || 405,
          ))
        }
      },
    )
  }

  /**
   * admin - create user
   *
   * person Person Person object to be added
   * no response value expected for this operation
   **/
  static userAdminPOST(person) {
    return new Promise(
      async (resolve) => {
        try {
          if (!isSiteAdmin) {
            resolve(Service.rejectResponse('Unauthorized', 401))
          }

          person = person.body
          if (person.id == undefined || person.id == null) {
            person.id = 0
          }

          if (person.password === '' || person.password == null || person.password == undefined) {
            // resolve(Service.rejectResponse('password required', 401))
            person.password = '' //TODO remove this for login
          }

          if (person.email === '' || person.email == null || person.email == undefined) {
            resolve(Service.rejectResponse('email required', 401))
          }

          Person.findOne({
            where: {
              email: person.email,
            },
          })
            .then(user => {
              if (user != null) {
                resolve(Service.rejectResponse('email already in use', 400))
              } else {
                var roleId = VIEWER_ROLE
                if (person.isAdmin != undefined && person.isAdmin != null) {
                  if (person.isAdmin == true || person.isAdmin == 1) {
                    roleId = GROUP_ADMIN_ROLE
                  }
                }
                Person.create({
                  firstname: person.firstName,
                  lastname: person.lastName,
                  email: person.email,
                  password: person.password, //TODO make it the hashed password
                  role_id: roleId
                }).then(personCreated => {
                  person.groups.forEach((group) => {
                    if (group.notification == "false" || group.notification == 0) {
                      group.notification = 0
                    }
                    else {
                      group.notification = 1
                    }
                    GroupNotify.create({
                      person_id: personCreated.id,
                      group_id: group.id,
                      notification: group.notification,
                    })
                      .catch(err => {
                        resolve(Service.rejectResponse('error creating person group settings: ' + err));
                      })
                  })
                  resolve(Service.successResponse('Created Person'));
                })
                // })
                // .catch(err => {
                //   resolve(Service.rejectResponse('error creating person group settings: ' + err));
                // })
              }
            })
            .catch(err => {
              resolve(Service.rejectResponse('problem communicating with database: ' + err, 500))
            });
        } catch (e) {
          resolve(Service.rejectResponse(
            e.message || 'Invalid input',
            e.status || 405,
          ))
        }
      },
    )
  }

  /**
   * admin - update user
   *
   * person Person object to be updated
   * no response value expected for this operation
   **/
  static userAdminPUT(person) {
    return new Promise(
      async (resolve) => {
        try {
          if (!isSiteAdmin) {
            resolve(Service.rejectResponse('Unauthorized', 401))
          }

          person = person.body
          if (person.id == undefined || person.id == null) {
            person.id = 0
          }

          Person.findOne({
            where: {
              id: person.id,
            },
          })
            .then(user => {
              if (user == null) {
                resolve(Service.rejectResponse('user not found', 400))
              } else {
                //update user info
                if (person.firstName !== undefined && person.firstName != null) {
                  user.firstname = person.firstName
                }
                if (person.lastName !== undefined && person.lastName != null) {
                  user.lastname = person.lastName
                }
                if (person.email !== undefined && person.email != null) {
                  user.email = person.email
                }
                if (person.password !== undefined && person.password != null) {
                  user.password = person.password
                }
                if (person.isAdmin != undefined && person.isAdmin != null) {
                  if (person.isAdmin == true || person.isAdmin == 1) {
                    user.role_id = GROUP_ADMIN_ROLE
                  }
                  else {
                    user.role_id = VIEWER_ROLE
                  }
                }

                var groupIdArr = []

                user.save().then(() => {
                  //update or create group assignments
                  person.groups.forEach((group) => {
                    groupIdArr.push(group.id)
                    GroupNotify.findOne({
                      where: {
                        person_id: user.id,
                        group_id: group.id
                      },
                    })
                      .then(groupNotify => {
                        if (groupNotify != null) {
                          if (group.notification == "false" || group.notification == 0) {
                            group.notification = 0
                          }
                          else {
                            group.notification = 1
                          }
                          groupNotify.notification = group.notification
                          groupNotify.save()
                        }
                        else {
                          GroupNotify.create({
                            person_id: user.id,
                            group_id: group.id,
                            notification: group.notification,
                          })
                            .catch(err => {
                              resolve(Service.rejectResponse('error creating person group settings: ' + err));
                            })
                        }
                      })
                      .catch(err => {
                        resolve(Service.rejectResponse('error updating person group settings: ' + err))
                      })
                  })

                  // delete unused group assignments
                  //sequelize destroy method bug required raw query here
                  conn.query('DELETE pg FROM person_group pg JOIN person p ON p.id = pg.person_id WHERE person_id = :personId AND group_id NOT IN (:groupIdArr) AND p.role_id != :adminRole',
                    {
                      replacements: {
                        personId: user.id,
                        groupIdArr: groupIdArr.toString(),
                        adminRole: ADMIN_ROLE
                      },
                      type: QueryTypes.DELETE
                    }
                  )
                  resolve(Service.successResponse('Updated Person'))
                })
              }
            })
            .catch(err => {
              resolve(Service.rejectResponse('problem communicating with database: ' + err, 500))
            })
        } catch (e) {
          resolve(Service.rejectResponse(
            e.message || 'Invalid input',
            e.status || 405,
          ))
        }
      },
    )
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
          if (!isSiteAdmin) {
            resolve(Service.rejectResponse('Unauthorized', 401))
          }
          const groups = await conn.query(
            'SELECT g.id, g.name, pg.notification FROM groups g JOIN person_group pg ON g.id = pg.group_id AND pg.person_id = :personId',
            {
              replacements: { personId: userId },
              type: QueryTypes.SELECT
            })

          Person.findOne({
            where: {
              id: userId,
            },
          })
            .then(user => {
              if (user != null) {
                var userObj = {
                  id: user.id,
                  email: user.email,
                  firstName: user.firstname,
                  lastName: user.lastname,
                  groups: [""]
                }
                userObj.groups = groups[0];

                resolve(Service.successResponse(JSON.stringify(userObj)))
              } else {
                resolve(Service.successResponse('Invalid ID: No user found'))
              }
            })
            .catch(err => {
              resolve(Service.successResponse('problem communicating with db: ' + err))
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

module.exports = SiteAdminService;
