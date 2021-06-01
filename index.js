const express =  require('express')
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose');
// Import Routes
const authRoute = require('./routes/auth');
const teamRoute = require('./routes/team')


dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT,
{   
    useNewUrlParser: true ,
    useUnifiedTopology: true 
} ,
(data) => {
    if (data == null ) {     
        console.log("Connected to DB");
    } else {
        console.log("DB connection Error");
        console.log(data);
    }
})

// Middleware
app.use(express.json()); 
// Route Midddlewares
app.use('/api/user',authRoute);
app.use('/api/team',teamRoute);

app.listen(3000, () => console.log("Server is up and running"));