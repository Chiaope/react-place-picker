import { useCallback, useEffect, useRef, useState } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';

const storedPlace = JSON.parse(localStorage.getItem('setPickedPlaces')) || []

function App() {
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(storedPlace);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({coords}) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        coords.latitude,
        coords.longitude
      )
      setAvailablePlaces(sortedPlaces)
    })
  }, [])

  function handleStartRemovePlace(id) {
    setModalOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      localStorage.setItem('setPickedPlaces', JSON.stringify([place, ...prevPickedPlaces]))
      return [place, ...prevPickedPlaces];
    });
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) => {
      const currPickedPlaces = prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
      localStorage.setItem('setPickedPlaces', JSON.stringify(currPickedPlaces))
      return (currPickedPlaces)
    }
    );
    setModalOpen(false);
  }, [])

  return (
    <>
      <Modal open={modalOpen} onClose={handleStopRemovePlace} >
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText={'Sorting Places'}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
