
<template>
  <div class="side" v-bind:class="{ 'side--active':isOpen}">
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
         <b-btn variant="danger" v-on:click="state='patientNew'">Cancel</b-btn>
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
    <b-btn variant="secondary" class="btn-float" v-on:click="toggleSidebar()">
      <svg v-if="!isOpen" width="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><path d="M360 48H40C18 48 0 66 0 88v224c0 22 18 40 40 40h320c22 0 40-18 40-40V88c0-22-18-40-40-40zM256 336H40c-13.2 0-24-10.8-24-24V88c0-13.2 10.8-24 24-24h216v272zm128-24c0 13.2-10.8 24-24 24h-88V64h88c13.2 0 24 10.8 24 24v224z"/><path d="M48 108h8c4.4 0 8-3.6 8-8s-3.6-8-8-8h-8c-4.4 0-8 3.6-8 8s3.6 8 8 8zM84 108h8c4.4 0 8-3.6 8-8s-3.6-8-8-8h-8c-4.4 0-8 3.6-8 8s3.6 8 8 8zM120 108h8c4.4 0 8-3.6 8-8s-3.6-8-8-8h-8c-4.4 0-8 3.6-8 8s3.6 8 8 8zM340 116h-28c-4.4 0-8 3.6-8 8s3.6 8 8 8h28c4.4 0 8-3.6 8-8s-3.6-8-8-8zM340 156h-28c-4.4 0-8 3.6-8 8s3.6 8 8 8h28c4.4 0 8-3.6 8-8s-3.6-8-8-8zM340 196h-28c-4.4 0-8 3.6-8 8s3.6 8 8 8h28c4.4 0 8-3.6 8-8s-3.6-8-8-8z"/></svg>
      <svg v-if="isOpen" width="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><path d="M26 0C11.664 0 0 11.663 0 26s11.664 26 26 26 26-11.663 26-26S40.336 0 26 0zm0 50C12.767 50 2 39.233 2 26S12.767 2 26 2s24 10.767 24 24-10.767 24-24 24z"/><path d="M35.707 16.293a.999.999 0 0 0-1.414 0L26 24.586l-8.293-8.293a.999.999 0 1 0-1.414 1.414L24.586 26l-8.293 8.293a.999.999 0 1 0 1.414 1.414L26 27.414l8.293 8.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L27.414 26l8.293-8.293a.999.999 0 0 0 0-1.414z"/></svg>
    </b-btn>

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
      isOpen: false,
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
      this.openSidebar()
    })
    this.$eventHub.$on('patient-selected', item => {
      this.sidebarData.selectedPatient = JSON.parse(JSON.stringify(item))
      this.state = 'patient'
      this.openSidebar()
    })
    this.$eventHub.$on('patient-new', item => {
      this.state = 'patientNew'
      this.openSidebar()
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
    toggleSidebar: function () {
      this.isOpen = !this.isOpen
    },
    openSidebar: function () {
      this.isOpen = true
    },
    displayCheckin: function () {
      this.state = 'bedCheckin'
    },
    cancelCheckin: function () {
      this.state = 'bed'
    },
    executeCheckin: function () {
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
      this.state = 'patientNew'
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
  width: 100%;
}


.vdp-datepicker__calendar {
  margin-left: -105px !important;
  width: 280px !important;
}

.btn-float {
  display: none !important;
  background-color: #fff !important;
}

.btn-float:hover {
  background-color: #EEE !important; 
}

@media(max-width:576px){
  .side {
    position: absolute !important;
    width: 300px !important;
    height: 100% !important;
    top: 0 !important;
    right: -300px !important;
    z-index: 2 !important;
    transition: right 0.3s ease-in-out !important;
  }

  .side--active {
    right: 0px !important;
  }

  .btn-float {
    display: inline-flex !important;
    position: fixed !important; 
    bottom: 20px !important;
    right: 20px !important;
  }

  .col, .col-1, .col-10, .col-11, .col-12, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-auto, .col-lg, .col-lg-1, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-auto, .col-md, .col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-auto, .col-sm, .col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-auto, .col-xl, .col-xl-1, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-auto{
    min-height: 35px !important;
  }
}
</style>
