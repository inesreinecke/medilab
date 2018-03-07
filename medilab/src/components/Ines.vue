<template>
 <div id="app">
    <heading></heading>
    <main class="appMain">
        <section class="viewCard">
            <div class="viewCardBody">
                <h2> Welcome to Ines component</h2>
                <hr class="breaker">
                <b-btn variant="primary" v-on:click="send('Ines')">Send Ines</b-btn>
                <b-btn variant="primary" v-on:click="send('Thomas')">Send Thomas</b-btn>
            </div>
        </section>
        <mySidebar></mySidebar>
    </main>
  </div>   
</template>
<script>
import Heading from '@/components/Heading'
import MySidebar from '@/components/MySidebar'

export default {
  name: 'ines',
  components: {
    Heading,
    MySidebar
  },
  methods: {
    send: function (name) {
      // console.log(name)
      this.$eventHub.$emit('displayButtonContext', {'name': name})
    }
  }
}
</script>
<style scoped>

</style>
