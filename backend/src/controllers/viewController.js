const db = require('../services/databaseService');

// III.f: Citire vizualizare simplă (editabilă cu LMD)
exports.getSimpleViews = async (req, res) => {
  const sql = `SELECT * FROM V_COMENZI_EDITABLE ORDER BY id_comanda`;
  try {
    const result = await db.execute(sql);
    res.json(result.rows);
  } catch (err) {
    console.error('Eroare SQL getSimpleViews:', err);
    res.status(500).json({ error: "Eroare la citire view simplu: " + err.message });
  }
};

// III.f: Citire vizualizare complexă (read-only cu statistici)
exports.getComplexViews = async (req, res) => {
  const sql = `SELECT * FROM V_DETALII_COMENZI ORDER BY id_comanda`;
  try {
    const result = await db.execute(sql);
    res.json(result.rows);
  } catch (err) {
    console.error('Eroare SQL getComplexViews:', err);
    res.status(500).json({ error: "Eroare la citire view complex: " + err.message });
  }
};

// III.f: Actualizare status prin vizualizare editabilă
exports.updateSimpleView = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  
  // Validare status
  const validStatuses = ['In procesare', 'In pregatire', 'In livrare', 'Livrat', 'Anulat'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Status invalid. Valori permise: " + validStatuses.join(', ') });
  }

  const sql = `UPDATE V_COMENZI_EDITABLE SET status = :status WHERE id_comanda = :id`;
  
  try {
    await db.execute(sql, { status, id });
    res.json({ message: "Status actualizat cu succes prin VIEW!" });
  } catch (err) {
    console.error("Eroare SQL updateSimpleView:", err);
    res.status(500).json({ error: "Eroare la actualizare: " + err.message });
  }
};

// III.f: Ștergere prin vizualizare (demonstrează CASCADE)
exports.deleteSimpleView = async (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM V_COMENZI_EDITABLE WHERE id_comanda = :id`;
  
  try {
    await db.execute(sql, { id });
    res.json({ message: "Comandă ștearsă cu succes prin VIEW! Toate datele asociate au fost eliminate prin CASCADE." });
  } catch (err) {
    console.error("Eroare SQL deleteSimpleView:", err);
    res.status(500).json({ error: "Eroare la ștergere: " + err.message });
  }
};

// Legacy method for compatibility
exports.getComplexView = async (req, res) => {
  return exports.getComplexViews(req, res);
};

exports.getCompoundView = async (req, res) => {
  return exports.getSimpleViews(req, res);
};

exports.updateThroughView = async (req, res) => {
  return exports.updateSimpleView(req, res);
};