const db = require('../services/databaseService');

// III.a: Listare toți alergenii cu posibilitate de sortare
exports.getAllAlergeni = async (req, res) => {
  // Preluăm coloana pentru sortare din query (implicit nume_alergen)
  const sortBy = req.query.sortBy || 'nume_alergen';
  const sql = `SELECT * FROM Alergeni ORDER BY ${sortBy}`;
  
  try {
    const result = await db.execute(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Eroare la listare: " + err.message });
  }
};

// III.b: Adăugare alergen nou
exports.createAlergen = async (req, res) => {
  const { id_alergen, nume_alergen, simptome } = req.body;
  const sql = `INSERT INTO Alergeni (id_alergen, nume_alergen, simptome) 
               VALUES (:id, :nume, :simptome)`;
  
  try {
    await db.execute(sql, { id: id_alergen, nume: nume_alergen, simptome });
    res.json({ message: "Alergen adăugat cu succes!" });
  } catch (err) {
    res.status(500).json({ error: "Eroare la adăugare: " + err.message });
  }
};

// III.b: Modificare informații alergen (Edit)
exports.updateAlergen = async (req, res) => {
  const id = req.params.id;
  const { nume_alergen, simptome, NUME_ALERGEN, SIMPTOME } = req.body;
  const sql = `UPDATE Alergeni 
               SET nume_alergen = :nume, simptome = :simptome 
               WHERE id_alergen = :id`;
  
  try {
    await db.execute(sql, { 
      nume: nume_alergen || NUME_ALERGEN, 
      simptome: simptome || SIMPTOME, 
      id 
    });
    res.json({ message: "Informații modificate cu succes!" });
  } catch (err) {
    console.error("Eroare SQL updateAlergen:", err);
    res.status(500).json({ error: "Eroare la editare: " + err.message });
  }
};

// III.b: Ștergere alergen
exports.deleteAlergen = async (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM Alergeni WHERE id_alergen = :id`;
  
  try {
    await db.execute(sql, { id });
    res.json({ message: "Alergenul a fost șters din bază." });
  } catch (err) {
    console.error("Eroare SQL deleteAlergen:", err);
    res.status(500).json({ error: "Eroare la ștergere: " + err.message });
  }
};