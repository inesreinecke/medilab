<template>
  <div id="app">
    <heading></heading>
    <main class="appMain">

      <section class="viewCard">
        <div class="viewCardBody">

          <b-table striped hover :items="tableData" :fields="fields" @row-clicked="selectPatient"></b-table>
        
        </div>
      </section>
       <sidebar></sidebar>
    </main>
  </div>   
</template>

<script>
import gql from 'graphql-tag'
import Heading from '@/components/Heading'
import Sidebar from '@/components/Sidebar'

export default {
  name: 'patients',
  components: {
    Heading,
    Sidebar
  },
  data () {
    return {
      fields: [
        {
          key: 'firstName',
          label: 'FirstName',
          sortable: false
        },
        {
          key: 'lastName',
          sortable: true
        },
        {
          key: 'birthday',
          label: 'Birthday',
          sortable: true
        },
        {
          key: 'sex',
          label: 'Sex',
          sortable: false
        }
      ],
      tableData: []
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
          this.tableData = data.Patients
        }
      }
    }
  },
  mounted () {
    this.$eventHub.$emit('patient-new', {})

    // async load stations
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
      this.tableData = data.Patients
    }).catch((error) => {
      console.error(error)
    })
  },
  methods: {
    selectPatient: function (patient, index) {
      this.$eventHub.$emit('patient-selected', patient)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@media (max-width:500px){
  td, th{ 
    display: none;
  }
  
  
  th:nth-child(1), th:nth-child(2), td:nth-child(1), td:nth-child(2){
    display: table-cell;
  }

}
</style>
