import * as express from 'express';
import 'express-async-errors';
import {static as eStatic, urlencoded} from "express";
import {engine} from "express-handlebars";
import { homeRouter } from './routers/home.router';
import {handleError, handleFourOhFourError} from './utils/errors';
import {handlebarsHelpers} from "./utils/handlebars-helpers";
import {config} from "./config/config";
import { apiRouter } from './routers/api.router';


const local = `Listening on http://${config.serverHost}:${config.serverPort}`;
const app = express();


app.use(express.json())
app.use(urlencoded({
    extended: true,
}));
app.use(eStatic('public'));
app.engine('.hbs', engine({
    extname: '.hbs',
    helpers: handlebarsHelpers,
}));
app.set('view engine', '.hbs');

app.use('/api/', apiRouter);
app.use('/', homeRouter);

app.use(handleError);
//błąd do obsługi 404
app.use(handleFourOhFourError);

app.listen(config.serverPort, config.serverHost, () => {
    console.log(local);
});