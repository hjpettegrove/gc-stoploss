import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import routes from './routes/index.js';


const app = express();

//  Configure and use middleware

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

/*  custom middelware for models - creates app object for model and user info data
 *  app.use((req,res,next) => {
 *      //  Custom middleware here
 *      next();
 *  })
 * 
 */

//  Configure routes
app.use('/api', routes.api);


app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})