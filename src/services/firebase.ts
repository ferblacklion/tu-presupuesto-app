import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { ISettings } from '../definition/ISettings';
import { IPayments, IPayment } from '../redux/payments-duck';
import moment from 'moment';
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

const montlyCollection = `${moment().month() + 1}-${moment().year()}`;

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
      //console.log('get successfully ', result);
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

export function savePaymentsService(userId: string, payment: IPayment) {
  const db = getfirebaseDb();
  const paymentsCol = db
    .collection(PAYMENTS_COLLETION + '/' + userId + '/' + montlyCollection)
    .doc();
  return paymentsCol
    .set(payment)
    .then(() => {
      console.log('saved payment');
    })
    .catch(() => {
      console.log('was an error');
    });
}

const initialPayment: IPayment = {
  id: '',
  name: '',
  cost: 0,
  isDefault: false,
  datetime: firebase.firestore.Timestamp.fromDate(new Date())
};
export function getUserPaymentService(
  userId: string = '0',
  getDefault: boolean
) {
  const db = getfirebaseDb();

  let query: firebase.firestore.Query<firebase.firestore.DocumentData> = db
    .collection(PAYMENTS_COLLETION + '/' + userId + '/' + montlyCollection)
    .where('cost', '>=', 0);

  if (getDefault) {
    query = db
      .collection(PAYMENTS_COLLETION + '/' + userId + '/' + montlyCollection)
      .where('isDefault', '==', true);
  }

  return query
    .get()

    .then(querySnapshot => {
      const dataResult: IPayments = {
        payments: []
      };
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        const data = doc.data();
        dataResult.payments.push({ ...initialPayment, ...data, id: doc.id });
      });
      return dataResult;
    })
    .catch(e => {
      console.log('service ', Error(e.message));
    });
}

export function deletePaymentService(id: string, userId: string) {
  const db = getfirebaseDb();

  return db
    .collection(PAYMENTS_COLLETION + '/' + userId + '/' + montlyCollection)
    .doc(id)
    .delete()
    .then(function() {
      console.log('Document successfully deleted!');
    })
    .catch(function(error) {
      console.error('Error removing document: ', error);
    });
}
