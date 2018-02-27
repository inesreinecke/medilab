
<template>
  <div class="side">
    <div v-if="sidebarData.selectedStation">
      <h3>Station: {{sidebarData.selectedStation.title}}</h3>
    </div>
    <div v-if="sidebarData.selectedRoom">
      <h3>Room: {{sidebarData.selectedRoom.title}}</h3>
      <div class='button' v-if="!stateData.displayCheckin" v-on:click="displayCheckin()">Checkin Patient</div>

      <div v-if="stateData.displayCheckin">
        <select class='dropDown' v-model="selectedPatient">
          <option class='dropDown' v-for="(patient) in Patients" v-bind:key="patient.id" v-bind:value="patient.serial">{{patient.firstName + " " + patient.lastName}}</option>
        </select>
        <div class='button' v-on:click="executeCheckin()">Checkin now!</div>
      </div>
    </div>

    <div v-if="sidebarData.selectedPatient">
      <h3>Patient: {{sidebarData.selectedPatient.patient.firstName + " " + sidebarData.selectedPatient.patient.lastName}}</h3>
    </div>
  </div>

</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'sidebar',
  data () {
    return {
      sidebarData: {
        selectedStation: null,
        selectedRoom: null,
        selectedPatient: null
      },
      stateData: {
        displayCheckin: false
      },
      selectedPatient: {},
      Patients: []
    }
  },
  created: function () {
    console.log('sidebar created')

    // Listen for the i-got-clicked event and its payload.
    this.$eventHub.$on('station-selected', item => {
      this.sidebarData.selectedStation = item
      // this.sidebarData.selectedRoom = null
      // this.sidebarData.selectedPatient = null
    })
    this.$eventHub.$on('room-selected', item => {
      this.sidebarData.selectedRoom = item
      // this.sidebarData.selectedPatient = null
    })
    this.$eventHub.$on('patient-selected', item => {
      this.sidebarData.selectedPatient = item
      // console.log(item)
    })
  },
  mounted () {
    // async load patients
    this.$apollo.query({
      query: gql`query {
        Patients {
          id
          serial
          firstName
          lastName
          initials
          birthday
          sex
        }
      }`
    }).then(({data}) => {
      this.Patients = data.Patients
    }).catch((error) => {
      console.error(error)
    })
  },
  methods: {
    displayCheckin: function () {
      this.stateData.displayCheckin = true
      console.log(this.Patients)
    },
    executeCheckin: function () {
      this.stateData.displayCheckin = false
      console.log('patientSerial: ' + this.selectedPatient)

      // query rooms for this station
      this.$apollo.mutate({
        mutation: gql`mutation checkinPatient($_stationId:ID!, $_roomId:ID!, $patientSerial:String!) {
          checkinPatient(_stationId: $_stationId, _roomId: $_roomId, patientSerial: $patientSerial) {
            id
          }
        }`,
        variables: {
          _stationId: this.sidebarData.selectedStation.id,
          _roomId: this.sidebarData.selectedRoom.id,
          patientSerial: this.selectedPatient
        }
      }
      ).then(({data}) => {
        // this.Rooms = data.RoomsByStation
        // console.log(this.checkinPatient)
      }).catch((error) => {
        console.error(error)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.side {
    //display: flex;
    //flex-direction: row-reverse;
    padding-left: 10px;
    padding-right: 10px;
    top: 0;
    width: 400px;
    background-color: #fff;
    right: 0;
    z-index: 10;
    border-left: 0 solid #fff;
}

.button {
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    width: 100%;
    padding: 10px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
}

.dropDown  {
    outline: 0;
    overflow: hidden;
    height: 40px;
    padding: 10px 32px;
    border: #2c343c;
    background: #ededed;
    padding: 5px 3px 5px 10px;
    width: 100%;
}



</style>
