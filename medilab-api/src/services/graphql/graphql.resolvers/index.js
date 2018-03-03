const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();
const ROOMS_CHANGED = 'ROOMS_CHANGED';
const PATIENTS_CHANGED = 'PATIENTS_CHANGED';

const Modok = require('modokdb');
const stationsDB = new Modok('stations');
const roomsDB = new Modok('rooms');
const patientsDB = new Modok('patients');


/** 
 * resetting the inMemory database 
 **/
var resetDatabase = function() {

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


  roomsDB.deleteMany({});
  roomsDB.insertMany([
    {
      id: 1,
      _stationId: 1,
      title: '1-001',
      bgColor: '#dc67ff',
      capacity: 4,
      beds: [
        {
          id: 1,
          used: true,
          _patientId : 1
        },
        {
          id: 2,
          used: true,
          _patientId : 2
        },
        {
          id: 3,
          used: false
        },
        {
          id: 4,
          used: false
        }
      ]
    },
    // {
    //   id: 2,
    //   _stationId: 1,
    //   title: '1-002',
    //   bgColor: '#dc67ff',
    //   capacity: 4
    // },
    // {
    //   id: 3,
    //   _stationId: 1,
    //   title: '1-003',
    //   bgColor: '#dc67ff',
    //   capacity: 2  
    // },
    // {
    //   id: 4,
    //   _stationId: 1,
    //   title: '1-004',
    //   bgColor: '#dc67ff',
    //   capacity: 2
    // },
    // {
    //   id: 5,
    //   _stationId: 2,
    //   title: '2-001',
    //   bgColor: '#79dd9a',
    //   capacity: 2
    // },
    // {
    //   id: 6,
    //   _stationId: 2,
    //   title: '2-002',
    //   bgColor: '#79dd9a',
    //   capacity: 4
    // },
    // {
    //   id: 7,
    //   _stationId: 2,
    //   title: '2-003',
    //   bgColor: '#79dd9a',
    //   capacity: 2
    // }
  ]);
  console.log("resetted 'rooms' on InMemoryDb");


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

};

/**
 * getRoomsByStation - fetches the rooms that belong to a given query
 */
var getRoomsByQuery = function(query) {
  let roomResult = [];
  let roomsCache = roomsDB.find( query );

  for (let origRoom of roomsCache) {
    let room = JSON.parse(JSON.stringify(origRoom));

    // enrich the beds with the patients
    for(let x=0; x < room.beds.length; x++) {
      let singleBed = room.beds[x];
      if(singleBed._patientId != null) {
        let patient = patientsDB.findOne( {id: Number(singleBed._patientId) } );
        singleBed.patient = patient;
      }
    }
    roomResult.push(room);
  }
  return roomResult;
};

// /**
//  * getAllocationsByRoom - fetches the allocations by given query
//  */
// var getAllocationsByQuery = function(query) {
//   let allocationResult = [];
//   let allocationCache = allocationsDB.find( query );

//   if(allocationCache != null) {
//     for (let allocation of allocationCache) {
//       let singleAllocation = JSON.parse(JSON.stringify(allocation));
//       // lookup the patient and merge it into the allocation
//       let singlePatient = patientsDB.findOne( {id : Number(singleAllocation._patientId)} );
//       singleAllocation.patient = singlePatient;
//       allocationResult.push(singleAllocation);
//     }
//     return allocationResult;
//   }
// };


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
        return stationsDB.findOne({ id: Number(id) });
      },
      /** returns all known rooms from roomsDB */
      Rooms () {
        return getRoomsByQuery( {} );
      },
      /** returns one specific room given by its id */
      RoomsByStation (root, {_stationId}) {
        return getRoomsByQuery( {_stationId: Number(_stationId) });
      },
      Patients () {
        return patientsDB.find( {} );
      }

    },
    Mutation: {
      checkinPatient(root, {_stationId, _roomId, patientSerial }, { db }) {
        let newAllocation = {};

        // first lookup the patient 
        let localPatient = null;
        for (let patient of patientsCache) {
          if(patientSerial == patient.serial) {
            localPatient = patient;
          }
        }
        // console.log(JSON.stringify(localPatient));
        if(localPatient != null) {
          
          // remove the patient from any maybe existing allocation
          let id = 0;
          for (let alloc of allocationCache) {
            if(alloc.id >= id) id = alloc.id;
            if(alloc.patientSerial == patientSerial) {
              allocationCache = allocationCache.filter(patient => patient.patientSerial != patientSerial);
            }
          }
          id += 1;
          // only allocate the petient when a room was given, else dismiss the patient
          if(_roomId != -1) {
            newAllocation = {
              id,
              _stationId,
              _roomId,
              patientSerial,
            };
            allocationCache.push(newAllocation);
            newAllocation.patient = localPatient;
          }
        }

        let currentRoomsByStation = getRoomsByStation(_stationId);
        console.log(currentRoomsByStation);
        pubsub.publish(ROOMS_CHANGED, {Rooms: currentRoomsByStation});

        return currentRoomsByStation;
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
