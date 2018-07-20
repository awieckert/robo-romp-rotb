import axios from 'axios';
import constants from '../constants.js';

const createUser = (newUser) => {
  return new Promise ((resolve, reject) => {
    axios.post(`${constants.firebaseConfig.databaseURL}/users.json`, newUser).then((data) => {
      resolve(data);
    }).catch((err) => {
      reject(err);
    });
  });
};

const getUser = (uid) => {
  return new Promise ((resolve, reject) => {
    let activeUser = {};
    axios.get(`${constants.firebaseConfig.databaseURL}/users.json?orderBy="uid"&equalTo="${uid}"`).then((data) => {
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

// const getUsersByWins = () => {
//   return new Promise ((resolve, reject) => {
//     let activeUser = {};
//     axios.get(`${constants.firebaseConfig.databaseURL}/users.json?orderBy="uid"&equalTo="${uid}"`).then((data) => {
//       if (data !== null) {
//         Object.keys(data.data).forEach((key) => {
//           data.data[key].id = key;
//           activeUser = data.data[key];
//         });
//       }
//       resolve(activeUser);
//     }).catch((err) => {
//       reject(err);
//     });
//   });
// };

export default {createUser, getUser};
