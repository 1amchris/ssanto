import React from 'react';
import Toast from 'components/core/Toast';
import { useAppSelector } from 'store/hooks';
import { selectToaster } from 'store/reducers/toaster';

export enum ToastSeverity {
  /* eslint-disable no-unused-vars */
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

function ToastView() {
  const toasts = useAppSelector(selectToaster).toasts;

  return toasts.length > 0 ? (
    <div
      className="position-absolute d-flex flex-column m-3"
      style={{
        width: 450,
        zIndex: 1000,
        position: 'absolute',
        right: 0,
        bottom: 0,
      }}
    >
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={index < toasts.length - 1 ? 'mb-2 shadow' : 'shadow'}
        >
          <Toast {...toast} />
        </div>
      ))}
    </div>
  ) : (
    <></>
  );
}

export default ToastView;
