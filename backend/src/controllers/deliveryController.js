const db = require('../services/databaseService');

// III.a: Listare toți livratorii cu posibilitate de sortare
exports.getAllLivratori = async (req, res) => {
  // Preluăm coloana pentru sortare; implicit după id_livrator
  const sortBy = req.query.sortBy || 'id_livrator';
  const sql = `SELECT * FROM Livratori ORDER BY ${sortBy}`;
  
  try {
    const result = await db.execute(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Eroare la listare livratori: " + err.message });
  }
};

// III.b: Modificare informații livrator (Edit)
exports.updateLivrator = async (req, res) => {
  const id = req.params.id;
  const { nume, prenume, locatie_curenta, NUME, PRENUME, LOCATIE_CURENTA } = req.body;
  
  // Actualizăm câmpurile specifice conform structurii tabelului
  const sql = `UPDATE Livratori 
               SET nume = :nume, prenume = :prenume, locatie_curenta = :locatie 
               WHERE id_livrator = :id`;
  
  try {
    await db.execute(sql, { 
      nume: nume || NUME, 
      prenume: prenume || PRENUME, 
      locatie: locatie_curenta || LOCATIE_CURENTA, 
      id 
    });
    res.json({ message: "Datele livratorului au fost actualizate cu succes!" });
  } catch (err) {
    console.error("Eroare SQL updateLivrator:", err);
    res.status(500).json({ error: "Eroare la editare livrator: " + err.message });
  }
};

// III.b: Ștergere livrator
exports.deleteLivrator = async (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM Livratori WHERE id_livrator = :id`;
  
  try {
    await db.execute(sql, { id });
    res.json({ message: "Livratorul a fost șters din sistem." });
  } catch (err) {
    console.error("Eroare SQL deleteLivrator:", err);
    res.status(500).json({ error: "Eroare la ștergere livrator: " + err.message });
  }
};

// Opțional: Adăugare livrator nou
exports.createLivrator = async (req, res) => {
  const { id_livrator, nume, prenume, locatie_curenta } = req.body;
  const sql = `INSERT INTO Livratori (id_livrator, nume, prenume, locatie_curenta) 
               VALUES (:id, :nume, :prenume, :locatie)`;
  
  try {
    await db.execute(sql, { id: id_livrator, nume, prenume, locatie: locatie_curenta });
    res.json({ message: "Livrator adăugat cu succes!" });
  } catch (err) {
    res.status(500).json({ error: "Eroare la adăugare livrator: " + err.message });
  }
};