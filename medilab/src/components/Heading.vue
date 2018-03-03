<template>
  <div>
    <header class="appHeader">
      <router-link class="title" to="/">MediLab</router-link>
        <div class="navContents" left>
          <router-link class="navElement" to="/stations">Stations</router-link>
          <router-link class="navElement" to="/patients">Patients</router-link>
          <img class="avatar" src="static/img/img_avatar.png" v-if="isAuthenticated()" v-on:click="doLogout()">
        </div>
      <img class="avatar" src="static/img/img_avatar.png" v-if="isAuthenticated()" v-on:click="doLogout()">
    </header>
  </div>
</template>

<script>

export default {
  name: 'heading',
  data () {
    return {
      Patients: []
    }
  },
  mounted () {
    console.log('header mounted')
  },
  methods: {
    doLogout: function () {
      console.log('logout')
      localStorage.removeItem('isAuthenticated')
      this.$router.push('/')
    },
    isAuthenticated: function () {
      return localStorage.getItem('isAuthenticated')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

/** defines the header including the application title **/
.appHeader {
  position: static;
  top: 0!important;
  height: 55px;
  width: 100%;
  min-width: 320px!important;
  background: rgb(233, 236, 239);
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
/** application title thats living inside of the header **/
.appHeader .title {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 18px;
  position: relative;
  margin-left: 10px;
  margin-right: 20px;
  color: #131212;
  text-decoration: none;
}

/** style for left navigational component **/
.navContents {
  display: inline-block;
}

/** style for a single element in left nav **/
.navElement {
  /* padding: 0px 10px; */
  color: #131212;
  text-decoration: none;
  width: 100%;
  margin: 5px;
}

.navElement.router-link-exact-active {
  font-weight: bold;
}


img.avatar {
    top: 12px;
    position: absolute;
    width: 35px;
    height: 35px;
    right: 20px;
    border-radius: 50%;
    border-top-left-radius: 50%;
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
    border-bottom-left-radius: 50%;
}

img.avatar:hover {
  cursor: pointer;
}

</style>
