<template>
  <div id="app">
    <heading></heading>
    <main class="appMain">
      <navigator></navigator>

      <section class="viewCard">
        <div class="viewCardBody">

          <!-- row for the stations -->
          <div class="row">
            <div class="card" v-for="(station) of Stations" v-bind:key="station.id" v-on:click="selectStation($event, station)">
              <div class="body" v-bind:style="{backgroundColor:station.bgColor}">
                <h3><b>{{station.title}}</b></h3> 
              </div>
              <div class="footer">
                <p>{{station.leader}}</p> 
              </div>
            </div>
          </div>  <!-- stations -->

          <!-- row for the rooms -->
          <div class="row">
            <div class="card" v-for="(room) in Rooms" v-bind:key="room.id" v-on:click="selectRoom($event, room)">
              <div class="full" v-bind:style="{backgroundColor:room.bgColor}">
                <h3><b>{{room.title}}</b></h3> 

                <div class="box" v-for="(patient) in room.allocation" v-bind:key="patient.id" v-on:click.stop="selectPatient($event, patient)">
                  <div class="avatar-circle">
                    <span class="initials">{{patient.patient.initials}}</span>
                  </div> 
                </div>
              </div>
            </div>
          </div> <!-- rooms -->

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
  name: 'stationLayout',
  components: {
    Heading,
    Navigator,
    Sidebar
  },
  data () {
    return {
      Stations: [],
      Rooms: []
    }
  },
  apollo: {
    $subscribe: {
      Issues: {
        query: gql`subscription issues {
          Issues {
            id
            title
            status
            created_at
          }
        }`,
        result ({data}) {
          this.Issues = data.Issues
        }
      },
      Rooms: {
        query: gql`subscription rooms {
          Rooms {
            id
            title
            bgColor
            capacity,
            allocation {
              id
              patient {
                id
                serial
                initials
                firstName
                lastName
                birthday
                sex
              }
            }
          }
        }`,
        result ({data}) {
          this.Rooms = data.Rooms
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
        Stations {
          id
          title
          bgColor
          leader
        }
      }`
    }).then(({data}) => {
      this.Stations = data.Stations
    }).catch((error) => {
      console.error(error)
    })
  },
  methods: {
    selectStation: function (event, station) {
      // send event to sidebar
      this.$eventHub.$emit('station-selected', station)

      // query rooms for this station
      this.$apollo.query({
        query: gql`query getRoomsByStation($_stationId:ID!) {
          RoomsByStation(_stationId: $_stationId) {
            id
            title
            bgColor
            capacity,
            allocation {
              id
              patient {
                id
                serial
                initials
                firstName
                lastName
                birthday
                sex
              }
            }
          }
        }`,
        variables: {
          _stationId: station.id
        }
      }
      ).then(({data}) => {
        this.Rooms = data.RoomsByStation
      }).catch((error) => {
        console.error(error)
      })
    },
    selectRoom: function (event, room) {
      this.$eventHub.$emit('room-selected', room)
    },
    selectPatient: function (event, patient) {
      this.$eventHub.$emit('patient-selected', patient.patient)
    }
  }
}
</script>

<style scoped>


.card {
    /* Add shadows to create the "card" effect */
    /* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.5s; */
    width: 200px;
    height: 200px;
    margin: 10px;
    border: 2px solid rgba(255,255,255,0);
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  border: 2px solid rgba(0,0,0,1)
}

/** box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2); **/

/* Add some padding inside the card container */
.card .body {
    padding: 2px 16px;
    height:75%
}

.card .footer {
    padding: 2px 16px;
    background-color: #ffffff;
    height:25%;
    font-size: 14px;
    vertical-align: middle;
}

.card .full {
    padding: 2px 16px;
    height:100%;
}

.row {
    position: relative;
    display: flex;
    flex-flow: row wrap;
}

.avatar-circle {
  width: 52px;
  height: 52px;
  background-color: #fff;
  text-align: center;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border: 2px solid rgba(255,255,255,0)
}


.avatar-circle:hover {
  border: 2px solid rgba(0,0,0,1)
}

.initials {
  position: relative;
  top: 12px; /* 25% of parent */
  font-size: 25px; /* 50% of parent */
  line-height: 25px; /* 50% of parent */
  color: #000;
  font-family: "Courier New", monospace;
  font-weight: bold;
}

.box {
    box-sizing: border-box;
    float: left;
    padding: 5px;
    border: 0px solid black;
}


</style>
