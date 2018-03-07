
<template>
  <div class="side">
    <!-- Station was selected -->
    <div v-if="state === 'station'">
      <p class="heading">Station: {{sidebarData.selectedStation.title}}</p>
      <b-container fluid>
        <b-row>
          <b-col sm="4"><p class="ownLabel">Leader</p></b-col>
          <b-col sm="8"><b-form-input v-model="sidebarData.selectedStation.leader" readonly></b-form-input></b-col>
        </b-row>
        <b-row>
          <b-col sm="4"><p class="ownLabel">Beds</p></b-col>
          <b-col sm="8"><b-form-input v-model="sidebarData.selectedStation.bedMetrics" readonly></b-form-input></b-col>
        </b-row>
        <b-row>
          <b-col sm="4"><p class="ownLabel">Utilization</p></b-col>
          <b-col sm="8"><b-form-input v-model="sidebarData.selectedStation.utilization" readonly></b-form-input></b-col>
        </b-row>
      </b-container>      
    </div>

    <!-- Room was selected -->
    <div v-if="state === 'room'">
      <p class="heading">Room: {{sidebarData.selectedRoom.title}}</p>
      <b-container fluid>
        <b-row>
          <b-col sm="4"><p class="ownLabel">Beds</p></b-col>
          <b-col sm="8"><b-form-input v-model="sidebarData.selectedRoom.bedMetrics" readonly></b-form-input></b-col>
        </b-row>
        <b-row>
          <b-col sm="4"><p class="ownLabel">Utilization</p></b-col>
          <b-col sm="8"><b-form-input v-model="sidebarData.selectedRoom.utilization" readonly></b-form-input></b-col>
        </b-row>
      </b-container>  
    </div>

    <!-- Bed was selected -->
    <div v-if="state.startsWith('bed') == true">
      <p class="heading">{{"Room: " + sidebarData.selectedBed.room.title + ", Bed: " + sidebarData.selectedBed.id}}</p>

      <div v-if="sidebarData.selectedBed.patient != null">
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
        <b-btn variant="primary" v-on:click="editPatient()">Edit</b-btn>
        <b-btn variant="danger" v-on:click="dismissPatient()">Dismiss</b-btn>
      </div>

      <div v-if="sidebarData.selectedBed.patient == null">
        <div v-if="state === 'bed'">
          <p>This bed is currently not in use</p>
          <b-btn variant="primary" v-on:click="displayCheckin()">Checkin</b-btn>
        </div>

        <div v-if="state === 'bedCheckin'">
          <p>Please select a Patient to check in</p>
          <b-form-select v-model="pickedPatientId" class="mb-3">
            <template slot="first">
              <option :value="null" disabled>Please select Patient...</option>
            </template>
            <option v-for="(patient) in Patients" v-bind:key="patient.id" v-bind:value="patient.id">{{patient.firstName + " " + patient.lastName}}</option>
          </b-form-select>
          <b-btn variant="success" :disabled="pickedPatientId ==null" v-on:click="executeCheckin()">Checkin</b-btn>
          <b-btn variant="danger" v-on:click="cancelCheckin()">Cancel</b-btn>
        </div>
      </div>
    </div>

    <!-- Existing Patient was selected -->
    <div v-if="state === 'patient'">
      <p class="heading">{{"Patient: " + sidebarData.selectedPatient.firstName + " " + sidebarData.selectedPatient.lastName}}</p>
      <b-container fluid>
        <b-row>
          <b-col sm="4"><p class="ownLabel">Firstname</p></b-col>
          <b-col sm="8"><b-form-input v-model="sidebarData.selectedPatient.firstName" :disabled="!editMode"></b-form-input></b-col>
        </b-row>
        <b-row>
          <b-col sm="4"><p class="ownLabel">Lastname</p></b-col>
          <b-col sm="8"><b-form-input v-model="sidebarData.selectedPatient.lastName" :disabled="!editMode"></b-form-input></b-col>
        </b-row>
        <b-row>
          <b-col sm="4"><p class="ownLabel">Birthday</p></b-col>
          <b-col sm="8">
            <b-form-input v-if="!editMode" v-model="sidebarData.selectedPatient.birthday" :disabled="!editMode"></b-form-input>
            <datepicker v-if="editMode" v-model="sidebarData.selectedPatient.birthday" :format="customFormatter" ></datepicker>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"><p class="ownLabel">Sex</p></b-col>
          <b-col sm="8"><b-form-select v-model="sidebarData.selectedPatient.sex" :options="sexOptions" :disabled="!editMode"/></b-col>
        </b-row>
      </b-container>

      <div v-if="!editMode">
        <hr class="breaker">
        <b-btn variant="primary" v-on:click="editPatient()">Edit</b-btn>
      </div>

      <div v-if="editMode">
        <hr class="breaker">
        <b-btn variant="success" v-on:click="savePatientEdit()" :disabled="isInvalidData()">Save</b-btn>
        <b-btn variant="danger" v-on:click="cancelPatientEdit()">Cancel</b-btn>
      </div>
    </div>
 
    <!-- New Patient should be entered -->
    <div v-if="state === 'patientNew'">
      <p class="heading">&nbsp;</p>
      <b-btn variant="primary" v-on:click="createEmptyPatient()">Admit new Patient</b-btn>
    </div>

    <!-- User Avatar was selected -->
    <div v-if="state === 'userAvatar'">
      <p class="heading">&nbsp;</p>
      <b-btn variant="danger" v-on:click="resetDB()">Reset Database</b-btn>
      <b-btn variant="primary" v-on:click="doLogout()">Logout</b-btn>
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
        selectedBed: null,
        selectedPatient: null
      },
      editMode: false,
      state: 'none',
      pickedPatientId: null,
      Patients: [],
      sexOptions: [
        'male',
        'female'
      ]
    }
  },
  apollo: {
    $subscribe: {
      Patients: {
        query: gql`subscription patients {
          Patients {
            id
            firstName
            lastName
            birthday
            sex
          }
        }`,
        result ({data}) {
          this.Patients = data.Patients
        }
      }
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
      this.sidebarData.selectedStation = JSON.parse(JSON.stringify(item))
      this.state = 'station'
    })
    this.$eventHub.$on('room-selected', item => {
      this.sidebarData.selectedRoom = JSON.parse(JSON.stringify(item))
      this.state = 'room'
    })
    this.$eventHub.$on('bed-selected', item => {
      this.sidebarData.selectedBed = JSON.parse(JSON.stringify(item))
      this.sidebarData.selectedPatient = (item.patient != null) ? JSON.parse(JSON.stringify(item.patient)) : null
      this.state = 'bed'
    })
    this.$eventHub.$on('patient-selected', item => {
      this.sidebarData.selectedPatient = JSON.parse(JSON.stringify(item))
      this.state = 'patient'
    })
    this.$eventHub.$on('patient-new', item => {
      this.state = 'patientNew'
    })
    this.$eventHub.$on('userAvatar', item => {
      this.state = 'userAvatar'
    })
  },
  mounted () {
    // async load patients
    this.$apollo.query({
      query: gql`query {
        Patients {
          id
          firstName
          lastName
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
      this.state = 'bedCheckin'
    },
    cancelCheckin: function () {
      this.state = 'bed'
    },
    executeCheckin: function () {
      this.state = 'room'
      // fire mutation to checkIn the patient into the given station/room
      this.$apollo.mutate({
        mutation: gql`mutation checkPatientIntoBed($_stationId:ID!, $_bedId:ID!, $_patientId:ID!) {
          checkPatientIntoBed(_stationId: $_stationId, _bedId: $_bedId, _patientId: $_patientId)
        }`,
        variables: {
          _stationId: this.sidebarData.selectedBed.station.id,
          _bedId: this.sidebarData.selectedBed.id,
          _patientId: this.pickedPatientId
        }
      }
      ).then(({data}) => {
        this.pickedPatientId = null
        this.state = 'none'
      }).catch((error) => {
        console.error(error)
      })
    },
    dismissPatient: function () {
      console.log(this.sidebarData.selectedBed.station.id)

      // fire mutation to checkIn the patient into the given station/room
      this.$apollo.mutate({
        mutation: gql`mutation checkPatientIntoBed($_stationId:ID!, $_bedId:ID!, $_patientId:ID!) {
          checkPatientIntoBed(_stationId: $_stationId, _bedId: $_bedId, _patientId: $_patientId)
        }`,
        variables: {
          _stationId: this.sidebarData.selectedBed.station.id,
          _bedId: -1,
          _patientId: this.sidebarData.selectedBed.patient.id
        }
      }
      ).then(({data}) => {
        this.sidebarData.selectedPatient = null
        this.state = 'none'
      }).catch((error) => {
        console.error(error)
      })
    },
    isInvalidData: function () {
      if (!this.sidebarData.selectedPatient.firstName) return true
      if (!this.sidebarData.selectedPatient.lastName) return true
      if (!this.sidebarData.selectedPatient.birthday) return true
      if (!this.sidebarData.selectedPatient.sex) return true
      return false
    },
    createEmptyPatient: function () {
      this.sidebarData.selectedPatient = {
        id: -1,
        firstName: '',
        lastName: '',
        birthday: '',
        sex: 'male'
      }
      this.state = 'patient'
      this.editMode = true
    },
    savePatientEdit: function () {
      // upsert
      // fire mutation to create patient
      this.$apollo.mutate({
        mutation: gql`mutation upsertPatient($id:ID!, $firstName:String!, $lastName:String!, $birthday:String!, $sex:String!) {
          upsertPatient(id: $id, firstName: $firstName, lastName: $lastName, birthday: $birthday, sex: $sex)
        }`,
        variables: {
          id: this.sidebarData.selectedPatient.id,
          firstName: this.sidebarData.selectedPatient.firstName,
          lastName: this.sidebarData.selectedPatient.lastName,
          birthday: moment(this.sidebarData.selectedPatient.birthday).format('YYYY-MM-DD'),
          sex: this.sidebarData.selectedPatient.sex
        }
      }
      ).then(({data}) => {
        this.editMode = false
      }).catch((error) => {
        console.error(error)
      })
    },
    editPatient: function () {
      this.state = 'patient'
      this.editMode = true
    },
    cancelPatientEdit: function () {
      this.editMode = false
      this.selectedPatient = null
      this.state = 'none'
    },
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    doLogout: function () {
      console.log('logout')
      localStorage.removeItem('isAuthenticated')
      this.$router.push('/')
    },
    resetDB: function () {
      console.log('reset db')
      this.sidebarData = {
        selectedStation: null,
        selectedRoom: null,
        selectedBed: null,
        selectedPatient: null
      }
      this.editMode = false
      this.state = 'none'
      this.pickedPatientId = null

      this.$apollo.query({
        query: gql`query { ResetDatabase }`
      }).then(({data}) => {}).catch((error) => {
        console.error(error)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

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

.vdp-datepicker input {
  padding: .375rem 0rem .225rem 0.45rem !important;
  border-radius: .25rem !important;
  border: 1px solid #ced4da !important;
  font-size: 1rem !important;
}


.vdp-datepicker__calendar {
  margin-left: -105px !important;
  width: 280px !important;
}

</style>
