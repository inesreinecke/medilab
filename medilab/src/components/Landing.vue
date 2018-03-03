<template>
  <div id="app">
    <!-- <heading></heading>   -->

    <b-jumbotron>
      <b-container fluid>
        <b-row>
          <b-col xl="9" lg="8" md="6" sm="12">
            <h2>Welcome to Medilab</h2>
            <p>delivery for course xyz by Ines Reinecke</p>
          </b-col>
          <b-col xl="3" lg="4" md="6" sm="12">
              <b-form-input v-model="username" type="text" placeholder="Username"></b-form-input>
              <b-form-input v-model="password" type="password" placeholder="Password"></b-form-input>
              <div class="embeddedLogin" @click="doLogin()">
                <icon name="arrow-circle-o-right" scale="1.8"></icon>
              </div>
          </b-col>
        </b-row>
      </b-container>
    </b-jumbotron>

    <b-container flueid>
      <b-row>
        <b-col xl="auto" lg="auto" md="auto" sm="auto">
          <b-carousel id="carousel1" style="text-shadow: 1px 1px 2px #333" controls indicators background="#ababab" :interval="7500" img-width="640" img-height="240" v-model="slide" @sliding-start="onSlideStart" @sliding-end="onSlideEnd">
            <b-carousel-slide img-src="https://lorempixel.com/640/240/abstract/1/">
              <h1>Hospital management</h1>
            </b-carousel-slide>
            <b-carousel-slide img-src="https://lorempixel.com/640/240/people/1/">
              <h1></h1>
            </b-carousel-slide>
            <b-carousel-slide img-src="https://lorempixel.com/640/240/people/7/">
              <h1>Hello world!</h1>
          </b-carousel-slide>      
          </b-carousel>
        </b-col>
        <b-col xl="auto" lg="auto" md="auto" sm="auto">
          <p>For more information visit Github</p>
          <b-btn variant="primary" target="_blank" href="https://github.com/inesreinecke/medilab">Sources on Github</b-btn>
        </b-col>
      </b-row>
    </b-container>

        <!-- <b-carousel-slide img-src="https://lorempixel.com/1024/480/people/7/"> -->


  </div>
</template>

<script>
import Heading from '@/components/Heading'
import Icon from 'vue-awesome/components/Icon'

export default {
  name: 'landing',
  components: {
    Heading,
    Icon
  },
  data () {
    return {
      username: null,
      password: null
    }
  },
  mounted () {
  },
  methods: {
    doLogin: function () {
      console.log(this.$route)
      localStorage.setItem('isAuthenticated', true)
      this.$router.push((this.$route.query.redirect) ? this.$route.query.redirect : '/stations')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.secondHeading {
  background: #ededed;
  width:100%;
  height: 200px;
}

.responsiveRow {
  display: flex;
  flex-wrap: wrap;
}

.infoBox {
  margin: 20px;
  width: 60%
}

.loginBox {
  margin: 20px;
  width: 25%
}

.embeddedLogin {
  position: absolute;
  top: 42px;
  right: 20px;
  width: 30px;
  height: 100%;
  border: inherit;
  z-index: 5;
  text-align: center;
  line-height: 34px;
  opacity: 0.5;
}

.embeddedLogin:hover {
  opacity: 0.75;
}

::placeholder {
  opacity: 0.5;
}
</style>
