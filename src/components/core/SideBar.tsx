import React from 'react';

/**
 * Side bar component.
 * @return {JSX.Element} Html.
 */
function SideBar({ children }: any) {
  return (
    <nav className="d-flex flex-column justify-content-between">
      <div className="d-flex flex-column overflow-auto">{children}</div>
    </nav>
  );
}

export default SideBar;
