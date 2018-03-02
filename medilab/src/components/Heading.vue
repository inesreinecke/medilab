<template>
  <header class="appHeader">
      <div class="title">MediLab</div>

      <img class="avatar" src="static/img/img_avatar.png" v-if="isAuthenticated()" v-on:click="doLogout()">
  </header>
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
  border-top: 4px solid #65a8ff;
  top: 0!important;
  height: 55px;
  width: 100%;
  min-width: 320px!important;
  color: #fff;
  background-color: #152531;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  z-index: 11;
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
  margin-right: 5px;
  font-family: "Helvetica Neue",Helvetica;
  font-weight: bold;
}

.appHeader img.avatar {
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

</style>
