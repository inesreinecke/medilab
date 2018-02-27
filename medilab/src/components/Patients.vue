<template>
  <section class="viewCard">
    <div class="viewCardBody">
      <div class="patientView">
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
        <div class='button' v-on:click="addNewPatient()">Add a new Patient</div>
      </div>
    </div>
  </section>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'patients',
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
      // send event to sidebar
      console.log(patient)
      this.$eventHub.$emit('patient-selected', patient)
    },
    addNewPatient: function () {
      console.log('add: ')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.patientView .patientTable {
    //border: solid 1px;
    margin:10px;
    display: block;
    flex-flow: row wrap;
    white-space: nowrap;
    background: #fff;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
}

.patientView .patientTable th {
  padding: 10px;
  background: #a8a8a8;
  text-align: left;
}

.patientView .patientTable td {
  padding: 10px;
}

.patientView .patientTable td:last-child {
  width:100%;
}

.patientView .patientTable tr:hover td {
  background-color: #d1d1d1;
}

.patientView .button {
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
