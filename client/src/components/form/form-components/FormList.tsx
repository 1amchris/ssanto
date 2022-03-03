import { control } from 'leaflet';
import { capitalize, uniqueId } from 'lodash';
import PropsModel from 'models/PropsModel';
import React, { ReactElement } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { FiMinusCircle, FiPlus } from 'react-icons/fi';
import { MdSubdirectoryArrowRight } from 'react-icons/md';
import FormComponent from './FormComponent';

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
 * @returns a row entry for the expandable list
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
      <ListGroup.Item
        key={this.key}
        className="list-group-item mt-3 d-grid  "
        style={{
          gridTemplateColumns: '1.75rem auto',
          gridTemplateRows: '1.75rem auto',
        }}
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
            <></>
          )}
        </Button>
        <div key={`${parentId}/wrapper-${index}`}>{children}</div>
      </ListGroup.Item>
    );
  };
}

/**
 * TODO: [optional] add the ability to reorder the elements in the list
 * FormExpandableList
 * @param props .factory is a generator function that, provided with a few props will return a ReactElement or a list of em
 *              .template is used to generate a new control object when the user asks to
 *              .controls is the existing controls upon generating the expandable list
 * @returns a list with variable length, to which the user can add elements and remove elements
 */
class FormList extends FormComponent {
  private readonly template: PropsModel;
  private readonly factory: (
    props: FactoryProps
  ) => ReactElement | ReactElement[];
  private onDeleteControl: any;

  state: { controls: PropsModel[] } = {
    controls: [],
  };

  constructor(props: any, key?: string) {
    super(props, uniqueId('form/expandable-list-'), key);
    this.factory = this.props.factory;
    this.template = this.props.template;
    this.onDeleteControl = this.props.onDeleteControl;

    this.state.controls =
      this.props.controls?.map((control: PropsModel) => ({
        ...control,
        id: control?.id !== undefined ? control.id : uniqueId(),
      })) || [];
  }

  render = () => {
    const { t, label, name } = this.props;
    return (
      <React.Fragment>
        <label
          htmlFor={name}
          className={`form-label small mb-0 ${
            this.hideLabel ? 'visually-hidden' : ''
          }`}
        >
          {capitalize(t(label || name))}
        </label>

        <ListGroup>
          {this.state.controls?.map((control: PropsModel, index: number) => (
            <Row
              key={`${this.id}/row-${control.index}`}
              parentId={this.id}
              index={control.index}
              onDeleteControl={this.removeControlAt}
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
        </ListGroup>
      </React.Fragment>
    );
  };

  private removeControlAt = (index: number) => {
    this.updateServer(index);
  };

  private updateServer = (index: number) => {
    this.onDeleteControl(index);
  };
}

export default withTranslation()(FormList);
