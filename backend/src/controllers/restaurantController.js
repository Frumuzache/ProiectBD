const db = require('../services/databaseService');

// III.a: Listare restaurante cu posibilitate de sortare
exports.getAllRestaurants = async (req, res) => {
  const sortBy = req.query.sortBy || 'nume';
  const sql = `SELECT * FROM Restaurante ORDER BY ${sortBy}`;
  
  try {
    const result = await db.execute(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Eroare la listare restaurante: " + err.message });
  }
};

// III.d: Afișarea rezultatului unei cereri care folosește funcții grup și HAVING
// Parametri: minProducts (implicit 2) - număr minim de produse
exports.getRestaurantStats = async (req, res) => {
  const minProducts = req.query.minProducts ? Number(req.query.minProducts) : 2;
  
  const sql = `
    SELECT r.nume, COUNT(p.id_produs) as numar_produse, AVG(p.pret) as pret_mediu
    FROM Restaurante r
    JOIN Produse p ON r.id_restaurant = p.id_restaurant
    GROUP BY r.nume
    HAVING COUNT(p.id_produs) >= :minProducts`; // Cerința III.d: funcții grup (COUNT, AVG) și HAVING
    
  try {
    const result = await db.execute(sql, { minProducts });
    res.json(result.rows);
  } catch (err) {
    console.error('Eroare SQL getRestaurantStats:', err);
    res.status(500).json({ error: "Eroare la calcularea statisticilor: " + err.message });
  }
};

// III.b: Modificare informații restaurant (Edit)
exports.updateRestaurant = async (req, res) => {
  const id = req.params.id;
  // Acceptă coloane indiferent de caz (lowercase din frontend)
  const { nume, adresa, nota, NUME, ADRESA, NOTA } = req.body;
  
  const sql = `UPDATE Restaurante SET nume = :nume, adresa = :adresa, nota = :nota 
               WHERE id_restaurant = :id`;
  
  try {
    // Folosim valorile primite, fie lowercase fie uppercase
    await db.execute(sql, { 
      nume: nume || NUME, 
      adresa: adresa || ADRESA, 
      nota: nota || NOTA, 
      id 
    });
    res.json({ message: "Informațiile restaurantului au fost actualizate!" });
  } catch (err) {
    console.error("Eroare SQL updateRestaurant:", err);
    res.status(500).json({ error: "Eroare la editare restaurant: " + err.message });
  }
};

// III.b: Ștergere restaurant
exports.deleteRestaurant = async (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM Restaurante WHERE id_restaurant = :id`;
  
  try {
    await db.execute(sql, { id });
    res.json({ message: "Restaurantul a fost eliminat din sistem." });
  } catch (err) {
    console.error("Eroare SQL deleteRestaurant:", err);
    res.status(500).json({ error: "Eroare la ștergere restaurant: " + err.message });
  }
};