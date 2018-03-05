# medilab

> simple medical lab app to manage allocations in hospitals

Web project using VueJS, GraphQL and Apollo to showcase a simple management app for a hospital. Allows to manage
patients, rooms and stations with various exemplary use cases.

This project is divided into two pieces:
 * medilab : the actual UI element available at http://localhost:8080/
 * medilab-api : a backend service proving the API layer to serve Frontend capabilities and data

Used Libraries:
 * vuejs : https://github.com/vuejs
 * vueks-datepicker : https://github.com/charliekassel/vuejs-datepicker
 * modokdb : https://github.com/KaiWedekind/modokDB
 * momentJs : https://github.com/moment/moment
 * bootstrap-vue : https://github.com/bootstrap-vue
 * vue-awesome : https://github.com/Justineo/vue-awesome
 * graphiql : https://github.com/graphql/graphiql

### Installation

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

The backend is available at http://localhost:3000. Medilab also comes with a GraphQL API explorer engine powered by GraphiQL, available at 
http://localhost:3000/graphiql

The frontend is available at http://localhost:8090/

Enjoy!


