<template>
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
  mounted () {
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
      console.log(data.Patients)
      this.Patients = data.Patients
    }).catch((error) => {
      console.error(error)
    })
  },
  methods: {
    selectPatient: function (event, patient) {
      // send event to sidebar
      console.log(patient)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.patientTable {
    //border: solid 1px;
    margin:10px;
    display: block;
    flex-flow: row wrap;
    white-space: nowrap;
    background: #fff;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
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

</style>
