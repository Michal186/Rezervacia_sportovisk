Návod na inštaláciu 

Tento projekt pozostáva z dvoch častí: Frontend (React/Vite) a Backend (Node.js)

Pred spustením projektu je potrebné mať nainštalované:
Node.js, npm a MySQL

Postup inštalácie

1. Najprv treba naklonovať repozitár
git clone gh repo clone Michal186/Rezervacia_sportovisk

2. Presunieme sa do adresára client a naištalujeme závislosti
cd Frontend
npm install

3. Pre adresár server musíme vykonať to isté
cd Backend
npm install

4. V adresári server vytvoríme .env súbor a vložíme údaje
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=cajik
DB_NAME=rezervaciadatabase
DB_PORT=3306

JWT_SECRET=VELMIDLHY_A_TAJNY_KLUC_PRE_JWT_TOKENY_1234567890

5. Otvoríme Backend na spustenie databázy
cd .\Backend\
node server.js

6. Príprava Frontendu
cd .\Frontend\
npm run dev
