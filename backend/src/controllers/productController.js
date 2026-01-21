const db = require('../services/databaseService');

// III.a: Listare toate produsele cu posibilitate de sortare
exports.getAllProducts = async (req, res) => {
  const sortBy = req.query.sortBy || 'id_produs';
  const sql = `SELECT * FROM Produse ORDER BY ${sortBy}`;
  
  try {
    const result = await db.execute(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Eroare la listare produse: " + err.message });
  }
};

// III.d: Afișarea rezultatului unei cereri care folosește funcții grup și HAVING
// Exemplu: Media de calorii per restaurant pentru restaurantele care oferă mâncare "light" (media sub 500 kcal)
exports.getNutritionStats = async (req, res) => {
  const sql = `
    SELECT id_restaurant, AVG(calorii) AS medie_calorii, COUNT(id_produs) AS total_produse
    FROM Produse
    GROUP BY id_restaurant
    HAVING AVG(calorii) < 500`; // Funcție grup (AVG) și clauză HAVING [cite: 425]
    
  try {
    const result = await db.execute(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Eroare la calcularea statisticilor: " + err.message });
  }
};

// III.b: Modificare informații produs (Edit)
exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  const { nume, pret, calorii, proteine, grasimi, NUME, PRET, CALORII, PROTEINE, GRASIMI } = req.body;
  
  const sql = `UPDATE Produse 
               SET nume = :nume, pret = :pret, calorii = :calorii, proteine = :proteine, grasimi = :grasimi 
               WHERE id_produs = :id`;
  
  try {
    await db.execute(sql, { 
      nume: nume || NUME, 
      pret: pret || PRET, 
      calorii: calorii || CALORII, 
      proteine: proteine || PROTEINE, 
      grasimi: grasimi || GRASIMI, 
      id 
    });
    res.json({ message: "Produsul a fost actualizat cu succes!" });
  } catch (err) {
    console.error("Eroare SQL updateProduct:", err);
    res.status(500).json({ error: "Eroare la editare produs: " + err.message });
  }
};


// III.b: Ștergere produs
exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM Produse WHERE id_produs = :id`;
  
  try {
    await db.execute(sql, { id });
    res.json({ message: "Produsul a fost eliminat din meniu." });
  } catch (err) {
    console.error("Eroare SQL deleteProduct:", err);
    res.status(500).json({ error: "Eroare la ștergere produs: " + err.message });
  }
};