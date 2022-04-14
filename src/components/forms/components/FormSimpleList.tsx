import { capitalize, uniqueId } from 'lodash';
import React, { ReactElement } from 'react';
import { withTranslation } from 'react-i18next';
import { MdSubdirectoryArrowRight } from 'react-icons/md';
import PropsModel from 'models/PropsModel';
import FormComponent from './FormComponent';
import { FiInfo } from 'react-icons/fi';
import { HashLink } from 'react-router-hash-link';

export interface FactoryProps extends PropsModel {
  orderIndex: number;
  key: (infix: string) => string;
  name: (infix: string) => string;
}

class Row extends React.Component<{
  parentId: string;
  index: number;
  hideArrow: boolean;
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
    const { parentId, index, children, hideArrow = false } = this.props;

    const rowParams = hideArrow
      ? {}
      : {
          className: 'mt-2 d-grid',
          style: { gridTemplateColumns: '1.75rem auto' },
          onMouseEnter: () => this.setState({ isHovered: true }),
          onMouseLeave: () => this.setState({ isHovered: false }),
        };

    return (
      <li key={this.key} {...rowParams}>
        {!hideArrow && (
          <div className="mb-auto" key={`${parentId}/container-${index}`}>
            <MdSubdirectoryArrowRight style={{ marginBottom: '3px' }} />
          </div>
        )}
        <div key={`${parentId}/wrapper-${index}`}>{children}</div>
      </li>
    );
  };
}

class FormExpandableList extends FormComponent {
  private readonly factory: (
    props: FactoryProps
  ) => ReactElement | ReactElement[];

  state: { controls: PropsModel[] } = {
    controls: [],
  };
  onAddControl: () => void;
  onRemoveControl?: (index: number) => void;

  constructor(props: any, key?: string) {
    super(props, uniqueId('form/expandable-list-'), key);
    this.factory = this.props.factory;
    this.onAddControl = this.props.onAddControl;
    this.onRemoveControl = this.props.onRemoveControl;
    this.state.controls =
      this.props.controls?.map((control: PropsModel) => ({
        ...control,
        id: control?.id !== undefined ? control.id : uniqueId(),
      })) || [];
  }

  render = () => {
    const { t, label, name, guideHash = '', hideArrow = false } = this.props;
    return (
      <React.Fragment>
        <label
          htmlFor={name}
          className={`form-label small mb-0 ${
            this.hideLabel ? 'visually-hidden' : ''
          }`}
        >
          {capitalize(t(label || name))}{' '}
          {guideHash?.length > 0 && (
            <HashLink to={`/guide#${guideHash}`}>
              <FiInfo />
            </HashLink>
          )}
        </label>

        <ul className="list-unstyled">
          {this.state.controls?.map((control: PropsModel, index: number) => (
            <Row
              key={`${this.id}/row-${index}`}
              parentId={this.id}
              index={index}
              hideArrow={hideArrow}
            >
              {this.factory({
                ...control,
                orderIndex: index,
                key: (infix: string) =>
                  `${name}.${infix}.${index}.${control.id}`,
                name: (infix: string) => `${name}.${infix}.${index}`,
              } as FactoryProps)}
            </Row>
          ))}
        </ul>
      </React.Fragment>
    );
  };
}

export default withTranslation()(FormExpandableList);
