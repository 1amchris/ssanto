import React, { useState } from 'react';
import { max, min } from 'lodash';

function Handle({ direction, options, onMouseDown }: any) {
  const handlerSize: number = options.size || 5;
  const color: string = options.color || '#0D6EFD';
  const directionIsColumn = direction === 'column';

  const [focused, setFocused] = useState(false);

  return (
    <div
      onMouseDown={e => {
        setFocused(true);
        onMouseDown(e);
      }}
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        marginLeft: directionIsColumn ? 0 : -handlerSize / 2,
        marginRight: directionIsColumn ? 0 : -handlerSize / 2,
        marginTop: directionIsColumn ? -handlerSize / 2 : 0,
        marginBottom: directionIsColumn ? -handlerSize / 2 : 0,

        zIndex: 100,
        cursor: directionIsColumn ? 'row-resize' : 'col-resize',
        minWidth: directionIsColumn ? '100%' : handlerSize,
        minHeight: directionIsColumn ? handlerSize : '100%',
        background: focused ? color : '#00000000',

        transitionProperty: 'background-color',
        transitionDuration: '250ms',
        transitionDelay: '250ms',
      }}
    ></div>
  );
}

export interface ViewOptions {
  size: number;
  unit: 'px' | '%';
  maxSize?: number;
  minSize?: number;
}

export interface HandlerOptions {
  color: string;
  size: number;
}
function SplitView({
  children,
  style,
  viewsOptions,
  direction = 'row' as 'row' | 'column',
  handlerOptions = { size: 5, color: '#0D6EFD' } as HandlerOptions,
}: any) {
  const [selectedView, setSelectedView] = useState<number | undefined>();
  const [handlePosition, setHandlePosition] = useState<number | undefined>();
  const [viewsSizes, setViewsSizes] = useState(
    viewsOptions.map((option: ViewOptions) => option.size)
  );

  const directionIsColumn = direction === 'column';

  return (
    <div
      style={{
        ...style,
        display: 'flex',
        flexDirection: direction || 'row',
      }}
      onMouseMove={e => resizeView(e)}
      onMouseLeave={() => unselectView()}
      onMouseUp={() => unselectView()}
    >
      {renderView(children[0], 0)}
      {children
        .slice(1)
        .map((children: JSX.Element, index: number) => [
          <Handle
            key={`handle-${index}`}
            direction={direction}
            options={handlerOptions}
            onMouseDown={(e: any) => selectView(e, index + 1)}
          />,
          renderView(children, index + 1),
        ])}
    </div>
  );

  function renderView(children: JSX.Element, index: number) {
    return (
      <div key={`view-${index}`} style={getViewStyle(index)}>
        {children}
      </div>
    );
  }

  function getViewStyle(viewIndex: number) {
    const defaultStyle = {
      overflow: 'hidden',
      minHeight: '100%',
      minWidth: '100%',
    };

    const viewOptions = viewsOptions[viewIndex];
    if (viewsSizes[viewIndex] !== undefined) {
      const size = `${viewsSizes[viewIndex]}${viewOptions.unit}`;

      return {
        ...defaultStyle,
        minHeight: directionIsColumn ? size : defaultStyle.minHeight,
        minWidth: !directionIsColumn ? size : defaultStyle.minWidth,
      };
    }

    return defaultStyle;
  }

  function selectView(e: any, index: number) {
    e.preventDefault();
    setSelectedView(index);
    setHandlePosition(directionIsColumn ? e.clientY : e.clientX);
  }

  function resizeView({ screenX, screenY }: any) {
    if (selectedView === undefined || handlePosition === undefined) return;

    /* eslint-disable no-unused-vars */
    // For some unknown reason, this isn't detected as "being used"
    enum OverflowDirection {
      LeftOrUp,
      RightOrDown,
    }
    /* eslint-enable no-unused-vars */

    const resize = (
      direction: OverflowDirection,
      viewIndex: number,
      distance: number,
      minTravel: number,
      maxTravel: number
    ) => {
      const displacement = max([minTravel, min([maxTravel, distance])])!;

      if (
        !(0 <= viewIndex && viewIndex < viewsSizes.length) ||
        displacement === 0
      )
        return 0;

      const currentSize = viewsSizes[viewIndex];
      const desiredSize =
        currentSize +
        (direction === OverflowDirection.LeftOrUp
          ? -displacement
          : +displacement);

      const { maxSize, minSize } = viewsOptions[viewIndex];
      const possibleSize = min([
        maxSize || Infinity,
        max([minSize || 0, desiredSize]),
      ]);

      const sizeDiff = possibleSize - desiredSize;
      let gained = possibleSize - currentSize;

      if (sizeDiff !== 0) {
        gained += resize(
          direction,
          viewIndex + (direction === OverflowDirection.LeftOrUp ? -1 : 1),
          direction === OverflowDirection.LeftOrUp ? sizeDiff : -sizeDiff,
          minTravel + gained,
          maxTravel - gained
        );
      }

      // console.log({
      //   viewIndex,
      //   currentSize,
      //   // desiredSize,
      //   possibleSize,
      //   sizeDiff,
      //   displacement,
      //   gained,
      //   minTravel,
      //   maxTravel,
      // });

      viewsSizes[viewIndex] = possibleSize;
      return gained;
    };

    const mousePosition = directionIsColumn ? screenY : screenX;
    const delta = handlePosition - mousePosition;

    const moved = resize(
      OverflowDirection.LeftOrUp,
      selectedView - 1,
      delta,
      -Infinity,
      Infinity
    );
    resize(OverflowDirection.RightOrDown, selectedView, delta, -moved, moved);

    // console.warn('');
    console.log({ viewsSizes });

    setHandlePosition(mousePosition);
    setViewsSizes(viewsSizes);
  }

  function unselectView() {
    setSelectedView(undefined);
  }
}

export default SplitView;
