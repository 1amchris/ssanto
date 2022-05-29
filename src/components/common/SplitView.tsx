import React, { useCallback } from 'react';
import SplitView from 'react-better-splitviews';
import { useDispatch } from 'react-redux';
import { updatePreventPointerEvents } from 'store/reducers/web-view';

function CustomSplitView({ style, direction, children }: any) {
  const dispatch = useDispatch();

  const disablePointerEvents = useCallback(() => {
    dispatch(updatePreventPointerEvents(true));
  }, []);
  const enablePointerEvents = useCallback(() => {
    dispatch(updatePreventPointerEvents(false));
  }, []);

  return (
    <SplitView
      style={style}
      direction={direction}
      onGrabHandle={disablePointerEvents}
      onReleaseHandle={enablePointerEvents}
    >
      {children}
    </SplitView>
  );
}

export default CustomSplitView;
