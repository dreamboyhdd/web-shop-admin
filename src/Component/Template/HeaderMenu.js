import React, { useState } from "react";
export const HeaderMenu = () => {
  const [Active, setActive] = useState(true)
  return (
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      aria-controls="navigation-index"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      {Active ?
        <i className="fa-solid fa-bars" onClick={e => setActive(!Active)} ></i> :
        <i className="fa-solid fa-x" onClick={e => setActive(!Active)} ></i>
      }
    </button>
  );
};
