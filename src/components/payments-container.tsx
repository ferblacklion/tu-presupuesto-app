import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
import { IPayment, IPayments } from '../definition/IPayment';
import { IUser } from '../definition/IUser';
import formatCurrency from '../utils/format-currency';
import 'firebase/firestore';
import firebase from 'firebase/app';
import { ISettings } from '../definition/ISettings';
import moment from 'moment';
import addClass from '../utils/add-class';
import removeClass from '../utils/remove-class';
import 'moment/locale/es';

export declare interface IPaymentsContainer {
  title: string;
  user: IUser | null;
  payments: IPayments;
  settings: ISettings;
  isDefaultData?: boolean;
  deletePaymentsAction: (paymentId: string, userId: string) => Promise<void>;
  savePaymentAction: (userId: string, payment: IPayment) => Promise<void>;
  getPaymentsAction: (userId: string, cutOffDate: number) => Promise<void>;
  getPaymentsDefaultAction: (userId: string) => Promise<void>;
}

export declare interface IFormPaymentState {
  id?: string;
  cost: string;
  name: string;
  datetime?: firebase.firestore.Timestamp | null;
}

function PaymentsContainer({
  title,
  user,
  payments,
  isDefaultData = false,
  settings,
  savePaymentAction,
  getPaymentsAction,
  deletePaymentsAction,
  getPaymentsDefaultAction
}: IPaymentsContainer) {
  const [formData, setFormData] = useState<IFormPaymentState>({
    name: '',
    cost: ''
  });

  const [deletePayment, setDeletePayment] = useState<IFormPaymentState>({
    id: '',
    name: '',
    cost: '',
    datetime: null
  });

  let costInput: any = null;
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const savePayments = () => {
    if (!user) return;
    const number = Number(costInput.state.numAsString);

    const singlePayment: IPayment = {
      name: formData.name,
      cost: !isNaN(number) ? number : 0,
      isDefault: isDefaultData,
      datetime: firebase.firestore.Timestamp.fromDate(moment().toDate())
    };

    if (singlePayment.cost > settings.totalAmount) {
      // TODO: show error to the user
      alert('La cantidad es muy elevada al presupuesto establecido');
      setFormData({ name: '', cost: '' });
      return;
    }

    if (singlePayment.name.trim() && singlePayment.cost > 0) {
      setSaving(true);
      if (user.uid)
        savePaymentAction(user.uid, singlePayment)
          .then(() => {
            setFormData({ name: '', cost: '' });

            if (user.uid) {
              getPaymentsDefaultAction(user.uid);
              if (!isDefaultData)
                getPaymentsAction(user.uid, settings.cutOffDate);
            }
          })
          .then(() =>
            setTimeout(() => {
              setSaving(false);
              hideAddModal();
            }, 300)
          );
    }
  };

  const deleteCostItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDeleting(true);
    const id = deletePayment.id || '';

    if (id && user && user.uid) {
      deletePaymentsAction(id, user.uid).then(() => {
        setTimeout(() => {
          setDeleting(false);
          hideDeleteModal();
        }, 300);
        setDeletePayment({ id: '', name: '', cost: '' });
      });
    }
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ name: e.target.value, cost: formData.cost });
  };

  const onChangeCost = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ name: formData.name, cost: e.target.value });
  };

  const showAddModal = () => {
    const modal = document.querySelector<HTMLDivElement>('#modal-add');
    addClass(modal, 'modal--open');
  };

  const hideAddModal = () => {
    const modal = document.querySelector<HTMLDivElement>('#modal-add');
    removeClass(modal, 'modal--open');
    setFormData({ name: '', cost: '' });
  };

  const showDeleteModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    console.log('close');

    const id = e.currentTarget.getAttribute('data-id') || '';

    const payment = payments.payments.filter(p => p.id === id).shift();

    if (id && payment) {
      setDeletePayment({
        id: id,
        name: payment.name,
        cost: payment.cost.toString(),
        datetime: payment.datetime
      });
    }

    const modal = document.querySelector<HTMLDivElement>('#modal-delete');
    addClass(modal, 'modal--open');
  };

  const hideDeleteModal = () => {
    const modal = document.querySelector<HTMLDivElement>('#modal-delete');
    removeClass(modal, 'modal--open');
  };

  return (
    <>
      <span onClick={showAddModal} className="btn" id="add">
        <span>
          <svg>
            <use xlinkHref="#plus" />
          </svg>
          Agregar Gasto
        </span>
      </span>

      <div className="box box-m-b">
        <div className="box-header">
          <p className="text text-extrabold text-lg text-up text-blue">
            {title}
          </p>
        </div>
        <div className="box-content">
          <ul id={'payments-list'}>
            {payments.payments.map((p, i: number) => (
              <li key={p.id}>
                <span>
                  <strong>{p.name}</strong>{' '}
                  {moment(p.datetime.toDate()).format('ll')}
                </span>
                <span>
                  {formatCurrency(p.cost)}
                  <a href="/" data-id={p.id} onClick={showDeleteModal}>
                    <svg>
                      <use xlinkHref="#delete" />
                    </svg>
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div id={'modal-delete'} className="modal modal-delete">
        <div>
          <div onClick={hideAddModal} className="modal-mask"></div>
          <div className="modal-box box">
            <p className="text text-red">¿Eliminar gasto seleccionado?</p>
            <p>
              <span>
                <strong>{deletePayment.name}</strong>{' '}
                {deletePayment.datetime &&
                  moment(deletePayment.datetime.toDate()).format('ll')}
              </span>
              <span>{formatCurrency(deletePayment.cost)}</span>
            </p>

            <div>
              <button onClick={deleteCostItem} className="btn btn-red">
                <span>{!deleting ? 'Eliminar' : 'Eliminando...'}</span>
              </button>
              <button onClick={hideDeleteModal} className="btn">
                <span>Cancelar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id={'modal-add'} className="modal modal-add">
        <div>
          <div onClick={hideAddModal} className="modal-mask"></div>
          <div className="modal-box box">
            <p className="text text-bold text-blue">Agregar Gasto</p>
            <div className="input">
              <label htmlFor={'cost-name'}>Nombre del Gasto</label>
              {/* <input type="text" id="nombre-gasto" /> */}
              <input
                autoComplete="off"
                onChange={onChangeName}
                minLength={3}
                id="cost-name"
                type="text"
                value={formData.name}
              />
            </div>
            <div className="input">
              <label htmlFor={'cost'}>Cantidad</label>
              {/* <input type="tel" id="cantidad" /> */}
              <NumberFormat
                onChange={onChangeCost}
                ref={(el: any) => (costInput = el)}
                decimalScale={2}
                thousandSeparator={true}
                id="cost"
                prefix={'Q'}
                value={formData.cost}
                autoComplete="off"
                inputMode={'decimal'}
                allowNegative={false}
              />
            </div>
            <div className="btns">
              <button onClick={hideAddModal} className="btn btn-red">
                <span>Cancelar</span>
              </button>
              <button onClick={savePayments} className="btn">
                <span>{!saving ? 'Agregar' : 'Agregando...'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentsContainer;
