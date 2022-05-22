import React, { useCallback, useState } from 'react';
import { max, min, sum } from 'lodash';

export interface HandleOptions {
  color: string;
  size: number;
}

function Handle({ position, direction, options, onMouseDown }: any) {
  const handleSize: number = options.size || 5;
  const handlePosition = position - handleSize / 2;
  const color: string = options.color || '#0D6EFD';
  const directionIsColumn = direction === 'column';

  const [focused, setFocused] = useState(true);

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
        position: 'absolute',
        top: directionIsColumn ? handlePosition : 0,
        left: directionIsColumn ? 0 : handlePosition,

        zIndex: 100,
        cursor: directionIsColumn ? 'row-resize' : 'col-resize',
        width: directionIsColumn ? '100%' : handleSize,
        height: directionIsColumn ? handleSize : '100%',
        background: focused ? color : '#00000000',

        transitionProperty: 'background-color',
        transitionDuration: '250ms',
        transitionDelay: '250ms',
      }}
    ></div>
  );
}

class ViewOptionsUtils {
  static convertToPixels(
    measure: string | number | undefined,
    length: number
  ): string | undefined {
    const value = ViewOptionsUtils.getValue(measure);
    if (value === undefined) return undefined;

    if (ViewOptionsUtils.getUnit(measure) === '%') {
      return `${(length * value) / 100}px`;
    } else {
      return `${value}px`;
    }
  }

  static getValue(measure: string | number | undefined): number | undefined {
    if (measure === undefined) return undefined;
    measure = measure.toString();
    if (measure.endsWith('%')) return +measure.substring(0, measure.length - 1);
    else if (measure.endsWith('px'))
      return +measure.substring(0, measure.length - 2);
    else return +measure;
  }

  static getUnit(measure: string | number | undefined): string | undefined {
    if (measure === undefined) return undefined;
    measure = measure.toString();
    if (measure.endsWith('%')) return '%';
    else return 'px';
  }
}

interface ViewOptions {
  size?: string;
  minSize?: string;
  maxSize?: string;
}

interface Dimensions {
  width: number;
  height: number;
}

function SplitView({
  children,
  style,
  direction = 'row' as 'row' | 'column',
  handleOptions = {
    size: 5,
    color: '#0D6EFD',
  } as HandleOptions,
}: any) {
  const [selectedHandle, setSelectedHandle] = useState<number | undefined>();
  const [handlePosition, setHandlePosition] = useState<number | undefined>();
  const [viewsOptions, setViewsOptions] = useState(
    children.map(() => ({ size: '0px' } as ViewOptions))
  );
  viewsOptions;

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  } as Dimensions);

  const directionIsColumn = direction === 'column';

  const windowSizeRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      const { width, height } = node.getBoundingClientRect();
      setDimensions({ width, height });

      const viewsOptions = children.map((node: JSX.Element) => {
        // extract the original styles (mins, maxs and defaults, if any)
        const viewOptions = directionIsColumn
          ? {
              maxSize: node.props.style?.maxHeight,
              minSize: node.props.style?.minHeight,
              size: node.props.style?.height,
            }
          : {
              maxSize: node.props.style?.maxWidth,
              minSize: node.props.style?.minWidth,
              size: node.props.style?.width,
            };

        // convert the % styles to pixels
        Object.entries(viewOptions).forEach(([key, value]: any) => {
          Object.defineProperty(viewOptions, key, {
            value: ViewOptionsUtils.convertToPixels(
              value,
              directionIsColumn ? height : width
            ),
          });
        });

        return viewOptions;
      });

      // distribute the remaining space evenly
      const used = sum(
        viewsOptions.map(
          (options: ViewOptions) => ViewOptionsUtils.getValue(options.size) || 0
        )
      );
      const available = (directionIsColumn ? height : width) - used;
      const undefinedSizesIndices = viewsOptions
        .map((options: ViewOptions, index: number) => [options, index])
        .filter(([options]: [ViewOptions, number]) => !options.size)
        .map(([_, index]: [ViewOptions, number]) => index);
      const averageSize = `${available / undefinedSizesIndices.length}px`;
      undefinedSizesIndices.forEach((index: number) => {
        viewsOptions[index].size = averageSize;
      });

      setViewsOptions(viewsOptions);
    }
  }, []);

  return (
    <React.Fragment>
      <div style={{ minWidth: 100 }} className="d-none">
        <p>width: {dimensions.width}px</p>
        <p>height: {dimensions.height}px</p>
      </div>
      <div
        ref={windowSizeRef}
        style={{
          ...style,
          position: 'relative',
          overflow: 'auto',
        }}
        className="border border-2 border-warning"
        onMouseMove={e => resizeView(e)}
        onMouseLeave={() => unselectView()}
        onMouseUp={() => unselectView()}
      >
        {renderView([].concat(children)[0], 0)}
        {[]
          .concat(children)
          .slice(1)
          .map((view: JSX.Element, index: number) => [
            <Handle
              key={`handle-${index}`}
              position={getPosition(index + 1)}
              direction={direction}
              options={handleOptions}
              onMouseDown={(e: any) => selectHandle(e, index + 1)}
            />,
            renderView(view, index + 1),
          ])}
      </div>
    </React.Fragment>
  );

  function renderView(children: JSX.Element, index: number) {
    return (
      <div key={`view-${index}`} style={getViewStyle(index)}>
        {React.cloneElement(children, {
          style: {
            ...children.props.style,
            minHeight: null,
            maxHeight: null,
            minWidth: null,
            maxWidth: null,
            width: '100%',
            height: '100%',
          },
        })}
      </div>
    );
  }

  function getViewStyle(viewIndex: number): React.CSSProperties {
    const size = `${viewsOptions[viewIndex].size}`;
    const position = getPosition(viewIndex);

    return {
      overflow: 'auto',
      position: 'absolute',
      top: directionIsColumn ? position : null,
      left: !directionIsColumn ? position : null,
      height: directionIsColumn ? size : '100%',
      width: !directionIsColumn ? size : '100%',
    } as React.CSSProperties;
  }

  function getPosition(viewIndex: number): number {
    return sum(
      viewsOptions
        .slice(0, viewIndex)
        .map((options: ViewOptions) => ViewOptionsUtils.getValue(options.size))
    );
  }

  function selectHandle(e: any, index: number) {
    setSelectedHandle(index);
    setHandlePosition(directionIsColumn ? e.screenY : e.screenX);
  }

  function resizeView({ screenX, screenY }: any) {
    if (selectedHandle === undefined || handlePosition === undefined) return;

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
        !(0 <= viewIndex && viewIndex < viewsOptions.length) ||
        displacement === 0
      )
        return 0;

      const currentSize = ViewOptionsUtils.getValue(
        viewsOptions[viewIndex].size
      )!;
      const desiredSize =
        currentSize +
        (direction === OverflowDirection.LeftOrUp
          ? -displacement
          : +displacement);

      // const { maxSize, minSize } = viewsOptions[viewIndex];
      // const possibleSize = min([
      //   maxSize || Infinity,
      //   max([minSize || 0, desiredSize]),
      // ]);
      const possibleSize = desiredSize;

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

      viewsOptions[viewIndex].size = `${possibleSize}px`;
      return gained;
    };

    const mousePosition = directionIsColumn ? screenY : screenX;
    const delta = handlePosition - mousePosition;

    const moved = resize(
      OverflowDirection.LeftOrUp,
      selectedHandle - 1,
      delta,
      -Infinity,
      Infinity
    );
    resize(OverflowDirection.RightOrDown, selectedHandle, delta, -moved, moved);

    setHandlePosition(mousePosition);
    setViewsOptions(viewsOptions);
  }

  function unselectView() {
    setSelectedHandle(undefined);
  }
}

export default SplitView;
