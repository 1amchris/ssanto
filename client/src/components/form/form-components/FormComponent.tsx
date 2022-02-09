import React from 'react';

class FormComponent extends React.Component {
  props: any;
  id: string;
  key?: string;

  constructor(props: any, id: string, key?: string) {
    super(props);
    this.props = props;
    this.key = key;
    this.id = id;
  }
}

export default FormComponent;
