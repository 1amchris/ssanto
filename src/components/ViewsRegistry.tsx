import React from 'react';
import ViewAction from 'models/ViewAction';

const ViewsRegistry = React.createContext({
  factories: {},

  registerFactory: (
    viewType: string,
    factory: (props: any) => React.ReactNode,
    actions: ViewAction[]
  ) => {},
});

export default ViewsRegistry;
