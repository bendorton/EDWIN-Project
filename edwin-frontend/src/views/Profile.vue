<template>
  <div class="profile">
    <h1 large class="display-3 text-center pa-8" center>My Profile</h1>
    <v-card
      class="mx-auto"
      max-width="800px"
    >
      <v-card-text>
        <div>Welcome</div>
        <p class="headline text--primary">
          {{loggedInUser.firstName}} {{loggedInUser.lastName}}
        </p>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="saveChanges()"
        >
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field v-model="loggedInUser.email" :rules="emailRules" label="Email" required :id="`${loggedInUser.id}-email`"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field  v-model="loggedInUser.firstName" label="First Name" required :id="`${loggedInUser.id}-fName`"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field v-model="loggedInUser.lastName" label="Last Name" required :id="`${loggedInUser.id}-lName`"
              ></v-text-field>
            </v-col>
          </v-row>
          <p class="headline text--primary">
            Notifications
          </p>
          <v-list>
            <v-subheader v-for="(group) in loggedInUser.groups" :key="group.id" @click.capture.stop="toggleGroup(group)">
                <v-checkbox v-model="selected" multiple :value="group" :label="group.name"></v-checkbox>
            </v-subheader>
          </v-list>
          <v-btn
            type="submit"
            :disabled="!valid"
            class="mr-4"
            color="primary"
            small
            @click="saveUser = true"
          >
            Save
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <v-snackbar
      v-model="saveUser"
      top
      :timeout="3000"
    >
      Your information has been saved
      <v-btn
        color="red"
        text
        @click="saveUser = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
// @ is an alias to /src
import {HTTP} from '@/api/http-common';

export default {
  data() {
    return {
      saveUser: false,
      user:[
        {
          id: 0,
          firstName: "Trevor",
          lastName: "Allen",
          email: "trevor@woodlandhills.com",
          groups: [
            {
              id: 0,
              name: "Woodland Hills",
              notification: true
            },
            {
              id: 1,
              name: "Provo",
              notification: true
            }
          ]
        }
      ],
      loggedInUser: [],
      valid: true,
      selected: [],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
    }
  },
  created () {
    this.getLoggedInUser()
  },
  methods: {
    getLoggedInUser: function(){
      return HTTP.get(`user/1`).then(response => {
        this.loggedInUser = response.data
        let selectedFromStart = []
        if(this.loggedInUser.groups.length > 0){
          this.loggedInUser.groups.forEach(function(group){
            if(group.notification === 1){
              selectedFromStart.push(group)
            }
          })
        }
        this.selected = selectedFromStart
        console.log('Get logged in user: ', JSON.stringify(this.loggedInUser))
      })
    },
    saveChanges: function(){
      this.selected.forEach(location => console.log(location.id));
      //console.log(this.selected)
      //let value = this.loggedInUser.email
      console.log('save the email to be', JSON.stringify(this.loggedInUser))
      console.log(JSON.stringify(this.selected))
      let selected = this.selected
      this.loggedInUser.groups.forEach(function(startingGroup){
        if(!selected.includes(startingGroup)){
          startingGroup.notification = 0
        }
        else{
          startingGroup.notification = 1
        }
      })
      console.log("Hello?",JSON.stringify(this.loggedInUser))
      HTTP.put('/user/1', {
        "id": this.loggedInUser.id,
        "email": this.loggedInUser.email,
        "firstName": this.loggedInUser.firstName,
        "lastName": this.loggedInUser.lastName,
        "groups": this.loggedInUser.groups
      }).catch(function (error) {
        console.log(error);
      });
    },
    toggleGroup (group) {
      if (this.selected.includes(group)) {
        // Removing the group
        this.selected.splice(this.selected.indexOf(group), 1);
      } else {
        this.selected.push(group);
      }
    }
  }
  

}
</script>
