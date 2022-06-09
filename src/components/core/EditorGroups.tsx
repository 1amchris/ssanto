import React from 'react';
import EditorGroup from 'components/core/EditorGroup';
import SplitView from 'components/core/SplitView';

function EditorGroups({ style }: any) {
  return (
    <SplitView direction="row" style={style}>
      <EditorGroup style={{ minWidth: 200 }} />
      <EditorGroup style={{ minWidth: 200 }} />
      {/* <EditorGroup style={{ minWidth: 200 }} /> */}
    </SplitView>
  );
}
export default EditorGroups;
