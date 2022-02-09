import React, { ReactElement } from 'react';

function NavigationBar(
  { children, className }: any,
  key?: string
): ReactElement {
  return (
    <nav
      key={key}
      className={`border-end bg-light overflow-scroll ${className}`}
      style={{ height: 'calc(100vh - 24px)', width: '270px' }}
    >
      <ul className="list-unstyled m-3">
        {[].concat(children).map((child: ReactElement, index: number) => (
          <li
            key={`navigation/item-${index}`}
            className="pb-2 border-bottom mb-2"
          >
            {child}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavigationBar;
