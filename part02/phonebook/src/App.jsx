import { useState, useEffect } from "react";
import axios from "axios";
import personService from "./services/persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Person from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  const addName = event => {
    event.preventDefault();

    const existingPerson = persons.find(person => person.name === newName);

    const personObj = { name: newName, number: newNumber };

    if (existingPerson) {
      if (
        window.confirm(
          `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        personService
          .update(existingPerson.id, personObj)
          .then(returnedPerson => {
            console.log(returnedPerson);
            setPersons(
              persons.with(
                persons.findIndex(p => p.id === returnedPerson.id),
                returnedPerson,
              ),
            );
            setNewName("");
            setNewNumber("");
          });
      }
    } else {
      personService.create(personObj).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const handleNameChange = event => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = event => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleFilterChange = event => {
    console.log(event.target.value);
    setFilter(event.target.value);
  };

  const handleDeletePerson = person => {
    if (window.confirm(`Delete ${person.name}`)) {
      personService.remove(person.id).then(deletedPerson => {
        setPersons(persons.filter(p => p.id !== deletedPerson.id));
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Person
        persons={persons}
        filter={filter}
        handleDeletePerson={handleDeletePerson}
      />
    </div>
  );
};

export default App;
