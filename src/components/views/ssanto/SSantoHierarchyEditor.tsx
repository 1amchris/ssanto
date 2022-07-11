import { Color } from 'enums/Color';
import React, { CSSProperties, useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import { call } from 'store/reducers/server';
import ServerCallTarget from 'enums/ServerCallTarget';
import { VscAdd, VscEdit, VscEllipsis, VscTrash } from 'react-icons/vsc';
import ReactTextareaAutosize from 'react-textarea-autosize';
import { Dropdown, DropdownButton } from 'react-bootstrap';

function AttributeRow({
  attribute,
  style,
  className,
  onChange: changeHandler,
  onDelete: deleteHandler,
  onSelect: selectHandler,
}: any & { style?: CSSProperties; className: string }) {
  const [focused, setFocused] = React.useState(false);
  const [editing, setEditing] = React.useState<string | undefined>();

  return (
    <div
      className={
        'small d-flex flex-row rounded' +
        (focused ? ' bg-light' : '') +
        (className ? ` ${className}` : '')
      }
      style={{
        cursor: 'pointer',
        ...style,
      }}
      onMouseEnter={e => {
        setFocused(true);
      }}
      onMouseLeave={e => {
        setFocused(false);
      }}
    >
      <input
        className={
          'form-control form-control-sm text-truncate fst-italic px-1' +
          (editing ? ' bg-light' : ' form-control-plaintext')
        }
        style={{ boxShadow: 'none' }}
        defaultValue={attribute.name}
        onClick={e => e.stopPropagation()}
        onChange={e => changeHandler('name')(e.target.value)}
        key={editing !== 'name' && attribute.name}
        autoFocus={editing === 'name'}
        onFocus={() => setEditing('name')}
        onBlur={() => setEditing(undefined)}
      />
      {(focused || !!editing) && (
        <div className="d-flex flex-row">
          <div
            className="btn btn-sm text-primary"
            onClick={(e: any) => {
              e.stopPropagation();
              selectHandler({ viewType: 'ssanto-attribute' });
            }}
          >
            <VscEdit />
          </div>
          <div
            className="btn btn-sm text-danger"
            onClick={(e: any) => {
              e.stopPropagation();
              deleteHandler({ type: 'attribute' });
            }}
          >
            <VscTrash />
          </div>
        </div>
      )}
    </div>
  );
}

function SecondaryObjective({
  objective,
  style,
  className,
  onChange: changeHandler,
  onCreate: createHandler,
  onDelete: deleteHandler,
  onSelect: selectHandler,
}: any & { style?: CSSProperties; className: string }) {
  const [editing, setEditing] = React.useState<string | undefined>();

  const attributes = objective.attributes || [];

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
    >
      <div className="d-flex flex-row justify-content-between pb-1">
        <ReactTextareaAutosize
          className={
            'form-control form-control-sm px-1' +
            (editing ? '' : ' form-control-plaintext')
          }
          defaultValue={objective.name}
          style={{ resize: 'none', boxShadow: 'none' }}
          onClick={e => e.stopPropagation()}
          onChange={e => changeHandler('name')(e.target.value)}
          key={editing !== 'name' && objective.name}
          autoFocus={editing === 'name'}
          onFocus={() => setEditing('name')}
          onBlur={() => setEditing(undefined)}
        />
        <DropdownButton
          title={<VscEllipsis />}
          variant="none"
          size="sm"
          className="ms-2"
          style={{ width: 32, height: 32 }}
        >
          {[
            {
              label: 'Remove',
              onClick: (e: any) => {
                e.stopPropagation();
                deleteHandler({ type: 'secondary' });
              },
            },
          ].map(({ label, ...props }, index: number) => (
            <small key={label + index}>
              <Dropdown.Item {...props}>{label}</Dropdown.Item>
            </small>
          ))}
        </DropdownButton>
      </div>
      <div className="pt-1">
        <small className="text-secondary">
          Attributes ({attributes.length})
        </small>
        {attributes.length > 0 && (
          <ul className="list-unstyled fst-italic mb-0">
            {attributes.map((attribute: any, index: number) => (
              <li key={attribute.name + index} className="text-truncate">
                <AttributeRow
                  attribute={attribute}
                  onDelete={(options: any) =>
                    deleteHandler({ ...options, attribute: index })
                  }
                  onSelect={({
                    viewType,
                    viewConfigs,
                  }: {
                    viewType: string;
                    viewConfigs: any;
                  }) =>
                    selectHandler({
                      viewType,
                      viewConfigs: {
                        ...viewConfigs,
                        attribute: index,
                      },
                    })
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <AddAttribute
        attributeCount={attributes.length ?? 0}
        onCreate={(options: any) =>
          createHandler({
            ...options,
            type: 'attribute',
          })
        }
      />
    </div>
  );
}

function PrimaryObjective({
  objective,
  style,
  className,
  onSelect: selectHandler,
  onChange: changeHandler,
  onCreate: createHandler,
  onDelete: deleteHandler,
}: any & { style?: CSSProperties; className?: string }) {
  const [focused, setFocused] = React.useState(false);
  const [editing, setEditing] = React.useState<string | undefined>();

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
        <div className="d-flex flex-row justify-content-between px-2 pb-1">
          <input
            className={
              'form-control form-control-sm fw-bold text-truncate px-1' +
              (editing ? '' : ' form-control-plaintext')
            }
            style={{ boxShadow: 'none' }}
            defaultValue={objective.name}
            onChange={e => changeHandler('name')(e.target.value)}
            key={editing !== 'name' && objective.name}
            autoFocus={editing === 'name'}
            onFocus={() => setEditing('name')}
            onBlur={() => setEditing(undefined)}
          />
          <DropdownButton
            title={<VscEllipsis />}
            variant="none"
            size="sm"
            className="ms-2"
            style={{ width: 32, height: 32 }}
          >
            {[
              {
                label: 'Remove',
                onClick: () => deleteHandler({ type: 'primary' }),
              },
            ].map(({ label, ...props }, index: number) => (
              <small key={label + index}>
                <Dropdown.Item {...props}>{label}</Dropdown.Item>
              </small>
            ))}
          </DropdownButton>
        </div>
        <div className="d-flex flex-column w-100 px-2 py-1 overflow-auto">
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
                  createHandler({ ...options, secondary: index })
                }
                onDelete={(options: any) => {
                  deleteHandler({ ...options, secondary: index });
                }}
                onSelect={({
                  viewType,
                  viewConfigs,
                }: {
                  viewType: string;
                  viewConfigs: any;
                }) =>
                  selectHandler({
                    viewType,
                    viewConfigs: {
                      ...viewConfigs,
                      secondary: index,
                    },
                  })
                }
              />
            )
          )}
        </div>
        <div className="d-flex flex-row pt-1">
          <AddSecondaryObjective
            objectiveCount={secondaryObjectives.length}
            onCreate={(options: any) =>
              createHandler({
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
      autoFocus={editing === 'main'}
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
  objectiveCount,
  onCreate: createHandler,
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
          onClick={e => {
            e.stopPropagation();
            createHandler(createDefaultOptions);
          }}
        >
          <VscAdd /> Add{' '}
          {objectiveCount && objectiveCount > 0 ? 'another' : 'a'} list
        </button>
      </div>
    </div>
  );
}

function AddSecondaryObjective({
  objectiveCount,
  onCreate: createHandler,
}: any) {
  const createDefaultOptions = {};

  return (
    <div className="w-100 px-2">
      <button
        className="btn btn-sm w-100 text-start text-secondary"
        onClick={e => {
          e.stopPropagation();
          createHandler(createDefaultOptions);
        }}
      >
        <VscAdd /> Add {objectiveCount && objectiveCount > 0 ? 'another' : 'a'}{' '}
        objective
      </button>
    </div>
  );
}

function AddAttribute({ attributeCount, onCreate: createHandler }: any) {
  const createDefaultOptions = {};

  const [focused, setFocused] = useState(false);

  return (
    <div
      className={'w-100 rounded' + (focused ? ' bg-light' : '')}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
    >
      <button
        className="btn btn-sm text-secondary w-100 text-start fst-italic"
        onClick={e => {
          e.stopPropagation();
          createHandler(createDefaultOptions);
        }}
      >
        <VscAdd /> Add {attributeCount && attributeCount > 0 ? 'another' : 'a'}{' '}
        attribute
      </button>
    </div>
  );
}

function SSantoHierarchyEditor({ view }: any) {
  const dispatch: any = useAppDispatch();
  const publishChanges = (changes: any) =>
    dispatch(
      call({
        target: ServerCallTarget.WorkspaceViewsPublishChanges,
        args: [view.uri, changes],
      })
    );

  const changeHandler = (field: string) => (value: any) =>
    publishChanges({ [field]: value });

  const createHandler = (payload: any) =>
    publishChanges({ ':create': payload });

  const deleteHandler = (payload: any) =>
    publishChanges({ ':delete': payload });

  const selectHandler = ({
    viewType: type,
    viewConfigs: configs,
  }: {
    viewType: string;
    viewConfigs: {
      main?: 'needs' | 'opportunities';
      primary?: number;
      secondary?: number;
      attribute?: number;
    };
  }) =>
    dispatch(
      call({
        target: ServerCallTarget.WorkspaceOpenView,
        args: [view.source, type, configs],
      })
    );

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
            onCreate={(options: any) =>
              createHandler({
                ...options,
                main: mainObjective,
                primary: index,
              })
            }
            onDelete={(options: any) =>
              deleteHandler({
                ...options,
                main: mainObjective,
                primary: index,
              })
            }
            onSelect={({
              viewType,
              viewConfigs,
            }: {
              viewType: string;
              viewConfigs: any;
            }) =>
              selectHandler({
                viewType,
                viewConfigs: {
                  ...viewConfigs,
                  main: mainObjective,
                  primary: index,
                },
              })
            }
          />
        ))}
        <AddPrimaryObjective
          objectiveCount={primaryObjectives.length}
          onCreate={(options: any) =>
            createHandler({
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
