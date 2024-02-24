import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import logo from './images/logo.png';

function App() {
  const [planets, setPlanets] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [page, setPage] = useState(1); // State to keep track of current page number

  useEffect(() => {
    fetchPlanets('https://swapi.dev/api/planets/?format=json');
  }, []);

  const fetchPlanets = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setPlanets(data.results);
      setNextPage(data.next);
      setPreviousPage(data.previous); // Set previous page URL
      setPage(1); // Reset page number
    } catch (error) {
      console.error('Error fetching planets:', error);
    }
  };
  
  const fetchNextPage = async () => {
    try {
      if (nextPage) {
        const response = await fetch(nextPage);
        const data = await response.json();
        setPlanets(prevPlanets => [...prevPlanets, ...data.results]);
        setNextPage(data.next);
        setPreviousPage(data.previous);
        setPage(page + 1); // Increment page number
      }
    } catch (error) {
      console.error('Error fetching next page:', error);
    }
  };

  const fetchPreviousPage = async () => {
    try {
      if (previousPage) {
        const response = await fetch(previousPage);
        const data = await response.json();
        setPlanets(data.results);
        setNextPage(data.next);
        setPreviousPage(data.previous);
        setPage(page - 1); // Decrement page number
      }
    } catch (error) {
      console.error('Error fetching previous page:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <header>
          <h1>Star Wars Planets Directory</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage planets={planets} nextPage={nextPage} fetchNextPage={fetchNextPage} fetchPreviousPage={fetchPreviousPage} page={page} />} />
            <Route path="/planet/:id" element={<PlanetDetailsPage planets={planets} />} />
          </Routes>
        </main>
        <footer>
          <p>© 2024 Star Wars</p>
        </footer>
      </div>
    </Router>
  );
}

const HomePage = ({ planets, nextPage, fetchNextPage, fetchPreviousPage, page }) => (
  <div className="home-page-container">
    <div className="left-section">
      <img src={logo} alt="Logo" className="home-image" />
    </div>
    <div className="right-section">
      <div className={`planets ${page === 1 ? 'slide-right-enter' : 'slide-left-enter'}`}>
        {planets.map((planet, index) => (
          <div className="planet-card" key={index}>
            <Link to={`/planet/${index}`}>
              <h2>{planet.name}</h2>
            </Link>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={fetchPreviousPage} disabled={!fetchPreviousPage}><h3>Lesser !!</h3></button>
        {nextPage && (
          <button onClick={fetchNextPage}><h3>More Planets?</h3></button>
        )}
      </div>
    </div>
  </div>
);


const PlanetDetailsPage = ({ planets }) => {
  const location = useLocation();
  const planetIndex = parseInt(location.pathname.split('/')[2]);
  const planet = planets[planetIndex];
  const [showDetails, setShowDetails] = useState(true);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div>
      <div className={`planet-details-card ${showDetails ? 'show' : ''}`}>
        <h2>{planet.name}</h2>
        {showDetails && (
          <div>
            <p><strong>Climate:</strong> {planet.climate}</p>
            <p><strong>Population:</strong> {planet.population !== 'unknown' ? planet.population : 'Unknown'}</p>
            <p><strong>Terrain:</strong> {planet.terrain}</p>
            {planet.population !== 'unknown' && <ResidentsButton residentsUrls={planet.residents} />}
          </div>
        )}
      </div>
      <button onClick={toggleDetails} className="minimize-btn">
        {showDetails ? <h3>Minimize</h3> : <h3>Expand</h3>}
      </button>
      <Link to="/" className="home-btn">
        <h3>Home</h3>
      </Link>
    </div>
  );
};

const ResidentsButton = ({ residentsUrls }) => {
  const [showResidents, setShowResidents] = useState(false);
  const [residents, setResidents] = useState([]);

  const toggleResidents = async () => {
    try {
      const promises = residentsUrls.map(url => fetch(url).then(response => response.json()));
      const data = await Promise.all(promises);
      setResidents(data);
      setShowResidents(!showResidents);
    } catch (error) {
      console.error('Error fetching residents:', error);
    }
  };

  return (
    <div>
      <button onClick={toggleResidents} className="residents-button">
        {showResidents ? <h3>Hide Residents</h3> : <h3>Show Residents</h3>}
      </button>
      {showResidents && <Residents residents={residents} />}
    </div>
  );
};

const Residents = ({ residents }) => (
  <div className="residents-card">
    <h3>Residents:</h3>
    <ul>
      {residents.map((resident, index) => (
        <li key={index}>
          <p><strong>Name:</strong> {resident.name}</p>
          <p><strong>Height:</strong> {resident.height}</p>
          <p><strong>Mass:</strong> {resident.mass}</p>
          <p><strong>Gender:</strong> {resident.gender}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default App;