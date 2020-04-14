import { ISettings } from '../definition/ISettings';
import {
  getUserSettingsService,
  saveUserSettingsService
} from '../services/firebase';
import { Dispatch } from 'redux';
import { initialSettingsState } from './initialState';

/**
 * CONSTANTS
 */
export const GET_SETTINGS = 'GET_SETTINGS';
export const SAVE_SETTINGS = 'SAVE_SETTINGS';
export const SETTINGS_FETCHING = 'SETTINGS_FETCHING';
export const FETCHING_ERROR = 'FETCHING_ERROR';

//define action interfaces
export interface IGetSettings {
  type: typeof GET_SETTINGS;
  payload: ISettings;
}

export interface ISaveSettings {
  type: typeof SAVE_SETTINGS;
  payload: ISettings;
  fetching: boolean;
}

export interface ISettingsFetching {
  type: typeof SETTINGS_FETCHING;
  fetching: boolean;
}

export interface ISettingsFetchingError {
  type: typeof FETCHING_ERROR;
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
  state = initialSettingsState,
  action: SettingsActionsTypes
) {
  switch (action.type) {
    case GET_SETTINGS:
      return { ...action.payload, success: false };
    case SAVE_SETTINGS:
      return { ...state, ...action.payload, success: true };

    case SETTINGS_FETCHING:
      return { ...state, success: true };

    case FETCHING_ERROR:
      return { ...state, success: false };

    default:
      return state;
  }
}

/**
 *
 * ACTIONS
 *
 */

export const getSettingsAction = (userId: string | undefined | null) => async (
  dispatch: Dispatch
) => {
  if (!userId) {
    Promise.reject('invalid userId');
    return;
  }
  try {
    const responseData = await getUserSettingsService(userId);
    const settings: ISettings =
      responseData !== undefined && Object.keys(responseData).length > 0
        ? (responseData as ISettings)
        : { totalAmount: 0, cutOffDate: 0 };
    //console.log('get settins actions ---', settings);

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
