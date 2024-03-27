import  { useState, useEffect } from 'react';
import './game.css';
import Category from '../Category/Category';
import CardAmount from '../CardAmount/CardAmount';
import Pace from '../Pace/Pace';
import { createClient } from 'pexels';

const Game = () => {
  const [startgame, setStartGame] = useState(false);
  const Queries = ['abstract', 'people', 'animals', 'nature'];
  const Paces = ['easy', 'medium', 'hard', 'pro'];

  const [category, setCategory] = useState(Queries[0]);
  const [Amount, setAmount] = useState(4);
  const [images, setImages] = useState([]);
  const [pace, setPace] = useState(Paces[0]);
  
  const [flippedCards, setFlippedCards] = useState(Array.from({ length: Amount * 2 }, () => false)); // Assuming 4 cards initially
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [attempts,setAttempts] = useState(0);
  const [result,setResult] = useState(null);
  const [finishgame,setFinishGame] = useState(false);
  const [matchedIndices, setMatchedIndices] = useState([]);
  const [matchingInProgress, setMatchingInProgress] = useState(false);
  
  const client = createClient('UUboF4rkITmKuDkvHUUJGcKMX14tR1GqVfXCys9XqOblSHKAxER1C6Rf');

  const handleStartGame = () => {
    setStartGame(true);
    shuffleArray(images);
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  const handleCardClick = (index) => {
    if (finishgame || flippedIndices.includes(index) || matchedIndices.includes(index) || matchingInProgress) return; 
  
    setFlippedCards((prevFlippedCards) => {
      const newFlippedCards = [...prevFlippedCards];
      newFlippedCards[index] = true;
      return newFlippedCards;
    });
  
    setFlippedIndices((prevFlippedIndices) => [...prevFlippedIndices, index]);
  
    if (flippedIndices.length === 1) {
      // Second card flipped, check for match
      setMatchingInProgress(true); // Set matching in progress
      if (images[flippedIndices[0]].id === images[index].id) {
        // Match found
        setFlippedIndices([]);
        setMatchedIndices((prevMatchedIndices) => [...prevMatchedIndices, flippedIndices[0], index]);
        setMatchingInProgress(false); // Reset matching status after match
      } else {
        // No match, flip back after a short delay
        setTimeout(() => {
          setFlippedCards((prevFlippedCards) => {
            const newFlippedCards = [...prevFlippedCards];
            newFlippedCards[flippedIndices[0]] = false;
            newFlippedCards[index] = false;
            if (attempts === 1) {
              setFinishGame(true);
              setResult("You Lose!");
            } else {
              setAttempts(attempts - 1);
            }
            return newFlippedCards;
          });
          setFlippedIndices([]);
          setMatchingInProgress(false); // Reset matching status after flip back
        }, 500);
      }
    } 
  };
  

  useEffect(() => {
    client.photos.search({ per_page: Amount, page: 1, query: category }).then((photos) => {
      // Repeat each image in the array twice
      const repeatedImages = photos.photos.flatMap((img) => [img, img]);
      setImages(repeatedImages);
    });
  }, [category, Amount]);

  useEffect(() => {
    // Check if all cards are flipped and matched
    const allMatched = flippedCards.every((card) => card);
    
    if (allMatched) {
      // All cards are matched
      setFinishGame(true);
      setResult("You Win!");
    }
    
  }, [flippedCards]);
  


const resetGame = () => {
  // Reset all game states here
  setStartGame(false);
  setCategory(category[0]); // Use current value of category
  setAmount(Amount); // Use current value of Amount
  setImages([]);
  setPace(pace[0]); // Use current value of pace
  setFlippedCards(Array.from({ length: Amount * 2 }, () => false));
  setFlippedIndices([]);
  setAttempts(0);
  setResult(null);
  setFinishGame(false);
  setMatchedIndices([]);
  setMatchingInProgress(false); 
};

  return (
    <>
      {!startgame ? (
        <div className='container flex justify-center'>
          <div className='game p-2 ps-3'>
            <h2 className='text-2xl font-extrabold text-gray-600 pb-2'>Setting</h2>
            <Category category={category} setCategory={setCategory} Queries={Queries} />
            <CardAmount Amount={Amount} setAmount={setAmount} setImages={setImages} />
            <Pace pace={pace} setPace={setPace} Paces={Paces} setAttempts={setAttempts} />
            <div className='btn-start flex justify-center mt-4' onClick={handleStartGame}>
              <button className='text-center rounded-xl p-2 px-8 bg-gray-100 hover:bg-gray-200' onClick={handleStartGame}>
                Start
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
        <div className='attempts'>
          {finishgame == false ? <>
            <section>
            attempts: {attempts}
          </section>
          </> :
          <div className='d-block'> 
            <div className='text-white text-2xl text-bold mb-4'>{result}</div>
            <div>
            <button 
            className='btn-retry text-white text-2xl text-bold rounded-xl p-4 hover'
            onClick={()=> resetGame()}
            >Return to Setting</button>
            </div>
          </div>  
          }
          
        </div>
        
        <div className='card-container'>
          {images.map((img, index) => (
            <div key={index} className={`card ${flippedCards[index] ? 'flipped' : ''}`} onClick={() => handleCardClick(index)}>
              <div className='card-face card-front'></div>
              <div className='card-face card-back'>
                <img src={img.src.medium} alt={img.photographer} />
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </>
  );
};

export default Game;