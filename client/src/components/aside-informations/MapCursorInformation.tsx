import { selectMap } from 'store/reducers/map';
import { useAppSelector } from 'store/hooks';

function MapCursorInformation() {
  const { cursor, cursorInformations } = useAppSelector(selectMap);

  const rows = [
    <div>
      <small>Latitude/Longitude</small>
      <div className="bg-light border rounded p-2">
        <code className="d-block">{cursor?.lat}</code>
        <code className="d-block">{cursor?.long}</code>
      </div>
    </div>,
    <div className="bg-light border rounded p-2">
      <code>{cursorInformations?.placeholder}</code>
    </div>,
  ];

  return (
    <div>
      {rows.map((row: any, index: number) => (
        <div key={`${index}`} className="mb-2">
          {row}
        </div>
      ))}
    </div>
  );
}

export default MapCursorInformation;
