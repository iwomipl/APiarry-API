import {Router} from "express";
import {createApiaryIdNumber} from "../utils/functions";
import {ApiaryRecord} from "../records/apiary.record";
import {ValidationError} from "../utils/errors";


export const apiRouter = Router();

apiRouter
    .get('/list', async (req, res) => {
        const allApiaries = await ApiaryRecord.listAll();

        res.json(allApiaries);
    })
    .post('/add', async (req, res) => {
        const {name, dailyNumber, startTime} = req.body;
        if (ApiaryRecord._validate(name, dailyNumber, startTime)) {
            throw new ValidationError(`Sorry, somethings wrong with your inputs.`);
        }
        //@TODO change body to params or queries in url
        const fixDateDash = startTime.split('-').join('');
        const {id, controlSum} = createApiaryIdNumber(fixDateDash, dailyNumber);

        if (await ApiaryRecord.checkIfIdExistsInDataBase(id)) {
            throw new ValidationError('Sorry, the Apiary Number you choose was already chosen today. Try again with different number.')
        }
        const newApiary = new ApiaryRecord({id, name, controlSum, dailyNumber, startTime})
        await newApiary.insert();

        res.json({
            name,
            id,
            controlSum,
            dailyNumber,
            startTime,
        })
    })