import { useState } from "react";

const Togglable = ({ buttonLabel, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {!visible && (
        <button onClick={() => setVisible(true)}>{buttonLabel}</button>
      )}
      {visible && (
        <div>
          {children}
          <button onClick={() => setVisible(false)}>cancel</button>
        </div>
      )}
    </div>
  );
};

export default Togglable;
