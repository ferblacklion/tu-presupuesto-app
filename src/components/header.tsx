import React, { ReactNode } from 'react';
declare interface IHeaderContainer {
  children: ReactNode;
}
function HeaderContainer({ children }: IHeaderContainer) {
  return (
    <div className="header">
      <div className="container">
        <div className="header-content">{children}</div>
      </div>
    </div>
  );
}

const Header = React.memo(HeaderContainer);
export default Header;
