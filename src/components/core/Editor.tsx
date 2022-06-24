import React, { Suspense } from 'react';
import useViewsRegistry from 'hooks/useViewsRegistry';

function Editor({ view }: any) {
  const { getView } = useViewsRegistry();
  const View = getView(view.uri);

  console.log({ view });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <View key={view.uri} />
    </Suspense>
  );
}

export default Editor;
