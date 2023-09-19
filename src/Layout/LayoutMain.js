import React from "react";
import { FooterMenu, HeaderMenu} from "../Component/Template";

const LayoutMain = ({ children, ...rest }) => {
  return (
    <>
      <HeaderMenu />
      <div className="main-panel ps">
        <div className="content">
          {children}
        </div>
        <FooterMenu />
      </div>
    </>
  );
};
export default LayoutMain;
