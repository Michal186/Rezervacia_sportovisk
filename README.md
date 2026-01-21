Rezervácia športovísk
Návod na inštaláciu

Tento projekt pozostáva z dvoch častí:

Frontend – React / Vite

Backend – Node.js

Pred spustením projektu je potrebné mať nainštalované:

Node.js

npm

MySQL

Postup inštalácie
1. Klonovanie repozitára

Najprv je potrebné naklonovať repozitár:

git clone https://github.com/Michal186/Rezervacia_sportovisk.git

2. Inštalácia závislostí – Frontend

Presunieme sa do adresára Frontend a nainštalujeme závislosti:

cd Frontend
npm install

3. Inštalácia závislostí – Backend

Pre adresár Backend vykonáme rovnaký postup:

cd Backend
npm install

4. Konfigurácia databázy

V adresári Backend vytvoríme súbor .env a vložíme nasledujúce údaje:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=cajik
DB_NAME=rezervaciadatabas
DB_PORT=3306

JWT_SECRET=VELMIDLHY_A_TAJNY_KLUC_PRE_JWT_TOKENY_1234567890

5. Spustenie Backend servera

Backend spustíme pomocou príkazu:

cd .\Backend
node server.js

6. Spustenie Frontendu

Frontend spustíme pomocou:

cd .\Frontend
npm run dev