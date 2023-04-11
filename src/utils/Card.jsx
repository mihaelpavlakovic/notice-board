import React from "react";

const Card = props => {
  return <div className="shadow-lg rounded-md p-5">{props.children}</div>;
};

export default Card;