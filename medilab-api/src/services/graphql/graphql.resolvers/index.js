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
  patientsDB.deleteMany({});
  patientsDB.insertMany([
    {
      id: 1,
      serial: 'tr19790923',
      firstName: 'Thomas',
      lastName: 'Reinecke',
      initials: 'TR',
      birthday: '1979-09-23',
      sex: 'male'
    },
    {
      id: 2,
      serial: 'ir19810105',
      firstName: 'Ines',
      lastName: 'Reinecke',
      initials: 'IR',
      birthday: '1981-01-05',
      sex: 'female'
    },
    {
      id: 3,
      serial: 'ar20081205',
      firstName: 'Anna',
      lastName: 'Reinecke',
      initials: 'AR',
      birthday: '2008-12-05',
      sex: 'female'
    },
  ]);
  console.log("resetted 'patients' on InMemoryDb");

  // reset Stations
  stationsDB.deleteMany({});
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
  roomsDB.deleteMany({});
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
  bedsDB.deleteMany({});
  bedsDB.insertMany([
    {
      id: 1,
      used: true,
      _roomId: 1,
      _stationId: 1,
      _patientId : 1
    },
    {
      id: 2,
      used: true,
      _roomId: 1,
      _stationId: 1,
      _patientId : 2
    },
    {
      id: 3,
      _roomId: 1,
      _stationId: 1,
      used: false
    },
    {
      id: 4,
      _roomId: 1,
      _stationId: 1,
      used: false
    },
    {
      id: 5,
      _roomId: 5,
      _stationId: 2,
      used: false
    },
    {
      id: 6,
      _roomId: 5,
      _stationId: 2,
      used: false
    }
  ]
  );
  console.log("resetted 'beds' on InMemoryDb");


};

/**
 * getRoomsByStation - fetches the rooms that belong to a given query
 */
var getRoomsByQuery = function(query) {
  console.log("getRoomsByQuery: "+JSON.stringify(query))
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
  console.log("getBedsByQuery: "+JSON.stringify(query))
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
      checkPatientIntoBed(root, {_bedId, _patientId }) {
        let newAllocation = {};
        console.log("checkPatientIntoBed _bedId="+_bedId+" _patientId="+_patientId);

        // first lookup the patient 
        let localPatient = patientsDB.findOne( {id:Number(_patientId)} );
        let localBed = bedsDB.findOne( {id:Number(_bedId)} );

 
        if(localPatient != null) {
          // remove the patient from any other bed
          let patientQuery = {_patientId: Number(_patientId)};
          let oldBedOfPatient = bedsDB.findOne( patientQuery);
          if(oldBedOfPatient != null) {
            delete oldBedOfPatient._patientId;
            oldBedOfPatient.used = false;
            bedsDB.updateOne( patientQuery, oldBedOfPatient);
          }

          // checkin patient into new bed (if a bed was given, otherwise dismiss patient)
          if(localBed != null) {
            localBed._patientId = _patientId;
            bedsDB.updateOne( {id:Number(_bedId)}, localBed);
          }
          else console.log("dismiss");
        }
        pubsub.publish(ROOMS_CHANGED, {Rooms: getRoomsByQuery( {} )} );

        return true;
        // return currentRoomsByStation;
      },
      addNewPatient(root, {firstName, lastName, birthday, sex }, { db }) {

        // create some props we need to create the patient (like initials and serial)
        let initials = firstName.toLowerCase().substring(0,1) + lastName.toLowerCase().substring(0,1);
        let cutBirthday = birthday.replace(/-/g,'');
        let serial = initials + cutBirthday;
        console.log('initials ' + initials + ' firstName ' + firstName + ' lastName ' + lastName + ' birthday ' + birthday + ' cutBirthday ' + cutBirthday + ' sex ' + sex)

        // find the latest index to generate the id
        let id = 0;
        for (let singlePatient of patientsCache) {
          if(singlePatient.id >= id) id = singlePatient.id;
        }
        id += 1;

        let newPatient = {
          id,
          serial,
          firstName,
          lastName,
          initials,
          birthday,
          sex
        };
        patientsCache.push(newPatient);

        pubsub.publish(PATIENTS_CHANGED, {Patients: patientsCache});
        return patientsCache;
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
