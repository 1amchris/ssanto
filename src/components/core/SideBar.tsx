import React from 'react';

/**
 * Side bar component.
 * @return {JSX.Element} Html.
 */
function SideBar() {
  return (
    <nav className="d-flex flex-column justify-content-between border-start border-end h-100">
      <div className="d-flex flex-column overflow-auto">
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          Exercitationem dignissimos autem architecto expedita illum sequi aut
          rerum, facilis enim fugit eligendi? Nesciunt unde soluta dolorem
          deleniti reprehenderit, temporibus dolore itaque.
        </p>
      </div>
    </nav>
  );
}

export default SideBar;
