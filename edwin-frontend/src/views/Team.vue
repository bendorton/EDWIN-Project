<template>
  <div class="team">
    <h1 large class="display-3 text-center pa-8" center>Group</h1>
    <div v-if="groups">
      <v-layout align-center justify-center row fill-height>
      <v-expansion-panels accordion hover multiple style="maxWidth: 800px;">
        <v-expansion-panel v-for="user in groups" :key="user.id">
          <v-expansion-panel-header disable-icon-rotate>
            <template v-slot:actions>
              <v-icon color="#2196F3">account_circle</v-icon>
            </template>
            {{user.firstName}} {{user.lastName}}
          </v-expansion-panel-header>
          <v-expansion-panel-content class="grey--text">
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              @submit.prevent="saveChanges"
            >
              <v-text-field
                v-model="user.email"
                :rules="emailRules"
                label="Email"
                required
                :id="`${user.id}-email`"
              ></v-text-field>
              <v-btn
                type="submit"
                :disabled="!valid"
                class="mr-4"
                color="primary"
                small
              >
                Save
              </v-btn>
              <v-btn
                class="mr-4"
                color="red"
                small
                dark
                absolute
                right
                @click="resetPassword(user.id), resetPass = true, resetPassUser = user.firstName + ' ' + user.lastName"
              >
                Reset Password
              </v-btn>
            </v-form>
            <!-- <v-card
              class="mx-auto"
              outlined
            >
              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-title>Email: </v-list-item-title>
                  <v-text-field
                    v-model="user.email"
                    placeholder= user.email
                    id="emailField"
                  ></v-text-field>
                  <div class="my-2">
                    <v-btn small color="primary" v-on:click="saveChanges($id.emailField)">Save</v-btn>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-card> -->
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-layout>
    </div>
    <v-snackbar
      v-model="resetPass"
      top
      :timeout="3000"
    >
      Password has been reset for {{resetPassUser}}
      <v-btn
        color="red"
        text
        @click="resetPass = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
// @ is an alias to /src
//import {HTTP} from '@/api/http-common';

export default {
  data() {
    return {
      valid: true,
      resetPass: false,
      resetPassUser: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      cameras: [],
      users: [],
      camErrors: [],
      userErrors: [],
      groups: [
        {
          id: 0,
          firstName: "Trevor",
          lastName: "Allen",
          email: "trevor@woodlandhills.com",
          groups: [
            {
              id: 0,
              name: "Woodland Hills"
            }
          ]
        },
        {
          id: 1,
          firstName: "Miranda",
          lastName: "Taylor",
          email: "miranda@woodlandhills.com",
          groups: [
            {
              id: 0,
              name: "Woodland Hills"
            }
          ]
        },
        {
          id: 2,
          firstName: "Kyle",
          lastName: "Neal",
          email: "kyle@woodlandhills.com",
          groups: [
            {
              id: 0,
              name: "Woodland Hills"
            }
          ]
        }
      ],
      sampleUser: [
        {
          id: 1234
        }
      ]
    }
  },
  created() {
        // HTTP.get(`user/${this.sampleUser.id}`)
        // .then(response => {
        //     this.users = response.data
        //     console.log(this.users)
        // })
        // .catch(e => {
        //     this.errors.push(e)
        // })
        // HTTP.get(`camera/list/1234`)
        // .then(response => {
        //     this.cameras = response.data
        //     console.log(JSON.stringify(this.cameras))
        // })
        // .catch(e => {
        //     this.camErrors.push(e)
        // })

    // HTTP.get(`user/admin/list/0`)
    // .then(response => {
    //     console.log(response.data)
    //     this.groups = response.data
    //     console.log(JSON.stringify(this.groups))
    // })
    // .catch(e => {
    //     this.userErrors.push(e)
    // })
  },
  mounted() {},
  methods: {
  //Set the camera type based on the status of the cameras. This 'type' is used for coloring 
    saveChanges: function(formObj){
      let value = formObj.target.elements[0]._value
      console.log('save the email to be', value)
      // let id = '' + userId
      // let test = id + '-email'
      // this.$nextTick(() => {
      //   console.log('this.refs: ',this.$refs.test)
      // });
      // console.log('save the email to be', test)
    },
    resetPassword: function(id){
      console.log('reset the password for ', id)
    }
  }
}
</script>
