import { capitalize, uniqueId } from 'lodash';
import React, { ReactElement } from 'react';
import { withTranslation } from 'react-i18next';
import { FiMinusCircle, FiPlus } from 'react-icons/fi';
import { MdSubdirectoryArrowRight } from 'react-icons/md';
import FormComponent from './FormComponent';

class Row extends React.Component<{
  parentId: string;
  index: number;
  control: ReactElement;
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
    const { parentId, index, control, onDeleteControl } = this.props;

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
        <div key={`${parentId}/wrapper-${index}`}>{control}</div>
      </li>
    );
  };
}

class FormExpandableList extends FormComponent {
  template: ReactElement;

  state: {
    controls: ReactElement[];
  } = {
    controls: [],
  };

  constructor(props: any, key?: string) {
    super(props, uniqueId('form/expandable-list-'), key);
    this.template = <React.Fragment>{this.props.template}</React.Fragment>;
    this.state.controls = this.props.controls || [];
  }

  render = () => {
    const { t, label, name } = this.props;
    return (
      <div>
        <label
          htmlFor={name}
          className={`form-label small mb-0 ${
            this.hideLabel ? 'visually-hidden' : ''
          }`}
        >
          {capitalize(t(label || name))}
        </label>
        <ul className="list-unstyled">
          {this.state.controls?.map((control, index) => (
            <Row
              key={`${this.id}/row-${index}`}
              parentId={this.id}
              control={control}
              index={index}
              onDeleteControl={this.removeControlAt}
            />
          ))}
          <Row
            parentId={this.id}
            key={`${this.id}/row-add`}
            control={
              <button
                type="button"
                className={`btn btn-sm btn-outline-secondary w-100`}
                onClick={this.addControl}
              >
                <FiPlus />
              </button>
            }
            index={this.state.controls.length}
          />
        </ul>
      </div>
    );
  };

  addControl = () => {
    const control = this.clone(this.template);
    this.setState({ controls: this.state.controls.concat(control) });
  };

  removeControlAt = (index: number) => {
    const controls = [...this.state.controls];
    controls.splice(index, 1);
    this.setState({
      controls,
    });
  };

  clone = (node: ReactElement, index?: number): ReactElement =>
    React.cloneElement(
      node,
      {
        ...node.props,
        name: `${this.props.name}.${node.props.name}.${
          index || this.state.controls.length
        }`,
      },
      React.Children.map(node.props?.children, (child: ReactElement) =>
        this.clone(child)
      )
    );
}

export default withTranslation()(FormExpandableList);
