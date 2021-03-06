# medilab

> simple medical lab app to manage allocations in hospitals

Web project using VueJS, GraphQL and Apollo to showcase a simple management app for a hospital. Allows to manage
patients, rooms and stations with various exemplary use cases.

This project is divided into two pieces:
 * medilab : the actual UI element available at http://localhost:8080/
 * medilab-api : a backend service proving the API layer to serve Frontend capabilities and data, http://localhost:3000

Used Libraries:
 * vuejs : https://github.com/vuejs
 * vueks-datepicker : https://github.com/charliekassel/vuejs-datepicker
 * modokdb : https://github.com/KaiWedekind/modokDB
 * momentJs : https://github.com/moment/moment
 * bootstrap-vue : https://github.com/bootstrap-vue
 * vue-awesome : https://github.com/Justineo/vue-awesome
 * graphiql : https://github.com/graphql/graphiql
 * feathers: https://docs.feathersjs.com/

### Installation

Ensure node 9.7 is installed on your system to properly run modokdb: https://nodejs.org/en/download/current/

Clone the repo and install the dependencies

```
git clone https://github.com/inesreinecke/medilab.git
cd medilab/medilab-api
npm install
cd ../medilab
npm install
```

### Execution

Run the backend API server (hosting graphql and the in-Memory document database)
```
cd medilab/medilab-api
npm run dev
```

On a new Terminal, run the frontend
```
cd medilab/medilab
npm run dev
```

### How to add the YouTube Intro Video to the Landing page

An introduction video is available on YouTube: 
https://www.youtube.com/watch?v=PmVNQo3lXvc&feature=youtu.be

To ensure the application is also running without internet connection locally, I decided to not include the YouTube Video.
If you want to add the video, simply change the code in Landing.vue. I already added the code to get the Video included instead of the pictures. 

### References, used tutorials

I have used the following article/tutorial to have graphql and as a service of my medilab-api project:https://medium.com/@wedekind.kai/rest-in-peace-long-live-graphql-f53e269c466d

I have used another tutorial to fetch the data from my API server via Apollo Client 2.0: https://medium.com/@wedekind.kai/data-fetching-with-apollo-client-2-0-d52a30eee63c

To setup my global event bus in my vue app, I have used the following tutoral:
https://medium.com/vuejobs/create-a-global-event-bus-in-vue-js-838a5d9ab03a


### App access
The backend is available at http://localhost:3000. Medilab also comes with a GraphQL API explorer engine powered by GraphiQL, available at 
http://localhost:3000/graphiql

The frontend is available at http://localhost:8090/

Enjoy!


