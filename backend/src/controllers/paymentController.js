const db = require('../services/databaseService');

// III.a: Listare toate plățile cu posibilitate de sortare
exports.getAllPayments = async (req, res) => {
  const sortBy = req.query.sortBy || 'id_plata';
  const sql = `SELECT * FROM Plati ORDER BY ${sortBy}`;
  
  try {
    const result = await db.execute(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Eroare la listare plăți: " + err.message });
  }
};

// III.b: Modificare informații plată (Edit)
exports.updatePayment = async (req, res) => {
  const id = req.params.id;
  const { ramas_de_plata, nr_card, data_exp_card, cvv, RAMAS_DE_PLATA, NR_CARD, DATA_EXP_CARD, CVV } = req.body;
  
  const sql = `UPDATE Plati 
               SET ramas_de_plata = :ramas, nr_card = :card, data_exp_card = :exp, cvv = :cvv 
               WHERE id_plata = :id`;
  
  try {
    await db.execute(sql, { 
      ramas: ramas_de_plata || RAMAS_DE_PLATA, 
      card: nr_card || NR_CARD, 
      exp: data_exp_card || DATA_EXP_CARD, 
      cvv: cvv || CVV, 
      id 
    });
    res.json({ message: "Informațiile plății au fost actualizate!" });
  } catch (err) {
    console.error("Eroare SQL updatePayment:", err);
    res.status(500).json({ error: "Eroare la editare plată: " + err.message });
  }
};

// III.b: Ștergere plată
exports.deletePayment = async (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM Plati WHERE id_plata = :id`;
  
  try {
    await db.execute(sql, { id });
    res.json({ message: "Plata a fost ștearsă din sistem." });
  } catch (err) {
    console.error("Eroare SQL deletePayment:", err);
    res.status(500).json({ error: "Eroare la ștergere plată: " + err.message });
  }
};

// Creare plată nouă
exports.createPayment = async (req, res) => {
  const { id_plata, id_comanda, ramas_de_plata, nr_card, data_exp_card, cvv } = req.body;
  const sql = `INSERT INTO Plati (id_plata, id_comanda, ramas_de_plata, nr_card, data_exp_card, cvv) 
               VALUES (:id_p, :id_c, :ramas, :card, :exp, :cvv)`;
  
  try {
    await db.execute(sql, { id_p: id_plata, id_c: id_comanda, ramas: ramas_de_plata, card: nr_card, exp: data_exp_card, cvv });
    res.json({ message: "Plată înregistrată cu succes!" });
  } catch (err) {
    res.status(500).json({ error: "Eroare la înregistrare plată: " + err.message });
  }
};