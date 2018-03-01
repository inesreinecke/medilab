
<template>
  <div class="side">
    <!-- Station was selected -->
    <div v-if="state === 'station'">
      <h3>Station: {{sidebarData.selectedStation.title}}</h3>
    </div>

    <!-- Room was selected -->
    <div v-if="state.startsWith('room') == true">
      <h3>Room: {{sidebarData.selectedRoom.title}}</h3>
      <div v-if="state === 'room'">
        <div class='button' v-on:click="displayCheckin()">Checkin Patient</div>
      </div>

      <div v-if="state === 'roomCheckin'">
        <select class='dropDown' v-model="selectedPatient">
          <option class='dropDown' v-for="(patient) in Patients" v-bind:key="patient.id" v-bind:value="patient.serial">{{patient.firstName + " " + patient.lastName}}</option>
        </select>
        <div class='button' v-on:click="executeCheckin()">Checkin now!</div>
      </div>
    </div>

    <!-- Patient was selected -->
    <div v-if="state === 'patient'">
      <h3>Patient: {{sidebarData.selectedPatient.firstName + " " + sidebarData.selectedPatient.lastName}}</h3>
    </div>

    <!-- New Patient should be entered -->
    <div v-if="state === 'patientNew'">
      <h3>New Patient:</h3>
      <div class="row">
        <div class="paramName">First Name</div>
        <input class="param" type="text" v-model="newPatient.firstName">
      </div>
      <div class="row">
        <div class="paramName">Last Name</div>
        <input class="param" type="text" v-model="newPatient.lastName">
      </div>
      <div class="row">
        <div class="paramName">Birthday (YYYY-MM-DD)</div>
        <input class="param" type="text" v-model="newPatient.birthday">
      </div>
      <div class="row"> 
        <div class="paramName">Sex</div>
          <select class='dropDown' v-model="newPatient.sex">
            <option class='dropDown'>female</option>
            <option class='dropDown'>male</option>
          </select>
      </div>

      <button class='button' @click="createPatient()" :disabled="validateInputData()">Create Patient!</button>
    </div>

  </div>

</template>

<script>
import gql from 'graphql-tag'

function isValidDate (dateString) {
  if (dateString != null) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/
    if (!dateString.match(regEx)) return false
    var d = new Date(dateString)
    if (!d.getTime() && d.getTime() !== 0) return false
    return d.toISOString().slice(0, 10) === dateString
  }
  return false
}

export default {
  name: 'sidebar',
  data () {
    return {
      sidebarData: {
        selectedStation: null,
        selectedRoom: null,
        selectedPatient: null
      },
      state: 'none',
      selectedPatient: {},
      newPatient: {},
      Patients: []
    }
  },
  created: function () {
    console.log('sidebar created')

    // Listen for the i-got-clicked event and its payload.
    this.$eventHub.$on('resetSidebar', item => {
      console.log('event:resetSidebar')
      this.sidebarData.selectedStation = null
      this.sidebarData.selectedRoom = null
      this.sidebarData.selectedPatient = null
      this.state = 'none'
    })
    this.$eventHub.$on('station-selected', item => {
      console.log('event:station-selected')
      this.sidebarData.selectedStation = item
      this.state = 'station'
    })
    this.$eventHub.$on('room-selected', item => {
      console.log('event:room-selected')
      this.sidebarData.selectedRoom = item
      this.state = 'room'
    })
    this.$eventHub.$on('patient-selected', item => {
      console.log('event:patient-selected')
      this.sidebarData.selectedPatient = item
      this.state = 'patient'
    })
    this.$eventHub.$on('patient-new', item => {
      this.sidebarData.selectedPatient = null
      this.state = 'patientNew'
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
      this.state = 'roomCheckin'
      console.log(this.Patients)
    },
    executeCheckin: function () {
      this.state = 'room'

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
    },
    validateInputData: function () {
      if (!this.newPatient.firstName) return true
      if (!this.newPatient.lastName) return true
      if (!isValidDate(this.newPatient.birthday)) return true
      if (!this.newPatient.sex) return true
      return false
    },
    createPatient: function () {
      console.log('create patient: ' + this.newPatient.birthday)

      // fire mutation to create patient
      this.$apollo.mutate({
        mutation: gql`mutation addNewPatient($firstName:String!, $lastName:String!, $birthday:String!, $sex:String!) {
          addNewPatient(firstName: $firstName, lastName: $lastName, birthday: $birthday, sex: $sex) {
            id
          }
        }`,
        variables: {
          firstName: this.newPatient.firstName,
          lastName: this.newPatient.lastName,
          birthday: this.newPatient.birthday,
          sex: this.newPatient.sex
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

.side .button {
    background-color: #4CAF50; 
    border: none;
    color: white;
    width: 100%;
    padding: 10px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
}

.side .button:disabled{
    background-color: rgb(122, 122, 122); 
}


.side .dropDown  {
    outline: 0;
    overflow: hidden;
    height: 40px;
    padding: 10px 32px;
    border: #2c343c;
    background: #ededed;
    padding: 5px 3px 5px 10px;
    width: 100%;
}

.side .row {
    position: relative;
    display: flex;
    flex-flow: row wrap;
    margin-bottom: 2px;
    width: 100%;
}

.side .paramName {
  padding: 10px;
  background: #a8a8a8;
  width: 100%;
}

.side .param {
  padding: 10px;
  width: 100%
}

</style>
