// index.js

const express = require('express');
const cors = require('cors');
const { sequelize, users, crates, crateMarket, crateMarketHist, userCurrency, initDb } = require('./database'); // Import everything

// Routers
const userRouter = require('./routes/users');
const crateRouter = require('./routes/crates');
const marketRouter = require('./routes/crateMarket');
const marketHistoryRouter = require('./routes/crateMarketHist');
const userCurrencyRouter = require('./routes/userCurrency');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/users', userRouter);
app.use('/crates', crateRouter);
app.use('/market', marketRouter);
app.use('/market-history', marketHistoryRouter);
app.use('/user-currency', userCurrencyRouter);

app.get('/', (req, res) => {
  res.send('Hello from our server!');
});

// Initialize the database
initDb().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
