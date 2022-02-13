import { capitalize, uniqueId } from 'lodash';
import React, { ReactElement } from 'react';
import { withTranslation } from 'react-i18next';
import { FiPlus, FiMinusCircle } from 'react-icons/fi';
import { MdSubdirectoryArrowRight } from 'react-icons/md';
import FormComponent from './FormComponent';

class FormExpandableList extends FormComponent {
  template: ReactElement;
  mouseHovering?: number;

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

  liProps = {
    style: { gridTemplateColumns: '1.75rem auto' },
    className: 'mt-2 d-grid',
  };

  render = () => {
    const { t, i18n, tReady, label } = this.props;
    return (
      <div>
        <label
          htmlFor={this.props.name}
          className={`form-label small mb-0 ${
            this.hideLabel && 'visually-hidden'
          }`}
        >
          {capitalize(t(label || this.props.name))}
        </label>
        <ul className="list-unstyled">
          {this.state.controls?.map((control: ReactElement, index: number) => (
            <li
              key={`${this.id}/li-${index}`}
              {...this.liProps}
              onMouseEnter={() => {
                this.mouseHovering = index;
              }}
              onMouseLeave={() => {
                this.mouseHovering = undefined;
              }}
            >
              <button
                key={`${this.id}/button-${index}`}
                type="button"
                className="btn btn-sm mb-auto"
                onClick={() => this.removeControl(index)}
              >
                {this.mouseHovering === index ? (
                  <FiMinusCircle
                    className="text-danger"
                    style={{ marginBottom: '3px' }}
                  />
                ) : (
                  <MdSubdirectoryArrowRight style={{ marginBottom: '3px' }} />
                )}
              </button>
              <div key={`${this.id}/wrapper-${index}`}>{control}</div>
            </li>
          ))}
          <li key={`${this.id}/li-plus`} {...this.liProps}>
            <button type="button" disabled className="btn btn-sm mb-auto">
              <MdSubdirectoryArrowRight style={{ marginBottom: '3px' }} />
            </button>
            <button
              type="button"
              className={`btn btn-sm btn-outline-secondary w-100`}
              onClick={this.addControl}
            >
              <FiPlus />
            </button>
          </li>
        </ul>
      </div>
    );
  };

  addControl = () => {
    const control = this.clone(this.template);
    if (control !== undefined)
      this.setState({ controls: this.state.controls.concat(control) });
  };

  removeControl = (index: number) => {
    const controls = [...this.state.controls];
    delete controls[index];
    this.setState({
      controls,
    });
  };

  clone(node: ReactElement, index?: number): ReactElement | undefined {
    return node === undefined
      ? undefined
      : React.cloneElement(
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
}

export default withTranslation()(FormExpandableList);
