import React from 'react';
import EditorGroup from 'components/core/EditorGroup';
import SplitView from 'components/core/SplitView';
import { useAppSelector } from 'store/hooks';
import { selectViewer } from 'store/reducers/viewer';
import ViewGroupModel from 'models/ViewGroupModel';

function EditorGroups({ style }: any) {
  const {
    editor: { groups, active },
  } = useAppSelector(selectViewer);

  return (
    <SplitView
      key={JSON.stringify(groups.map(group => group.uri))}
      direction="row"
      style={style}
    >
      {groups.map((group: ViewGroupModel) => (
        <EditorGroup
          key={group.uri}
          focused={group.uri === active?.[0]}
          group={group}
          closeable={groups.length > 1}
          style={{ minWidth: 200 }}
        />
      ))}
    </SplitView>
  );
}
export default EditorGroups;
