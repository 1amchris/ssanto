import React, { useState } from 'react';

function ResizeHandle({ direction, color, onMouseDown }: any) {
  const handlerSize: number = 5;
  const [focused, setFocused] = useState(false);
  const directionIsColumn = direction === 'column';

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
        transitionDelay: '500ms',
      }}
    ></div>
  );
}

function SplitView({
  children,
  style,
  panelsSize: _panelsSize, // an array of constraints.
  // For example, [300, 500] will set the first child to 300 px wide,
  // and the second to 500px wide. Any other children will be set to 100%.
  direction = 'row',
  handlerColor = '#0D6EFD',
}: any) {
  const [selectedView, setSelectedView] = useState<number | null>(null);
  const [viewOrigin, setViewOrigin] = useState<number | null>(null);
  const [viewsSizes, setPanelsSize] = useState(_panelsSize);
  const [resizing, setResizing] = useState(false);

  const directionIsColumn = direction === 'column';

  return (
    <div
      style={{
        ...style,
        display: 'flex',
        flexDirection: direction || 'row',
      }}
      onMouseMove={e => resize(e)}
      onMouseLeave={() => stop()}
      onMouseUp={() => stop()}
    >
      {renderChildren(children[0], 0)}
      {children
        .slice(1)
        .map((children: JSX.Element, index: number) => [
          renderHandle(index + 1),
          renderChildren(children, index + 1),
        ])}
    </div>
  );

  function renderChildren(children: JSX.Element, index: number) {
    return (
      <div key={`fragment-${index}`} style={getStyle(index)}>
        {children}
      </div>
    );
  }

  function renderHandle(index: number) {
    return (
      <ResizeHandle
        key={`handle-${index}`}
        direction={direction}
        color={handlerColor}
        onMouseDown={(e: any) => start(e, index)}
      />
    );
  }

  function getStyle(index: number) {
    const size =
      index > viewsSizes.length - 1 ? '100%' : `${viewsSizes[index]}px`;

    return {
      minHeight: directionIsColumn ? size : '100%',
      minWidth: directionIsColumn ? '100%' : size,
      overflow: 'hidden',
    };
  }

  function start(e: any, index: number) {
    e.preventDefault();
    setSelectedView(index);
    setViewOrigin(directionIsColumn ? e.clientY : e.clientX);
    setResizing(true);
  }

  function resize({ screenX, screenY }: any) {
    if (resizing) {
      const mousePosition = directionIsColumn ? screenY : screenX;

      const delta = viewOrigin! - mousePosition;
      const newViewsSizes = getNewViewsSizes(delta);

      setViewOrigin(mousePosition);
      setPanelsSize(newViewsSizes);
    }
  }

  function stop() {
    setResizing(false);
    setSelectedView(null);
  }

  function getNewViewsSizes(delta: number) {
    return viewsSizes.map((viewSize: number, index: number) => {
      if (index === selectedView) return viewSize + delta;
      else if (index === selectedView! - 1) return viewSize - delta;
      else return viewSize;
    });
  }
}

export default SplitView;
