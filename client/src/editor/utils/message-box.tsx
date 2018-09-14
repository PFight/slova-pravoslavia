import ReactDOM from 'react-dom';
import { Alert } from '@blueprintjs/core';
import React from 'react';

export class MessageBox {
  static async ShowConfirmation(message: string) {
    return new Promise((resolve, reject) => {
      let container = document.createElement("div");
      document.body.appendChild(container);
      let dispose = () => {
        ReactDOM.unmountComponentAtNode(container);
        container.remove();
      }
      let accept = () => {
        resolve();
        dispose();
      }
      let cancel = () => {
        reject();
        dispose();
      }
      ReactDOM.render(
        <Alert
            cancelButtonText="Отмена"
            confirmButtonText="ОК"
            isOpen={true}
            onCancel={cancel}
            onConfirm={accept}>
            <p>{message}</p>
        </Alert>, 
        container);
    });    
  }
}