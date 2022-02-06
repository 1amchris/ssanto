import React from 'react';
import { withTranslation } from 'react-i18next';
import { FcCollapse, FcExpand } from 'react-icons/fc';
import { uniqueId } from 'lodash';

class Collapsible extends React.Component {
  t: (str: string) => string;
  title: string;
  id: string;

  state = {
    open: true,
  };

  constructor(props: any) {
    super(props);
    const { t, title } = props;
    this.t = t;
    this.title = title;
    this.id = uniqueId('collapsible-');
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="w-100 d-flex justify-content-between"
          data-bs-toggle="collapse"
          data-bs-target={`#${this.id}`}
          role="button"
          aria-expanded="true"
          aria-controls={this.id}
          onClick={() => {
            this.setState({ open: !this.state.open });
          }}
        >
          <h5>{this.t(this.title || 'collapsible-title')}</h5>
          <span>{this.state.open ? <FcCollapse /> : <FcExpand />}</span>
        </div>
        <div className="collapse show" id={this.id}>
          {this.props?.children}
        </div>
      </React.Fragment>
    );
  }
}

export default withTranslation()(Collapsible);
