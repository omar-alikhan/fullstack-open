const Persons = ({ persons, filter, handleDeletePerson }) => {
  return (
    <>
      {persons
        .filter(p => p.name.includes(filter))
        .map(p => (
          <div id={p.id} key={p.name}>
            {p.name} {p.number}
            <button onClick={() => handleDeletePerson(p)}>delete</button>
          </div>
        ))}
    </>
  );
};

export default Persons;
