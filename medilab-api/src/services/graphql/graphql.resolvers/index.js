const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();
const ROOMS_CHANGED = 'ROOMS_CHANGED';
const PATIENTS_CHANGED = 'PATIENTS_CHANGED';

const Modok = require('modokdb');
const patientsDB = new Modok('patients');
const stationsDB = new Modok('stations');
const roomsDB = new Modok('rooms');
const bedsDB = new Modok('beds');


/** 
 * resetting the inMemory database 
 **/
var resetDatabase = function() {

  // resetting patients
  patientsDB.drop();
  patientsDB.insertMany([
    {
      id: 1,
      firstName: 'Thomas',
      lastName: 'Reinecke',
      birthday: '1979-09-23',
      sex: 'male'
    },
    {
      id: 2,
      firstName: 'Ines',
      lastName: 'Reinecke',
      birthday: '1981-01-05',
      sex: 'female'
    },
    {
      id: 3,
      firstName: 'Anna',
      lastName: 'Reinecke',
      birthday: '2008-12-05',
      sex: 'female'
    },
  ]);
  console.log("resetted 'patients' on InMemoryDb");

  // reset Stations
  stationsDB.drop();
  stationsDB.insertMany(
    [{
      id: 1,
      title: 'Innere Medizin',
      bgColor: '#dc67ff',
      leader: 'Dr. Habermann'
    },
    {
      id: 2,
      title: 'Intensivstation',
      bgColor: '#79dd9a',
      leader: 'Dr. Mustermann'
    }]
  );
  console.log("resetted 'stations' on InMemoryDb");

  // resetting rooms
  roomsDB.drop();
  roomsDB.insertMany([
    {
      id: 1,
      _stationId: 1,
      title: '1-001',
      bgColor: '#dc67ff'
    },
    // {
    //   id: 2,
    //   _stationId: 1,
    //   title: '1-002',
    //   bgColor: '#dc67ff'
    // },
    // {
    //   id: 3,
    //   _stationId: 1,
    //   title: '1-003',
    //   bgColor: '#dc67ff'
    // },
    // {
    //   id: 4,
    //   _stationId: 1,
    //   title: '1-004',
    //   bgColor: '#dc67ff'
    // },
    {
      id: 5,
      _stationId: 2,
      title: '2-001',
      bgColor: '#79dd9a'
    },
    // {
    //   id: 6,
    //   _stationId: 2,
    //   title: '2-002',
    //   bgColor: '#79dd9a'
    // },
    // {
    //   id: 7,
    //   _stationId: 2,
    //   title: '2-003',
    //   bgColor: '#79dd9a'
    // }
  ]);
  console.log("resetted 'rooms' on InMemoryDb");

  // reset Beds
  bedsDB.drop();
  bedsDB.insertMany([
    {
      id: 1,
      _roomId: 1,
      _stationId: 1,
      _patientId : 1
    },
    {
      id: 2,
      _roomId: 1,
      _stationId: 1,
      _patientId : 2
    },
    {
      id: 3,
      _roomId: 1,
      _stationId: 1
    },
    {
      id: 4,
      _roomId: 1,
      _stationId: 1
    },
    {
      id: 5,
      _roomId: 5,
      _stationId: 2
    },
    {
      id: 6,
      _roomId: 5,
      _stationId: 2
    }
  ]
  );
  console.log("resetted 'beds' on InMemoryDb");


};

/**
 * getRoomsByStation - fetches the rooms that belong to a given query
 */
var getRoomsByQuery = function(query) {
  // console.log("getRoomsByQuery: "+JSON.stringify(query))
  let roomResult = [];
  let roomsCache = roomsDB.find( query );

  if(roomsCache != null) {
    for (let origRoom of roomsCache) {
      let room = JSON.parse(JSON.stringify(origRoom));
      room.beds = getBedsByQuery( {_roomId: Number(room.id)} );
      roomResult.push(room);
    }
  }
  return roomResult;
};

/**
 * getBedsByQuery - fetches the beds that belong to a given query
 */
var getBedsByQuery = function(query) {
  // console.log("getBedsByQuery: "+JSON.stringify(query))
  let bedsResult = [];
  let bedsCache = bedsDB.find( query );

  if(bedsCache != null) {
    for (let origBed of bedsCache) {
      // enrich the beds with the room and station information
      let singleBed = JSON.parse(JSON.stringify(origBed));
      singleBed.room = roomsDB.findOne( {id: Number(singleBed._roomId)} );
      singleBed.station = stationsDB.findOne( {id: Number(singleBed._stationId)} );
      if(singleBed._patientId != null) singleBed.patient = patientsDB.findOne( {id: Number(singleBed._patientId)} );
      bedsResult.push(singleBed);
    }
  }
  return bedsResult;
};


module.exports = function () {
  return {
    Query: {
      /** returns a Welcome query, for API availability testing */
      Welcome () {
        resetDatabase();
        return 'Welcome to MediLab';
      },
      ResetDatabase() {
        // reset the actual database in the backend
        resetDatabase();
        return true;
      },
      /** returns all known stations from stationsDB */
      Stations () {
        return stationsDB.find( {} );
      },
      /** returns one specific station given by its id */
      StationById (root, { id }) {
        return stationsDB.findOne( {id: Number(id)} );
      },
      /** returns all known rooms from roomsDB */
      Rooms () {
        return getRoomsByQuery( {} );
      },
      /** returns rooms by the given station */
      RoomsByStation (root, {_stationId}) {
        return getRoomsByQuery( {_stationId: Number(_stationId) });
      },
      /** returns one specific room given by its id */
      RoomById (root, { id }) {
        return getRoomsByQuery( {id: Number(id)} );
      },
      /** returns all known beds from bedsDB */
      Beds () {
        return getBedsByQuery( {} );
      },
      /** returns beds by the given room */
      BedsByRoom (root, {_roomId}) {
        return getRoomsByQuery( {_roomId: Number(_roomId) });
      },
      /** returns one specific bed given by its id */
      BedById (root, { id }) {
        return getBedsByQuery( {id: Number(id)} );
      },
      /** returns all known patiens from patiensDB */
      Patients () {
        return patientsDB.find( {} );
      }

    },
    Mutation: {
      checkPatientIntoBed(root, {_stationId, _bedId, _patientId }) {
        // console.log("checkPatientIntoBed _stationId="+_stationId+" _bedId="+_bedId+" _patientId="+_patientId);

        // first lookup the patient 
        let patientQuery = {_patientId: Number(_patientId)};
        let localPatient = patientsDB.findOne( {id:Number(_patientId)} );


        // console.log('found patient: '+JSON.stringify(localPatient));
        if(localPatient != null) {
          // remove the patient from any other bed
          // console.log('remove the patient from any other bed')
          
          let oldBedOfPatient = bedsDB.findOne( patientQuery );
          // console.log('found old bed: '+JSON.stringify(oldBedOfPatient));
          if(oldBedOfPatient != null) {
            delete oldBedOfPatient._patientId;
            bedsDB.updateOne( patientQuery, oldBedOfPatient);
          }

          // checkin patient into new bed (if a bed was given, otherwise dismiss patient)
          if(_bedId != -1) {
            let localBed = bedsDB.findOne( {id:Number(_bedId)} );
            if(localBed != null) {
              localBed._patientId = Number(_patientId);
              bedsDB.updateOne( {id:Number(_bedId)}, localBed);
            }
          }
          // else console.log('dismiss');
        }
        pubsub.publish(ROOMS_CHANGED, {Rooms: getRoomsByQuery( {_stationId: Number(_stationId)} )} );

        return true;
      },
      upsertPatient(root, {id, firstName, lastName, birthday, sex }) {
        console.log('id ' + id + ' firstName ' + firstName + ' lastName ' + lastName + ' birthday ' + birthday + ' sex ' + sex)

        let patient = {
          id: Number(id),
          firstName: firstName,
          lastName: lastName,
          birthday: birthday,
          sex: sex
        };

        // new patient : insert it into DB
        if (id == -1) {
          // find highest ID in db and increment by one
          let allPatients = patientsDB.find( {} );
          let highestId = 0;
          for(let x=0; x < allPatients.length; x++) {
            if(allPatients[x].id > highestId) highestId = allPatients[x].id;
          }
          patient.id = (highestId+1)
          patientsDB.insertOne(patient);
        }
        // existing patient, ID is still the same, update record
        else {
          patientsDB.updateOne( {id: patient.id}, patient);
        }

        pubsub.publish(PATIENTS_CHANGED, {Patients: patientsDB.find( {} )});

        // find out whether this patient is using a room
        let usedBed = bedsDB.findOne( {_patientId: patient.id});
        if(usedBed != null) {
          pubsub.publish(ROOMS_CHANGED, {Rooms: getRoomsByQuery( {_stationId: Number(usedBed._stationId)} )} );
        }
        return true;
      }
    },
    Subscription: {
      Rooms: {
        subscribe: () => pubsub.asyncIterator(ROOMS_CHANGED),
      },
      Patients: {
        subscribe: () => pubsub.asyncIterator(PATIENTS_CHANGED),
      }
    }
  };
};

// make sure we reset the database after startup
resetDatabase();
