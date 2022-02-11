import { uniqueId } from 'lodash';
import MenuComponent from './MenuItem';

class MenuDivider extends MenuComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('menu/divider-'), key);
  }

  render = () => {
    const { t, i18n, tReady, className, ...rest } = this.props;

    return (
      <hr
        {...rest}
        key={this.key}
        className={`dropdown-divider small ${className}`}
      />
    );
  };
}

export default MenuDivider;
