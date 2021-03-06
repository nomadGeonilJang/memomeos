const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const hpp = require('hpp');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');

const passportConfig = require('./passport');
const db = require('./models');
const userAPIRouter = require('./routes/user')
const memoAPIRouter = require('./routes/memo')

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080
passportConfig();
db.sequelize.sync();

app.use(hpp());
app.use(helmet());
app.use(cors({
    origin:true,
    credentials:true,
}));
app.use(morgan("dev"));
app.use('/',express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:process.env.COOKIE_SECRET,
    cookie:{
        httpOnly:true,
        secure:false,
    },
    name:'memos'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user/', userAPIRouter);
app.use('/api/memo/', memoAPIRouter);
app.get('/', (req, res)=>{
  res.send('back 동작중')
});



app.listen(PORT, () => {
    console.log(`server is running on localhost:${PORT}`);
})
