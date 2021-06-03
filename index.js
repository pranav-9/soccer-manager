const express =  require('express')
const app = express();

// Import Routes
const authRoute = require('./routes/auth');
const teamRoute = require('./routes/team')
const orderRouter = require('./routes/order')
const marketRouter = require('./routes/market')

// Middleware
app.use(express.json()); 
// Route Midddlewares
app.use('/api/user',authRoute);
app.use('/api/team',teamRoute);
app.use('/api/order', orderRouter);
app.use('/api/market', marketRouter);

app.listen(3000, () => console.log("Server is up and running"));