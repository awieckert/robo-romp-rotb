import axios from 'axios';
import constants from '../constants.js';

const createUser = (newUser) => {
  return new Promise ((resolve, reject) => {
    axios.post(`${constants.firebaseConfig.databaseURL}/userData.json`, newUser).then((data) => {
      resolve(data);
    }).catch((err) => {
      reject(err);
    });
  });
};

const getUser = (uid) => {
  return new Promise ((resolve, reject) => {
    let activeUser = {};
    axios.get(`${constants.firebaseConfig.databaseURL}/userData.json?orderBy="uid"&equalTo="${uid}"`).then((data) => {
      if (data !== null) {
        Object.keys(data.data).forEach((key) => {
          data.data[key].id = key;
          activeUser = data.data[key];
        });
      }
      resolve(activeUser);
    }).catch((err) => {
      reject(err);
    });
  });
};

const getUsersBySpWins = () => {
  return new Promise ((resolve, reject) => {
    const leaders = [];
    axios.get(`${constants.firebaseConfig.databaseURL}/userData.json?orderBy="spWins"&limitToLast=5`).then((data) => {
      if (data !== null) {
        Object.keys(data.data).forEach((key) => {
          data.data[key].id = key;
          leaders.push(data.data[key]);
        });
      }
      const sortedLeaders = leaders.sort(function (a, b) {
        return b.spWins - a.spWins;
      });
      resolve(sortedLeaders);
    }).catch((err) => {
      reject(err);
    });
  });
};

const getUsersByOlWins = () => {
  return new Promise ((resolve, reject) => {
    const leaders = [];
    axios.get(`${constants.firebaseConfig.databaseURL}/userData.json?orderBy="olWins"&limitToLast=5`).then((data) => {
      if (data !== null) {
        Object.keys(data.data).forEach((key) => {
          data.data[key].id = key;
          leaders.push(data.data[key]);
        });
      }
      const sortedLeaders = leaders.sort(function (a, b) {
        return b.olWins - a.olWins;
      });
      resolve(sortedLeaders);
    }).catch((err) => {
      reject(err);
    });
  });
};

const updateUserProfile = (profileId, userProfile) => {
  return new Promise ((resolve, reject) => {
    axios.put(`${constants.firebaseConfig.databaseURL}/userData/${profileId}.json`, userProfile).then((data) => {
      resolve(data);
    }).catch((err) => {
      reject(err);
    });
  });
};

export default {createUser, getUser, getUsersBySpWins, getUsersByOlWins, updateUserProfile};
