import './App.css'
import Discover from './components/discover'
import { useState } from 'react';

function App() {
  const [dogImage, setDogImage] = useState(null);
  const [dogAttributes, setDogAttributes] = useState([]);
  const [banList, setBanList] = useState([]);

  const url = `https://api.thecatapi.com/v1/images/search?limit=20`;
  const api_key = "live_KOqYts7oMCCYehe4AEIRxk1f68mYCK18KYOKjHOFD505NdNjAiYkdWMaccsDvyE7"

  const handleDiscoverClick = async () => {
    try {
      const response = await fetch('https://api.thedogapi.com/v1/images/search');
      if (!response.ok) {
        throw new Error('Failed to fetch dog image');
      }
      const data = await response.json();
      setDogImage(data[0].url);
      const attributes = Object.entries(data[0]);
      setDogAttributes(attributes);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleAttributeClick = (attribute) => {
    // Add attribute to the list
    setBanList([...banList, attribute]);
  };

  return (
    <>
      <div className='main_container'>
        <div className='veni_container'>
          <div className='veni_card'>
            <h1>Veni Vici!</h1>
            <p>Discover dogs from your wildest dreams!</p>
            <Discover />
            {dogAttributes.map(([attribute, value]) => (
              <button key={attribute} onClick={() => handleAttributeClick({ [attribute]: value })}>
                {`${attribute}: ${value}`}
              </button>
            ))}
            {dogImage && <img src={dogImage} alt='Random Dog' />}
            <button onClick={handleDiscoverClick}>Discover!</button>
          </div>
        </div>
        <div className='ban_container'>
          <h3>Ban List</h3>
          <p>Select an attribute in your listing to ban it</p>
          {banList.map((item, index) => (
            <div key={index}>
              {Object.entries(item).map(([key, value]) => (
                <p key={key}>{`${key}: ${value}`}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App