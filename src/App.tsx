import { FormEvent, useMemo, useRef, useState } from 'react';

function fillArrayWithPairs(numberOfPairs: number) {
  // Create an array of pairs
  var array = [];
  for (var i = 0; i < numberOfPairs; i++) {
    array.push({ num: i, id: Math.random() });
    array.push({ num: i, id: Math.random() });
  }

  // Shuffle the positions
  for (var j = array.length - 1; j > 0; j--) {
    var k = Math.floor(Math.random() * (j + 1));
    var temp = array[j] as { num: number; id: number };
    array[j] = array[k];
    array[k] = temp;
  }

  return array;
}

function App() {
  const [numberOfPairs, setNumberOfPairs] = useState<number>(8);
  const [selectedPair, setSelectedPair] = useState<any[]>([]);
  const [discoveredPairs, setDiscoveredPairs] = useState<Map<number, any[]>>(
    new Map()
  );
  const [currentTile, setCurrentTile] = useState<number>();
  const numberOfPairsRef = useRef<HTMLInputElement>(null);

  function handleNumberOfPairsSubmit(e: FormEvent) {
    e.preventDefault();
    if (numberOfPairsRef && numberOfPairsRef.current) {
      const numOfPairsInput = parseInt(numberOfPairsRef.current.value, 10);
      if (numOfPairsInput > 0) {
        setNumberOfPairs(numOfPairsInput);
      }
    }
  }

  function handleMemoryTileClick(num: number, id: number) {
    setCurrentTile(id);
    if (selectedPair.length === 0) {
      setSelectedPair([num]);
    }

    if (selectedPair.length === 1) {
      if (selectedPair[0] === num) {
        setDiscoveredTiles(num);
      }
      setSelectedPair([]);
    }
  }

  function setDiscoveredTiles(num: number) {
    setDiscoveredPairs((prevState) => prevState.set(num, [num, num]));
  }

  function isDiscovered(num: number, id: number) {
    const currentEntry = discoveredPairs.get(num);
    return id === currentTile || currentEntry?.length === 2;
  }

  const tilesArray = useMemo(
    () => (numberOfPairs > 0 ? fillArrayWithPairs(numberOfPairs) : []),
    [numberOfPairs]
  );

  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      {/** Number of pairs form */}
      {numberOfPairs === 0 && (
        <form
          onSubmit={handleNumberOfPairsSubmit}
          className='w-full flex items-center justify-center'
        >
          <input
            ref={numberOfPairsRef}
            className='h-12 p-4 border w-1/2'
            type='number'
            placeholder='Type the number of pairs for the game...'
          />
        </form>
      )}

      {/** Memory tiles */}

      {tilesArray.length > 0 && (
        <div className={`grid grid-cols-4 gap-2`}>
          {tilesArray.map((position) => {
            const id = position.id;
            const num = position.num;
            return (
              <button
                onClick={handleMemoryTileClick.bind(null, num, id)}
                className={`cursor-pointer w-28 h-28 bg-slate-300 flex items-center justify-center ${
                  isDiscovered(num, id) ? 'bg-lime-300' : ''
                }`}
                key={id}
                disabled={isDiscovered(num, id)}
              >
                <p className={isDiscovered(num, id) ? '' : 'hidden'}>{num}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
