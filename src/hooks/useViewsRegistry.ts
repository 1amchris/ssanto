import { useContext } from 'react';
import ViewsRegistry from 'components/ViewsRegistry';
import UnsupportedFileView from 'components/common/UnsupportedFileView';

export default function useViewsRegistry() {
  const { factories } = useContext(ViewsRegistry);

  return {
    getView: (uri?: string) => {
      if (!uri) {
        return UnsupportedFileView;
      }

      const viewType = uri.slice(0, uri.indexOf('://'));
      const View = (factories as any)[viewType];
      return View || UnsupportedFileView;
    },
  };
}
