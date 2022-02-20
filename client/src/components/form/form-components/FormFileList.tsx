import { control } from 'leaflet';
import { capitalize, uniqueId } from 'lodash';
import React, { ReactElement } from 'react';
import { withTranslation } from 'react-i18next';
import { FiMinusCircle, FiPlus } from 'react-icons/fi';
import { MdSubdirectoryArrowRight } from 'react-icons/md';
import PropsModel from '../../../models/PropsModel';
import { GeoFile } from '../../../store/reducers/analysis';
import FormComponent from './FormComponent';

class Row extends React.Component<{
  parentId: string;
  file: GeoFile;
  onDeleteControl?: (fileName: string) => void;
}> {
  key?: string;
  state = {
    isHovered: false,
  };

  constructor(props: any, key?: string) {
    super(props);
    this.key = key;
  }

  render = () => {
    const { parentId, children, file, onDeleteControl } = this.props;
    return (
      <li
        key={`${parentId}/row-${file.name}`}
        className="list-group-item mt-1 d-grid"
        style={{ gridTemplateColumns: '1.75rem auto' }}
        onMouseEnter={() => this.setState({ isHovered: true })}
        onMouseLeave={() => this.setState({ isHovered: false })}
      >
        <button
          type="button"
          className="btn btn-sm mb-auto"
          key={`${parentId}/button-${file.name}`}
          disabled={onDeleteControl === undefined}
          onClick={() => onDeleteControl!(file.name)}
        >
          {onDeleteControl && this.state.isHovered ? (
            <FiMinusCircle
              className="text-danger"
              style={{ marginBottom: '3px' }}
            />
          ) : (
            <></>
          )}
        </button>
        <div key={`${parentId}/wrapper-${file.name}`}>{children}</div>
      </li>
    );
  };
}

class FormExpandableList extends FormComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('form/filelist-'), key);
  }
  render = () => {
    const {
      t,
      i18n,
      tReady,
      geoFiles,
      onDeleteControl,
      className,
      hideLabel,
      label,
      ...props
    } = this.props;
    this.state = {
      isHovered: false,
    };
    return (
      <div>
        <ol className="list-group">
          {geoFiles.map((file: GeoFile) => (
            <Row
              key={`${this.id}/row-${file.name}`}
              parentId={this.id}
              onDeleteControl={console.log}
              file={file}
            >
              <div className="ms-1 me-auto small">
                <div>{file.name}</div>
              </div>
              <span className="badge bg-primary rounded-pill top-right">
                {file.extention}
              </span>
            </Row>
          ))}
        </ol>
      </div>
    );
  };
}

export default withTranslation()(FormExpandableList);
