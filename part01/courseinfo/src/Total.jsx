const Total = (props) => {  
  const total = props.parts.reduce((sum,part) => sum + part.exercises,0);

  return (<p>Total number of exercises is {total}</p>);
}

export default Total