import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import {
  saveSettingsAction,
  getSettingsAction,
  ISettingsState
} from '../redux/settings-duck';
import { RootState } from '../redux/store';
import { IUser } from '../definition/IUser';
import { loginFromStoreAction } from '../redux/user-duck';
import { ISettings } from '../definition/ISettings';

export declare interface ISettingsProps {
  loginFromStoreAction: () => Promise<void>;
  user: IUser | null;
  saveSettingsAction: (uID: string, s: ISettings) => Promise<void>;
  getSettingsAction: (uID: string) => Promise<void>;
  settings: ISettingsState;
}

const SettingsPage = ({
  user,
  loginFromStoreAction,
  saveSettingsAction,
  getSettingsAction,
  settings
}: ISettingsProps) => {
  const cutOffDateElement = useRef<HTMLInputElement>(null);
  const totalAmountElement = useRef<HTMLInputElement>(null);
  const [cutOffDate, setCutOffDate] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const initFetch = () => {
      loginFromStoreAction();
    };
    initFetch();
  }, [loginFromStoreAction]);

  useEffect(() => {
    if (user !== null) {
      getSettingsAction(user.uid || '0');
    }
  }, [getSettingsAction, user]);

  useEffect(() => {
    setCutOffDate(settings.cutOffDate);
    setTotalAmount(settings.totalAmount);
  }, [settings]);

  const saveUserData = () => {
    const currentUserSettings: ISettings = {
      cutOffDate: cutOffDateElement.current?.value
        ? Number(cutOffDateElement.current?.value)
        : 31,
      totalAmount: totalAmountElement.current?.value
        ? Number(totalAmountElement.current.value)
        : 5000
    };
    console.log(currentUserSettings);

    saveSettingsAction(user?.uid || '0', currentUserSettings);
  };

  return (
    <div>
      <h1>Settings</h1>

      <>
        <p>
          <label htmlFor="">Fecha corte:</label>
          <input
            ref={cutOffDateElement}
            type="text"
            name="cut-off-date"
            defaultValue={cutOffDate}
          />
        </p>
        <p>
          <label htmlFor="">Monto total:</label>
          <input
            ref={totalAmountElement}
            type="text"
            name="total-amount"
            defaultValue={totalAmount}
          />
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

export default connect(mapStateToProps, dispatchToProps)(SettingsPage);
