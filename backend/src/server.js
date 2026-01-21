const express = require('express');
const cors = require('cors');
const app = express();

// Dezactivăm ETag ca să nu primim 304/Not Modified din cache-ul browserului
app.disable('etag');

app.use(cors());
app.use(express.json());

// Forțăm răspunsurile să nu fie cache-uite de client/proxy
app.use((req, res, next) => {
	res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
	res.set('Pragma', 'no-cache');
	res.set('Expires', '0');
	next();
});

// Import Rute
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const productRoutes = require('./routes/productRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes'); // Verifică aceasta!
const alergenRoutes = require('./routes/alergenRoutes');     // Verifică aceasta!
const paymentRoutes = require('./routes/paymentRoutes');     // Verifică aceasta!
const reportRoutes = require('./routes/reportRoutes');
const orderItemRoutes = require('./routes/orderItemRoutes');
const productAlergenRoutes = require('./routes/productAlergenRoutes');
const viewRoutes = require('./routes/viewRoutes');

// Utilizare Rute
app.use('/api/Utilizatori', userRoutes);
app.use('/api/Comenzi', orderRoutes);
app.use('/api/Restaurante', restaurantRoutes);
app.use('/api/Produse', productRoutes);
app.use('/api/Livratori', deliveryRoutes);
app.use('/api/Alergeni', alergenRoutes);
app.use('/api/PLati', paymentRoutes);
app.use('/api/Raportari', reportRoutes);
app.use('/api/produse-comanda', orderItemRoutes);
app.use('/api/alergeni-produse', productAlergenRoutes);
app.use('/api/views', viewRoutes);

module.exports = app;