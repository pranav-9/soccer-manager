const express =  require('express')
const app = express();

// Import Routes
const userRoute = require('./routes/user');
const teamRoute = require('./routes/team')
const orderRouter = require('./routes/order')
const marketRouter = require('./routes/market')
const playerRouter = require('./routes/player')

// Middleware
app.use(express.json()); 
// Route Midddlewares
app.use('/api/user',userRoute);
app.use('/api/team',teamRoute);
app.use('/api/order', orderRouter);
app.use('/api/market', marketRouter);
app.use('/api/player', playerRouter);

app.listen(3000, () => console.log("Server is up and running"));