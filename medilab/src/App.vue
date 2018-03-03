<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Heading from '@/components/Heading'
import Sidebar from '@/components/Sidebar'

export default {
  name: 'app',
  components: {
    Heading,
    Sidebar
  }
}
</script>

<!-- CSS styles applicable for the entire app -->
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #232629;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100vh!important;
}



.appMain {
    position: relative;
    display: flex;
    flex: 1;
    overflow: hidden;
}


/** main view area definition **/
.viewCard {
  display: block;
  background-color: #fff;
  border-radius: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 20px;
}

.viewCardBody {
  height: 100%
}

/** styles for phone and tablet sized devices **/
@media (min-width: 768px) {
  #app {
    display: flex;
  }
}

</style>
