<template>
  <div id="app">
    <heading></heading>
    <main class="appMain">
      <navigator></navigator>

      <section class="viewCard">
        <div class="viewCardBody">

          <table class="patientTable">
            <tr>
              <th>Name</th>
              <th>Serial</th>
              <th>Birthday</th>
              <th>Sex</th>
            </tr>
            <tr v-for="(patient) of Patients" v-bind:key="patient.id" v-on:click="selectPatient($event, patient)">
              <td>{{patient.firstName + " " + patient.lastName}}</td>
              <td>{{patient.serial}}</td>
              <td>{{patient.birthday}}</td>
              <td>{{patient.sex}}</td>
            </tr>
          </table>
          <button class='button' v-on:click="addNewPatient()">Admit new Patient</button>
        
        </div>
      </section>
       <sidebar></sidebar>
    </main>
  </div>   
</template>

<script>
import gql from 'graphql-tag'
import Heading from '@/components/Heading'
import Navigator from '@/components/Navigator'
import Sidebar from '@/components/Sidebar'

export default {
  name: 'patients',
  components: {
    Heading,
    Navigator,
    Sidebar
  },
  data () {
    return {
      Patients: []
    }
  },
  apollo: {
    $subscribe: {
      Issues: {
        query: gql`subscription patients {
          Patients {
            id
            serial
            firstName
            lastName
            initials
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
  mounted () {
    // on init/mounting of this component, reset the sidebar
    this.$eventHub.$emit('resetSidebar', {})

    // async load stations
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
    selectPatient: function (event, patient) {
      this.$eventHub.$emit('patient-selected', patient)
    },
    addNewPatient: function () {
      this.$eventHub.$emit('patient-new', {})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.patientTable {
    //border: solid 1px;
    margin:10px;
    display: block;
    flex-flow: row wrap;
    white-space: nowrap;
    background: #fff;
    /* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); */
}

.patientTable th {
  padding: 10px;
  background: #a8a8a8;
  text-align: left;
}

.patientTable td {
  padding: 10px;
}

.patientTable td:last-child {
  width:100%;
}

.patientTable tr:hover td {
  background-color: #d1d1d1;
}

.button {
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 10px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    margin-left: 10px;
}

</style>
