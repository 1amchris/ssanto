import { useContext } from 'react';
import ViewsRegistry from 'components/ViewsRegistry';
import UnsupportedFileView from 'components/common/UnsupportedFileView';
import DefaultView from 'components/common/DefaultView';

export default function useViewsRegistry() {
  const { factories } = useContext(ViewsRegistry);

  return {
    getActions: (uri?: string) => {
      if (!uri) {
        return [];
      }

      const viewType = uri.slice(0, uri.indexOf('://'));
      const viewActions = (factories as any)[viewType]?.actions;
      return viewActions || [];
    },
    getView: (uri?: string) => {
      if (!uri) {
        return DefaultView;
      }

      const viewType = uri.slice(0, uri.indexOf('://'));
      const viewFactory = (factories as any)[viewType]?.factory;
      return viewFactory || UnsupportedFileView;
    },
  };
}
