import './App.css';
import { useState} from 'react';

const api_key = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [dogImage, setDogImage] = useState(null);
  const [dogBreeds, setDogBreeds] = useState([]);
  const [banList, setBanList] = useState([]);
  const [currentDogIndex, setCurrentDogIndex] = useState(0);
  const [banned, setBanned] = useState(false);

  const displayedKeys = ['name', 'life_span', 'breed_group', 'origin', 'weight'];

  const url = `https://api.thedogapi.com/v1/images/search?limit=20&has_breeds=1`;


  const handleDiscoverClick = async () => {
    try {
      if (currentDogIndex < dogBreeds.length - 1 && !banned) {
        setCurrentDogIndex(prevIndex => prevIndex + 1);
        setDogImage(dogBreeds[currentDogIndex + 1].url);
        return;
      }
      setBanned(false);

      const response = await fetch(url, {
        headers: {
          'x-api-key': api_key,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dog image');
      }

      const data = await response.json();
      const filteredDogs = data.filter(dog => {
          for (const ban of banList) {
            const [key, value] = Object.entries(ban);
            if (dog.breeds[0][key[0]] === key[1]) {
              return false;
            }
          }
          return true;
        })
        .map(dog => ({
          url: dog.url,
          breeds: dog.breeds,
        }));
      setDogImage(filteredDogs[0].url);
      setDogBreeds(filteredDogs);
      setCurrentDogIndex(0);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBreedAttributeClick = (key, value) => {
    setBanList([...banList, { [key]: value }]);
    setBanned(true);
  };

  return (
    <>
      <div className='main_container'>
        <div className='veni_container'>
          <div className='veni_card'>
            <h1>Veni Vici!</h1>
            <p>Discover dogs from your wildest dreams!</p>
            {dogBreeds[currentDogIndex]?.breeds.map((breed, index) => (
              <div key={index}>
                {Object.entries(breed)
                  .filter(([key, _]) => displayedKeys.includes(key))
                  .map(([key, value]) => (
                    <button key={key} onClick={() => handleBreedAttributeClick(key, value)}>
                      {key === 'weight' && typeof value === 'object'
                        ? `${value.imperial} lbs`
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
                  {key === 'weight' && typeof value === 'object' ? `${value.imperial} lbs` : `${value}`}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;