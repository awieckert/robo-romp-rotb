import axios from 'axios';
import constants from '../constants.js';

const updateUserFavorites = (favoritesId, favoriteBots) => {
  return new Promise ((resolve, reject) => {
    axios.put(`${constants.firebaseConfig.databaseURL}/favoriteBot/${favoritesId}.json`, favoriteBots).then((data) => {
      resolve(data);
    }).catch((err) => {
      reject(err);
    });
  });
};

const getUserSortedFavorites = (uid) => {
  return new Promise ((resolve, reject) => {
    axios.get(`${constants.firebaseConfig.databaseURL}/favoriteBot.json?orderBy="uid"&equalTo="${uid}"`).then((favorites) => {
      const favoriteBots = [];
      const favoritesArray = [];
      if (favorites.data !== null) {
        Object.keys(favorites.data).forEach((key) => {
          favoriteBots.push(favorites.data[key]);
        });
      }
      Object.keys(favoriteBots[0]).forEach((item) => {
        if ((item !== 'uid') && (item !== 'id')) {
          favoritesArray.push(favoriteBots[0][item]);
        }
      });
      const sortedFavorites = favoritesArray.sort(function (a, b) {
        return b.used - a.used;
      });
      resolve([sortedFavorites]);
    }).catch((err) => {
      reject(err);
    });
  });
};

const getUserFavorites = (uid) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${constants.firebaseConfig.databaseURL}/favoriteBot.json?orderBy="uid"&equalTo="${uid}"`)
      .then(res => {
        let favorites = {};
        if (res.data !== null) {
          Object.keys(res.data).forEach(fbKey => {
            res.data[fbKey].id = fbKey;
            favorites = (res.data[fbKey]);
          });
        }
        resolve(favorites);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export default {updateUserFavorites, getUserFavorites, getUserSortedFavorites};
