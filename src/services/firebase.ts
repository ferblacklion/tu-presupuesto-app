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

const allPaymentColletionName = `all-payments`;

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
    .collection(
      PAYMENTS_COLLETION + '/' + userId + '/' + allPaymentColletionName
    )
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
const year = moment().year();
const month = moment().month() + 1;
const day = moment().date();

export function getUserPaymentServiceT(
  userId: string = '0',
  cutOffDate: number
) {
  const db = getfirebaseDb();
  const isCurrentMonth = day <= cutOffDate;
  const startDate = isCurrentMonth ? 1 : day;
  const endMonth = isCurrentMonth ? month : month + 1;

  const startFullDate = firebase.firestore.Timestamp.fromDate(
    new Date(`${year}-${month}-${startDate}`) //YYY-MM-DD
  );
  console.log('start ', startDate);

  var endDate = new Date(`${year}-${endMonth}-${cutOffDate}`);
  endDate.setHours(23, 59, 59, 999);

  const endFullDate = firebase.firestore.Timestamp.fromDate(endDate);
  console.log('end', endDate);

  let query: firebase.firestore.Query<firebase.firestore.DocumentData> = db
    .collection(
      PAYMENTS_COLLETION + '/' + userId + '/' + allPaymentColletionName
    )
    .where('isDefault', '==', false)
    .orderBy('datetime')
    .startAt(startFullDate)
    .endAt(endFullDate);

  return query
    .get()

    .then(querySnapshot => {
      //alert(querySnapshot.size);
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

export function getUserPaymentDefaultService(userId: string = '0') {
  const db = getfirebaseDb();

  const query: firebase.firestore.Query<firebase.firestore.DocumentData> = db
    .collection(
      PAYMENTS_COLLETION + '/' + userId + '/' + allPaymentColletionName
    )
    .where('isDefault', '==', true)
    .orderBy('datetime');

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
    .collection(
      PAYMENTS_COLLETION + '/' + userId + '/' + allPaymentColletionName
    )
    .doc(id)
    .delete()
    .then(function() {
      console.log('Document successfully deleted!');
    })
    .catch(function(error) {
      console.error('Error removing document: ', error);
    });
}
