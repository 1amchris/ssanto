import React, { MouseEvent, useState } from 'react';
import { Color, Opacity } from 'enums/Color';
import Editor from 'components/core/Editor';
import ServerCallTarget from 'enums/ServerCallTarget';
import { ColorPalette } from 'models/ColorPalette';
import ViewModel from 'models/ViewModel';
import CallModel from 'models/server-coms/CallModel';
import * as codicons from 'react-icons/vsc';
import { BsTextLeft } from 'react-icons/bs';
import { IconBaseProps, IconType } from 'react-icons';
import { useAppDispatch } from 'store/hooks';
import { call } from 'store/reducers/server';
import ColorsUtils from 'utils/colors-utils';
import DefaultView from 'components/common/DefaultView';
import useViewsRegistry from 'hooks/useViewsRegistry';
import ViewAction from 'models/ViewAction';

const backgroundColors = {
  active: ColorsUtils.applyOpacity(Color.White, Opacity.Opaque),
  disabled: ColorsUtils.applyOpacity(Color.LightGray, Opacity.Half),
  focused: undefined,
  hovered: undefined,
  default: ColorsUtils.applyOpacity(Color.LightGray, Opacity.Half),
} as ColorPalette;

const borderColors = {
  active: undefined,
  disabled: undefined,
  focused: ColorsUtils.applyOpacity(Color.Info, Opacity.Opaque),
  hovered: undefined,
  default: ColorsUtils.applyOpacity(Color.Black, Opacity.Transparent),
} as ColorPalette;

const textColors = {
  active: ColorsUtils.applyOpacity(Color.Black, Opacity.Opaque),
  disabled: ColorsUtils.applyOpacity(Color.Gray, Opacity.ThreeQuarters),
  hovered: undefined,
  focused: undefined,
  default: ColorsUtils.applyOpacity(Color.Gray, Opacity.Opaque),
} as ColorPalette;

function NoEditor({ closeable, onClose }: any) {
  const iconBaseProps: IconBaseProps = {
    size: 16,
    color: Color.Black,
  };

  const closeIcon = {
    label: 'Close view',
    name: 'VscClose',
  };

  return (
    <div className="d-flex flex-column h-100 w-100">
      <div
        className="d-flex flex-row-reverse align-items-center"
        style={{ height: 35 }}
      >
        <div
          className="ps-1 pe-2"
          style={{ display: closeable ? 'block' : 'none' }}
        >
          <button
            style={{
              marginTop: -6,
              padding: '0 2.5px',
            }}
            className="btn btn-sm"
            onClick={(e: MouseEvent) => closeable && onClose?.(e)}
          >
            {(codicons as { [name: string]: IconType })[closeIcon.name]({
              title: closeIcon.label,
              ...iconBaseProps,
            })}
          </button>
        </div>
      </div>
      <DefaultView />
    </div>
  );
}

function EditorTab({
  tab,
  active,
  disabled = false,
  onClick = (e: any) => {},
  onClose = (e: any) => {},
}: any) {
  const [hovered, setHovered] = useState(false);

  const closeIcon = { label: 'Close', icon: 'VscClose' };

  const modifiedColor = Color.Purple;

  const options = { active, hovered, disabled };
  const tabOptions = {
    cursor: disabled ? 'default' : 'pointer',
    color: ColorsUtils.getRelevantColor(textColors, options),
    borderColor: ColorsUtils.getRelevantColor(borderColors, options),
    backgroundColor: ColorsUtils.getRelevantColor(backgroundColors, options),
  };

  return (
    <div
      className="d-flex flex-row justify-content-between align-items-center flex-nowrap h-100"
      onClick={e => !disabled && onClick(e)}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => !disabled && setHovered(false)}
      style={{
        background: tabOptions.backgroundColor,
        border: `1px solid ${tabOptions.borderColor || 'transparent'}`,
        cursor: tabOptions.cursor,
        paddingLeft: 10,
      }}
    >
      <span className="text-truncate" style={{ fontSize: 13 }}>
        <BsTextLeft style={{ marginTop: -6, marginRight: 4 }} />
        <span
          style={{
            color:
              tab.modified === true
                ? ColorsUtils.applyOpacity(
                    modifiedColor,
                    active ? Opacity.Opaque : Opacity.ThreeQuarters
                  )
                : tabOptions.color,
          }}
        >
          {tab.name}
        </span>
      </span>
      <div style={{ marginTop: -6 }}>
        {
          <button
            style={{
              padding: '0 2.5px',
              opacity: hovered || active ? 1.0 : 0.0,
            }}
            className={`btn btn-sm`}
            onClick={(e: any) => {
              e.stopPropagation();
              onClose(e);
            }}
          >
            {(codicons as { [name: string]: IconType })[closeIcon.icon]({
              title: closeIcon.label,
              color: tabOptions.color,
              size: 16,
            })}
          </button>
        }
      </div>
    </div>
  );
}

function EditorTabBar({
  active,
  focused,
  views,
  style,
  onClose,
  onFocus,
}: any) {
  const dispatch = useAppDispatch();
  const { getActions } = useViewsRegistry();

  const iconBaseProps: IconBaseProps = {
    size: 16,
    color: Color.Black,
  };

  const defaultActions = [
    {
      label: 'Views and more actions...',
      iconName: 'VscEllipsis',
      action: () => {},
    },
  ];

  const conditionalDefaultActions = [
    {
      label: 'Split Editor',
      iconName: 'VscSplitHorizontal',
      action: () => {
        dispatch(
          call({
            target: ServerCallTarget.WorkspaceViewsOpenEditorGroup,
          } as CallModel)
        );
      },
    },
  ];

  const viewsActions = getActions(active?.[0]);

  return (
    <div
      className="d-flex flex-row flex-nowrap justify-content-between align-items-center bg-light overflow-none"
      style={{ ...style }}
    >
      <div
        className="d-flex flex-row flex-shrink-1 overflow-auto"
        style={{ height: 35 }}
      >
        {views.map((tab: ViewModel, index: number) => (
          <EditorTab
            tab={tab}
            key={tab.uri + index}
            active={tab.uri === active[0]}
            onClick={() => onFocus(tab.uri)}
            onClose={() => onClose(tab.uri)}
          />
        ))}
      </div>
      <div style={{ marginTop: -6 }} className="flex-shrink-0 ps-1 pe-2">
        {([] as ViewAction[])
          .concat((focused && viewsActions) || [])
          .concat((focused && conditionalDefaultActions) || [])
          .concat(defaultActions || [])
          .map((action: any, index: number) => (
            <button
              key={`${action.label}-${index}`}
              style={{
                padding: '0 2.5px',
              }}
              className="btn btn-sm"
              onClick={() =>
                action.action({
                  view: views.find((view: ViewModel) => view.uri === active[0]),
                })
              }
            >
              {(codicons as { [name: string]: IconType })[action.iconName]({
                title: action.label,
                ...iconBaseProps,
              })}
            </button>
          ))}
      </div>
    </div>
  );
}

function EditorGroup({ closeable, focused, group, style }: any) {
  const dispatch = useAppDispatch();

  const selectedView = group.views.find(
    (view: any) => view.uri === group.active[0]
  );

  return (
    <div
      className="d-flex flex-column flex-nowrap position-relative overflow-none"
      style={style}
      onClick={() => {
        if (focused) return;
        dispatch(
          call({
            target: ServerCallTarget.WorkspaceViewsSelectEditorGroup,
            args: [group.uri],
          } as CallModel)
        );
      }}
    >
      <div className="flex-shrink-0">
        {group.views.length > 0 && (
          <EditorTabBar
            focused={focused}
            active={group.active}
            views={group.views}
            onFocus={(uri: string) =>
              dispatch(
                call({
                  target: ServerCallTarget.WorkspaceViewsSelectEditor,
                  args: [uri, group.uri],
                } as CallModel)
              )
            }
            onClose={(uri: string) =>
              dispatch(
                call({
                  target: ServerCallTarget.WorkspaceViewsCloseEditor,
                  args: [uri, group.uri],
                } as CallModel)
              )
            }
          />
        )}
      </div>
      <div className="flex-fill flex-shrink-1 overflow-auto">
        {selectedView !== undefined ? (
          <Editor view={selectedView} />
        ) : (
          <NoEditor
            closeable={closeable}
            onClose={(e: MouseEvent) => {
              e.stopPropagation();
              if (closeable) {
                dispatch(
                  call({
                    target: ServerCallTarget.WorkspaceViewsCloseEditorGroup,
                    args: [group.uri],
                  } as CallModel)
                );
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

export default EditorGroup;
