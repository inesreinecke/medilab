<template>
  <div id="app">
    <header class="appHeader">
      <div class="title">MediLab</div>
    </header>

    <main class="appMain">

      <nav class="appNavigation">
        <ul class="appNavList">
          <li class="appNavListItem">
            <router-link to="/">Station Layout</router-link>
          </li>
          <li class="appNavListItem">
            <router-link to="/patients">Patients</router-link>
          </li>
        </ul>
      </nav>

      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html, body, #app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: #f8fafa;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #232629;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100vh!important;
}


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


.appMain {
    position: relative;
    display: flex;
    flex: 1;
    overflow: hidden;
}

.appNavigation {
    display: inline-block;
    position: static;
    top: 0;
    width: 200px;
    background-color: #ffffff;
    z-index: 1000;
    -webkit-transition: width 250ms ease;
    -moz-transition: width 250ms ease;
    -o-transition: width 250ms ease;
    transition: width 250ms ease;
}

/** style for left navigational component **/
.appNavList {
  list-style: none;
  padding: 0px;
  margin: 0px;
}

/** style for a single element in left nav **/
.appNavListItem > a {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0px 10px;
  color: #131212;
  text-decoration: none;
  width: 100%;
}

.appNavListItem > a.router-link-exact-active {
  background-color: #65a8ff;
}


/** main view area definition **/
.viewCard {
  display: block;
  background-color: #ededed;
  border-radius: 0;
  width: 100%;
  height: 100%;
  padding: 0px;
  overflow: hidden;
}

.viewCardBody {
}

.viewCard .h2 {
  color:#65a8ff
}

.panel {
    flex-direction: column;
    display: flex;
    margin: 0;
    box-shadow: none;
    flex: 1;
    width: 100%;
    background-color: #fff;
    border-radius: 0;
    padding: 0;
    height: 100%;
}

.panel .panelHeader {
    border-top: 5px solid #32d0b6;
    background-color: #fff;
    height: 45px;
    line-height: 45px;
    min-height: 45px;
    color: #152531;
    padding: 0;
    display: flex;
    position: relative;
}

/** styles for phone and tablet sized devices **/
@media (min-width: 768px) {
  #app {
    display: flex;
  }
}

</style>
