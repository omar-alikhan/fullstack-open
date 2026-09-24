const Notification = ({ message, type }) => {
  if (!message) return null;

  const style = {
    color: type === "error" ? "red" : "green",
    background: "#d3d3d3",
    padding: "10px",
    borderRadius: "5px",
    fontSize: "24px",
    border: `4px solid ${type === "error" ? "red" : "green"}`,
    marginTop: "1rem",
  };

  return <div style={style}>{message}</div>;
};

export default Notification;
