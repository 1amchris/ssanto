// import React, { CSSProperties, useEffect, useState } from 'react';
import React, { MouseEvent, useState } from 'react';
import ColorsUtils from 'utils/colors-utils';
import { Color, Opacity } from 'enums/Color';
import { ColorPalette } from 'models/ColorPalette';
// import FileMetadataModel from 'models/file/FileMetadataModel';
// import FolderMetadataModel from 'models/file/FolderMetadataModel';
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
  onClick = () => {},
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

const TreeNode = ({
  node,
  factory,
  selection,
  focus,
  onClick,
  getIdentifier,
  getNodesAndLeaves,
  indentationLevel = 0,
  noHeader = false,
  disabled = false,
}: any) => {
  const expandedDefault = true;
  const [expanded, setExpanded] = useState(noHeader || expandedDefault);

  const { nodes, leaves } = getNodesAndLeaves(node);

  return (
    <div className="w-100">
      {!noHeader && (
        <TreeHeader
          expanded={expanded}
          label={node.name}
          active={selection.includes(getIdentifier(node))}
          focused={focus === getIdentifier(node)}
          indentationLevel={indentationLevel}
          onClick={(e: MouseEvent) => {
            if (disabled) return;
            onClick(e, node);

            if (!(e.shiftKey || e.ctrlKey || e.metaKey)) {
              setExpanded(!expanded);
            }
          }}
        />
      )}
      {expanded && (
        <React.Fragment>
          {nodes.map((node: any, index: number) => (
            <TreeNode
              key={index}
              node={node}
              focus={focus}
              selection={selection}
              indentationLevel={indentationLevel + 1}
              factory={factory}
              getIdentifier={getIdentifier}
              getNodesAndLeaves={getNodesAndLeaves}
              onClick={onClick}
            />
          ))}
          {leaves.map((leaf: any, index: number) => (
            <TreeLeaf
              key={`${JSON.stringify(leaf)}-${index}`}
              active={
                getIdentifier(leaf) !== undefined &&
                selection.includes(getIdentifier(leaf))
              }
              focused={focus !== undefined && focus === getIdentifier(leaf)}
              indentationLevel={indentationLevel}
              onClick={(e: MouseEvent) => {
                onClick(e, leaf);
              }}
            >
              {factory({
                ...leaf,
                orderIndex: index,
              })}
            </TreeLeaf>
          ))}
        </React.Fragment>
      )}
    </div>
  );
};

function TreeView({
  node,
  factory,
  style,
  selected = [],
  focused = undefined,
  indentationLevel = 0,
  getIdentifier = (element?: any) => element?.id,
  getNodesAndLeaves = (element: any) => ({
    nodes: element.nodes,
    leaves: element.leaves,
  }),
  onFocusChanged = () => {},
  onSelectionChanged = () => {},
}: any) {
  const [selection, setSelection] = useState<any[]>(selected);
  const [focus, setFocus] = useState<any | undefined>(focused);

  function flatten(root: any): /* leaves */ any[] {
    const { nodes, leaves } = getNodesAndLeaves(root);

    return []
      .concat(
        nodes?.reduce(
          (acc: any[], node: any) => acc.concat(node, flatten(node)),
          []
        ),
        leaves
      )
      .filter((e: any) => getIdentifier(e) !== undefined);
  }
  const uris = flatten(node).map(getIdentifier);

  return (
    <div style={{ ...style, width: '100%', height: '100%' }}>
      <TreeNode
        noHeader
        node={node}
        focus={focus}
        selection={selection}
        indentationLevel={indentationLevel}
        factory={factory}
        getIdentifier={getIdentifier}
        getNodesAndLeaves={getNodesAndLeaves}
        onClick={(e: MouseEvent, element: any) => {
          let newSelection = [];
          const elementId = getIdentifier(element);

          // handle shift selection
          if (e.shiftKey && focus !== undefined) {
            newSelection = [...selection];
            const indexOfFocused = uris.findIndex(uri => uri === focus);
            const index = uris.findIndex(uri => uri === elementId);
            const startIndex = Math.max(0, Math.min(index, indexOfFocused));
            const endIndex = Math.max(index, indexOfFocused);
            for (let i = startIndex; i <= endIndex; i++) {
              if (!newSelection.includes(uris[i])) {
                newSelection.push(uris[i]);
              }
            }
          }
          // TODO: Handle Windows/Mac events differently (e.g. ctrl/cmd)
          // handle ctrl/cmd selection
          else if (e.ctrlKey || e.metaKey) {
            const currentIndex = selection.indexOf(elementId);
            newSelection =
              currentIndex === -1
                ? [...selection, elementId]
                : selection.filter(id => id !== elementId);
          }
          // handle normal selection
          else {
            newSelection = [elementId];
          }

          setSelection(newSelection);
          onSelectionChanged(newSelection);

          setFocus(elementId);
          onFocusChanged(elementId);
        }}
      />
    </div>
  );
}

export default TreeView;
