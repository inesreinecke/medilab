const typeDefinitions = `
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
    capacity: Int
    beds: [Bed]
  }

  type Patient {
    id: ID!
    serial : String
    firstName: String
    lastName: String
    initials: String
    birthday: String
    sex: String
  }

  type Bed {
    id: ID!,
    used : Boolean,
    patient: Patient
  }

  type Query {
    Welcome: String,

    Stations : [Station],
    StationById(id: ID!): Station,
    
    Rooms : [Room],
    RoomsByStation(_stationId: ID!): [Room],

    Patients : [Patient]
  }

  type Mutation {
    checkinPatient(_stationId: ID!, _roomId: ID!, patientSerial: String!): [Room],
    addNewPatient(firstName: String!, lastName: String!, birthday: String!, sex: String!): [Patient]
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
