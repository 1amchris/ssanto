import { control } from 'leaflet';
import { capitalize, uniqueId } from 'lodash';
import React, { ReactElement } from 'react';
import { withTranslation } from 'react-i18next';
import { FiMinusCircle, FiPlus } from 'react-icons/fi';
import { MdSubdirectoryArrowRight } from 'react-icons/md';
import PropsModel from '../../../models/PropsModel';
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
      <li
        key={this.key}
        className="mt-2 d-grid"
        style={{ gridTemplateColumns: '1.75rem auto' }}
        onMouseEnter={() => this.setState({ isHovered: true })}
        onMouseLeave={() => this.setState({ isHovered: false })}
      >
        <button
          type="button"
          className="btn btn-sm mb-auto"
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
        </button>
        <div key={`${parentId}/wrapper-${index}`}>{children}</div>
      </li>
    );
  };
}

class FormExpandableList extends FormComponent {
  private readonly template: PropsModel;
  private readonly factory: (
    props: FactoryProps
  ) => ReactElement | ReactElement[];

  state: { controls: PropsModel[] } = {
    controls: [],
  };

  constructor(props: any, key?: string) {
    super(props, uniqueId('form/expandable-list-'), key);
    this.factory = this.props.factory;
    this.template = this.props.template;
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

        <ul className="list-unstyled">
          {this.state.controls?.map((control: PropsModel, index: number) => (
            <Row
              key={`${this.id}/row-${index}`}
              parentId={this.id}
              index={index}
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
          <Row
            parentId={this.id}
            key={`${this.id}/row-add`}
            index={this.state.controls.length}
          >
            <button
              type="button"
              className={`btn btn-sm btn-outline-secondary w-100`}
              onClick={this.addControl}
            >
              <FiPlus />
            </button>
          </Row>
        </ul>
      </React.Fragment>
    );
  };

  private addControl = () => {
    const controls = this.state.controls.concat({
      ...this.template,
      id: uniqueId(),
    });
    this.updateControls(controls);
  };

  private removeControlAt = (index: number) => {
    const controls = [...this.state.controls];
    controls.splice(index, 1);
    this.updateControls(controls);
  };

  private updateControls = (controls: PropsModel[]) => {
    this.setState({
      controls,
    });
  };
}

export default withTranslation()(FormExpandableList);
