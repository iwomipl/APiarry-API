import {Router} from "express";
import {createApiaryIdNumber} from "../utils/functions";
import {ApiaryRecord} from "../records/apiary.record";
import {ValidationError} from "../utils/errors";

export const apiRouter = Router();
type QueryData = {
    name: string;
    dailyNumber: string;
}

apiRouter
    .get('/list', async (req, res) => {
        const {dateFrom, dateTo} = req.query;
        if (dateFrom || dateTo){
            if (!dateFrom || !dateTo){
                throw new ValidationError(`There must be two date from and to what date.`)
            }
            if (dateFrom > dateTo){
                throw new ValidationError(`Date From must be equal od earlier than Date To.`)
            }
            const allApiaries = await ApiaryRecord.listAll(dateFrom.toString(), dateTo.toString());
            res.json(allApiaries);
        } else {
            const allApiaries = await ApiaryRecord.listAll();
            res.json(allApiaries);
        }
    })
    .post('/json/add', async (req, res) => {
        const {name, dailyNumber} = req.body as QueryData;
        const startTime = new Date().toLocaleDateString('sv');
        if (ApiaryRecord._validate(name, dailyNumber, startTime)) {
            throw new ValidationError(`Sorry, somethings wrong with your query. Check it and try again.`);
        }

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
