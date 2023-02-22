import { useAppDispatch, useAppSelector } from 'store/hooks';
import { requestBlob, selectBlobber } from 'store/reducers/blobber';

export default function useBlobber() {
  const blobber = useAppSelector(selectBlobber);
  const dispatch = useAppDispatch();

  const isBlob = (obj: any) =>
    typeof obj === 'string' && obj.startsWith('blob://');
  const isLoading = (uri: string) =>
    blobber.requestedBlobs.filter(blobUri => blobUri === uri).length > 0;
  const hasBlob = (uri: string) => !!blobber.blobs[uri];

  return {
    isBlob,
    isLoading,
    hasBlob,
    getBlob: (uri: string) => {
      if (!isBlob(uri)) return null;
      if (hasBlob(uri)) return blobber.blobs[uri];
      if (!isLoading(uri)) dispatch(requestBlob(uri));
      return null;
    },
  };
}
