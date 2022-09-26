import { Color } from 'enums/Color';
import React, { CSSProperties, useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import { call } from 'store/reducers/server';
import ServerCallTarget from 'enums/ServerCallTarget';
import { VscAdd, VscEdit, VscEllipsis, VscTrash } from 'react-icons/vsc';
import ReactTextareaAutosize from 'react-textarea-autosize';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import IAttribute from 'models/IAttribute';
import ISecondaryHierarchy from 'models/ISecondaryHierarchy';
import IPrimaryHierarchy from 'models/IPrimaryHierarchy';
import IMainObjective from 'models/IMainObjective';
import IObjectiveHierarchy from 'models/IObjectiveHierarchy';

interface ICreateElement {
  type?: 'main' | 'primary' | 'secondary' | 'attribute';
  main?: IMainObjective;
  primary?: number;
  secondary?: number;
  attribute?: number;
}

interface IOpenView {
  viewType: string;
  viewConfigs?: any;
}

interface IDeleteElement {
  type: 'main' | 'primary' | 'secondary' | 'attribute';
  main?: IMainObjective;
  primary?: number;
  secondary?: number;
  attribute?: number;
}

function Attribute({
  attribute,
  style,
  className,
  onChange: changeHandler,
  onDelete: deleteHandler,
  onSelect: selectHandler,
}: {
  attribute: IAttribute;
  style?: CSSProperties;
  className?: string;
  onChange: (field: string) => (value: any) => void;
  onDelete: (params: IDeleteElement) => void;
  onSelect: (params: IOpenView) => void;
}) {
  const [focused, setFocused] = React.useState(false);
  const [editing, setEditing] = React.useState<string | undefined>();

  return (
    <div
      className={
        'small d-flex flex-row rounded' +
        (focused || editing !== undefined ? ' bg-light' : '') +
        (className ? ` ${className}` : '')
      }
      style={{
        cursor: 'pointer',
        ...style,
      }}
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
    >
      <input
        className={
          'form-control form-control-sm text-truncate fst-italic px-1' +
          (editing ? ' bg-light' : ' form-control-plaintext')
        }
        style={{ boxShadow: 'none' }}
        defaultValue={attribute.name}
        onClick={(e: any) => e.stopPropagation()}
        onChange={(e: any) => changeHandler('name')(e.target.value)}
        key={editing !== 'name' ? attribute.name : undefined}
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

function SecondaryHierarchy({
  objective,
  style,
  className,
  onChange: changeHandler,
  onCreate: createHandler,
  onDelete: deleteHandler,
  onSelect: selectHandler,
}: {
  objective: ISecondaryHierarchy;
  onCreate: (params: ICreateElement) => void;
  onChange: (field: string) => (value: any) => void;
  onDelete: (params: IDeleteElement) => void;
  onSelect: (params: IOpenView) => void;
  style?: CSSProperties;
  className?: string;
}) {
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
          onClick={(e: any) => e.stopPropagation()}
          onChange={(e: any) => changeHandler('name')(e.target.value)}
          key={editing !== 'name' ? objective.name : undefined}
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
            {attributes.map((attribute: IAttribute, index: number) => (
              <li
                key={`${attributes.length}${index}`}
                className="text-truncate"
              >
                <Attribute
                  attribute={attribute}
                  onChange={(partialKey: string) =>
                    changeHandler(`attributes.${index}.${partialKey}`)
                  }
                  onDelete={(options: IDeleteElement) =>
                    deleteHandler({ ...options, attribute: index })
                  }
                  onSelect={({ viewType, viewConfigs }: IOpenView) =>
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
        onCreate={(options: ICreateElement) =>
          createHandler({
            ...options,
            type: 'attribute',
          })
        }
      />
    </div>
  );
}

function PrimaryHierarchy({
  objective,
  style,
  className,
  onSelect: selectHandler,
  onChange: changeHandler,
  onCreate: createHandler,
  onDelete: deleteHandler,
}: {
  objective: IPrimaryHierarchy;
  onCreate: (params: ICreateElement) => void;
  onChange: (field: string) => (value: any) => void;
  onDelete: (params: IDeleteElement) => void;
  onSelect: (params: IOpenView) => void;
  style?: CSSProperties;
  className?: string;
}) {
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
            onChange={(e: any) => changeHandler('name')(e.target.value)}
            key={editing !== 'name' ? objective.name : undefined}
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
            (
              objective: ISecondaryHierarchy,
              index: number,
              objectives: ISecondaryHierarchy[]
            ) => (
              <SecondaryHierarchy
                key={`${objectives.length}${index}`}
                objective={objective}
                className={index < objectives.length - 1 ? 'mb-2' : undefined}
                onChange={(partialKey: string) =>
                  changeHandler(`secondaries.${index}.${partialKey}`)
                }
                onCreate={(options: ICreateElement) =>
                  createHandler({ ...options, secondary: index })
                }
                onDelete={(options: IDeleteElement) => {
                  deleteHandler({ ...options, secondary: index });
                }}
                onSelect={({ viewType, viewConfigs }: IOpenView) =>
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
          <AddSecondaryHierarchy
            objectiveCount={secondaryObjectives.length}
            onCreate={(options: ICreateElement) =>
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
}: {
  objective: string;
  onChange: (field: string) => (value: any) => void;
  style?: CSSProperties;
  className?: string;
}) {
  const [editing, setEditing] = React.useState<string | undefined>();

  return (
    <select
      className={
        'form-select form-select-sm' + (className ? ` ${className}` : '')
      }
      style={{ maxWidth: 200, ...style }}
      onChange={(e: any) => changeHandler('main')(e.target.value)}
      defaultValue={objective}
      key={editing !== 'main' ? objective : undefined}
      autoFocus={editing === 'main'}
      onFocus={() => setEditing('main')}
      onBlur={() => setEditing(undefined)}
    >
      <option value="needs">Needs</option>
      <option value="opportunities">Opportunities</option>
    </select>
  );
}

function AddPrimaryHierarchy({
  style,
  className,
  objectiveCount,
  onCreate: createHandler,
}: {
  objectiveCount: number;
  onCreate: (options: ICreateElement) => void;
  style?: CSSProperties;
  className?: string;
}) {
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
          onClick={(e: any) => {
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

function AddSecondaryHierarchy({
  objectiveCount,
  onCreate: createHandler,
  style,
  className,
}: {
  objectiveCount: number;
  onCreate: (options: ICreateElement) => void;
  style?: CSSProperties;
  className?: string;
}) {
  const createDefaultOptions = {};

  return (
    <div
      className={'w-100 px-2' + (className ? ` ${className}` : '')}
      style={style}
    >
      <button
        className="btn btn-sm w-100 text-start text-secondary"
        onClick={(e: any) => {
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

function AddAttribute({
  attributeCount,
  onCreate: createHandler,
  className,
  style,
}: {
  attributeCount: number;
  onCreate: (options: ICreateElement) => void;
  style?: CSSProperties;
  className?: string;
}) {
  const createDefaultOptions = {};

  const [focused, setFocused] = useState(false);

  return (
    <div
      className={
        'w-100 rounded' +
        (focused ? ' bg-light' : '') +
        (className ? ` ${className}` : '')
      }
      style={style}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
    >
      <button
        className="btn btn-sm text-secondary w-100 text-start fst-italic"
        onClick={(e: any) => {
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
  const dispatch = useAppDispatch();
  const publishChanges = (changes: any) =>
    dispatch(
      call({
        target: ServerCallTarget.WorkspaceViewsPublishEvent,
        args: [view.uri, changes],
      })
    );

  const changeHandler = (field: string) => (value: any) =>
    publishChanges({ [field]: value });

  const createHandler = (payload: ICreateElement) =>
    publishChanges({ ':create': payload });

  const deleteHandler = (payload: IDeleteElement) =>
    publishChanges({ ':delete': payload });

  const selectHandler = ({
    viewType: type,
    viewConfigs: configs,
  }: {
    viewType: string;
    viewConfigs: {
      main?: IMainObjective;
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

  const objectives: IObjectiveHierarchy = view.content!.objectives!;
  const mainObjective: IMainObjective = objectives.main!;
  const primaryObjectives: IPrimaryHierarchy[] =
    objectives[mainObjective].primaries || [];

  console.log({ objectives });

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
        {primaryObjectives.map(
          (
            primaryObjective: IPrimaryHierarchy,
            index: number,
            objectives: IPrimaryHierarchy[]
          ) => (
            <PrimaryHierarchy
              key={`${objectives.length}${index}`}
              objective={primaryObjective}
              onChange={(partialKey: string) =>
                changeHandler(
                  `objectives.${mainObjective}.primaries.${index}.${partialKey}`
                )
              }
              onCreate={(options: ICreateElement) =>
                createHandler({
                  ...options,
                  main: mainObjective,
                  primary: index,
                })
              }
              onDelete={(options: IDeleteElement) =>
                deleteHandler({
                  ...options,
                  main: mainObjective,
                  primary: index,
                })
              }
              onSelect={({ viewType, viewConfigs }: IOpenView) =>
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
          )
        )}
        <AddPrimaryHierarchy
          objectiveCount={primaryObjectives.length}
          onCreate={(options: ICreateElement) =>
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
