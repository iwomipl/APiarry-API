import {Router} from "express";
import {createApiaryIdNumber} from "../utils/functions";
import {ApiaryRecord} from "../records/apiary.record";
import {ValidationError} from "../utils/errors";


export const homeRouter = Router();

homeRouter
    .get('/', async (req, res) => {
        const allApiaries = await ApiaryRecord.listAll();

        res.render('home/home', {allApiaries});
    })
    .get('/add', async (req, res) => {
        const startTime = new Date().toLocaleDateString('sv');
        const dailyNumber = await ApiaryRecord.getFirstPossibleNumberForTheDay(new Date(startTime));

        res.render('add/apiary', {
            startTime,
            dailyNumber,
        })
    })
    .post('/add', async (req, res) => {
        const {name, dailyNumber, startTime} = req.body;
        if (ApiaryRecord._validate(name, dailyNumber)){
            throw new ValidationError(`Sorry, somethings wrong with your inputs.`);
        }

        const fixDateDash = startTime.split('-').join('');
        const {id, controlSum} = createApiaryIdNumber(fixDateDash, dailyNumber);

        const newApiary = new ApiaryRecord({id, name, controlSum, dailyNumber, startTime})
        if (await ApiaryRecord.checkIfIdExistsInDataBase(id)){
            throw new ValidationError('Sorry, the Apiary number you choose was already chosen today. Try again with different number.')
        }
        await newApiary.insert();

        res.render('add/added', {
            name,
            id,
            controlSum,
            dailyNumber,
            startTime,
        })
    })

//@TODO add sorting and filtering options to homeRouter and apiary . record