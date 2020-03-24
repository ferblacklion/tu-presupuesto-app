import { ISettings } from '../definition/ISettings';
import {
  getUserSettingsService,
  saveUserSettingsService
} from '../services/firebase';
import { Dispatch } from 'redux';

/**
 * CONSTANTS
 */
export declare interface ISettingsState extends ISettings {
  success: boolean;
}
const initialState: ISettingsState = {
  totalAmount: 0,
  cutOffDate: 0,
  success: false
};

export const GET_SETTINGS = 'GET_SETTINGS';
export type GET_SETTINGS_TYPE = typeof GET_SETTINGS;

export const SAVE_SETTINGS = 'SAVE_SETTINGS';
export type SAVE_SETTINGS_TYPE = typeof SAVE_SETTINGS;

export const SETTINGS_FETCHING = 'SETTINGS_FETCHING';
export type SETTINGS_FETCHING_TYPE = typeof SETTINGS_FETCHING;

export const FETCHING_ERROR = 'FETCHING_ERROR';
export type FETCHING_ERROR_TYPE = typeof FETCHING_ERROR;

//define action interfaces
export interface IGetSettings {
  type: GET_SETTINGS_TYPE;
  payload: ISettings;
}

export interface ISaveSettings {
  type: SAVE_SETTINGS_TYPE;
  payload: ISettings;
  fetching: boolean;
}

export interface ISettingsFetching {
  type: SETTINGS_FETCHING_TYPE;
  fetching: boolean;
}

export interface ISettingsFetchingError {
  type: FETCHING_ERROR_TYPE;
  fetching: boolean;
}
export type SettingsActionsTypes =
  | IGetSettings
  | ISaveSettings
  | ISettingsFetching
  | ISettingsFetchingError;

/**
 * REDUCERS
 * @param state
 * @param action
 */
export default function reducer(
  state = initialState,
  action: SettingsActionsTypes
) {
  switch (action.type) {
    case GET_SETTINGS:
      return { ...action.payload };
    case SAVE_SETTINGS:
      return { ...action.payload };

    case SETTINGS_FETCHING:
      return { ...state, success: true };

    case FETCHING_ERROR:
      return { ...state, success: false };

    default:
      return { ...state };
  }
}

/**
 *
 * ACTIONS
 */

export const getSettingsAction = (userId: string) => async (
  dispatch: Dispatch
) => {
  try {
    const responseData = await getUserSettingsService(userId);
    const settings: ISettings =
      responseData !== undefined && Object.keys(responseData).length > 0
        ? (responseData as ISettings)
        : { totalAmount: 0, cutOffDate: 0 };
    console.log('get settins actions');

    dispatch({ type: GET_SETTINGS, payload: settings });
    dispatch({ type: SETTINGS_FETCHING, fetching: true });
  } catch (error) {
    console.log(error);
  }
};

export const saveSettingsAction = (
  userId: string,
  settings: ISettings
) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: SAVE_SETTINGS, payload: settings });
    saveUserSettingsService(userId, settings)
      .then(function() {
        dispatch({ type: SETTINGS_FETCHING, fetching: true });
      })
      .catch(function(error) {
        console.error('Error writing document: ', error);
        dispatch({ type: FETCHING_ERROR, fetching: false });
      });
  } catch (error) {
    console.log(error);
  }
};
