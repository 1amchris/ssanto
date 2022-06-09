import React from 'react';
import EditorGroup from 'components/core/EditorGroup';
import SplitView from 'components/core/SplitView';
import { useAppSelector } from 'store/hooks';
import { selectViewsManager } from 'store/reducers/views-manager';

function EditorGroups({ style }: any) {
  const { groups } = useAppSelector(selectViewsManager);

  return (
    <SplitView
      key={JSON.stringify(groups.map(group => group.uri))}
      direction="row"
      style={style}
    >
      {groups.map(group => (
        <EditorGroup key={group.uri} group={group} style={{ minWidth: 200 }} />
      ))}
    </SplitView>
  );
}
export default EditorGroups;
