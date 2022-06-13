import React from 'react';

const ViewsRegistry = React.createContext({
  factories: {},
  registerFactory: (
    viewType: string,
    factory: (props: any) => React.ReactNode
  ) => {},
});

export default ViewsRegistry;
