const typeDefinitions = `
  
  type Patient {
    id: ID!
    firstName: String
    lastName: String
    birthday: String
    sex: String
  }

  type Station {
    id: ID!
    title: String
    bgColor: String
    leader: String
    bedMetrics: String
    utilization: String
  }

  type Room {
    id: ID!
    _stationId : ID!
    title: String
    bgColor: String
    bedMetrics: String
    utilization: String
    beds: [Bed]
  }

  type Bed {
    id: ID!,
    room : Room,
    station: Station,
    patient: Patient
  }


  type Query {
    Welcome: String,
    ResetDatabase : Boolean,

    Patients : [Patient],

    Stations : [Station],
    StationById(id: ID!) : Station,
    
    Rooms : [Room],
    RoomsByStation(_stationId: ID!) : [Room],
    RoomById(id: ID!) : Room,

    Beds : [Bed],
    BedsByRoom(_roomId: ID!) : Bed,
    BedById(id: ID!) : Bed,
  }

  type Mutation {
    checkPatientIntoBed(_stationId: ID!, _bedId: ID!, _patientId: ID!) : Boolean,
    upsertPatient(id:ID!, firstName: String!, lastName: String!, birthday: String!, sex: String!) : Boolean
  }

  type Subscription {
    Rooms: [Room],
    Patients: [Patient]
  }
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

module.exports = typeDefinitions;
