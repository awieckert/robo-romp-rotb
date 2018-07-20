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

export default {createUser};
