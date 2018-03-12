<template>
  <div id="app">
    <heading></heading>
    <main class="appMain">

      <section class="viewCard">
        <div class="viewCardBody">

          <!-- row for the stations -->
          <div class="cardRow">
            <div class="card" v-for="(station) of Stations" v-bind:key="station.id" v-on:click="selectStation($event, station)">
              <div class="body" v-bind:style="{backgroundColor:station.bgColor}">
                <p class="bodyText">{{station.leader}}</p> 
              </div>
              <div class="footer">
                <p class="footerText">Station: {{station.title}}</p> 
              </div>
            </div>
          </div>  <!-- stations -->

          <!-- row for the rooms -->
          <div class="cardRow">
            <div class="card" v-for="(room) in Rooms" v-bind:key="room.id" v-on:click.stop="selectRoom($event, room)">
              <div class="body" v-bind:style="{backgroundColor:room.bgColor}">
                <div class="bed" v-for="(bed) in room.beds" v-bind:key="bed.id" v-on:click.stop="selectBed($event, bed)">{{(bed.patient != null) ? (bed.patient.firstName + " " + bed.patient.lastName) : "-"}}</div>
              </div>
              <div class="footer">
                <p class="footerText">Room: {{room.title}}</p> 
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
import Sidebar from '@/components/Sidebar'

export default {
  name: 'stationLayout',
  components: {
    Heading,
    Sidebar
  },
  data () {
    return {
      Stations: [],
      Rooms: [],
      selectedStation: {},
      selectedRoom: {}
    }
  },
  apollo: {
    $subscribe: {
      Rooms: {
        query: gql`subscription rooms {
          Rooms {
            id
            title
            bedMetrics
            utilization
            bgColor
            beds {
              id
              room {
                id
                title
              }
              station {
                id
                title
              }
              patient {
                id
                firstName
                lastName
                birthday
                sex
              }
            }
          }
        }`,
        result ({data}) {
          console.log('received updated Rooms')
          this.Rooms = data.Rooms
        }
      },
      Stations: {
        query: gql`subscription stations {
          Stations {
            id
            title
            bgColor
            leader
            bedMetrics
            utilization
          }
        }`,
        result ({data}) {
          console.log('received updated Stations')
          this.Stations = data.Stations
          this.selectedStation = null
          this.selectedRoom = null
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
          bedMetrics
          utilization
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
      this.selectedStation = station

      // send event to sidebar
      this.$eventHub.$emit('station-selected', station)

      // query rooms for this station
      this.$apollo.query({
        query: gql`query getRoomsByStation($_stationId:ID!) {
          RoomsByStation(_stationId: $_stationId) {
            id
            title
            bedMetrics
            utilization
            bgColor
            beds {
              id
              room {
                id
                title
              }
              station {
                id
                title
              }
              patient {
                id
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
    selectBed: function (event, bed) {
      this.$eventHub.$emit('bed-selected', bed)
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
    border: 1px solid rgba(255,255,255,0);
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  border: 1px solid #414c55;
  cursor: pointer;
}

/** box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2); **/

/* Add some padding inside the card container */
.card .body {
    padding: 5px;
    height:75%
}

.card .body .bodyText {
  margin-top:10px;
  font-size: 14px;
}


.card .footer {
    padding: 2px 16px;
    background-color: #414c55;
    height:25%;
}

.card .footer .footerText {
    font-size: 14px;
    vertical-align: middle;
    color: #fff;
    margin-top: 10px;
}

.card .full {
    padding: 2px 16px;
    height:100%;
}

.cardRow {
    display: flex;
    flex-flow: row wrap;
}



.bed {
    position: relative;
    padding: 3px;
    margin: 3px;
    border-radius: 5px;
    background-color: rgba(255,255,255,0.4);
    font-size: 14px;
    border: 1px solid rgba(255,255,255,0)
}

.bed:hover {
  border: 1px solid #414c55
}

</style>
