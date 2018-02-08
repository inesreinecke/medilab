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
  }

  type Query {
    Welcome: String,
    Issues: [Issue],

    Stations : [Station],
    StationById(id: ID!): Station,
    
    Rooms : [Room],
    RoomsByStation(_stationId: ID!): [Room]
  }

  type Mutation {
    addIssue(id: ID!, title: String!, status: String): Issue
  }

  type Subscription {
    Issues: [Issue]
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

module.exports = typeDefinitions;
