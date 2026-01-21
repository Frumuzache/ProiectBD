# ProiectBD - Food Delivery Database System

Proiect de baze de date - sistem de gestionare comenzi pentru livrări de mâncare.

## 🏗️ Tehnologii

- **Frontend**: Angular 17+ (Standalone Components)
- **Backend**: Node.js + Express
- **Database**: Oracle Database 23c
- **ORM**: oracledb npm package

## 📋 Cerințe Implementate

- ✅ **III.a** - List & Sort (Listare și sortare)
- ✅ **III.b** - Edit & Delete (Modificare informații cu inline editing)
- ✅ **III.c** - 3-Table JOIN + 2 Conditions (Interogare cu 3 tabele)
- ✅ **III.d** - GROUP BY + HAVING (Grupare și filtrare)
- ✅ **III.e** - ON DELETE CASCADE (Demonstrație ștergere în cascadă)
- ✅ **III.f** - Database Views (Vizualizări simple și complexe)

## 🚀 Setup

### Backend

```bash
cd backend
npm install
# Configurează .env cu detaliile Oracle DB
npm run dev
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

## 📊 Database Schema

Scriptul de creare a bazei de date se află în `database_script_with_views.sql` și include:
- 10 tabele (Utilizatori, Restaurante, Produse, Comenzi, etc.)
- Constraint-uri ON DELETE CASCADE
- 2 vizualizări: V_COMENZI_EDITABLE și V_DETALII_COMENZI

## 🎨 Features

- Dark theme UI consistent
- Inline editing pentru toate tabelele
- Validări și error handling
- Responsive design
- Real-time data updates

## 📝 License

Academic project
