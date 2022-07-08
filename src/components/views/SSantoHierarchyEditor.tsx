import { Color, Opacity } from 'enums/Color';
import React, { CSSProperties } from 'react';
import { useAppDispatch } from 'store/hooks';
import { call } from 'store/reducers/server';
import ServerCallTarget from 'enums/ServerCallTarget';
import { VscEdit } from 'react-icons/vsc';
import ReactTextareaAutosize from 'react-textarea-autosize';
import ColorsUtils from 'utils/colors-utils';

const SecondaryObjective = ({
  objective,
  style,
  className,
  onChange: changeHandler,
}: any & { style?: CSSProperties; className: string }) => {
  const [focused, setFocused] = React.useState(false);

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
};

const PrimaryObjective = ({
  objective,
  style,
  className,
  onChange: changeHandler,
}: any & { style?: CSSProperties; className?: string }) => {
  const [focused, setFocused] = React.useState(false);

  const secondaryObjectives = objective.secondaries || [];

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
          />
          {/* <button className="btn btn-sm ms-2" style={{ width: 32, height: 32 }}>
            <VscEllipsis />
          </button> */}
        </div>
        <div className="d-flex flex-column w-100 p-2 overflow-auto">
          {secondaryObjectives.map(
            (objective: any, index: number, objectives: any[]) => (
              <SecondaryObjective
                key={objective + index}
                objective={objective}
                className={index < objectives.length - 1 && 'mb-2'}
                onChange={(partialKey: string) =>
                  changeHandler(`secondaries.${index}.${partialKey}`)
                }
              />
            )
          )}
          {/* {secondaryObjectives.map(
            (objective: any, index: number, objectives: any[]) => (
              <SecondaryObjective
                key={objective + index}
                objective={objective}
                className={index < objectives.length - 1 && 'mb-2'}
              />
            )
          )} */}
        </div>
      </div>
    </div>
  );
};

const MainObjective = ({
  objective,
  style,
  className,
  onChange: changeHandler,
}: any & { style?: CSSProperties; className?: string }) => {
  return (
    <select
      className={
        'form-select form-select-sm' + (className ? ` ${className}` : '')
      }
      style={{ maxWidth: 200, ...style }}
      onChange={e => changeHandler('main')(e.target.value)}
      defaultValue={objective}
    >
      <option value="needs">Needs</option>
      <option value="opportunities">Opportunities</option>
    </select>
  );
};

function SSantoHierarchyEditor({ view }: any) {
  const dispatch = useAppDispatch();
  const changeHandler = (field: string) => (value: any) => {
    const changes = { [field]: value };
    console.log({ changes });
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
          />
        ))}
      </div>
    </div>
  );
}

export default SSantoHierarchyEditor;
