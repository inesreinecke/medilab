const typeDefinitions = `
  
  type Patient {
    id: ID!
    serial : String
    firstName: String
    lastName: String
    initials: String
    birthday: String
    sex: String
  }

  type Station {
    id: ID!
    title: String
    bgColor: String
    leader: String
  }

  type Room {
    id: ID!
    _stationId : ID!
    title: String
    bgColor: String
    beds: [Bed]
  }

  type Bed {
    id: ID!,
    used : Boolean,
    room : Room,
    station: Station,
    patient: Patient
  }

  type Query {
    Welcome: String,

    Patients : [Patient]

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
    checkPatientIntoBed(_bedId: ID!, _patientId: ID!) : Boolean,
    addNewPatient(firstName: String!, lastName: String!, birthday: String!, sex: String!) : [Patient]
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
