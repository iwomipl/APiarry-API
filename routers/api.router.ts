import {Router} from "express";
import {ApiaryRecord} from "../records/apiary.record";
import {ValidationError} from "../utils/errors";
import {createCheckAndInsertNewApiary, validateDatesFromAndTo} from "../utils/functions-antiredundant";

export const apiRouter = Router();
type QueryData = {
    name: string;
    dailyNumber: string;
}

apiRouter
    .get('/list', async (req, res) => {
        const {dateFrom, dateTo} = req.query;

        if (dateFrom || dateTo){
            // first check, if we have good dates
            validateDatesFromAndTo(dateFrom as string, dateTo as string);

            //if we have dates, let's grab Apiaries
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
            throw new ValidationError(`Sorry, somethings wrong with your name or Number. Check it and try again.`);
        }
        const {id, controlSum } = await createCheckAndInsertNewApiary(startTime, dailyNumber, name);

        res.json({
            name,
            id,
            controlSum,
            dailyNumber,
            startTime,
        })
    })
