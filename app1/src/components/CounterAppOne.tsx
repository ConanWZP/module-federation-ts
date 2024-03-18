import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Counter = () => {
  const [count, setCount] = useState(0);

  const location = useLocation();

  return (
    <div >
      <p>
          esrdgfghkghjlfdgjghjlghljk
        Add by one each click <strong>APP-1</strong>
      </p>
      <span>Your click count : {count} </span>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      {location.pathname !== "/" && (
        <Link  to="/">
          Back to container
        </Link>
      )}
    </div>
  );
};

export default Counter;
