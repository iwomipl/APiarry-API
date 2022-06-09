import {Router} from "express";
import {createApiaryIdNumber} from "../utils/functions";


export const homeRouter = Router();

homeRouter
    .get('/', async (req, res) => {
        res.render('home/home');
    })
    .get('/add', (req, res) => {
        const date = new Date().toLocaleDateString('sv');
        const number = 54321;

        res.render('add/apiary', {
            date,
            number: number,
        })
    })
    .post('/add', (req, res) => {
        const {name, number, date} = req.body;
        const fixDateDash = date.split('-').join('');
        const {newIdForApirary, controlSum} = createApiaryIdNumber(fixDateDash, number);


        console.log(newIdForApirary, controlSum);

        res.json({
            name,
            number,
            date,
        })
    })