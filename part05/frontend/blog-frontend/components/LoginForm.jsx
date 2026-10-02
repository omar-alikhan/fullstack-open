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
          <label htmlFor="username">
            username
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
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
              onChange={handlePasswordChange}
            />
          </label>
        </div>
        <button>login</button>
      </form>
    </>
  );
};

export default LoginForm;
