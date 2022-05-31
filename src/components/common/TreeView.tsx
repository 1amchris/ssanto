// import React, { CSSProperties, useEffect, useState } from 'react';
import React, { CSSProperties, useState } from 'react';
import ColorsUtils from 'utils/colors-utils';
import { Color, Opacity } from 'enums/Color';
import { ColorPalette } from 'models/ColorPalette';
import FilesUtils from 'utils/files-utils';
import { VscChevronDown, VscChevronRight } from 'react-icons/vsc';

const backgroundColors = {
  active: ColorsUtils.applyOpacity(Color.Primary, Opacity.SevenEighths),
  disabled: ColorsUtils.applyOpacity(Color.LightGray, Opacity.Half),
  focused: undefined,
  hovered: ColorsUtils.applyOpacity(Color.LightGray, Opacity.OneQuarter),
  default: ColorsUtils.applyOpacity(Color.Black, Opacity.Transparent),
} as ColorPalette;

const borderColors = {
  active: undefined,
  disabled: undefined,
  focused: ColorsUtils.applyOpacity(Color.Info, Opacity.Opaque),
  hovered: undefined,
  default: ColorsUtils.applyOpacity(Color.Black, Opacity.Transparent),
} as ColorPalette;

const textColors = {
  active: ColorsUtils.applyOpacity(Color.White, Opacity.Opaque),
  disabled: ColorsUtils.applyOpacity(Color.Gray, Opacity.ThreeQuarters),
  hovered: ColorsUtils.applyOpacity(Color.Black, Opacity.Opaque),
  focused: ColorsUtils.applyOpacity(Color.Black, Opacity.Opaque),
  default: ColorsUtils.applyOpacity(Color.Black, Opacity.Opaque),
} as ColorPalette;

const TreeHeader = ({
  label,
  expanded,
  active,
  focused,
  onClick,
  indentationLevel = 0,
  disabled = false,
}: any) => {
  const [hovered, setHovered] = useState(false);

  const options = { active, focused, hovered, disabled };
  const row = {
    cursor: disabled ? 'default' : 'pointer',
    color: ColorsUtils.getRelevantColor(textColors, options),
    borderColor: ColorsUtils.getRelevantColor(borderColors, options),
    backgroundColor: ColorsUtils.getRelevantColor(backgroundColors, options),
  };

  return (
    <div
      className="w-100"
      onClick={e => !disabled && onClick(e)}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => !disabled && setHovered(false)}
      style={{
        paddingLeft: indentationLevel * 8,
        color: row.color,
        background: row.backgroundColor,
        border: `1px solid ${row.borderColor || 'transparent'}`,
        cursor: row.cursor,
      }}
    >
      {expanded ? <VscChevronDown /> : <VscChevronRight />} {label}
    </div>
  );
};

const TreeNode = ({
  node,
  label,
  factory,
  indentationLevel = 0,
  disabled = false,
}: any) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="w-100">
      <TreeHeader
        expanded={expanded}
        label={label}
        indentationLevel={indentationLevel}
        onClick={(e: MouseEvent) => {
          if (disabled) return;
          // TODO: the shift/ctrl/meta key should be handled here
          if (e.shiftKey || e.ctrlKey || e.metaKey) return;
          setExpanded(!expanded);
        }}
      />
      {expanded && (
        <TreeView
          node={node}
          factory={factory}
          indentationLevel={indentationLevel + 1}
        />
      )}
    </div>
  );
};

const TreeLeaf = ({
  children,
  active,
  focused,
  indentationLevel = 0,
  onClick = () => {},
  disabled = false,
}: any) => {
  const [hovered, setHovered] = useState(false);

  const options = { active, focused, hovered, disabled };
  const row = {
    cursor: disabled ? 'default' : 'pointer',
    color: ColorsUtils.getRelevantColor(textColors, options),
    borderColor: ColorsUtils.getRelevantColor(borderColors, options),
    backgroundColor: ColorsUtils.getRelevantColor(backgroundColors, options),
  };

  return (
    <div
      className="w-100"
      onClick={e => !disabled && onClick(e)}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => !disabled && setHovered(false)}
      style={{
        paddingLeft: indentationLevel * 8 - 1,
        color: row.color,
        background: row.backgroundColor,
        border: `1px solid ${row.borderColor || 'transparent'}`,
        cursor: row.cursor,
      }}
    >
      {children}
    </div>
  );
};

function TreeView({
  elements,
  node,
  factory,
  indentationLevel = 0,
  style,
}: // selected = [],
// focused = undefined,
// onFocusChanged = () => {},
// onSelectionChanged = () => {},
{
  elements?: any[];
  node?: any[];
  factory: (props: Object) => React.ReactNode;
  indentationLevel?: number;
  style?: CSSProperties;
  selected?: number[];
  focused?: number;
  onFocusChanged?: (index: number) => void;
  onSelectionChanged?: (indices: number[]) => void;
}) {
  /* remove me when generifying */
  if (elements) {
    node = FilesUtils.treeify(elements);
  }
  const { folders: nodes, files: leaves } =
    FilesUtils.splitFoldersAndFiles(node);

  return (
    <div style={{ ...style, width: '100%', height: '100%' }}>
      {nodes.map(([label, node]: any, index: number) => (
        <TreeNode
          key={index}
          label={label}
          node={node}
          factory={factory}
          indentationLevel={indentationLevel}
        />
      ))}
      {leaves.map(([_, leaf]: any, index: number) => (
        <TreeLeaf
          key={`${JSON.stringify(leaf)}-${index}`}
          indentationLevel={indentationLevel}
        >
          {factory({
            ...leaf,
            orderIndex: index,
          })}
        </TreeLeaf>
      ))}
    </div>
  );
}

export default TreeView;
