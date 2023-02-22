import React, { CSSProperties } from 'react';
import { useAppSelector } from 'store/hooks';
import { selectWebView } from 'store/reducers/web-view';

function WebView({ src, title, style }: any) {
  const { preventPointerEvents } = useAppSelector(selectWebView);

  function getIFrameStyle(): CSSProperties {
    return {
      pointerEvents: preventPointerEvents ? 'none' : 'auto',
    } as CSSProperties;
  }

  return (
    <iframe
      src={src}
      width="100%"
      height="100%"
      style={{
        ...style,
        ...getIFrameStyle(),
      }}
      title={title}
    />
  );
}

export default WebView;
