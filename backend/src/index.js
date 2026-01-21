require('dotenv').config(); // <-- TREBUIE SA FIE PE PRIMA LINIE

const db = require('./services/databaseService');
const app = require('./server');

async function start() {
  // Debug: Verificăm în consolă ce IP încearcă serverul să folosească
  console.log('Încercare conectare la:', process.env.DB_CONNECT_STRING);
  
  try {
    await db.initialize();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server pornit pe portul ${port}`);
    });
  } catch (err) {
    console.error('Eroare critică la pornire:', err);
  }
}

start();