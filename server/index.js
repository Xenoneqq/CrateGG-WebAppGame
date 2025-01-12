const express = require('express');
const cors = require('cors')
const { sequelize, users } = require('./database');
const { initDb } = require('./database');

// routers
const userRouter = require('./routes/users');

const app = express();
const port = 8080;

app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/login', userRouter);

app.get('/', (req, res) => {
  res.send('Hello from our server!')
})

initDb().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});