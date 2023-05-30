import React from "react";

const Card = props => {
  return (
    <div className="shadow-lg rounded-md p-3 md:p-5 mb-4">{props.children}</div>
  );
};

export default Card;
