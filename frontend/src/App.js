import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Trips from './pages/Trips';
import MyTrips from './pages/MyTrips';
import Profile from './pages/Profile';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import LandingPage from './pages/LandingPage';
import EditTrip from './pages/EditTrip';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/trips' element={<Trips />} />
        <Route path='/trips/:id' element={<TripDetails />} />
        <Route path='/my-trips' element={<MyTrips/>} />
        <Route path='/my-trips/create' element={<CreateTrip/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='/profile/:id' element={<Profile/>} />
        <Route path='/my-trips/edit/:id' element={<EditTrip />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
