const db = require('../services/databaseService');

// III.a: Listare toate raportările cu posibilitate de sortare
exports.getAllReports = async (req, res) => {
  // Preluăm coloana pentru sortare; implicit după data_deschidere
  const sortBy = req.query.sortBy || 'data_deschidere DESC';
  const sql = `SELECT * FROM Raportari ORDER BY ${sortBy}`;
  
  try {
    const result = await db.execute(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Eroare la listare raportări: " + err.message });
  }
};

// III.b: Modificare descriere problemă (Edit)
exports.updateReport = async (req, res) => {
  const id = req.params.id;
  const { descriere_problema, DESCRIERE_PROBLEMA } = req.body;
  
  const sql = `UPDATE Raportari 
               SET descriere_problema = :descriere 
               WHERE id_raportare = :id`;
  
  try {
    await db.execute(sql, { descriere: descriere_problema || DESCRIERE_PROBLEMA, id });
    res.json({ message: "Descrierea problemei a fost actualizată!" });
  } catch (err) {
    console.error("Eroare SQL updateReport:", err);
    res.status(500).json({ error: "Eroare la editare raportare: " + err.message });
  }
};

// III.b: Ștergere raportare (manuală)
exports.deleteReport = async (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM Raportari WHERE id_raportare = :id`;
  
  try {
    await db.execute(sql, { id });
    res.json({ message: "Raportarea a fost ștearsă." });
  } catch (err) {
    console.error("Eroare SQL deleteReport:", err);
    res.status(500).json({ error: "Eroare la ștergere raportare: " + err.message });
  }
};

// Creare raportare nouă (Ticket de suport)
exports.createReport = async (req, res) => {
  const { id_raportare, id_comanda, descriere_problema } = req.body;
  const sql = `INSERT INTO Raportari (id_raportare, id_comanda, descriere_problema) 
               VALUES (:id_r, :id_c, :descriere)`;
  
  try {
    await db.execute(sql, { id_r: id_raportare, id_c: id_comanda, descriere: descriere_problema });
    res.json({ message: "Raportare creată cu succes!" });
  } catch (err) {
    res.status(500).json({ error: "Eroare la crearea raportării: " + err.message });
  }
};