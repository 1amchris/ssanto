import { capitalize, uniqueId } from 'lodash';
import React, { ReactElement } from 'react';
import { Button } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { FiMinusCircle, FiPlus, FiInfo } from 'react-icons/fi';
import { MdSubdirectoryArrowRight } from 'react-icons/md';
import PropsModel from 'models/PropsModel';
import FormComponent from './FormComponent';
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
 * @param onDeleteControl [optional] Specifies what happens when the 'delete' button is clicked
 *                        Leave undefined to prevent the user from deleting the entry
 * @return a row entry for the expandable list
 */
class Row extends React.Component<{
  parentId: string;
  index: number;
  onDeleteControl?: (index: number) => void;
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
    const { parentId, index, children, onDeleteControl } = this.props;
    return (
      <li
        key={this.key}
        className="mt-2 d-grid"
        style={{ gridTemplateColumns: '1.75rem auto' }}
        onMouseEnter={() => this.setState({ isHovered: true })}
        onMouseLeave={() => this.setState({ isHovered: false })}
      >
        <Button
          variant="none"
          size="sm"
          className="mb-auto"
          key={`${parentId}/button-${index}`}
          disabled={onDeleteControl === undefined}
          onClick={() => onDeleteControl!(index)}
        >
          {onDeleteControl && this.state.isHovered ? (
            <FiMinusCircle
              className="text-danger"
              style={{ marginBottom: '3px' }}
            />
          ) : (
            <MdSubdirectoryArrowRight style={{ marginBottom: '3px' }} />
          )}
        </Button>
        <div key={`${parentId}/wrapper-${index}`}>{children}</div>
      </li>
    );
  };
}

/**
 * TODO: [optional] add the ability to reorder the elements in the list
 * FormExpandableList
 * @param props .factory is a generator function that, provided with a few props will return a ReactElement or a list of em
 *              .template is used to generate a new control object when the user asks to
 *              .controls is the existing controls upon generating the expandable list
 * @return a list with variable length, to which the user can add elements and remove elements
 */
class FormExpandableList extends FormComponent {
  private readonly template: PropsModel;
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
    this.template = this.props.template;
    this.state.controls =
      this.props.controls?.map((control: PropsModel) => ({
        ...control,
        id: control?.id !== undefined ? control.id : uniqueId(),
      })) || [];
  }

  render = () => {
    const { t, label, name, guideHash = '' } = this.props;
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
              onDeleteControl={this.onRemoveControl}
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
          <Row
            parentId={this.id}
            key={`${this.id}/row-add`}
            index={this.state.controls.length}
          >
            <Button
              variant="outline-secondary"
              size="sm"
              className="w-100"
              onClick={this.onAddControl}
            >
              <FiPlus />
            </Button>
          </Row>
        </ul>
      </React.Fragment>
    );
  };
}

export default withTranslation()(FormExpandableList);
