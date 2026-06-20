const CountrySearch = ({ searchQuery, onChange }) => {
  return (
    <>
      find countries
      <input value={searchQuery} onChange={onChange} />
    </>
  );
};

export default CountrySearch;
