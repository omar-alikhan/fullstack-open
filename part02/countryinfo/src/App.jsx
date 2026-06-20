import { useEffect, useState } from "react";
import CountrySearch from "./components/CountrySearch";
import Country from "./components/Country";
import Countries from "./components/Countries";
import countryService from "./services/countries";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    countryService.getAll().then(initialCountries => {
      setCountries(initialCountries);
    });
  }, []);

  const handleSearchQuery = event => {
    console.log(event.target.value);
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <CountrySearch value={searchQuery} onChange={handleSearchQuery} />
      <Countries
        countries={countries}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </>
  );
};

export default App;

/* 
Exercises 2.18.-2.20.
2.18* Data for countries, step 1

At https://studies.cs.helsinki.fi/restcountries/ you can find a service that offers a lot of information related to different countries in a so-called machine-readable format via the REST API. Make an application that allows you to view information from different countries.

The user interface is very simple. The country to be shown is found by typing a search query into the search field.

If there are too many (over 10) countries that match the query, then the user is prompted to make their query more specific:

*/
