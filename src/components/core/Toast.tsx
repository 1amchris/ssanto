import React from 'react';
import { IconBaseProps, IconType } from 'react-icons';
import { Color } from 'enums/Color';
import * as codicons from 'react-icons/vsc';
import { useAppDispatch } from 'store/hooks';
import ServerCallTarget from 'enums/ServerCallTarget';
import { call } from 'store/reducers/server';

function Toast({ id, message, severity, source, actions, closeable }: any) {
  const dispatch = useAppDispatch();

  const iconBaseProps: IconBaseProps = {
    size: 16,
    color: Color.Black,
  };

  const icons = {
    close: {
      label: 'Close view',
      name: 'VscClose',
    },
    info: {
      label: 'Info',
      name: 'VscInfo',
      color: Color.Info,
    },
    warning: {
      label: 'Warning',
      name: 'VscWarning',
      color: Color.Warning,
    },
    error: {
      label: 'Error',
      name: 'VscError',
      color: Color.Danger,
    },
  };

  const severityIcon = (icons as any)[severity];

  return (
    <div className="shadow bg-white border p-2">
      {message && (
        <div className="d-flex flex-row justify-content-between align-content-center">
          <div className="d-flex flex-row">
            <span
              style={{
                padding: '0 2.5px',
              }}
            >
              {(codicons as { [name: string]: IconType })[severityIcon.name]({
                ...iconBaseProps,
                title: severityIcon.label,
                color: severityIcon.color,
              })}
            </span>
            <div className="text-break" style={{ fontSize: 14 }}>
              {message}
            </div>
          </div>
          {closeable && (
            <div className="ps-1">
              <button
                style={{
                  padding: '0 2.5px',
                }}
                className="btn btn-sm"
                onClick={() =>
                  dispatch(
                    call({
                      target: ServerCallTarget.ToasterCloseToast,
                      args: [id],
                    })
                  )
                }
              >
                {(codicons as { [name: string]: IconType })[icons.close.name]({
                  ...iconBaseProps,
                  title: icons.close.label,
                })}
              </button>
            </div>
          )}
        </div>
      )}
      <div className="d-flex flex-row justify-content-between align-content-center mt-3">
        <div className="d-flex align-items-center text-muted text-truncate">
          <span style={{ fontSize: 12 }}>{source && `Source: ${source}`}</span>
        </div>
        {actions && (
          <div>
            {actions.map((action: any, index: number) => (
              <button
                className={`btn btn-sm btn-primary ${
                  index < actions.length - 1 ? 'me-2 ' : ''
                }`}
                key={index}
                onClick={() =>
                  dispatch(
                    call({
                      target: ServerCallTarget.ToasterTriggerAction,
                      args: [id, action.id],
                    })
                  )
                }
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Toast;
