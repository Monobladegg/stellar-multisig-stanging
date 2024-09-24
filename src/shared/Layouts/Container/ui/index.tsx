import React, { FC } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Container: FC<Props> = ({ children, className }) => {
  return (
    <div className={`container ${className}`}>
      <div className="segment blank">{children}</div>
    </div>
  );
};

export default Container;
