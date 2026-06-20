import Country from "./Country";

const Countries = ({ countries, searchQuery, setSearchQuery }) => {
  const filteredCountries = countries.filter(c =>
    c.name.common.toLowerCase().includes(searchQuery),
  );

  if (filteredCountries.length === 1) {
    return <Country country={filteredCountries[0]} />;
  } else if (filteredCountries.length < 10) {
    return filteredCountries.map(c => (
      <div>
        {c.name.common}
        <button onClick={() => setSearchQuery(c.name.common.toLowerCase())}>
          Show
        </button>
      </div>
    ));
  } else {
    return <div>too many matches, specify another filter</div>;
  }
};

export default Countries;
