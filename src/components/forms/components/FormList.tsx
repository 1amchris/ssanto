import { capitalize, uniqueId } from 'lodash';
import PropsModel from 'models/PropsModel';
import React, { ReactElement } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { FiInfo, FiMinusCircle } from 'react-icons/fi';
import { HashLink } from 'react-router-hash-link';
import FormComponent from './FormComponent';

export interface FactoryProps extends PropsModel {
  orderIndex: number;
  key: (infix: string) => string;
  name: (infix: string) => string;
}

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
        className="d-grid"
        style={{
          minHeight: 'calc(31px + 2px + 1rem)',
          gridTemplateColumns: '1.75rem auto',
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
        <div
          key={`${parentId}/wrapper-${index}`}
          className="w-100 h-100 position-relative"
        >
          {children}
        </div>
      </ListGroup.Item>
    );
  };
}

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
          <span>({this.state.controls.length || '0'})</span>{' '}
          {guideHash?.length > 0 && (
            <HashLink to={`/guide#${guideHash}`}>
              <FiInfo />
            </HashLink>
          )}
        </label>

        <ListGroup>
          {this.state.controls?.map((control: PropsModel, index: number) => (
            <Row
              key={`${this.id}/row-${index}`}
              parentId={this.id}
              index={index}
              onDeleteControl={this.onDeleteControl}
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
}

export default withTranslation()(FormList);
