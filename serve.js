const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: `.env` });

//  using mongoose labriry to set mongoDb
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DBPASS)

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Mongodb is integrated with express()'))
    .catch(err => {
        if (process.env.NODE_ENV === 'development') console.log(err);
        console.log('Mongodb isnt\' integrated with express()');

    })



const port = process.env.PORT || 4000;
// listen server
app.listen(port, () => { console.log(`app just listing at port ${port}`) });