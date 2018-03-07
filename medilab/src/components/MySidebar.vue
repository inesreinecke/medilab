<template>
 <div class="side">
     <h1>Hallo</h1>
     <!-- Ines was selected -->
    <div v-if="buttonContext=='Ines'">
        <p class="heading">INES</p>
        Hallo Ines
    </div>
    <!-- Thomas was selected -->
    <div v-if="buttonContext=='Thomas'">
         <p class="heading">INES</p>
        Hallo Thomas
    </div>
  </div>   
</template>
<script>
export default {
  name: 'mySidebar',
  data () {
    return {
      buttonContext: 'none'
    }
  },
  components: {
  },
  created () {
    console.log('initializing MySidebar')
    // Listen for the i-got-clicked event and its payload.
    this.$eventHub.$on('displayButtonContext', payload => {
      console.log(payload)
      this.buttonContext = payload.name
    })
  }
}
</script>
<style scoped>

.side {
    padding-left: 10px;
    padding-right: 10px;
    top: 0;
    width: 400px;
    background-color: rgb(213, 216, 219);
    right: 0;
    z-index: 10;
    border-left: 0 solid #fff;
}

.ownLabel {
  position: absolute;
  margin-top: 8px;
}

.heading {
  background: #414c55;
  padding: 10px;
  margin: 0px -10px 10px -10px;
  color: #fff;
}

.breaker {
  margin-left: -10px;
  margin-right: -10px;
  color: #414c55
}

select option:disabled {
    color: #000;
    font-weight: bold;
}


/** disable frame around inputs and textarea in chrome **/
textarea:focus, input:focus{
  outline-style:none;
  box-shadow:none;
  border-color:transparent;
}


</style>
