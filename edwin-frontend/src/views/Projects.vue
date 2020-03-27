<template>
  <div class="projects">
    <h1 large class="display-3 text-center pa-8" center>My Profile</h1>
    <v-card
      class="mx-auto"
      max-width="800px"
    >
      <v-card-text>
        <div>Welcome</div>
        <p class="headline text--primary">
          {{user[0].firstName}} {{user[0].lastName}}
        </p>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="saveChanges"
        >
          <v-text-field
            v-model="user[0].email"
            :rules="emailRules"
            label="Email"
            required
            :id="`${user[0].id}-email`"
          ></v-text-field>
          <p class="headline text--primary">
            Notifications
          </p>
          <v-list>
            <v-subheader v-for="(group) in user[0].groups" :key="group.id" @click.capture.stop="toggleGroup(group)">
                <v-checkbox v-model="selected" multiple :value="group" :label="group.name"></v-checkbox>
            </v-subheader>
          </v-list>
          <pre>{{ selected }}</pre>
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
      valid: true,
      selected: [],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
    }
  },
  methods: {
    saveChanges: function(formObj){
      this.selected.forEach(element => console.log(element.id));
      //console.log(this.selected)
      let value = formObj.target.elements[0]._value
      console.log('save the email to be', value)
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
