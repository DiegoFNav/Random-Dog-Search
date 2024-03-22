import './App.css'
import { useState } from 'react';
const api_key = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [dogImage, setDogImage] = useState(null);
  const [dogBreeds, setDogBreeds] = useState([]);
  const [banList, setBanList] = useState([]);

  const displayedKeys = ['name', 'life_span', 'breed_group', 'origin', 'weight'];

  const url = `https://api.thedogapi.com/v1/images/search?limit=1&has_breeds=1`;

  const handleDiscoverClick = async () => {
    try {
      const response = await fetch(url, {
        headers: {
          'x-api-key': api_key
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch dog image');
      }
      const data = await response.json();
      setDogImage(data[0].url);
      setDogBreeds(data[0].breeds);
      console.log(data[0].breeds);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBreedAttributeClick = (key, value) => {
    setBanList([...banList, { [key]: value }]);
  };

  return (
    <>
      <div className='main_container'>
        <div className='veni_container'>
          <div className='veni_card'>
            <h1>Veni Vici!</h1>
            <p>Discover dogs from your wildest dreams!</p>
            {dogBreeds.map((breed, index) => (
              <div key={index}>
                {Object.entries(breed)
                  .filter(([key, _]) => displayedKeys.includes(key))
                  .map(([key, value]) => (
                    <button key={key} onClick={() => handleBreedAttributeClick(key, value)}>
                      {key === 'weight' && typeof value === 'object' // Check if key is 'weight' and value is an object
                        ? `${value.imperial} lbs` // If yes, display 'imperial' value and append 'lbs'
                        : `${value}`}
                    </button>
                  ))}
              </div>
            ))}
            {dogImage && <img src={dogImage} alt='Random Dog' />}
            <button onClick={handleDiscoverClick}>Discover!</button>
          </div>
        </div>
        <div className='ban_container'>
          <h3>Ban List</h3>
          <p>Select attributes in your listing to ban it</p>
          {banList.map((breed, index) => (
            <div key={index}>
              {Object.entries(breed).map(([key, value], i) => (
                <p key={i}>
                  {key === 'weight' && typeof value === 'object' // Check if key is 'weight' and value is an object
                    ? `${value.imperial} lbs` // If yes, display 'imperial' value and append 'lbs'
                    : `${value}`}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App;