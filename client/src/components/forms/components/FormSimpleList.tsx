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

/**
 * Row
 * @param parentId the id of the calling parent
 * @param index the index at which the row is placed in a list
 * @returns a row entry for the expandable list
 */
class Row extends React.Component<{
  parentId: string;
  index: number;
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
    const { parentId, index, children } = this.props;
    return (
      <li
        key={this.key}
        className="mt-2 d-grid"
        style={{ gridTemplateColumns: '1.75rem auto' }}
        onMouseEnter={() => this.setState({ isHovered: true })}
        onMouseLeave={() => this.setState({ isHovered: false })}
      >
        <div className="mb-auto" key={`${parentId}/container-${index}`}>
          <MdSubdirectoryArrowRight style={{ marginBottom: '3px' }} />
        </div>
        <div key={`${parentId}/wrapper-${index}`}>{children}</div>
      </li>
    );
  };
}

/**
 * TODO: [optional] add the ability to reorder the elements in the list
 * FormExpandableList
 * @param props .factory is a generator function that, provided with a few props will return a ReactElement or a list of em
 *              .controls is the existing controls upon generating the expandable list
 * @returns a list with variable length, to which the user can add elements and remove elements
 */
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
    const { t, label, name, guide_hash = '' } = this.props;
    return (
      <React.Fragment>
        <label
          htmlFor={name}
          className={`form-label small mb-0 ${
            this.hideLabel ? 'visually-hidden' : ''
          }`}
        >
          {capitalize(t(label || name))}{' '}
          {guide_hash?.length > 0 && (
            <HashLink to={`/guide#${guide_hash}`}>
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
