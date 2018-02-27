const typeDefinitions = `
  type Issue {
    id: ID!
    title: String
    status: String
    created_at: String
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
    capacity: Int
    allocation: [Allocation]
  }

  type Patient {
    id: ID!
    serial : String!
    firstName: String
    lastName: String
    initials: String
    birthday: String
    sex: String
  }

  type Allocation {
    id: ID!
    _stationId: ID!
    _roomId: ID!
    patient: Patient
  }

  type Query {
    Welcome: String,
    Issues: [Issue],

    Stations : [Station],
    StationById(id: ID!): Station,
    
    Rooms : [Room],
    RoomsByStation(_stationId: ID!): [Room],

    Allocation : [Allocation], 

    Patients : [Patient]
  }

  type Mutation {
    addIssue(id: ID!, title: String!, status: String): Issue,
    checkinPatient(_stationId: ID!, _roomId: ID!, patientSerial: String!): [Room],
    addNewPatient(firstName: String!, lastName: String!, birthday: String!, sex: String!): [Patient]
  }

  type Subscription {
    Issues: [Issue],
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
