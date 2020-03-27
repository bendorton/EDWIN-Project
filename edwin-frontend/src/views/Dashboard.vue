<template>
  <div class="dashboard">
    <h1 large class="display-3 text-center pa-8" center>Woodland Hills</h1>
    <v-layout align-center justify-center row fill-height>
      <v-expansion-panels accordion hover style="maxWidth: 800px;">
        <v-expansion-panel v-for="cameras in myCameras" :key="cameras.id">
          <v-expansion-panel-header disable-icon-rotate>
            <template v-slot:actions>
              <v-icon v-if="cameras.status === 'good'" color="teal">check_circle</v-icon>
              <v-icon v-else-if="cameras.status === 'offline'" color="warning">warning</v-icon>
              <v-icon v-else-if="cameras.status === 'alert'" color="error">error</v-icon>
              <v-icon v-else color="#2196F3">info</v-icon>
            </template>
            {{cameras.name}}
          </v-expansion-panel-header>
          <v-expansion-panel-content class="grey--text">
            <!-- <v-card>  v-if="cameras.streams.length > 3" -->
              <v-card
                class="mx-auto"
                outlined
              >
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="overline mb-4">{{ cameras.name }}, {{cameras.ipAddress}}, {{cameras.streams[0].streamType}} stream</div>
                    <v-list-item-title class="headline mb-1">{{ cameras.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-alert v-if="cameras.status === 'good'" text color="teal">The camera status is {{cameras.status}}</v-alert>
                      <v-alert v-else-if="cameras.status === 'offline'" text color="warning">The camera status is {{cameras.status}}</v-alert>
                      <v-alert v-else-if="cameras.status === 'alert'" text color="error">The camera status is {{cameras.status}}</v-alert>
                      <v-alert v-else text color="#2196F3">The camera status is unknown</v-alert>
                    </v-list-item-subtitle>
                    <span class="pl-4 pa-1 pb-2">View on <a :href="`https://www.google.com/maps/search/?api=1&query=${cameras.coordinates}`" target="_blank">Google Maps</a></span>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item three-line >
                  <v-list-item-content>
                    <v-list-item-title class="headline mb-1">Streams</v-list-item-title>
                    <v-list-item-subtitle v-for="streams in cameras.streams" :key="streams.id">
                      <iframe v-if="streams.streamType === 'HD'" width="560" height="315" v-bind:src="streams.url" frameborder="0"/>
                      <iframe v-if="streams.streamType === 'Thermal'" width="560" height="315" v-bind:src="streams.url" frameborder="0"/>
                    </v-list-item-subtitle>
                  </v-list-item-content> 
                </v-list-item>
                <v-list-item three-line>
                  <v-list-item-content>
                    <v-list-item-title class="headline mb-1" v-if="cameras.alerts.length !== selected.length">Alert Histroy ({{cameras.alerts.length - selected.length}})</v-list-item-title>
                    <v-list-item-title v-else class="headline mb-1">No Recent Alerts</v-list-item-title>
                    <v-list-item-subtitle v-for="alerts in cameras.alerts" :key="alerts.id">
                      <v-alert v-if="alerts.alertType === 'High Temperature'" 
                        text color="yellow darken-3" 
                        dismissible 
                        @input="dismissAlert(alerts.id), getAlertCount(alerts.id), dismissedAlert = true, dismissedAlertId = alerts.id"
                      >
                        A {{alerts.alertType}} has been detected
                      </v-alert>
                      <v-alert v-else-if="alerts.alertType === 'Rapid rise in temperature'" 
                        text color="orange darken-3" 
                        dismissible 
                        @input="dismissAlert(alerts.id), getAlertCount(alerts.id), dismissedAlert = true, dismissedAlertId = alerts.id"
                      >
                        A {{alerts.alertType}} has been detected
                      </v-alert>
                      <v-alert v-else-if="alerts.alertType === 'Danger'" 
                        text color="red darken-2" 
                        dismissible 
                        @input="dismissAlert(alerts.id), getAlertCount(alerts.id), dismissedAlert = true, dismissedAlertId = alerts.id"
                      >
                        A {{alerts.alertType}} has been detected
                      </v-alert>
                      <v-alert v-else 
                        text color="#2196F3" 
                        dismissible 
                        @input="dismissAlert(alerts.id), getAlertCount(alerts.id), dismissedAlert = true, dismissedAlertId = alerts.id"
                      >
                        A {{alerts.alertType}} has been detected
                      </v-alert>
                    </v-list-item-subtitle>
                  </v-list-item-content> 
                </v-list-item>
              </v-card>
            <!-- </v-card> -->
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-layout>
    <v-snackbar
      v-model="dismissedAlert"
      top
      :timeout="3000"
    >
      Alert with ID of {{dismissedAlertId}} has been dismissed
      <v-btn
        color="red"
        text
        @click="dismissedAlert = false"
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
    return{
      dismissedAlert: false,
      dismissedAlertId: '',
      cameras: [
        {
          id: 0,
          name: "Fire Department North",
          groupId: 0,
          coordinates: "40.0116236, -111.6503782",
          ipAddress: "198.51.100.42",
          status: "good",
          alerts: [
            {
              "id": 0,
              "cameraId": 0,
              "status": "active",
              "alertType": "High Temperature",
              "message": "High Temp Message",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/hightemp"
            },
            {
              "id": 1,
              "cameraId": 0,
              "status": "dismissed",
              "alertType": "Rapid rise in temperature",
              "message": "Rapid rise in Temp message",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/rapidrise"
            },
            {
              "id": 2,
              "cameraId": 0,
              "status": "dismissed",
              "alertType": "Danger",
              "message": "DANGER DANGER",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/danger"
            },
            {
              "id": 3,
              "cameraId": 0,
              "status": "deleted",
              "alertType": "Danger",
              "message": "DANGER DANGER",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/danger"
            }
          ],
          streams: [
            {
              id: 0,
              url: "https://rtsp.me/embed/HySsFh8T/",
              streamType: "HD"
            }
          ]
        },
        {
          id: 1,
          name: "Fire Department West",
          groupId: 0,
          coordinates: "40.0116236, -111.6503782",
          ipAddress: "198.51.100.43",
          status: "alert",
          alerts: [
            {
              "id": 4,
              "cameraId": 1,
              "status": "active",
              "alertType": "High Temperature",
              "message": "High Temp Message",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/hightemp"
            },
            {
              "id": 5,
              "cameraId": 1,
              "status": "dismissed",
              "alertType": "Rapid rise in temperature",
              "message": "Rapid rise in Temp message",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/rapidrise"
            },
            {
              "id": 6,
              "cameraId": 1,
              "status": "dismissed",
              "alertType": "Danger",
              "message": "DANGER DANGER",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/danger"
            },
            {
              "id": 7,
              "cameraId": 1,
              "status": "deleted",
              "alertType": "Danger",
              "message": "DANGER DANGER",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/danger"
            }
          ],
          streams: [
            {
              id: 1,
              url: "testurl",
              streamType: "Thermal"
            }
          ]
        },
        {
          id: 2,
          name: "Fire Department East",
          groupId: 0,
          coordinates: "40.0116236, -111.6503782",
          ipAddress: "198.51.100.44",
          status: "offline",
          alerts: [
            {
              "id": 8,
              "cameraId": 2,
              "status": "active",
              "alertType": "High Temperature",
              "message": "High Temp Message",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/hightemp"
            },
            {
              "id": 9,
              "cameraId": 2,
              "status": "dismissed",
              "alertType": "Rapid rise in temperature",
              "message": "Rapid rise in Temp message",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/rapidrise"
            },
            {
              "id": 10,
              "cameraId": 2,
              "status": "dismissed",
              "alertType": "Danger",
              "message": "DANGER DANGER",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/danger"
            },
            {
              "id": 11,
              "cameraId": 2,
              "status": "deleted",
              "alertType": "Danger",
              "message": "DANGER DANGER",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/danger"
            }
          ],
          streams: [
            {
              id: 2,
              url: "https://rtsp.me/embed/HySsFh8T/",
              streamType: "HD"
            }
          ]
        },
        {
          id: 3,
          name: "Fire Department South",
          groupId: 0,
          coordinates: "40.0116236, -111.6503782",
          ipAddress: "198.51.100.45",
          status: "",
          alerts: [
            {
              "id": 12,
              "cameraId": 3,
              "status": "active",
              "alertType": "High Temperature",
              "message": "High Temp Message",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/hightemp"
            },
            {
              "id": 13,
              "cameraId": 3,
              "status": "dismissed",
              "alertType": "Rapid rise in temperature",
              "message": "Rapid rise in Temp message",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/rapidrise"
            },
            {
              "id": 14,
              "cameraId": 3,
              "status": "dismissed",
              "alertType": "Danger",
              "message": "DANGER DANGER",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/danger"
            },
            {
              "id": 15,
              "cameraId": 3,
              "status": "deleted",
              "alertType": "Danger",
              "message": "DANGER DANGER",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/danger"
            }
          ],
          streams: [
            {
              id: 3,
              url: "https://rtsp.me/embed/HySsFh8T/",
              streamType: "HD"
            }
          ]
        },
      ],
      selected: [],
    }
  },
  methods: {
    //Set the camera type based on the status of the cameras. This 'type' is used for coloring 
    checkCameraStatus: function(){
      this.cameras.forEach(cam => {
        switch(cam.status){
          case 'good':
            cam.type = 'success'
            break;
          case 'offline':
            cam.type = 'warning'
            break;
          case 'alert':
            cam.type = 'error'
            break;
          default:
            cam.type = 'info'
            break;
        }
      });
    },
    getAlertCount (alert) {
      if (this.selected.includes(alert)) {
        // Removing the alert
        this.selected.splice(this.selected.indexOf(alert), 1);
      } else {
        this.selected.push(alert);
      }
    },
    dismissAlert (id) {
      console.log('Alert to dismiss: ', id)
      //this.cameras[0].alerts[id].status = 'dismissed'
    }
  },
  // watch: {
  //   myCameras: {
  //     handler: function (){
  //       switch(this.cameras.status){
  //         case 'good':
  //           this.cameras.type = 'success'
  //           break;
  //         case 'warning':
  //           this.cameras.type = 'warning'
  //           break;
  //         case 'error':
  //           this.cameras.type = 'error'
  //           break;
  //       }
  //     }
  //   }
  // },
  computed: {
    myCameras() {
      // return this.cameras.filter(cameras => {
      //   return cameras.status === 'Good'
      // })
      return this.cameras
    }
  }

}
</script>
