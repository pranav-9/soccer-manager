const express =  require('express')
const app = express();

// Import Routes
const authRoute = require('./routes/auth');
const teamRoute = require('./routes/team')

// Middleware
app.use(express.json()); 
// Route Midddlewares
app.use('/api/user',authRoute);
app.use('/api/team',teamRoute);

app.listen(3000, () => console.log("Server is up and running"));