# tw-proiect-2023
## Tema: Jurnal muti-user integrat cu Google translate

# Descriere:

### Proiectul va folosi interpretatorul de JavaScript Node.js, framework-ul web Express si React.js pentru partea de front-end.

### Cerinta de traducere va integra un serviciu extern: API-ul Google Translate pentru a traduce la cerere, descrierea intrarilor din jurnal. Tema aplicatiei este de jurnal alimentar, in care utilizatorii pot introduce zilnic, date legate de continutul meselor.

### Utilizatorul va putea accesa aplicatia in urma autentificarii cu un username si o parola. Dupa login, interfata (de tip SPA) va fi alcatuita din mai multe componente. Utilizatorul poate interactiona cu fiecare din ele, pentru a putea adauga o intrare noua in jurnal, pentru a edita intrarile deja adaugate sau sterge oricare din ele.

### Aplicatia va folosi o baza de date de tip relational, organizata dupa structura:

Tabele:
- `USERS`
  - ATRIBUTE: ID(PK), USERNAME, PASSWORD, CREATEDAT, UPDATEDAT;
- `ENTRIES`
  - ATRIBUTE: ID(PK), TITLE, DESCRIPTION, DATE, CREATEDAT, UPDATEDAT, USERID(FK);

### Pentru adaugarea intrarilor in jurnal, utilizatorul va accesa un formular de introducere a datelor, unde va completa titlul unei noi intrari si descrierea corespunatoare acesteia. In urma salvarii intrarii, aceasta va fi inregistrata in baza de date, asociata utilizatorului. In plus, intrarea va stoca si data la care a fost creata.

Functionalitatile primare ale proiectului:
- Mecanism CRUD pentru inregistrari;
- Login/Logout/SignUp;
- Translate folosing Google Cloud Translation API;


# Instructiuni rulare:
* Clonarea locala a proiectului cu `git clone <sursa_proiectului>`;
* In folderul root vor exista trei directoare (backend, database, frontend) si fisierul README.md;
* Pentru fiecare dintre cele trei, navigam in interiorul lor `cd <nume_director>` si executam comanda `npm install` (pentru fiecare dintre cele trei in parte);
* Navigam in directorul backend si pornim serverul de backend folosind comanda `node index.js` (se ocupa si de conectarea la baza de date); 
* Navigam in directorul frontend si pornim aplicatia React folosind comanda `npm start`;
* Se deschide o fereastra de browser cu aplicatia ruland, in pagina principala de Login;

### De aici aplicatia este functionala si se pot realiza interactiuni:
  - Crearea unui utilizator nou folosind formularul de SignUp accesat prin butonul cu acelasi nume;
  - Dupa crearea unui utilizator, aplicatia revine in sectiunea de Login si userul creat se poate autentifica;
  - Dupa un Login corect, se randeaza componenta Profile si utilizatorul poate adauga intrari noi in jurnal, folosing formularul (introducerea de Titlu si Descriere) si butonul de "Add Entry";
  - Noua intrare in jurnal este vizibila acum intr-o lista;
  - Exista optiune pentru sterge (folosind butonul Delete), sau editare folosing butonul Edit, caz in care:
    - se deschide un nou formular pentru intrarea respectiva din jurnal, in care utilizatorul poate:
      - modifica titlul sau descrierea si executa Update pentru persistarea modificarilor;
      - alege sa renunte la editare folosind butonul Cancel;
      - alege sa traduca din romana in engleza descrierea, folosind butonul "Translate Description" (se face automat si update);
  - Utilizatorul poate face Logout folosind butonul specific;
