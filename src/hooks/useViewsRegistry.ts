import { useContext } from 'react';
import ViewsRegistry from 'components/ViewsRegistry';
import UnsupportedFileView from 'components/common/UnsupportedFileView';
import DefaultView from 'components/common/DefaultView';

export default function useViewsRegistry() {
  const { factories } = useContext(ViewsRegistry);

  return {
    getView: (uri?: string) => {
      if (!uri) {
        return DefaultView;
      }

      const viewType = uri.slice(0, uri.indexOf('://'));
      const View = (factories as any)[viewType];
      return View || UnsupportedFileView;
    },
  };
}
