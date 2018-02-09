<template>
  <section class="viewCard">
    <div class="viewCardBody">

      <div class="wrapper">


        <div class="card" v-for="(item) of Stations" v-bind:key="item.id" v-on:click="selectStation($event, item)">
          <div class="body" v-bind:style="{backgroundColor:item.bgColor}">
            <h3><b>{{item.title}}</b></h3> 
          </div>
          <div class="footer">
            <p>{{item.leader}}</p> 
          </div>
        </div>
    </div>

     <div class="wrapper">
        <div class="card" v-for="(room) in Rooms" v-bind:key="room.id">
          <div class="full" v-bind:style="{backgroundColor:room.bgColor}">
            <h3><b>{{room.title}}</b></h3> 

           
            <!-- <div class="box">
              <div class="avatar-circle">
                <span class="initials">TR</span>
              </div>
            </div>
            <div class="box">
              <div class="avatar-circle">
                <span class="initials">IR</span>
              </div>
            </div>

                        <div class="box">
              <div class="avatar-circle">
                <span class="initials">IR</span>
              </div>
            </div> -->
            
            <div class="box" v-for="(patient) in room.allocation" v-bind:key="patient.id">
              <div class="avatar-circle">
                <span class="initials">{{patient.patient.initials}}</span>
              </div> 
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>


<script>
import gql from 'graphql-tag'

export default {
  name: 'stationLayout',
  data () {
    return {
      Stations: [],
      selectedStation: null,
      Rooms: [],
      selectedRoom: null
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
          console.log(JSON.stringify(data))
          this.Issues = data.Issues
        }
      }
    }
  },
  mounted () {
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
    selectStation: function (event, item) {
      // `this` inside methods points to the Vue instance
      this.selectedStation = item

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
                initials
                firstName
                lastName
              }
            }
          }
        }`,
        variables: {
          _stationId: this.selectedStation.id
        }
      }
      ).then(({data}) => {
        this.Rooms = data.RoomsByStation
        console.log(this.RoomsByStation)
      }).catch((error) => {
        console.error(error)
      })
    }
  }
}
</script>

<style>

.row {
  display:inline;
  overflow: hidden;
  border: solid 1px red;
}

.card {
    /* Add shadows to create the "card" effect */
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.5s;
    width: 200px;
    height: 200px;
    margin: 10px;
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  opacity: 0.75;
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
    height:100%
}

.wrapper {
    position: relative;
    display: flex;
    flex-flow: row wrap;
}



.avatar-circle {
  width: 48px;
  height: 48px;
  background-color: #000;
  text-align: center;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
}

.initials {
  position: relative;
  top: 12px; /* 25% of parent */
  font-size: 25px; /* 50% of parent */
  line-height: 25px; /* 50% of parent */
  color: #fff;
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
