import React, { ReactElement } from 'react';

function NavigationBar({ children }: any): ReactElement {
  return (
    <nav
      className="border-end bg-light overflow-scroll"
      style={{ height: 'calc(100vh - 24px)', width: '270px' }}
    >
      <ul className="list-unstyled m-3">
        {children?.map((child: ReactElement, index: number) => (
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
