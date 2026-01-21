-- ==========================================================
-- 1. CURATARE BAZA DE DATE (Stergere completa)
-- ==========================================================
DROP VIEW V_DETALII_COMENZI;
DROP VIEW V_COMENZI_EDITABLE;
DROP TABLE Raportari CASCADE CONSTRAINTS;
DROP TABLE Plati CASCADE CONSTRAINTS;
DROP TABLE Alergeni_Produse CASCADE CONSTRAINTS;
DROP TABLE Produse_Comanda CASCADE CONSTRAINTS;
DROP TABLE Comenzi CASCADE CONSTRAINTS;
DROP TABLE Produse CASCADE CONSTRAINTS;
DROP TABLE Alergeni CASCADE CONSTRAINTS;
DROP TABLE Restaurante CASCADE CONSTRAINTS;
DROP TABLE Livratori CASCADE CONSTRAINTS;
DROP TABLE Utilizatori CASCADE CONSTRAINTS;

-- ==========================================================
-- 2. CREARE TABELE SI CONSTRANGERI
-- ==========================================================

CREATE TABLE Utilizatori (
    id_utilizator NUMBER PRIMARY KEY,
    nume VARCHAR2(50) NOT NULL,
    prenume VARCHAR2(50) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL, 
    username VARCHAR2(50) UNIQUE NOT NULL, 
    parola VARCHAR2(100) NOT NULL,
    data_inscriere DATE DEFAULT SYSDATE
);

CREATE TABLE Livratori (
    id_livrator NUMBER PRIMARY KEY,
    nume VARCHAR2(50) NOT NULL,
    prenume VARCHAR2(50) NOT NULL,
    data_inscriere DATE DEFAULT SYSDATE,
    locatie_curenta VARCHAR2(100)
);

CREATE TABLE Restaurante (
    id_restaurant NUMBER PRIMARY KEY,
    nume VARCHAR2(100) NOT NULL,
    adresa VARCHAR2(200) NOT NULL,
    nota NUMBER(3,2),
    CONSTRAINT check_nota_restaurante CHECK (nota BETWEEN 1 AND 5)
);

CREATE TABLE Alergeni (
    id_alergen NUMBER PRIMARY KEY,
    nume_alergen VARCHAR2(50) NOT NULL,
    simptome VARCHAR2(200)
);

CREATE TABLE Produse (
    id_produs NUMBER PRIMARY KEY,
    id_restaurant NUMBER NOT NULL,
    nume VARCHAR2(100) NOT NULL,
    pret NUMBER(10,2) NOT NULL,
    calorii NUMBER,
    proteine NUMBER,
    grasimi NUMBER,
    CONSTRAINT fk_produs_restaurant FOREIGN KEY (id_restaurant) REFERENCES Restaurante(id_restaurant),
    CONSTRAINT check_pret_produs CHECK (pret > 0),
    CONSTRAINT check_nutritie CHECK (calorii >= 0 AND proteine >= 0 AND grasimi >= 0)
);

CREATE TABLE Comenzi (
    id_comanda NUMBER PRIMARY KEY,
    id_utilizator NUMBER NOT NULL,
    id_restaurant NUMBER NOT NULL,
    id_livrator NUMBER,
    status VARCHAR2(30) DEFAULT 'In procesare',
    CONSTRAINT fk_comanda_utilizator FOREIGN KEY (id_utilizator) REFERENCES Utilizatori(id_utilizator),
    CONSTRAINT fk_comanda_restaurant FOREIGN KEY (id_restaurant) REFERENCES Restaurante(id_restaurant),
    CONSTRAINT fk_comanda_livrator FOREIGN KEY (id_livrator) REFERENCES Livratori(id_livrator),
    CONSTRAINT check_status_comanda CHECK (status IN ('In procesare', 'In pregatire', 'In livrare', 'Livrat', 'Anulat'))
);

CREATE TABLE Produse_Comanda (
    id_comanda NUMBER,
    id_produs NUMBER,
    cantitate NUMBER NOT NULL,
    PRIMARY KEY (id_comanda, id_produs),
    CONSTRAINT fk_pc_comanda FOREIGN KEY (id_comanda) 
        REFERENCES Comenzi(id_comanda) ON DELETE CASCADE, 
    CONSTRAINT fk_pc_produs FOREIGN KEY (id_produs) 
        REFERENCES Produse(id_produs),
    CONSTRAINT check_cantitate_pc CHECK (cantitate > 0)
);

CREATE TABLE Alergeni_Produse (
    id_alergen NUMBER,
    id_produs NUMBER,
    PRIMARY KEY (id_alergen, id_produs),
    CONSTRAINT fk_ap_alergen FOREIGN KEY (id_alergen) REFERENCES Alergeni(id_alergen),
    CONSTRAINT fk_ap_produs FOREIGN KEY (id_produs) REFERENCES Produse(id_produs)
);

CREATE TABLE Plati (
    id_plata NUMBER PRIMARY KEY,
    id_comanda NUMBER NOT NULL,
    ramas_de_plata NUMBER(10,2) NOT NULL,
    nr_card VARCHAR2(16),
    data_exp_card VARCHAR2(5),
    cvv VARCHAR2(3),
    data_plata DATE DEFAULT SYSDATE,
    CONSTRAINT fk_plata_comanda FOREIGN KEY (id_comanda) 
        REFERENCES Comenzi(id_comanda) ON DELETE CASCADE,
    CONSTRAINT check_plata_pozitiva CHECK (ramas_de_plata >= 0)
);

CREATE TABLE Raportari (
    id_raportare NUMBER PRIMARY KEY,
    id_comanda NUMBER NOT NULL,
    data_deschidere DATE DEFAULT SYSDATE,
    descriere_problema VARCHAR2(500) NOT NULL,
    CONSTRAINT fk_raportare_comanda FOREIGN KEY (id_comanda) 
        REFERENCES Comenzi(id_comanda) ON DELETE CASCADE
);

-- ==========================================================
-- 3. CREARE VIZUALIZARI (Cerinta III.f)
-- ==========================================================

-- III.f.1: VIZUALIZARE SIMPLA EDITABILA (LMD Operations)
-- Permite operatii UPDATE si DELETE pe statusul comenzilor
CREATE OR REPLACE VIEW V_COMENZI_EDITABLE AS
SELECT 
    c.id_comanda,
    c.id_utilizator,
    c.id_restaurant,
    c.id_livrator,
    c.status,
    u.nume || ' ' || u.prenume AS client,
    r.nume AS restaurant,
    l.nume || ' ' || l.prenume AS livrator
FROM Comenzi c
LEFT JOIN Utilizatori u ON c.id_utilizator = u.id_utilizator
LEFT JOIN Restaurante r ON c.id_restaurant = r.id_restaurant
LEFT JOIN Livratori l ON c.id_livrator = l.id_livrator;

-- III.f.2: VIZUALIZARE COMPLEXA (READ-ONLY)
-- Afiseaza comenzi cu detalii complete: produse, plati, raportari
CREATE OR REPLACE VIEW V_DETALII_COMENZI AS
SELECT 
    c.id_comanda,
    c.status AS status_comanda,
    u.nume || ' ' || u.prenume AS client_complet,
    r.nume AS restaurant_nume,
    r.nota AS restaurant_rating,
    l.nume || ' ' || l.prenume AS livrator_complet,
    COUNT(DISTINCT pc.id_produs) AS numar_produse,
    COUNT(DISTINCT pl.id_plata) AS numar_plati,
    COUNT(DISTINCT rp.id_raportare) AS numar_raportari,
    SUM(p.pret * pc.cantitate) AS valoare_totala_comenzi
FROM Comenzi c
LEFT JOIN Utilizatori u ON c.id_utilizator = u.id_utilizator
LEFT JOIN Restaurante r ON c.id_restaurant = r.id_restaurant
LEFT JOIN Livratori l ON c.id_livrator = l.id_livrator
LEFT JOIN Produse_Comanda pc ON c.id_comanda = pc.id_comanda
LEFT JOIN Produse p ON pc.id_produs = p.id_produs
LEFT JOIN Plati pl ON c.id_comanda = pl.id_comanda
LEFT JOIN Raportari rp ON c.id_comanda = rp.id_comanda
GROUP BY 
    c.id_comanda, c.status, 
    u.nume, u.prenume, r.nume, r.nota, l.nume, l.prenume;

-- ==========================================================
-- 4. TRIGGER VALIDARE DATA
-- ==========================================================
CREATE OR REPLACE TRIGGER trg_utilizatori_data
BEFORE INSERT OR UPDATE ON Utilizatori
FOR EACH ROW
BEGIN
  IF :NEW.data_inscriere > SYSDATE THEN
    RAISE_APPLICATION_ERROR(-20001, 'Data inscrierii nu poate fi in viitor.');
  END IF;
END;
/

-- ==========================================================
-- 5. INSERARE DATE (Comenzi si Produse suplimentare)
-- ==========================================================

-- Utilizatori (10)
INSERT INTO Utilizatori VALUES (1, 'Popescu', 'Ion', 'ion@email.ro', 'ionp', 'pass1', TO_DATE('2025-01-01', 'YYYY-MM-DD'));
INSERT INTO Utilizatori VALUES (2, 'Ionescu', 'Maria', 'maria@email.ro', 'mariai', 'pass2', TO_DATE('2025-01-05', 'YYYY-MM-DD'));
INSERT INTO Utilizatori VALUES (3, 'Dumitru', 'Andrei', 'andrei@email.ro', 'andreid', 'pass3', SYSDATE);
INSERT INTO Utilizatori VALUES (4, 'Stoica', 'Elena', 'elena@email.ro', 'elenas', 'pass4', SYSDATE);
INSERT INTO Utilizatori VALUES (5, 'Radu', 'Mihai', 'mihai@email.ro', 'mihair', 'pass5', SYSDATE);
INSERT INTO Utilizatori VALUES (6, 'Enache', 'Ana', 'ana@email.ro', 'anae', 'pass6', SYSDATE);
INSERT INTO Utilizatori VALUES (7, 'Gheorghe', 'Vasile', 'vasile@email.ro', 'vasileg', 'pass7', SYSDATE);
INSERT INTO Utilizatori VALUES (8, 'Marin', 'Cristina', 'cristina@email.ro', 'cristinam', 'pass8', SYSDATE);
INSERT INTO Utilizatori VALUES (9, 'Lupu', 'Stefan', 'stefan@email.ro', 'stefanl', 'pass9', SYSDATE);
INSERT INTO Utilizatori VALUES (10, 'Stan', 'Laura', 'laura@email.ro', 'lauras', 'pass10', SYSDATE);

-- Livratori (10)
INSERT INTO Livratori VALUES (1, 'Balan', 'Doru', SYSDATE, 'Sector 1');
INSERT INTO Livratori VALUES (2, 'Miron', 'George', SYSDATE, 'Sector 2');
INSERT INTO Livratori VALUES (3, 'Popa', 'Dan', SYSDATE, 'Sector 3');
INSERT INTO Livratori VALUES (4, 'Nita', 'Alex', SYSDATE, 'Sector 4');
INSERT INTO Livratori VALUES (5, 'Constantin', 'Paul', SYSDATE, 'Sector 5');
INSERT INTO Livratori VALUES (6, 'Dinu', 'Adrian', SYSDATE, 'Sector 6');
INSERT INTO Livratori VALUES (7, 'Sandu', 'Victor', SYSDATE, 'Otopeni');
INSERT INTO Livratori VALUES (8, 'Voicu', 'Rares', SYSDATE, 'Chiajna');
INSERT INTO Livratori VALUES (9, 'Matei', 'Bogdan', SYSDATE, 'Popesti');
INSERT INTO Livratori VALUES (10, 'Ilie', 'Gabriel', SYSDATE, 'Pantelimon');

-- Restaurante (10)
INSERT INTO Restaurante VALUES (1, 'Burger Factory', 'Calea Victoriei 12', 4.8);
INSERT INTO Restaurante VALUES (2, 'Pizza Hut', 'Bd. Magheru 5', 4.2);
INSERT INTO Restaurante VALUES (3, 'Sushi Terra', 'Mall Baneasa', 4.5);
INSERT INTO Restaurante VALUES (4, 'Pasta Palace', 'Str. Lipscani 20', 4.1);
INSERT INTO Restaurante VALUES (5, 'Libanese Delights', 'Soseaua Nordului 3', 4.9);
INSERT INTO Restaurante VALUES (6, 'Healthy Salad', 'Str. Buzesti 4', 3.8);
INSERT INTO Restaurante VALUES (7, 'Taco Bell', 'Afi Cotroceni', 3.5);
INSERT INTO Restaurante VALUES (8, 'Dristor Kebab', 'Piata Universitatii', 4.6);
INSERT INTO Restaurante VALUES (9, 'Zest Pizza', 'Str. Toamnei 10', 4.7);
INSERT INTO Restaurante VALUES (10, 'Mamma Mia', 'Str. Academiei 2', 4.3);

-- Alergeni (10)
INSERT INTO Alergeni VALUES (1, 'Gluten', 'Balonare');
INSERT INTO Alergeni VALUES (2, 'Lactoza', 'Indigestie');
INSERT INTO Alergeni VALUES (3, 'Arahide', 'Soc anafilactic');
INSERT INTO Alergeni VALUES (4, 'Fructe de mare', 'Eruptii');
INSERT INTO Alergeni VALUES (5, 'Soia', 'Mancarimi');
INSERT INTO Albergeni VALUES (6, 'Oua', 'Greata');
INSERT INTO Alergeni VALUES (7, 'Mustar', 'Stranut');
INSERT INTO Alergeni VALUES (8, 'Susan', 'Inflamatii');
INSERT INTO Alergeni VALUES (9, 'Telina', 'Iritatii');
INSERT INTO Alergeni VALUES (10, 'Sulfiti', 'Dificultati respiratorii');

-- Produse (20)
INSERT INTO Produse VALUES (1, 1, 'Classic Burger', 35, 600, 30, 25);
INSERT INTO Produse VALUES (2, 1, 'Cheese Fries', 18, 450, 5, 20);
INSERT INTO Produse VALUES (3, 2, 'Pizza Margherita', 42, 800, 20, 15);
INSERT INTO Produse VALUES (4, 2, 'Pizza Diavola', 48, 950, 25, 30);
INSERT INTO Produse VALUES (5, 3, 'California Roll', 38, 320, 12, 8);
INSERT INTO Produse VALUES (6, 3, 'Miso Soup', 15, 100, 4, 2);
INSERT INTO Produse VALUES (7, 4, 'Pasta Carbonara', 39, 700, 15, 25);
INSERT INTO Produse VALUES (8, 4, 'Lasagna', 45, 850, 30, 40);
INSERT INTO Produse VALUES (9, 5, 'Hummus Classic', 22, 300, 8, 15);
INSERT INTO Produse VALUES (10, 5, 'Falafel Wrap', 28, 500, 12, 18);
INSERT INTO Produse VALUES (11, 6, 'Caesar Salad', 32, 400, 20, 22);
INSERT INTO Produse VALUES (12, 7, 'Beef Taco', 25, 450, 18, 12);
INSERT INTO Produse VALUES (13, 8, 'Shaorma Mare', 32, 1100, 45, 50);
INSERT INTO Produse VALUES (14, 9, 'Truffle Pizza', 55, 900, 18, 28);
INSERT INTO Produse VALUES (15, 10, 'Tiramisu', 20, 500, 5, 25);
INSERT INTO Produse VALUES (16, 1, 'Bacon Burger', 40, 750, 35, 40);
INSERT INTO Produse VALUES (17, 2, 'Coca-Cola', 8, 140, 0, 0);
INSERT INTO Produse VALUES (18, 3, 'Sake', 25, 200, 0, 0);
INSERT INTO Produse VALUES (19, 4, 'Focaccia', 12, 300, 5, 8);
INSERT INTO Produse VALUES (20, 8, 'Ayran', 7, 80, 2, 4);

-- Comenzi (21 inregistrari in total)
INSERT INTO Comenzi VALUES (101, 1, 1, 1, 'Livrat');
INSERT INTO Comenzi VALUES (102, 2, 2, 2, 'Livrat');
INSERT INTO Comenzi VALUES (103, 3, 3, 3, 'In livrare');
INSERT INTO Comenzi VALUES (104, 4, 4, 4, 'In pregatire');
INSERT INTO Comenzi VALUES (105, 5, 5, 5, 'Anulat');
INSERT INTO Comenzi VALUES (106, 6, 8, 6, 'Livrat');
INSERT INTO Comenzi VALUES (107, 7, 9, 7, 'In procesare');
INSERT INTO Comenzi VALUES (108, 8, 10, 8, 'Livrat');
INSERT INTO Comenzi VALUES (109, 9, 1, 9, 'Livrat');
INSERT INTO Comenzi VALUES (110, 10, 2, 10, 'Livrat');
INSERT INTO Comenzi VALUES (111, 1, 5, 1, 'Livrat');
INSERT INTO Comenzi VALUES (112, 2, 3, 2, 'Livrat');
INSERT INTO Comenzi VALUES (113, 3, 1, 3, 'Livrat');
INSERT INTO Comenzi VALUES (114, 4, 9, 4, 'Livrat');
INSERT INTO Comenzi VALUES (115, 5, 4, 5, 'Livrat');
INSERT INTO Comenzi VALUES (116, 1, 1, 1, 'Anulat');
INSERT INTO Comenzi VALUES (117, 3, 5, 2, 'Anulat');
INSERT INTO Comenzi VALUES (118, 7, 10, 3, 'Anulat');
INSERT INTO Comenzi VALUES (119, 2, 2, 4, 'In procesare');
INSERT INTO Comenzi VALUES (120, 5, 8, 5, 'In procesare');
INSERT INTO Comenzi VALUES (121, 9, 3, 6, 'In procesare');

-- Produse_Comanda
INSERT INTO Produse_Comanda VALUES (101, 1, 2); INSERT INTO Produse_Comanda VALUES (101, 2, 1);
INSERT INTO Produse_Comanda VALUES (102, 3, 1); INSERT INTO Produse_Comanda VALUES (102, 17, 2);
INSERT INTO Produse_Comanda VALUES (103, 5, 2); INSERT INTO Produse_Comanda VALUES (103, 6, 1);
INSERT INTO Produse_Comanda VALUES (104, 7, 1); INSERT INTO Produse_Comanda VALUES (104, 19, 2);
INSERT INTO Produse_Comanda VALUES (106, 13, 1); INSERT INTO Produse_Comanda VALUES (106, 20, 1);
INSERT INTO Produse_Comanda VALUES (108, 15, 3); INSERT INTO Produse_Comanda VALUES (109, 16, 1);
INSERT INTO Produse_Comanda VALUES (110, 4, 1); INSERT INTO Produse_Comanda VALUES (110, 17, 1);
INSERT INTO Produse_Comanda VALUES (111, 9, 2); INSERT INTO Produse_Comanda VALUES (112, 18, 1);
INSERT INTO Produse_Comanda VALUES (113, 1, 1); INSERT INTO Produse_Comanda VALUES (113, 16, 1);
INSERT INTO Produse_Comanda VALUES (114, 14, 1); INSERT INTO Produse_Comanda VALUES (115, 8, 1);
INSERT INTO Produse_Comanda VALUES (116, 1, 1);
INSERT INTO Produse_Comanda VALUES (117, 9, 2);
INSERT INTO Produse_Comanda VALUES (118, 15, 1);
INSERT INTO Produse_Comanda VALUES (119, 4, 1);
INSERT INTO Produse_Comanda VALUES (120, 13, 1);
INSERT INTO Produse_Comanda VALUES (121, 5, 2);

-- Alergeni_Produse
INSERT INTO Alergeni_Produse VALUES (1, 1); INSERT INTO Alergeni_Produse VALUES (2, 2);
INSERT INTO Alergeni_Produse VALUES (1, 3); INSERT INTO Alergeni_Produse VALUES (2, 3);
INSERT INTO Alergeni_Produse VALUES (1, 4); INSERT INTO Alergeni_Produse VALUES (4, 5);
INSERT INTO Alergeni_Produse VALUES (5, 6); INSERT INTO Alergeni_Produse VALUES (1, 7);
INSERT INTO Alergeni_Produse VALUES (2, 7); INSERT INTO Alergeni_Produse VALUES (6, 8);
INSERT INTO Alergeni_Produse VALUES (8, 9); INSERT INTO Alergeni_Produse VALUES (1, 10);
INSERT INTO Alergeni_Produse VALUES (2, 11); INSERT INTO Alergeni_Produse VALUES (6, 11);
INSERT INTO Alergeni_Produse VALUES (1, 13); INSERT INTO Alergeni_Produse VALUES (1, 14);
INSERT INTO Alergeni_Produse VALUES (2, 15); INSERT INTO Alergeni_Produse VALUES (6, 15);
INSERT INTO Alergeni_Produse VALUES (1, 16); INSERT INTO Alergeni_Produse VALUES (1, 19);

-- Plati
INSERT INTO Plati VALUES (1, 101, 0, '1111', '12/28', '111', SYSDATE);
INSERT INTO Plati VALUES (2, 102, 0, '2222', '10/27', '222', SYSDATE);
INSERT INTO Plati VALUES (3, 103, 101, '3333', '01/29', '333', SYSDATE);
INSERT INTO Plati VALUES (4, 106, 0, '4444', '05/27', '444', SYSDATE);
INSERT INTO Plati VALUES (5, 108, 0, '5555', '08/28', '555', SYSDATE);
INSERT INTO Plati VALUES (6, 109, 0, '6666', '09/27', '666', SYSDATE);
INSERT INTO Plati VALUES (7, 110, 0, '7777', '11/26', '777', SYSDATE);
INSERT INTO Plati VALUES (8, 111, 0, '8888', '03/27', '888', SYSDATE);
INSERT INTO Plati VALUES (9, 112, 0, '9999', '04/28', '999', SYSDATE);
INSERT INTO Plati VALUES (10, 113, 0, '0000', '06/27', '000', SYSDATE);

-- Raportari
INSERT INTO Raportari VALUES (1, 101, SYSDATE, 'Lipsa servetele');
INSERT INTO Raportari VALUES (2, 102, SYSDATE, 'Pizza a fost rece');
INSERT INTO Raportari VALUES (3, 103, SYSDATE, 'Livratorul a intarziat');
INSERT INTO Raportari VALUES (4, 105, SYSDATE, 'Am anulat din greseala');
INSERT INTO Raportari VALUES (5, 106, SYSDATE, 'Mancare nesarata');
INSERT INTO Raportari VALUES (6, 108, SYSDATE, 'Desert topit');
INSERT INTO Raportari VALUES (7, 109, SYSDATE, 'Ambalaj deteriorat');
INSERT INTO Raportari VALUES (8, 110, SYSDATE, 'Bautura varsata');
INSERT INTO Raportari VALUES (9, 111, SYSDATE, 'Lipsa sos');
INSERT INTO Raportari VALUES (10, 113, SYSDATE, 'Produse incurcate');

COMMIT;
