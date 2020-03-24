import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { ISettings } from '../definition/ISettings';
import { IPayments } from '../redux/payments-duck';
declare interface IFirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

let firebaseClient: firebase.app.App;

function getFirebaseClient() {
  const firebaseConfig: IFirebaseConfig = {
    apiKey: 'AIzaSyBMH2Hk-ieriWWDYnH2oz6l0F7ndMIaWsM',
    authDomain: 'presupuesto-app-1582410219393.firebaseapp.com',
    databaseURL: 'https://presupuesto-app-1582410219393.firebaseio.com',
    projectId: 'presupuesto-app-1582410219393',
    storageBucket: 'presupuesto-app-1582410219393.appspot.com',
    messagingSenderId: '672626645688',
    appId: '1:672626645688:web:5e11071fe35be00bd8324d'
  };

  if (firebaseClient === undefined) {
    firebaseClient = firebase.initializeApp(firebaseConfig);
  }
  return firebaseClient;
}

export function loginWithGoogle() {
  const firebaseClient = getFirebaseClient();
  const provider = new firebase.auth.GoogleAuthProvider();
  return firebaseClient
    .auth()
    .signInWithPopup(provider)
    .then(snap => {
      return snap.user;
    });
}

function getfirebaseDb() {
  const firebaseClient = getFirebaseClient();
  return firebaseClient.firestore();
}

const SETTINGS_COLLECTION = 'settings';
const PAYMENTS_COLLETION = 'payments';

export function getUserSettingsService(userId: string = '0') {
  const db = getfirebaseDb();
  const settings = db.collection(SETTINGS_COLLECTION).doc(userId);

  return settings
    .get()
    .then(setting => {
      const initialState: ISettings = { totalAmount: 0, cutOffDate: 0 };
      const dataResult = setting.data();
      const result =
        dataResult && Object.keys(dataResult).length > 0
          ? dataResult
          : initialState;
      console.log('get successfully ', result);
      return result;
    })
    .catch(e => {
      console.log('service', Error(e.message));
    });
}

export function saveUserSettingsService(userId: string, settings: ISettings) {
  const db = getfirebaseDb();
  const settingsCol = db.collection(SETTINGS_COLLECTION).doc(userId);

  return settingsCol
    .set(settings)
    .then(() => {
      console.log('saved settings');
    })
    .catch(() => {
      console.log('was an error');
    });
}

export function savePaymentsService(
  userId: string,
  payments: IPayments,
  isDefault = false
) {
  const db = getfirebaseDb();
  const collectionName = !isDefault ? PAYMENTS_COLLETION : SETTINGS_COLLECTION;
  const paymentsCol = db.collection(collectionName).doc(userId);

  console.log(collectionName);

  return paymentsCol
    .set(payments)
    .then(() => {
      console.log('saved payment');
    })
    .catch(() => {
      console.log('was an error');
    });
}

export function getUserPaymentService(userId: string = '0') {
  const db = getfirebaseDb();

  const dbCol = db.collection(PAYMENTS_COLLETION).doc(userId);

  return dbCol
    .get()
    .then(responsePayments => {
      const response =
        responsePayments.data() !== undefined &&
        Object.keys(responsePayments).length > 0
          ? (responsePayments.data() as IPayments)
          : { payments: [] };
      console.log('get successfully  response -- ', response);
      return response;
    })
    .catch(e => {
      console.log('service ', Error(e.message));
    });
}
