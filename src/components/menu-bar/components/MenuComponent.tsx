import React from 'react';

/**
 * Menu component.
 * @param {any} param0 Parameters for the menu.
 * @return {JSX.Element} Html.
 */
class MenuComponent extends React.Component {
  props: any;
  id: string;
  key?: string;

  /**
   * @constructor
   * @param {any} props Props. TODO
   * @param {string} id Identifier.
   * @param {string} [key] Key name.
   */
  constructor(props: any, id: string, key?: string) {
    super(props);
    this.props = props;
    this.key = key;
    this.id = id;
  }
}

export default MenuComponent;
