<template>
  <section class="viewCard">
    <div class="viewCardBody">

      <div class="wrapper">


        <div class="card" v-for="(item, index) of Stations" v-on:click="selectStation($event, item)">
          <div class="body" v-bind:style="{backgroundColor:item.bgColor}">
            <h3><b>{{item.title}}</b></h3> 
          </div>
          <div class="footer">
            <p>{{item.leader}}</p> 
          </div>
        </div>
    </div>

     <div class="wrapper">
        <div class="card" v-for="(item, index) of Rooms">
          <div class="body" v-bind:style="{backgroundColor:item.bgColor}">
            <h3><b>{{item.title}}</b></h3> 
          </div>
          <div class="footer">
            <p>{{item.leader}}</p> 
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
            capacity
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


.wrapper {
    position: relative;
    display: flex;
    flex-flow: row wrap;
}

</style>
