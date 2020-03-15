import React, { useRef, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { saveSettingsAction, getSettingsAction } from '../redux/settings-duck';
import { RootState } from '../redux/store';
import { IUser } from '../definition/IUser';
import { loginFromStoreAction } from '../redux/user-duck';
import { ISettings } from '../definition/ISettings';

export declare interface ISettingsProps {
  loginFromStoreAction: () => Promise<void>;
  user: IUser | null;
  saveSettingsAction: (uID: string, s: ISettings) => Promise<void>;
  getSettingsAction: (uID: string) => Promise<void>;
  settings: ISettings;
}

const Settings = ({
  user,
  loginFromStoreAction,
  saveSettingsAction,
  getSettingsAction,
  settings
}: ISettingsProps) => {
  const cutOffDate = useRef<HTMLInputElement>(null);
  const totalAmount = useRef<HTMLInputElement>(null);

  const initFetch = useCallback(() => {
    loginFromStoreAction();
  }, [loginFromStoreAction]);

  useEffect(() => {
    if (user?.uid) {
      getSettingsAction(user?.uid);
    }
  }, [getSettingsAction, user]);

  useEffect(() => {
    initFetch();
  }, [initFetch]);

  const saveUserData = () => {
    const data: ISettings = {
      cutOffDate: Number(cutOffDate.current?.value) || 31,
      totalAmount: Number(totalAmount.current?.value) || 0
    };

    const userId = user?.uid ? user?.uid : '0';
    saveSettingsAction(userId, data);
  };

  if (cutOffDate.current) {
    cutOffDate.current.value = settings.cutOffDate.toString();
  }
  if (totalAmount.current) {
    totalAmount.current.value = settings.totalAmount.toString();
  }
  console.log(settings);

  return (
    <div>
      <h1>Settings</h1>

      <>
        <p>
          <label htmlFor="">Fecha corte:</label>
          <input ref={cutOffDate} type="text" defaultValue={0} />
        </p>
        <p>
          <label htmlFor="">Monto total:</label>
          <input ref={totalAmount} type="text" defaultValue={0} />
        </p>
        <button onClick={saveUserData}>Guardar</button>
      </>
    </div>
  );
};

function mapStateToProps(state: RootState) {
  return {
    user: state.user.userData,
    settings: state.settings
  };
}
const dispatchToProps = {
  loginFromStoreAction,
  saveSettingsAction,
  getSettingsAction
};

export default connect(mapStateToProps, dispatchToProps)(Settings);
