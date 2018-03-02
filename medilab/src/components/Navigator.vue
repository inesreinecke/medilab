<template>
    <nav class="appNavigation">
        <ul class="appNavList">
            <li class="appNavListItem">
            <router-link to="/stations">Stations</router-link>
            </li>
            <li class="appNavListItem">
            <router-link to="/patients">Patients</router-link>
            </li>
        </ul>
    </nav>
</template>

<script>

export default {
  name: 'navigator',
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

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

</style>
