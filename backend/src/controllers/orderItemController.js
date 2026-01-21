const db = require('../services/databaseService');

exports.getAllOrderItems = async (req, res) => {
  // Selectăm coloanele specifice: id_comanda, id_produs și cantitate
  const sql = `SELECT ID_COMANDA, ID_PRODUS, CANTITATE FROM PRODUSE_COMANDA ORDER BY ID_COMANDA`;
  try {
    const result = await db.execute(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Eroare la extragere produse_comanda: " + err.message });
  }
};