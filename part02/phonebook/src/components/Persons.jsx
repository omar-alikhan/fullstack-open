const Persons = ({persons, filter}) => {
  return (
    <>
      {persons
        .filter((p) => p.name.includes(filter))
        .map((p) => (
          <div key={p.name}>
            {p.name} {p.number}
          </div>
        ))}
    </>
  );
};

export default Persons;