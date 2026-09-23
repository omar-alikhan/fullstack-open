import { useState } from "react";

const LoginForm = ({
  handleLogin,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <>
      <h1>log in to the application</h1>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button>login</button>
      </form>
    </>
  );
};

export default LoginForm;
