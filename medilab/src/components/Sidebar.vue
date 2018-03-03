
<template>
  <div class="side">
    <!-- Station was selected -->
    <div v-if="state === 'station'">
      <p class="heading">Station: {{sidebarData.selectedStation.title}}</p>
      any activities applicable for a single Station would go here
    </div>

    <!-- Room was selected -->
    <div v-if="state.startsWith('room') == true">
      <p class="heading">Room: {{sidebarData.selectedRoom.title}}</p>
      <div v-if="state === 'room'">

        <b-input-group prepend="Capacity">
          <b-form-input v-model="sidebarData.selectedRoom.capacity" readonly></b-form-input>
        </b-input-group>

        <hr class="breaker">
        <b-btn variant="success" v-on:click="displayCheckin()">Checkin Patient</b-btn>
      </div>

      <div v-if="state === 'roomCheckin'">
        <b-form-select v-model="selectedPatient" class="mb-3">
          <template slot="first">
            <option :value="null" disabled>Please select Patient...</option>
          </template>
          <option v-for="(patient) in Patients" v-bind:key="patient.id" v-bind:value="patient.serial">{{patient.firstName + " " + patient.lastName}}</option>
        </b-form-select>
        <b-btn variant="primary" v-on:click="executeCheckin()">Checkin!</b-btn>
      </div>
    </div>

    <!-- Patient was selected -->
    <div v-if="state === 'patient'">
      <p class="heading">Patient: {{sidebarData.selectedPatient.firstName + " " + sidebarData.selectedPatient.lastName}}</p>

      <b-container fluid>
        <b-row>
          <b-col sm="4"><p class="ownLabel">Firstname</p></b-col>
          <b-col sm="8"><b-form-input v-model="sidebarData.selectedPatient.firstName" readonly></b-form-input></b-col>
        </b-row>
        <b-row>
          <b-col sm="4"><p class="ownLabel">Lastname</p></b-col>
          <b-col sm="8"><b-form-input v-model="sidebarData.selectedPatient.lastName" readonly></b-form-input></b-col>
        </b-row>
        <b-row>
          <b-col sm="4"><p class="ownLabel">Birthday</p></b-col>
          <b-col sm="8"><b-form-input v-model="sidebarData.selectedPatient.birthday" readonly></b-form-input></b-col>
        </b-row>
        <b-row>
          <b-col sm="4"><p class="ownLabel">Sex</p></b-col>
          <b-col sm="8"><b-form-input v-model="sidebarData.selectedPatient.sex" readonly></b-form-input></b-col>
        </b-row>

      </b-container>

 
      <hr class="breaker">
      <b-btn variant="primary" v-on:click="editPatient()">Edit Patient</b-btn>
      <b-btn variant="danger" v-on:click="dismissPatient()">Dismiss Patient</b-btn>
    </div>

    <!-- New Patient should be entered -->
    <div v-if="state === 'patientNew'">
      <p class="heading">New Patient</p>
      <div class="row">
        <div class="paramName">First Name</div>
        <input class="param" type="text" v-model="newPatient.firstName">
      </div>
      <div class="row">
        <div class="paramName">Last Name</div>
        <input class="param" type="text" v-model="newPatient.lastName">
      </div>
      <div class="row">
        <div class="paramName">Birthday</div>
        <datepicker :format="customFormatter()" v-model="newPatient.birthday"></datepicker>
        <!-- <input class="param" type="text" v-model="newPatient.birthday"> -->
      </div>
      <div class="row"> 
        <div class="paramName">Sex</div>
          <select class='dropDown' v-model="newPatient.sex">
            <option class='dropDown'>female</option>
            <option class='dropDown'>male</option>
          </select>
      </div>

      <button class='button' @click="createPatient()" :disabled="isInvalidData()">Create Patient!</button>
    </div>

  </div>

</template>

<script>
import gql from 'graphql-tag'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'

export default {
  name: 'sidebar',
  components: {
    Datepicker
  },
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
    // Listen for the i-got-clicked event and its payload.
    this.$eventHub.$on('resetSidebar', item => {
      this.sidebarData.selectedStation = null
      this.sidebarData.selectedRoom = null
      this.sidebarData.selectedPatient = null
      this.state = 'none'
    })
    this.$eventHub.$on('station-selected', item => {
      this.sidebarData.selectedStation = item
      this.state = 'station'
    })
    this.$eventHub.$on('room-selected', item => {
      this.sidebarData.selectedRoom = item
      // console.log(item)
      this.state = 'room'
    })
    this.$eventHub.$on('patient-selected', item => {
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
    },
    executeCheckin: function () {
      this.state = 'room'

      // fire mutation to checkIn the patient into the given station/room
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
      }).catch((error) => {
        console.error(error)
      })
    },
    isInvalidData: function () {
      if (!this.newPatient.firstName) return true
      if (!this.newPatient.lastName) return true
      if (!this.newPatient.birthday) return true
      if (!this.newPatient.sex) return true
      return false
    },
    createPatient: function () {
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
          birthday: moment(this.newPatient.birthday).format('YYYY-MM-DD'),
          sex: this.newPatient.sex
        }
      }
      ).then(({data}) => {
        // this.Rooms = data.RoomsByStation
      }).catch((error) => {
        console.error(error)
      })
    },
    dismissPatient: function () {
      // fire mutation to checkIn the patient into the given station/room
      this.$apollo.mutate({
        mutation: gql`mutation checkinPatient($_stationId:ID!, $_roomId:ID!, $patientSerial:String!) {
          checkinPatient(_stationId: $_stationId, _roomId: $_roomId, patientSerial: $patientSerial) {
            id
          }
        }`,
        variables: {
          _stationId: this.sidebarData.selectedStation.id,
          _roomId: -1,
          patientSerial: this.sidebarData.selectedPatient.serial
        }
      }
      ).then(({data}) => {
        this.sidebarData.selectedPatient = null
        this.state = 'none'
      }).catch((error) => {
        console.error(error)
      })
    },
    editPatient: function () {
      this.state = 'patientNew'
    },
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.side {
    padding-left: 10px;
    padding-right: 10px;
    top: 0;
    width: 400px;
    background-color: rgb(213, 216, 219);
    right: 0;
    z-index: 10;
    border-left: 0 solid #fff;
}

.ownLabel {
  position: absolute;
  margin-top: 8px;
}

.heading {
  background: #414c55;
  padding: 10px;
  margin: 0px -10px 10px -10px;
  color: #fff;
}

.breaker {
  margin-left: -10px;
  margin-right: -10px;
  color: #414c55
}

select option:disabled {
    color: #000;
    font-weight: bold;
}


/** disable frame around inputs and textarea in chrome **/
textarea:focus, input:focus{
  outline-style:none;
  box-shadow:none;
  border-color:transparent;
}


</style>
