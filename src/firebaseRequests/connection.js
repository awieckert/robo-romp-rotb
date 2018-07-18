import firebase from 'firebase';
import constants from '../constants.js';

const firebaseConnection = () => {
  firebase.initializeApp(constants.firebaseConfig);
};

export default firebaseConnection;
