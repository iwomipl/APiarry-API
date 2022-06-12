import {Router} from "express";
import {ApiaryRecord} from "../records/apiary.record";
import {ValidationError} from "../utils/errors";
import {createCheckAndInsertNewApiary, validateDatesFromAndTo} from "../utils/functions-antiredundant";
import {fillingNumberToHaveFiveDigits} from "../utils/functions";


export const homeRouter = Router();

homeRouter
    .get('/add', async (req, res) => {
        const startTime = new Date().toLocaleDateString('sv');
        const dailyNumber = await ApiaryRecord.getFirstPossibleNumberForTheDay(new Date(startTime));

        res.render('add/apiary', {
            startTime,
            dailyNumber,
        })
    })
    .get('/admin', async (req, res) => {
        res.render('admin/admin');
    })
    .get('/', async (req, res) => {
        const {dateFrom, dateTo, direction} = req.query;

        if (dateFrom || dateTo){
            // first check, if we have good dates
            validateDatesFromAndTo(dateFrom as string, dateTo as string);

            //if we have dates, let's grab Apiaries
            const allApiaries = await ApiaryRecord.listAll(dateFrom.toString(), dateTo.toString());


            //On frontend I have function that checks direction of tablerows by id, here i'm checking if it is set, if not, i'm setting it
            res.render('home/home', {
                allApiaries,
                direction: direction ?? '8595',
            });
        } else {
            const allApiaries = await ApiaryRecord.listAll();

            res.render('home/home', {
                allApiaries,
                direction: direction ?? '8595',
            });
        }
    })
    .post('/add', async (req, res) => {
        let {name, dailyNumber} = req.body;

        dailyNumber = dailyNumber.length < 5 ? fillingNumberToHaveFiveDigits(dailyNumber) : dailyNumber;

        //would have brought creating this variable to createCheckAndInsertNewApiary, but i need it to be _validated
        const startTime = new Date().toLocaleDateString('sv');
        if (ApiaryRecord._validate(name, dailyNumber, startTime)){
            throw new ValidationError(`Sorry, somethings wrong with your inputs.`);
        }
        const {id, controlSum } = await createCheckAndInsertNewApiary(startTime, dailyNumber, name);

        res.render('add/added', {
            name,
            id,
            controlSum,
            dailyNumber,
            startTime,
        })
    })
    .post('/', async (req, res) => {
        const {dateFrom, dateTo, direction} = req.body;
        if (dateFrom || dateTo){
            if (!dateFrom || !dateTo){
                throw new ValidationError(`There must be two date from and to what date.`)
            }
            const allApiaries = await ApiaryRecord.listAll(dateFrom.toString(), dateTo.toString());
            res.render('home/home', {
                allApiaries: direction === '8593'? allApiaries.sort((a,b)=> Number(b.id) - Number(a.id)) : allApiaries,
                direction,
            });
        } else {
            const allApiaries = await ApiaryRecord.listAll();

            res.render('home/home', {
                allApiaries: direction === '8593'? allApiaries.sort((a,b)=> Number(b.id) - Number(a.id)) : allApiaries,
                direction,
            });
        }
    })
