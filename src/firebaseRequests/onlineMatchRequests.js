import axios from 'axios';
import constants from '../constants.js';

const createOnlineMatch = (newMatch) => {
  return new Promise ((resolve, reject) => {
    axios.post(`${constants.firebaseConfig.databaseURL}/onlineMatches.json`, newMatch).then((data) => {
      resolve(data);
    }).catch((err) => {
      reject(err);
    });
  });
};

const getOnlineMatches = () => {
  return new Promise ((resolve, reject) => {
    const allMatches = [];
    axios.get(`${constants.firebaseConfig.databaseURL}/onlineMatches.json`).then((data) => {
      if (data !== null) {
        Object.keys(data.data).forEach((key) => {
          data.data[key].id = key;
          allMatches.push(data.data[key]);
        });
      }
      resolve(allMatches);
    }).catch((err) => {
      reject(err);
    });
  });
};

const joinGame = (gameId, gameObject) => {
  return new Promise ((resolve, reject) => {
    axios.put(`${constants.firebaseConfig.databaseURL}/onlineMatches/${gameId}.json`, gameObject).then((data) => {
      resolve(data);
    }).catch((err) => {
      reject(err);
    });
  });
};

const getCurrentOnlineMatch = (matchId) => {
  return new Promise ((resolve, reject) => {
    axios.get(`${constants.firebaseConfig.databaseURL}/onlineMatches/${matchId}.json`).then((data) => {
      resolve(data.data);
    }).catch((err) => {
      reject(err);
    });
  });
};

export default {createOnlineMatch, getOnlineMatches, joinGame, getCurrentOnlineMatch};
