const db = require('../services/databaseService');

exports.getAllProductAlergens = async (req, res) => {
  // Selectăm coloanele specifice: id_produs și id_alergen
  const sql = `SELECT * FROM ALERGENI_PRODUSE ORDER BY ID_PRODUS`;
  try {
    const result = await db.execute(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Eroare la extragere alergeni_produse: " + err.message });
  }
};