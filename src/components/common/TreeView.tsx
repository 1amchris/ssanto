import React, { CSSProperties, useEffect, useState } from 'react';
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

const Row = ({ children, active, focused, onClick, disabled = false }: any) => {
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
  factory,
  style,
  selected = [],
  focused = undefined,
  onFocusChanged = () => {},
  onSelectionChanged = () => {},
}: {
  elements: any[];
  factory: (props: Object) => React.ReactNode;
  style?: CSSProperties;
  selected?: number[];
  focused?: number;
  onFocusChanged?: (index: number) => void;
  onSelectionChanged?: (indices: number[]) => void;
}) {
  const [selection, setSelection] = useState<number[]>([]);
  const [focus, setFocus] = useState<number | undefined>();

  useEffect(() => {
    setSelection(selected);
    setFocus(focused);
  }, [selected, focused]);

  return (
    <div style={{ ...style, width: '100%', height: '100%' }}>
      {elements.map((element: any, index: number) => (
        <Row
          key={`${JSON.stringify(element)}-${index}`}
          active={selection.includes(index)}
          focused={focus === index}
          onClick={(e: MouseEvent) => {
            let newSelection = [];

            // handle shift selection
            if (e.shiftKey && focus !== undefined) {
              newSelection = [...selection];
              const startIndex = Math.min(index, focus);
              const endIndex = Math.max(index, focus);
              for (let i = startIndex; i <= endIndex; i++) {
                if (!newSelection.includes(i)) {
                  newSelection.push(i);
                }
              }
            }
            // TODO: Handle Windows/Mac events differently (e.g. ctrl/cmd)
            // handle ctrl/cmd selection
            else if (e.ctrlKey || e.metaKey) {
              const currentIndex = selection.indexOf(index);
              newSelection =
                currentIndex === -1
                  ? [...selection, index]
                  : selection.filter((n: number) => n !== index);
            }
            // handle normal selection
            else {
              newSelection = [index];
            }

            setSelection(newSelection);
            onSelectionChanged(newSelection);

            setFocus(index);
            onFocusChanged(index);
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

export default TreeView;
