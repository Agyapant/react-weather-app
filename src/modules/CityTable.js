import React, { useState, useEffect } from 'react';
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; /* Set width to 100% for responsiveness */
  max-width: 800px; /* Limit maximum width */
  margin: auto;
  padding-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableCell = styled.td`
  padding: 8px;
  border: 1px solid #dddddd;
  text-align: left;
`;

const SearchBox = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the form items */
  margin: 20px;
  border: black solid 1px;
  border-radius: 2px;

  & input {
    padding: 10px;
    font-size: 14px;
    border: none;
    outline: none;
    font-family: Montserrat;
    font-weight: bold;
  }
  & button {
    background-color: black;
    font-size: 14px;
    padding: 0 10px;
    color: white;
    border: none;
    outline: none;
    cursor: pointer;
    font-family: Montserrat;
    font-weight: bold;
  }
`;

const ChooseCityLabel = styled.span`
  color: black;
  margin: 10px auto;
  font-size: 18px;
  font-weight: bold;
`;

const WelcomeWeatherLogo = styled.img`
  width: 140px;
  height: 140px;
  margin: 40px auto;
`;

function CityTable({ fetchWeather }) {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const limit = 5; // Number of cities to fetch per request

  useEffect(() => {
    fetchCities();
  }, []); // Fetch cities on component mount

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      // Fetch search results
      fetchSearchResults();
    } else {
      // Clear search results if search query is empty
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchCities = () => {
    setLoading(true);
    fetch(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=${limit}&start=${offset}`)
      .then(response => response.json())
      .then(data => {
        setCities(prevCities => [...prevCities, ...data.records]);
        setOffset(prevOffset => prevOffset + limit);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const fetchSearchResults = () => {
    setLoading(true);
    fetch(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=${searchQuery}`)
      .then(response => response.json())
      .then(data => {
        setSearchResults(data.records);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching search results:', error);
        setLoading(false);
      });
  };
  
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      // Call fetchWeather with the selected city
      await fetchWeather(searchQuery);
    }
  };

  return (
    <Container>
      <WelcomeWeatherLogo src={"/react-weather-app/icons/perfect-day.svg"} />
      <ChooseCityLabel>Find Weather of your city</ChooseCityLabel>
      <h1>Cities Table</h1>
      <SearchBox onSubmit={handleSearchSubmit}>
        <input type="text" placeholder="Search cities..." value={searchQuery} onChange={handleInputChange} />
        <button type="submit">Search</button>
      </SearchBox>
      <Table>
        <thead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Timezone</TableCell>
            <TableCell>Population</TableCell>
          </TableRow>
        </thead>
        <tbody>
          {searchQuery.trim() === '' ? (
            cities.map((city, index) => (
              <TableRow key={city.recordid}>
                <TableCell>{city.fields.name}</TableCell>
                <TableCell>{city.fields.cou_name_en}</TableCell>
                <TableCell>{city.fields.timezone}</TableCell>
                <TableCell>{city.fields.population}</TableCell>
              </TableRow>
            ))
          ) : (
            searchResults.map((city, index) => (
              <TableRow key={city.recordid}>
                <TableCell>{city.fields.name}</TableCell>
                <TableCell>{city.fields.cou_name_en}</TableCell>
                <TableCell>{city.fields.timezone}</TableCell>
                <TableCell>{city.fields.population}</TableCell>
              </TableRow>
            ))
          )}
        </tbody>
      </Table>
      {loading && <div className="loader"></div>}
      {!loading && (
        <button onClick={fetchCities}>Load More</button>
      )}
    </Container>
  );
}

export default CityTable;
