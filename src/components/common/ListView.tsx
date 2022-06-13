import React, { CSSProperties, useState } from 'react';
import ColorsUtils from 'utils/colors-utils';
import { Color, Opacity } from 'enums/Color';
import { ColorPalette } from 'models/ColorPalette';

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

const Row = ({
  children,
  active,
  focused,
  onClick,
  onDoubleClick,
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
      onDoubleClick={e => !disabled && onDoubleClick(e)}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => !disabled && setHovered(false)}
      style={{
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

function ListView({
  elements,
  factory,
  style,
  selected = [],
  focused = undefined,
  getIdentifier = (element: any | undefined) => element?.id,
  onFocusChanged = () => {},
  onSelectionChanged = () => {},
  onDoubleClickRow = () => {},
}: {
  elements: any[];
  factory: (props: Object) => React.ReactNode;
  style?: CSSProperties;
  selected?: any[];
  focused?: any;
  getIdentifier?: (element: any) => any; // must return a unique identifier for every element
  onFocusChanged?: (identifier: any) => void;
  onSelectionChanged?: (identifiers: any[]) => void;
  onDoubleClickRow?: (e: MouseEvent, row: any) => void;
}) {
  const [selection, setSelection] = useState<any[]>(selected);
  const [focus, setFocus] = useState<any | undefined>(focused);

  return (
    <div style={{ ...style, width: '100%', height: '100%' }}>
      {elements.map((element: any, index: number) => (
        <Row
          key={`${JSON.stringify(element)}-${index}`}
          active={selection.includes(getIdentifier(element))}
          focused={focus !== undefined && focus === getIdentifier(element)}
          onDoubleClick={(e: MouseEvent) => {
            onDoubleClickRow(e, element);
          }}
          onClick={(e: MouseEvent) => {
            let newSelection = [];
            const elementId = getIdentifier(element);

            // handle shift selection
            if (e.shiftKey && focus !== undefined) {
              newSelection = [...selection];
              const indexOfFocused = elements.findIndex(
                element => getIdentifier(element) === focus
              );
              const startIndex = Math.max(0, Math.min(index, indexOfFocused));
              const endIndex = Math.max(index, indexOfFocused);
              for (let i = startIndex; i <= endIndex; i++) {
                const elementId = getIdentifier(elements[i]);
                if (!newSelection.includes(elementId)) {
                  newSelection.push(elementId);
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
        >
          {factory({
            ...element,
            orderIndex: index,
          })}
        </Row>
      ))}
    </div>
  );
}

export default ListView;
