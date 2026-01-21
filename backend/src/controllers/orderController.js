const db = require('../services/databaseService');

// III.a: Listare toate comenzile cu posibilitate de sortare
exports.getAllOrders = async (req, res) => {
  const sortBy = req.query.sortBy || 'c.id_comanda';
  const sql = `
    SELECT 
      c.id_comanda,
      c.id_utilizator,
      c.id_restaurant,
      c.id_livrator,
      c.status,
      u.nume || ' ' || u.prenume AS client,
      r.nume AS restaurant
    FROM Comenzi c
    LEFT JOIN Utilizatori u ON c.id_utilizator = u.id_utilizator
    LEFT JOIN Restaurante r ON c.id_restaurant = r.id_restaurant
    ORDER BY ${sortBy}
  `;
  
  try {
    const result = await db.execute(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Eroare la listare comenzi: " + err.message });
  }
};

// III.c: Afișarea rezultatului unei cereri din 3 tabele cu 2 condiții (parametrizabile)
// Params (opționale):
//  - status: filtrează după status comandă
//  - minRating: filtrează restaurante cu notă minimă
exports.getDetailedOrders = async (req, res) => {
  const { status, minRating } = req.query;

  const conditions = [];
  const binds = {};

  if (status) {
    conditions.push('LOWER(c.status) = LOWER(:status)');
    binds.status = status;
  }
  if (minRating) {
    conditions.push('r.nota >= :minRating');
    binds.minRating = Number(minRating);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT 
      u.nume || ' ' || u.prenume AS client,
      c.id_comanda,
      r.nume AS restaurant,
      r.nota AS rating,
      c.status
    FROM Comenzi c
    JOIN Utilizatori u ON c.id_utilizator = u.id_utilizator
    JOIN Restaurante r ON c.id_restaurant = r.id_restaurant
    ${whereClause}`; // 3 tabele + până la 2 condiții
    
  try {
    const result = await db.execute(sql, binds);
    res.json(result.rows);
  } catch (err) {
    console.error('Eroare SQL getDetailedOrders:', err);
    res.status(500).json({ error: "Eroare la cererea complexă: " + err.message });
  }
};



// III.b: Modificare status comandă (Edit)
exports.updateOrder = async (req, res) => {
  const id = req.params.id;
  const { status, STATUS } = req.body;
  const sql = `UPDATE Comenzi SET status = :status WHERE id_comanda = :id`;
  
  try {
    await db.execute(sql, { status: status || STATUS, id });
    res.json({ message: "Statusul comenzii a fost actualizat!" });
  } catch (err) {
    console.error("Eroare SQL updateOrder:", err);
    res.status(500).json({ error: "Eroare la editare: " + err.message });
  }
};

// III.b & III.e: Ștergere comandă cu exemplificare ON DELETE CASCADE
// Ștergerea unei comenzi va șterge automat raportările, plățile și produsele asociate din DB
exports.deleteOrder = async (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM Comenzi WHERE id_comanda = :id`;
  
  try {
    await db.execute(sql, { id });
    res.json({ message: "Comanda a fost ștearsă. Plățile, produsele și raportările asociate au fost eliminate automat (CASCADE)." });
  } catch (err) {
    console.error("Eroare SQL deleteOrder:", err);
    res.status(500).json({ error: "Eroare la ștergere: " + err.message });
  }
};