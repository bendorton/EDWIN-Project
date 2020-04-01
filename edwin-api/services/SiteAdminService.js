/* eslint-disable no-unused-vars */
const Service = require('./Service');
var conn = require('../database/sequelize').conn;
var Person = require('../database/sequelize').Person;
var GroupNotify = require('../database/sequelize').GroupNotify;
var PersonRoleAssign = require('../database/sequelize').PersonRoleAssign;
var bcrypt = require('bcrypt');

const BCRYPT_SALT_ROUNDS = 12;
const QueryTypes = require('sequelize');

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
            'SELECT DISTINCT p.id, p.firstname, p.lastname, p.email, pg.notification FROM person p JOIN `person_group` pg ON p.id = pg.person_id AND pg.group_id = :group_Id',
            {
              replacements: { group_Id: groupId },
              type: QueryTypes.SELECT
            }
          )

          people[0].forEach((person) => {
            let personObj = {
              id: person['id'],
              firstName: person['firstname'],
              lastName: person['lastname'],
              email: person['email'],
              groups: {
                id: groupId,
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

          if (person.password === '' || person.email === '') {
            resolve(Service.rejectResponse('email and password required', 401))
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
                // bcrypt
                //   .hash(person.password, BCRYPT_SALT_ROUNDS)
                //   .then(function (hashedPassword) {
                Person.create({
                  firstname: person.firstName,
                  lastname: person.lastName,
                  email: person.email,
                  password: person.password, //TODO make it the hashed password
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

                  if (person.isAdmin != undefined && person.isAdmin != null) {
                    if (person.isAdmin == true || person.isAdmin == 1) {
                      PersonRoleAssign.create({
                        person_id: personCreated.id,
                        role: 2
                      })
                        .catch(err => {
                          resolve(Service.rejectResponse('error creating person role assignment: ' + err));
                        })
                    }
                  }
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
                user.firstname = person.firstName
                user.lastname = person.lastName
                user.email = person.email
                if (person.password !== undefined && person.password != null) {
                  user.password = person.password
                }
                user.save().then(() => {
                  person.groups.forEach((group) => {
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

                  if (person.isAdmin != undefined && person.isAdmin != null) {
                    if (person.isAdmin == true || person.isAdmin == 1) {
                      PersonRoleAssign.create({
                        person_id: user.id,
                        role: 2
                      })
                        .catch(err => {
                          resolve(Service.rejectResponse('error updating person role assignment: ' + err));
                        })
                    } else {
                      PersonRoleAssign.findOne({
                        where: {
                          person_id: user.id
                        }
                      })
                      .then(personAssign => {
                        personAssign.destroy()
                        .catch(err => {
                          resolve(Service.rejectResponse('error updating person role assignment: ' + err));
                        })
                      })
                      .catch(err => {
                        resolve(Service.rejectResponse('error updating person role assignment: ' + err));
                      })
                    }
                  }
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
