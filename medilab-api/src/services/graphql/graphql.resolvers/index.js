const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();
const ISSUE_ADDED = 'ISSUE_ADDED';

var stationCache = [
  {
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
  },
];


var roomsCache = [
  {
    id: 1,
    _stationId: 1,
    title: '1-001',
    bgColor: '#dc67ff',
    capacity: 4,
    allocation: [
      {
        id: 1,
        lastName: 'Reinecke',
        firstName: 'Thomas',
        initials: 'TR'
      },
      {
        id: 2,
        lastName: 'Reinecke',
        firstName: 'Thomas',
        initials: 'TR'
      }
    ]
  },
  {
    id: 2,
    _stationId: 1,
    title: '1-002',
    bgColor: '#dc67ff',
    capacity: 2,
    allocation: []
  },
  {
    id: 3,
    _stationId: 1,
    title: '1-003',
    bgColor: '#dc67ff',
    capacity: 2,
    allocation: []    
  },
  {
    id: 4,
    _stationId: 1,
    title: '1-004',
    bgColor: '#dc67ff',
    capacity: 2,
    allocation: []
  },
  {
    id: 5,
    _stationId: 2,
    title: '2-001',
    bgColor: '#79dd9a',
    capacity: 2,
    allocation: []
  },
  {
    id: 6,
    _stationId: 2,
    title: '2-002',
    bgColor: '#79dd9a',
    capacity: 4,
    allocation: []
  },
  {
    id: 7,
    _stationId: 2,
    title: '2-003',
    bgColor: '#79dd9a',
    capacity: 2,
    allocation: []
  }
];


var issueCache = [
  {
    id: 1,
    title: 'Issue '+Math.floor((Math.random() * 10) + 1),
    status: 'open',
    created_at: new Date()
  },
  {
    id: 2,
    title: 'Issue '+Math.floor((Math.random() * 10) + 1),
    status: 'closed',
    created_at: new Date()
  },
  {
    id: 3,
    title: 'Issue '+Math.floor((Math.random() * 10) + 1),
    status: 'limboState',
    created_at: new Date()
  }
]; 

module.exports = function () {
  return {
    Query: {
      Welcome (root, args, context) {
        return 'Welcome to MediLab';
      },
      Issues (root, { id }, context) {
        return issueCache;
      },
      Stations (root, args, context) {
        return stationCache;
      },
      StationById (root, { id }, context) {
        for (station of stationCache) {
          if(station.id == id) return station;
        }
        return null;
      },
      Rooms (root, args, context) {
        return roomsCache;
      },
      RoomsByStation (root, {_stationId}, context) {
        let selectedRooms = [];
        for (room of roomsCache) {
          if(room._stationId == _stationId) selectedRooms.push(room);
        }
        return selectedRooms;
      }
    },
    Mutation: {
      addIssue(root, { id, title, status }, context) {
        const issue = {
          id,
          title,
          status,
          created_at: new Date()
        };
        issueCache.push(issue);

        console.log(JSON.stringify(issueCache));

        // pubsub.publish(ISSUE_ADDED, { issueAdded: issue });
        pubsub.publish(ISSUE_ADDED, {Issues: issueCache});

        return issue;
      },
    },
    Subscription: {
      Issues: {
        subscribe: () => pubsub.asyncIterator(ISSUE_ADDED),
      }
    }
  };
};
