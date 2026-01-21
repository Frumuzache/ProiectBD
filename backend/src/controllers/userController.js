const db = require('../services/databaseService');

// III.a: Listare toți utilizatorii cu posibilitate de sortare
exports.getAllUsers = async (req, res) => {
  // Preluăm coloana pentru sortare din query; implicit după id_utilizator 
  const sortBy = req.query.sortBy || 'id_utilizator';
  const sql = `SELECT id_utilizator, nume, prenume, email, username, data_inscriere 
               FROM Utilizatori ORDER BY ${sortBy}`;
  
  try {
    const result = await db.execute(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Eroare la listare utilizatori: " + err.message });
  }
};

// III.b: Modificare informații utilizator (Edit)
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const { nume, prenume, email, username, NUME, PRENUME, EMAIL, USERNAME } = req.body;
  
  const sql = `UPDATE Utilizatori 
               SET nume = :nume, prenume = :prenume, email = :email, username = :username 
               WHERE id_utilizator = :id`;
  
  try {
    await db.execute(sql, { 
      nume: nume || NUME, 
      prenume: prenume || PRENUME, 
      email: email || EMAIL, 
      username: username || USERNAME, 
      id 
    });
    res.json({ message: "Datele utilizatorului au fost actualizate cu succes!" });
  } catch (err) {
    console.error("Eroare SQL updateUser:", err);
    res.status(500).json({ error: "Eroare la editare utilizator: " + err.message });
  }
};

// III.b: Ștergere utilizator
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM Utilizatori WHERE id_utilizator = :id`;
  
  try {
    // Adăugăm opțiunea autoCommit pentru a salva modificarea imediat 
    await db.execute(sql, { id }, { autoCommit: true }); 
    res.json({ message: "Utilizatorul a fost șters din sistem." });
  } catch (err) {
    // În consolă (terminal) vei vedea eroarea reală ORA-02292 [cite: 8]
    console.error("Eroare SQL deleteUser:", err); 
    res.status(500).json({ error: "Eroare la ștergere: " + err.message });
  }
};

// Adăugare utilizator nou (pentru testare CRUD complet)
exports.createUser = async (req, res) => {
  const { id_utilizator, nume, prenume, email, username, parola } = req.body;
  const sql = `INSERT INTO Utilizatori (id_utilizator, nume, prenume, email, username, parola) 
               VALUES (:id, :nume, :prenume, :email, :user, :pass)`;
  
  try {
    await db.execute(sql, { id: id_utilizator, nume, prenume, email, user: username, pass: parola });
    res.json({ message: "Utilizator creat cu succes!" });
  } catch (err) {
    res.status(500).json({ error: "Eroare la crearea utilizatorului: " + err.message });
  }
};