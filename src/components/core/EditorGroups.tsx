import React from 'react';
import EditorGroup from 'components/core/EditorGroup';
import SplitView from 'components/common/SplitView';

function EditorGroups({ style }: any) {
  return (
    <SplitView direction="row" style={style}>
      <EditorGroup style={{ minWidth: 120 }} />
      <EditorGroup style={{ minWidth: 120 }} />
      <EditorGroup style={{ minWidth: 120 }} />
    </SplitView>
  );
}
export default EditorGroups;
