# Kino Bilietų Rezervacijos Sistema

Sprendimas sukurtas naudojant **Node.js + Express + MongoDB + React**.

## Projekto Apžvalga

Tai kino bilietų rezervacijos sistema, kuri leidžia vartotojams:
- Registruotis ir prisijungti su JWT autentifikacija
- Kurti, peržiūrėti, redaguoti ir šalinti kino bilietų rezervacijas
- Pasirinkti sėdimas vietas iš interaktyvaus teatro plano
- Filtruoti rezervacijas pagal kino teatrą, datą ir statusą
- Naudoti sėdimų vietų pasirinkimo funkcionalumą

## Panaudota

- **Backend**: Node.js + Express + MongoDB (Atlas) + JWT
- **Frontend**: React + Vite + Interaktyvūs komponentai
- **Duomenų bazė**: MongoDB Atlas (`cluster0.gtsjimj.mongodb.net`)
- **Autentifikacija**: JSON Web Tokens (JWT)
- **Validacija**: express-validator
- **Stilizavimas**: Modernūs CSS stiliai su animacijomis

## Projekto Struktūra

```
rest-api-2/
├── server/                 # Backend (Node.js + Express)
│   ├── controllers/       # Maršrutų kontroleriai
│   │   ├── authController.js      # Autentifikacijos logika
│   │   └── bookingController.js   # Rezervacijų valdymas
│   ├── middleware/        # Tarpinis folderis
│   │   └── auth.js               # JWT autentifikacijos middleware
│   ├── models/            # Mongoose duomenų modeliai
│   │   ├── User.js               # Vartotojo schema
│   │   └── Booking.js            # Rezervacijos schema
│   ├── routes/           # API maršrutai
│   │   ├── auth.js               # Autentifikacijos maršrutai
│   │   └── bookings.js           # Rezervacijų maršrutai
│   ├── .env             # kintamieji 
│   ├── server.js        # Pagrindinis serverio failas
│   ├── package.json     # Backend priklausomybės
│   └── package-lock.json # Priklausomybių fiksavimas
├── client/               # Frontend (React)
│   ├── src/
│   │   ├── components/   # React komponentai
│   │   │   ├── Login.jsx                 # Prisijungimo forma
│   │   │   ├── Register.jsx              # Registracijos forma
│   │   │   ├── BookingForm.jsx           # Paprastoji rezervacijos forma
│   │   │   ├── BookingList.jsx           # Rezervacijų sąrašas
│   │   │   ├── EnhancedBookingForm.jsx   # Išplėstinė rezervacijos forma
│   │   │   └── EnhancedBookingForm.css   # Stiliai rezervacijos formai
│   │   ├── context/      # React kontekstai
│   │   │   └── AuthContext.jsx           # Autentifikacijos kontekstas
│   │   ├── services/     # API tarnybos
│   │   │   ├── api.js               # Pagrindinis API servisas
│   │   │   └── tmdbService.js       # TMDB filmų API servisas (neprijungtas-tik numatomas patobulinimas)
│   │   ├── data/         # Statiniai duomenys
│   │   │   └── cinemaData.js        # Kino teatrų duomenys
│   │   ├── App.jsx       # Pagrindinis App komponentas
│   │   └── main.jsx      
│   ├── index.html       # Pagrindinis HTML failas
│   ├── vite.config.js   # Vite konfigūracija
│   ├── package.json     # Frontend priklausomybės
│   └── package-lock.json # Priklausomybių fiksavimas
├── views/                # šablonai (server-side rendering)
│   ├── partials/        # Dalinieai šablonai
│   │   ├── header.ejs          # Puslapio antraštė
│   │   └── footer.ejs          # Puslapio poraštė
│   └── home.ejs         # Pagrindinio puslapio šablonas
├── public/               # Statiniai failai
│   └── style.css        # Globalūs CSS stiliai
├── package.json         # Root projekto konfigūracija
└── README.md           # Šis failas
```

## Diegimo Instrukcijos

### 1. MongoDB Atlas Nustatymas

**Svarbu**: MongoDB Atlas IP prieigos sąrašas šiuo metu nustatytas į `0.0.0.0/0 (Leisti iš bet kur)`.

#### Vartotojams su dinaminiais IP adresais:

1. Eikite į **MongoDB Atlas** → **Network Access** → **IP Access List**
2. Spustelėkite **Add IP Address** → **Add current IP address** → Save
3. **(Pasirinktinai)** Ištrinkite arba redaguokite `0.0.0.0/0` įrašą, kai norite apriboti prieigą
4. Jei jūsų IP keičiasi, pakartokite 2 žingsnį (arba palikite `0.0.0.0/0` kūrimo metu)
5. Palaukite, kol taisyklės bus įdiegtos (kelias minutes), tada bandykite prisijungti iš naujo

**Paleidžiant projektą į Hostinger**: Venkti `0.0.0.0/0`; naudoti konkrečius IP adresus.

### 2. Backend Nustatymas

1. **Eikite į serverio katalogą:**
   ```bash
   cd server
   ```

2. **Įdiekite node-modules:**
   ```bash
   npm install
   ```

3. **Sukurkite `.env` failą** `server/` kataloge su šiomis reikšmėmis:
   ```env
   # Server
   NODE_ENV=development
   PORT=5000

   # MongoDB Atlas
   MONGODB_URI=mongodb+srv://user_1:slaptazodis@cluster0.gtsjimj.mongodb.net
   DB_NAME=db_kino
   Collection=cinematika

   # Autentifikacija
   JWT_SECRET=change_me_dev_secret_please
   JWT_EXPIRES_IN=30d

   # Klientas
   CLIENT_URL=http://localhost:5173
   ```

4. **Paleiskite backend serverį:**
   ```bash
   npm run dev
   ```
 

   Serveris veiks `http://localhost:5000`

### 3. Frontend Nustatymas

1. **Eikite į kliento katalogą (nauja terminalo sesija):**
   ```bash
   cd client
   ```

2. **Įdiekite (node-modules):**
   ```bash
   npm install
   ```

3. **Paleiskite React kūrimo serverį:**
   ```bash
   npm run dev
   ```


   Klientas veiks `http://localhost:5173`

### 4. Prieiga prie Aplikacijos

1. Atidarykite naršyklę ir eikite į `http://localhost:5173`
2. Registruokitės naują paskyrą arba prisijunkite
3. Pradėkite kurti kino bilietų rezervacijas!

## API Galutiniai Taškai

### Autentifikacija
- `POST /api/auth/register` - Registruoti naują vartotoją
- `POST /api/auth/login` - Prisijungti
- `GET /api/auth/me` - Gauti dabartinio vartotojo informaciją

### Rezervacijos (Apsaugoti maršrutai)
- `GET /api/bookings` - Gauti visas vartotojo rezervacijas
- `POST /api/bookings` - Sukurti naują rezervaciją
- `GET /api/bookings/:id` - Gauti konkrečią rezervaciją
- `PUT /api/bookings/:id` - Atnaujinti rezervaciją
- `DELETE /api/bookings/:id` - Ištrinti rezervaciją
- `GET /api/bookings/available-seats` - Gauti laisvas vietas

## Duomenų Bazės Schema

### Vartotojo Modelis
```javascript
{
  username: String (privalomas, unikalus),
  email: String (privalomas, unikalus), 
  password: String (privalomas, užšifruotas),
  role: String (numatytasis: 'user'),
  timestamps: true
}
```

### Rezervacijos Modelis (Kolekcija: `cinematika`)
```javascript
{
  cinemaName: String (privalomas),
  date: Date (privalomas, negali būti praeityje),
  price: Number (privalomas, 0-1000),
  bookingTime: String (privalomas, HH:MM formatas),
  stageSquares: Number (privalomas, 10-500),
  seatNumber: Number (privalomas, teigiamas),
  selectedSeats: Array (pasirinktos vietos),
  userId: ObjectId (privalomas, ref: 'User'),
  status: String (numatytasis: 'active'),
  timestamps: true
}
```

## Funkcionalumai

### Autentifikacija
- Vartotojo registracija su validacija
- Saugi prisijungimas su JWT tokenais
- Slaptažodžių šifravimas su bcryptjs
- Apsaugotų maršrutų tarpinė programinė įranga

### Rezervacijų Valdymas
- Sukurti naują kino bilietų rezervaciją
- Peržiūrėti visas savo rezervacijas su filtrais
- Redaguoti esamas rezervacijas
- Šalinti rezervacijas
- Sėdimų vietų prieinamumo tikrintojas
- Užkirsti kelią dvigubai rezervacijai tai pačiai vietai

### Frontend Funkcijos
- Paprastas, švarus sąsajas
- Responsyvus dizainas
- Formų validacija
- Realaus laiko sėdimų vietų prieinamumas
- **Interaktyvus sėdimų vietų pasirinkimas**
- **Profesionalus kino teatro planas**
- **Spalvų kodavimo sistema vietoms**
- **Automatinis limito valdymas**

## Sėdimų Vietų Pasirinkimo Sistema

### Interaktyvus Teatro Planas
- **Vizualus kino ekranas** viršuje
- **Eilių ženklinimas** (A, B, C ir t.t.) kairėje
- **Vietų numeriai** (1, 2, 3 ir t.t.) realistiniame kino teatro išdėstyme
- **20 vietų per eilę** (standartinė kino teatro konfigūracija)

### Spalvų Sistema
- **🟢 Žalia (Laisva)** - Paruošta pasirinkti
- **🔵 Mėlyna (Pasirinkta)** - Šiuo metu pasirinktos vietos
- **⚫ Pilka (Nepasiekiama)** - Negalima pasirinkti (pasiektas limitas)

### Pasirinkimo Funkcionalumas
- **Spustelėti bet kurią vietą** pasirinkti/nuimti pasirinkimą
- **Daugkartinis pasirinkimas** - spustelėti kelis vietas iš karto
- **Vizualus atsiliepimas** - vietos iš kart keičia spalvą
- **Hover efektai** su sklandžiomis animacijomis
- **Automatinis limito vykdymas**

## Kalbų Palaikymas

Aplikacija pilnai palaiko **lietuvių kalbą**:
- Klaidų pranešimai
- Sėkmės pranešimai
- Navigacijos elementai
- Visi vartotojo sąsajos tekstai

##  Saugumo Funkcijos

- JWT token autentifikacija
- Įvesties validacija
  

