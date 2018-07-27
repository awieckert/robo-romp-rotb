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

export default {updateUserFavorites};
