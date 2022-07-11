import React from 'react';
import ServerCallTarget from 'enums/ServerCallTarget';
import { useAppDispatch } from 'store/hooks';
import { call } from 'store/reducers/server';

function SSantoSecondaryObjectiveEditor({ view }: any) {
  const { main, primary, secondary, attribute } = view.configs;

  const dispatch: any = useAppDispatch();
  const publishChanges = (changes: any) =>
    dispatch(
      call({
        target: ServerCallTarget.WorkspaceViewsPublishChanges,
        args: [view.uri, changes],
      })
    );

  const changeHandler = (field: string) => (value: any) =>
    publishChanges({
      [`objectives.${main}.primaries.${primary}.secondaries.${secondary}.attributes.${attribute}.${field}`]:
        value,
    });

  changeHandler;
  console.log({ content: view.content, main, primary, secondary, attribute });

  return <div>{view.content.name}</div>;
}

export default SSantoSecondaryObjectiveEditor;
