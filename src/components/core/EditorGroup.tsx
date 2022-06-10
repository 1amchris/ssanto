import React, { useState } from 'react';
import DefaultView from 'components/common/DefaultView';
import { Color, Opacity } from 'enums/Color';
import { ColorPalette } from 'models/ColorPalette';
import ColorsUtils from 'utils/colors-utils';
import * as codicons from 'react-icons/vsc';
import { IconBaseProps, IconType } from 'react-icons';
import { BsTextLeft } from 'react-icons/bs';
import { useAppDispatch } from 'store/hooks';
import ViewModel from 'models/ViewModel';
import { call } from 'store/reducers/server';
import ServerCallTarget from 'enums/ServerCallTarget';
import CallModel from 'models/server-coms/CallModel';

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

function EditorTab({
  tab,
  active,
  disabled = false,
  onClick = (e: any) => {},
  onClose = (e: any) => {},
}: any) {
  const [hovered, setHovered] = useState(false);

  const closeIcon = { label: 'Close', icon: 'VscClose' };

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
        color: tabOptions.color,
        background: tabOptions.backgroundColor,
        border: `1px solid ${tabOptions.borderColor || 'transparent'}`,
        cursor: tabOptions.cursor,
        paddingLeft: 10,
      }}
    >
      <span className="text-truncate" style={{ fontSize: 13 }}>
        <BsTextLeft style={{ marginTop: -6 }} /> {tab.name}
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

function EditorTabBar({ active, views, style, onClose, onFocus }: any) {
  const iconBaseProps: IconBaseProps = {
    size: 16,
    color: Color.Black,
  };

  const icons = [
    {
      label: 'Split Editor',
      name: 'VscSplitHorizontal',
    },
    {
      label: 'Views and more actions...',
      name: 'VscEllipsis',
    },
  ];

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
        {/* TODO: add action to icon */}
        {icons.map((icon: any, index: number) => (
          <button
            key={`${icon.label}-${index}`}
            style={{
              padding: '0 2.5px',
            }}
            className="btn btn-sm"
          >
            {(codicons as { [name: string]: IconType })[icon.name]({
              title: icon.label,
              ...iconBaseProps,
            })}
          </button>
        ))}
      </div>
    </div>
  );
}

function EditorGroup({ group, style }: any) {
  const dispatch = useAppDispatch();

  return (
    <div
      className="d-flex flex-column position-relative w-100 h-100"
      style={style}
    >
      {group.views.length > 0 && (
        <EditorTabBar
          active={group.active}
          views={group.views}
          onFocus={(uri: string) =>
            dispatch(
              call({
                target: ServerCallTarget.ViewsManagerSelectEditor,
                args: [uri, group.uri],
              } as CallModel)
            )
          }
          onClose={(uri: string) =>
            dispatch(
              call({
                target: ServerCallTarget.ViewsManagerCloseEditor,
                args: [uri, group.uri],
              } as CallModel)
            )
          }
        />
      )}
      <div className="flex-fill">
        <DefaultView />
      </div>
    </div>
  );
}

export default EditorGroup;
