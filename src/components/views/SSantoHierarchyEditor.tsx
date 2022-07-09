import { Color, Opacity } from 'enums/Color';
import React, { CSSProperties } from 'react';
import { useAppDispatch } from 'store/hooks';
import { call } from 'store/reducers/server';
import ServerCallTarget from 'enums/ServerCallTarget';
import { VscAdd, VscEdit } from 'react-icons/vsc';
import ReactTextareaAutosize from 'react-textarea-autosize';
import ColorsUtils from 'utils/colors-utils';

function SecondaryObjective({
  objective,
  style,
  className,
  onChange: changeHandler,
}: any & { style?: CSSProperties; className: string }) {
  const [focused, setFocused] = React.useState(false);
  const [editing, setEditing] = React.useState<string | undefined>();

  return (
    <div
      className={
        'bg-white p-2 shadow-sm rounded border small position-relative' +
        (className ? ` ${className}` : '')
      }
      style={{
        cursor: 'pointer',
        ...style,
      }}
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
      onClick={() => {
        console.log('clicked', objective.name);
      }}
    >
      <div
        className="btn btn-sm position-absolute"
        style={{
          background: ColorsUtils.applyOpacity(
            Color.White,
            Opacity.SevenEighths
          ),
          top: 0,
          right: 0,
          width: 32,
          height: 32,
          display: focused ? undefined : 'none',
          color: Color.Primary,
        }}
      >
        <VscEdit />
      </div>
      <ReactTextareaAutosize
        className="form-control form-control-sm form-control-plaintext px-1"
        defaultValue={objective.name}
        style={{ resize: 'none' }}
        onClick={e => e.stopPropagation()}
        onChange={e => changeHandler('name')(e.target.value)}
        key={editing !== 'name' && objective.name}
        onFocus={() => setEditing('name')}
        onBlur={() => setEditing(undefined)}
      />
      {objective.attributes?.length > 0 && (
        <div className="pt-1">
          <small className="text-secondary">
            Attributes ({objective.attributes.length})
          </small>
          <ul className="list-unstyled fst-italic mb-0 ps-1">
            {objective.attributes.map((attribute: any, index: number) => (
              <li key={attribute.name + index} className="text-truncate">
                <span>{attribute.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function PrimaryObjective({
  objective,
  style,
  className,
  onChange: changeHandler,
  onCreate: publishCreateRequest,
}: any & { style?: CSSProperties; className?: string }) {
  const [focused, setFocused] = React.useState(false);
  const [editing, setEditing] = React.useState<string | undefined>();

  const secondaryObjectives = objective.secondaries || [];

  console.log({ secondaryObjectives });

  return (
    <div
      className={
        'p-2' +
        (focused ? ' bg-light' : '') +
        (className ? ` ${className}` : '')
      }
      style={{ ...style }}
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div
        className="d-flex flex-column mh-100"
        style={{
          minWidth: 300,
          width: 300,
          height: 'fit-content',
          borderLeft: '2px solid',
          borderColor: focused ? Color.Primary : 'transparent',
        }}
      >
        <div className="d-flex flex-row justify-content-between px-2">
          <input
            className="form-control form-control-sm form-control-plaintext fw-bold text-truncate px-1"
            defaultValue={objective.name}
            onChange={e => changeHandler('name')(e.target.value)}
            key={editing !== 'name' && objective.name}
            onFocus={() => setEditing('name')}
            onBlur={() => setEditing(undefined)}
          />
          {/* <button className="btn btn-sm ms-2" style={{ width: 32, height: 32 }}>
            <VscEllipsis />
          </button> */}
        </div>
        <div className="d-flex flex-column w-100 p-2 pb-1 overflow-auto">
          {secondaryObjectives.map(
            (objective: any, index: number, objectives: any[]) => (
              <SecondaryObjective
                key={objective + index}
                objective={objective}
                className={index < objectives.length - 1 && 'mb-2'}
                onChange={(partialKey: string) =>
                  changeHandler(`secondaries.${index}.${partialKey}`)
                }
                onCreate={(options: any) =>
                  publishCreateRequest({ ...options, secondary: index })
                }
              />
            )
          )}
        </div>
        <div className="d-flex flex-row pt-1">
          <AddSecondaryObjective
            onCreate={(options: any) =>
              publishCreateRequest({
                ...options,
                type: 'secondary',
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

function MainObjective({
  objective,
  style,
  className,
  onChange: changeHandler,
}: any & { style?: CSSProperties; className?: string }) {
  const [editing, setEditing] = React.useState<string | undefined>();

  return (
    <select
      className={
        'form-select form-select-sm' + (className ? ` ${className}` : '')
      }
      style={{ maxWidth: 200, ...style }}
      onChange={e => changeHandler('main')(e.target.value)}
      defaultValue={objective}
      key={editing !== 'main' && objective}
      onFocus={() => setEditing('main')}
      onBlur={() => setEditing(undefined)}
    >
      <option value="needs">Needs</option>
      <option value="opportunities">Opportunities</option>
    </select>
  );
}

function AddPrimaryObjective({
  style,
  className,
  onCreate: publishCreateRequest,
}: any) {
  const [focused, setFocused] = React.useState(false);

  const createDefaultOptions = {};

  return (
    <div
      className={
        'p-2' +
        (focused ? ' bg-light' : '') +
        (className ? ` ${className}` : '')
      }
      style={{ width: 300, minWidth: 300, ...style }}
      onFocus={() => setFocused(true)}
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
      onBlur={() => setFocused(false)}
    >
      <div
        className="p-2"
        style={{
          borderLeft: '2px solid',
          borderColor: focused ? Color.Primary : 'transparent',
        }}
      >
        <button
          className="btn btn-sm btn-outline-secondary w-100 text-truncate"
          onClick={() => publishCreateRequest(createDefaultOptions)}
        >
          <VscAdd /> Add another list
        </button>
      </div>
    </div>
  );
}

function AddSecondaryObjective({ onCreate: publishCreateRequest }: any) {
  const createDefaultOptions = {};

  return (
    <div className="w-100 px-2">
      <button
        className="btn btn-sm w-100 text-start text-secondary"
        onClick={() => publishCreateRequest(createDefaultOptions)}
      >
        <VscAdd /> Add another objective
      </button>
    </div>
  );
}

function SSantoHierarchyEditor({ view }: any) {
  const dispatch = useAppDispatch();
  const changeHandler = (field: string) => (value: any) => {
    publishChanges({ [field]: value });
  };

  const publishCreateRequest = (payload: any) => {
    publishChanges({ ':create': payload });
  };

  const publishChanges = (changes: any) => {
    dispatch(
      call({
        target: ServerCallTarget.WorkspaceViewsPublishChanges,
        args: [view.uri, changes],
      })
    );
  };

  const mainObjective = view.content?.objectives?.main;
  const primaryObjectives =
    view.content?.objectives?.[mainObjective].primaries || [];

  console.log({ primaryObjectives });

  return (
    <div className="d-flex flex-column h-100 w-100">
      <div className="p-2">
        <MainObjective
          objective={mainObjective}
          onChange={(partialKey: string) =>
            changeHandler(`objectives.${partialKey}`)
          }
        />
      </div>
      <div className="p-2 d-flex flex-row flex-fill overflow-auto">
        {primaryObjectives.map((primaryObjective: any, index: number) => (
          <PrimaryObjective
            key={primaryObjective + index}
            objective={primaryObjective}
            onChange={(partialKey: string) =>
              changeHandler(
                `objectives.${mainObjective}.primaries.${index}.${partialKey}`
              )
            }
            onCreate={(options: any) =>
              publishCreateRequest({
                ...options,
                main: mainObjective,
                primary: index,
              })
            }
          />
        ))}
        <AddPrimaryObjective
          onCreate={(options: any) =>
            publishCreateRequest({
              ...options,
              type: 'primary',
              main: mainObjective,
            })
          }
        />
      </div>
    </div>
  );
}

export default SSantoHierarchyEditor;
