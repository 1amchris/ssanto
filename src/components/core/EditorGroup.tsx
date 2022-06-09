import React, { useState } from 'react';
import DefaultView from 'components/common/DefaultView';
import { Color, Opacity } from 'enums/Color';
import { ColorPalette } from 'models/ColorPalette';
import ColorsUtils from 'utils/colors-utils';
import * as codicons from 'react-icons/vsc';
import { IconType } from 'react-icons';
import { BsTextLeft } from 'react-icons/bs';
import { useResizeDetector } from 'react-resize-detector';
import FileMetadataModel from 'models/file/FileMetadataModel';

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
              opacity: !hovered ? 0.0 : 1.0,
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

function EditorTabBar({ style }: any) {
  const [tabs, setTabs] = useState<FileMetadataModel[]>([
    {
      name: 'Editor.tsx',
      stem: 'Editor',
      extension: 'tsx',
      uri: 'file:///src/components/core/Editor.tsx',
    },
    {
      name: 'TreeView.tsx',
      stem: 'TreeView',
      extension: 'tsx',
      uri: 'file:///src/components/core/TreeView.tsx',
    },
    {
      name: 'EditorGroup.tsx',
      stem: 'EditorGroup',
      extension: 'tsx',
      uri: 'file:///src/components/core/EditorGroup.tsx',
    },
    {
      name: 'ListView.tsx',
      stem: 'ListView',
      extension: 'tsx',
      uri: 'file:///src/components/core/ListView.tsx',
    },
  ]);
  const [activeTabs, setActiveTabs] = useState<string[]>(
    tabs.length > 0 ? tabs.map(tab => tab.uri) : []
  );

  const setFocus = (uri: string) => {
    const newActiveTabs = [uri, ...activeTabs.filter(tabUri => tabUri !== uri)];
    setActiveTabs(newActiveTabs);
    console.log({ activeTabs: newActiveTabs });
  };

  const closeTab = (uri: string) => {
    const newActiveTabs = activeTabs.filter(tabUri => tabUri !== uri);
    const newTabs = tabs.filter(tab => tab.uri !== uri);

    setTabs(newTabs);
    setActiveTabs(newActiveTabs);
    console.log({ tabs: newTabs, activeTabs: newActiveTabs });
  };

  return (
    <div className="d-flex flex-row bg-light" style={{ ...style, height: 35 }}>
      {tabs.map((tab, index) => (
        <EditorTab
          tab={tab}
          key={tab.uri + index}
          active={tab.uri === activeTabs[0]}
          onClick={() => setFocus(tab.uri)}
          onClose={() => closeTab(tab.uri)}
        />
      ))}
    </div>
  );
}

function EditorGroup({ style }: any) {
  const {
    width: containerWidth,
    height: containerHeight,
    ref: containerRef,
  } = useResizeDetector();
  const { height: tabBarHeight, ref: tabBarRef } = useResizeDetector();

  return (
    <div
      ref={containerRef}
      className="d-flex flex-column position-relative w-100 h-100"
      style={style}
    >
      <div
        ref={tabBarRef}
        className="position-absolute top-0 left-0 overflow-scroll"
        style={{ width: containerWidth }}
      >
        <EditorTabBar />
      </div>
      <div
        className="position-absolute left-0 overflow-auto w-100"
        style={{
          top: tabBarHeight,
          height: Math.max(containerHeight! - tabBarHeight! || 0, 0),
        }}
      >
        <DefaultView />
      </div>
    </div>
  );
}

export default EditorGroup;
