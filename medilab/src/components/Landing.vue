<template>
  <div>
    <!-- <heading></heading>   -->

    <b-jumbotron>
      <b-container fluid>
        <b-row>
          <b-col xl="9" lg="8" md="6" sm="12">
            <h2>Welcome to my Medilab app</h2>
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
        <b-col>
         <div class="container">
          <iframe src="//www.youtube.com/embed/PmVNQo3lXvc?rel=0" 
          frameborder="0" allowfullscreen class="video"></iframe>
      </div>
        </b-col>
        <b-col xl="6" lg="6" md="12" sm="12">
          <p>This is the deliverable for course <i>Projektarbeit Web-Engineering I</i> from Ines Reinecke. This Web Application is mainly to manage patients, stations and room allocation for a hospital.   
          <p>For more information visit Github. The ReadMe contains all needed information to quickly setup up the environment and run the application. The app is also deployed on IBM Cloud/Bluemix.</p>
          <b-btn variant="primary" target="_blank" href="https://github.com/inesreinecke/medilab">Sources on Github</b-btn>
          <b-btn variant="primary" target="_blank" href="https://medilab.mybluemix.net/">Access App on IBM Cloud</b-btn>
        </b-col>
      </b-row>

    </b-container>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import VueYouTubeEmbed from 'vue-youtube-embed'

export default {
  name: 'landing',
  components: {
    Icon,
    VueYouTubeEmbed
  },
  data () {
    return {
      username: null,
      password: null,
      videoId: 'PmVNQo3lXvc'
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

.container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;
}

.video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

::placeholder {
  opacity: 0.5;
}
</style>
