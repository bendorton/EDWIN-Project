<template>
  <div class="dashboard">
    <h1 large class="display-3 text-center pa-8" center>Woodland Hills</h1>
    <v-layout align-center justify-center row fill-height>
      <v-expansion-panels accordion hover style="maxWidth: 800px;">
        <v-expansion-panel v-for="camera in finalCameras" :key="camera.id">
          <v-expansion-panel-header disable-icon-rotate>
            <template v-slot:actions>
              <v-icon v-if="camera.status === 'good'" color="teal">check_circle</v-icon>
              <v-icon v-else-if="camera.status === 'offline'" color="warning">warning</v-icon>
              <v-icon v-else-if="camera.status === 'alert'" color="error">error</v-icon>
              <v-icon v-else color="#2196F3">info</v-icon>
            </template>
            {{camera.name}}
          </v-expansion-panel-header>
          <v-expansion-panel-content class="grey--text">
            <v-card
              class="mx-auto"
              outlined
            >
              <v-list-item three-line>
                <v-list-item-content>
                  <div class="overline mb-4">{{ camera.name }}, {{camera.coordinates}}</div>
                  <v-list-item-title class="headline mb-1">{{ camera.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-alert v-if="camera.status === 'good'" text color="teal">The camera status is {{camera.status}}</v-alert>
                    <v-alert v-else-if="camera.status === 'offline'" text color="warning">The camera status is {{camera.status}}</v-alert>
                    <v-alert v-else-if="camera.status === 'alert'" text color="error">The camera status is {{camera.status}}</v-alert>
                    <v-alert v-else text color="#2196F3">The camera status is unknown</v-alert>
                  </v-list-item-subtitle>
                  <span class="pl-4 pa-1 pb-2">View on <a :href="`https://www.google.com/maps/search/?api=1&query=${camera.coordinates}`" target="_blank">Google Maps</a></span>
                </v-list-item-content>
              </v-list-item>
              <v-list-item three-line v-if="camera.streams.length > 0" >
                <v-list-item-content>
                  <v-list-item-title class="headline mb-1">Streams</v-list-item-title>
                    <videoPlayer
                      :options="camera.streams[0].fullStream">
                    </videoPlayer>
                </v-list-item-content> 
              </v-list-item>
              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-title class="headline mb-1" v-if="getActiveAlerts(camera.alerts, camera)">Alerts</v-list-item-title>
                  <v-list-item-title class="headline mb-1" v-else>No Active Alerts</v-list-item-title>
                  <v-list-item-subtitle v-for="alerts in camera.alerts" :key="alerts.id">
                    <v-alert v-if="alerts.alert_status !== 'dismissed'" 
                      text 
                      v-bind:color="alerts.color" 
                      dismissible 
                      @input="dismissAlert(alerts.id, alerts.camera_id, alerts.alert_type), getAlertCount(alerts.id), dismissedAlert = true, dismissedAlertId = alerts.id"
                    >
                      {{alerts.alert_type}}, {{alerts.message}}
                    </v-alert>
                  </v-list-item-subtitle>
                </v-list-item-content> 
              </v-list-item>
            </v-card>
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
import {HTTP} from '@/api/http-common';
import {videoPlayer} from 'vue-videojs7'

export default {
  data() {
    return{
      finalCameras: [],
      playerOptions: {
        // videojs and plugin options
        height: '360',
        autoplay: false,
        sources: {
          type: "application/x-mpegURL",
          src: "http://69.162.231.249:4040/stream/d471ec7b-771e-418c-87ab-cb1c003f5ad0/index.m3u8"
        }
      },
      generalURL: 'http://69.162.231.249:4040',
      streamURLdone: '',
      loggedInUserCameras: [],
      dismissedAlert: false,
      dismissedAlertId: '',
      oldCamers: [
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
              "alert_type": "High Temperature",
              "message": "High Temp Message",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/hightemp"
            },
            {
              "id": 1,
              "cameraId": 0,
              "status": "dismissed",
              "alert_type": "Rapid rise in temperature",
              "message": "Rapid rise in Temp message",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/rapidrise"
            },
            {
              "id": 2,
              "cameraId": 0,
              "status": "dismissed",
              "alert_type": "Danger",
              "message": "DANGER DANGER",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/danger"
            },
            {
              "id": 3,
              "cameraId": 0,
              "status": "deleted",
              "alert_type": "Danger",
              "message": "DANGER DANGER",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/danger"
            }
          ],
          streams: [
            {
              id: 0,
              url: "http://69.162.231.249:4040/stream/d471ec7b-771e-418c-87ab-cb1c003f5ad0/index.m3u8",
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
              "alert_type": "High Temperature",
              "message": "High Temp Message",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/hightemp"
            },
            {
              "id": 5,
              "cameraId": 1,
              "status": "dismissed",
              "alert_type": "Rapid rise in temperature",
              "message": "Rapid rise in Temp message",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/rapidrise"
            },
            {
              "id": 6,
              "cameraId": 1,
              "status": "dismissed",
              "alert_type": "Danger",
              "message": "DANGER DANGER",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/danger"
            },
            {
              "id": 7,
              "cameraId": 1,
              "status": "deleted",
              "alert_type": "Danger",
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
              "alert_type": "High Temperature",
              "message": "High Temp Message",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/hightemp"
            },
            {
              "id": 9,
              "cameraId": 2,
              "status": "dismissed",
              "alert_type": "Rapid rise in temperature",
              "message": "Rapid rise in Temp message",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/rapidrise"
            },
            {
              "id": 10,
              "cameraId": 2,
              "status": "dismissed",
              "alert_type": "Danger",
              "message": "DANGER DANGER",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/danger"
            },
            {
              "id": 11,
              "cameraId": 2,
              "status": "deleted",
              "alert_type": "Danger",
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
              "alert_type": "High Temperature",
              "message": "High Temp Message",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/hightemp"
            },
            {
              "id": 13,
              "cameraId": 3,
              "status": "dismissed",
              "alert_type": "Rapid rise in temperature",
              "message": "Rapid rise in Temp message",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/rapidrise"
            },
            {
              "id": 14,
              "cameraId": 3,
              "status": "dismissed",
              "alert_type": "Danger",
              "message": "DANGER DANGER",
              "timeStamp": "2020-03-05T15:58:04.186Z",
              "filePath": "/camera/id/alert/danger"
            },
            {
              "id": 15,
              "cameraId": 3,
              "status": "deleted",
              "alert_type": "Danger",
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
  created() {
    this.getLoggedInUserCameras().then(() =>{
      let generalURL = this.generalURL
      let finalCameraStreams = this.loggedInUserCameras
      finalCameraStreams.forEach(function(camera){
        if(camera.streams.length){
          camera.streams.forEach(function(stream){
            let url = generalURL + stream.url
            stream.fullStream = {
              height: '360',
              autoplay: false,
              sources: {
                type: "application/x-mpegURL",
                src: url
              }
            }
            console.log('NEW STREAM:',JSON.stringify(stream))
          })
        }

      })
      this.finalCameras = finalCameraStreams
    }).catch(e => {
      console.log(e)
    });
  },
  methods: {
    getLoggedInUserCameras: function(){
      return HTTP.get(`/camera/list/1`).then(response => {
        this.loggedInUserCameras = response.data
        //console.log('Get cameras for logged in user: ', JSON.stringify(this.loggedInUserCameras))
      })
    },
    getActiveAlerts: function(alerts, camera) {
      let counter = 0;
      alerts.forEach(function(alert){
        if(alert.alert_status !== 'dismissed'){
          counter++;
          HTTP.put('/camera', {
            "id": camera.id,
            "status": "alert"
          }).catch(function (error) {
            console.log(error);
          });
          //camera.status = 'alert'
        }
        if(alert.alert_type === 'High Temperature'){
          alert.color = 'yellow darken-3'
        }
        else if(alert.alert_type === 'Rapid Rise in Temperature'){
          alert.color = 'orange darken-3'
        }
        else if(alert.alert_type === 'Danger'){
          alert.color = 'red darken-2'
        }
        else{
          alert.color = '#2196F3'
        }
      })
      if(counter === 0){
        camera.status = 'good';
        HTTP.put(`/camera`, {
          "id": camera.id,
          "status": "good",
        }).catch(function (error) {
          console.log(error);
        });
      }
      return counter;
    },
    getAlertCount (alert) {
      if (this.selected.includes(alert)) {
        // Removing the alert
        this.selected.splice(this.selected.indexOf(alert), 1);
      } else {
        this.selected.push(alert);
      }
    },
    dismissAlert (alertId, cameraId, alertType) {
      //console.log('Alert to dismiss: ', alertId, " on camera ", cameraId, " with alert type of ", alertType)
      HTTP.put(`/alert`, {
        "id": alertId,
        "cameraId": cameraId,
        "status": "dismissed",
        "alertType": alertType

      }).then(response => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  },
  components: {
    videoPlayer
  }

}
</script>
