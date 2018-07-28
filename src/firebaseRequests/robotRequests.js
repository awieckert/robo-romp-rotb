import axios from 'axios';
import constants from '../constants.js';

const getRobots = () => {
  return new Promise ((resolve, reject) => {
    const allRobots = [];
    axios.get(`${constants.firebaseConfig.databaseURL}/robots.json`).then((data) => {
      if (data !== null) {
        Object.keys(data.data).forEach((key) => {
          allRobots.push(data.data[key]);
        });
      }
      resolve(allRobots);
    }).catch((err) => {
      reject(err);
    });
  });
};

const getMostUsedBots = () => {
  return new Promise ((resolve, reject) => {
    axios.get(`${constants.firebaseConfig.databaseURL}/mostUsed.json?orderBy="used"&limitToLast=3`).then((data) => {
      const usedRobots = [];
      if (data !== null) {
        Object.keys(data.data).forEach((key) => {
          usedRobots.push(data.data[key]);
        });
      }
      const sortedUsedRobots = usedRobots.sort(function (a, b) {
        return b.used - a.used;
      });
      resolve(sortedUsedRobots);
    }).catch((err) => {
      reject(err);
    });
  });
};

const getMostWinningBots = () => {
  return new Promise ((resolve, reject) => {
    axios.get(`${constants.firebaseConfig.databaseURL}/mostWins.json?orderBy="wins"&limitToLast=3`).then((data) => {
      const winningRobots = [];
      if (data !== null) {
        Object.keys(data.data).forEach((key) => {
          winningRobots.push(data.data[key]);
        });
      }
      const sortedWinningRobots = winningRobots.sort(function (a, b) {
        return b.wins - a.wins;
      });
      resolve(sortedWinningRobots);
    }).catch((err) => {
      reject(err);
    });
  });
};

export default {getRobots, getMostUsedBots, getMostWinningBots};
