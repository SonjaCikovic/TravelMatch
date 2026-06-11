const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./cron');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'TravelMatch API radi!' });
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const usersRoutes = require('./routes/users');
app.use('/api/users', usersRoutes);

const tripsRoutes = require('./routes/trips');
app.use('/api/trips', tripsRoutes);

const tripCitiesRoutes = require('./routes/trip_cities');
app.use('/api/trips', tripCitiesRoutes);

const tripRequests = require('./routes/trip_requests');
app.use('/api/trips', tripRequests);

const ratings = require('./routes/ratings');
app.use('/api/trips', ratings);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`);
});

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));