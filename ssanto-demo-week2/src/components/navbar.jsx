import React from "react";

const NavBar = ({ onToggleClicked }) => {
  return (
    <nav className="px-4 navbar navbar-light bg-light space-between shadow">
      <a className="navbar-brand" href="#">
        SSANTO Demo
      </a>

      <div>
        <button
          className="btn btn-sm"
          onClick={() => onToggleClicked("Countries")}
        >
          Toggle Countries
        </button>
        <button
          className="btn btn-sm"
          onClick={() => onToggleClicked("UsStates")}
        >
          Toggle US States
        </button>
        <button
          className="btn btn-sm"
          onClick={() => onToggleClicked("UsCounties")}
        >
          Toggle US Counties
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
