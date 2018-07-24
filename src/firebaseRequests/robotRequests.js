import axios from 'axios';
import constants from '../constants.js';

const getRobots = () => {
  return new Promise ((resolve, reject) => {
    const allRobots = [];
    axios.get(`${constants.firebaseConfig.databaseURL}/robots.json`).then((data) => {
      if (data !== null) {
        Object.keys(data.data).forEach((key) => {
          data.data[key].id = key;
          allRobots.push(data.data[key]);
        });
      }
      resolve(allRobots);
    }).catch((err) => {
      reject(err);
    });
  });
};

export default {getRobots};
