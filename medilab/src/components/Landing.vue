<template>
  <div id="app">
    <heading></heading>    
    <div class="landing">
      <div class="secondHeading">
        <div class="responsiveRow">
          <div class="infoBox">
            <h1>Welcome to MediLab !</h1>
            this is a blabla app. Put some more descriptive text here
          </div>

          <div class="loginBox">
            <div class="row">
              <div class="paramName">Username</div>
              <input class="param" type="text" v-model="username">
            </div>
            <div class="row">
              <div class="paramName">Password</div>
              <input class="param" type="password" v-model="password">
            </div>
            <button class='button' v-on:click="doLogin()">Login!</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Heading from '@/components/Heading'

export default {
  name: 'landing',
  components: {
    Heading
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

.row {
    position: relative;
    display: flex;
    margin-bottom: 2px;
    width: 100%;
}

.paramName {
  padding: 10px;
  background: #a8a8a8;
  width: 140px;
}

.param {
  padding: 10px;
  width: 100%
}

.button {
    background-color: #4CAF50; 
    border: none;
    color: white;
    width: 100%;
    padding: 10px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    margin-bottom: 2px;
}

</style>
