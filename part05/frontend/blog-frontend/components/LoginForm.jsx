import { useState } from "react";

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = event => {
    event.preventDefault();
    handleLogin({ username, password });
  };

  return (
    <>
      <h1>log in to the application</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">
            username
            <input
              type="text"
              id="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label htmlFor="password">
            password
            <input
              type="password"
              id="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button>login</button>
      </form>
    </>
  );
};

export default LoginForm;
