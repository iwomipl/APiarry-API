import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2/promise";
import {fillingNumberToHaveFiveDigits, getSuggestedNumberForForm} from "../utils/functions";


type ApiaryRecordResults = [ApiaryRecord[], FieldPacket[]];

export class ApiaryRecord {
    public id: string;
    public name: string;
    public dailyNumber: number | string;
    public startTime: string;
    public controlSum: string;

    constructor(obj: Omit<ApiaryRecord, 'insert' | 'delete' | 'validate'>) {
        const {id, name, controlSum, dailyNumber, startTime} = obj;
        if (name.length < 3 || name.length > 50) {
            throw new ValidationError(`Name of apiary must be between 3 and 50 letters long. Now it is ${name.length} letters long.`);
        }

        this.id = id;
        this.name = name;
        this.dailyNumber = dailyNumber;
        this.startTime = startTime;
        this.controlSum = controlSum;
    }

    // validating data from request
    static _validate(name: string, dailyNumber: string, startTime: string): Boolean{
        if ((dailyNumber).toString().length <5 || (dailyNumber).toString().length >5|| isNaN(Number(dailyNumber))){
            throw new ValidationError('Sorry, Your number should be digits only and be  5 digits long.');
        }
        if (name.length < 3 || name.length >50 ){
            throw new ValidationError(`Sorry, Your Apiary's name  should be from 3 to 50 characters long.`);
        }
        if (startTime !== new Date().toLocaleDateString('sv')){
            throw new ValidationError(`Sorry, given date is not today. It should be date of adding apiary to our list.`);
        }
        return false;
    }

    //add new apiary to database
    async insert(): Promise<string> {
        if ((this.dailyNumber).toString().length <5){
            this.dailyNumber = fillingNumberToHaveFiveDigits((this.dailyNumber).toString())
        }
        await pool.execute("INSERT INTO `apiaries`(`id`, `name`, `dailyNumber`,`startTime`, `controlSum`) VALUES (:id, :name, :dailyNumber, :startTime, :controlSum)", this);
        return this.id;
    }

    //Get list of all apiaries
    static async listAll(dateFrom?: string, dateTo?: string): Promise<ApiaryRecord[]> {
        const [results] = await pool.execute('SELECT * FROM `apiaries`', ) as ApiaryRecordResults;

        //Map result from db and change their dates
        const mappedResults = results.map(apiary=> new ApiaryRecord({
            ...apiary,
            startTime: new Date(apiary.startTime).toLocaleDateString('sv'),
            dailyNumber: apiary.dailyNumber ,
        }));

        //If we have a dates in arguments, we're filtering them to fit demands
        if (dateFrom || dateTo){
            return mappedResults.filter(apiary=> {
                return (new Date(apiary.startTime) >= new Date(dateFrom) && new Date(apiary.startTime) <= new Date(dateTo))
            })
        }
        return mappedResults;
    }

    static async checkIfIdExistsInDataBase(id: string): Promise<Boolean>{
        const [results] = await pool.execute('SELECT `dailyNumber` FROM `apiaries` WHERE `id`=:id', {
                id,
        }) as ApiaryRecordResults;

        //if id exists, and has length more than 0 send true, else send false
        return results.length >0;
    }

    static async getFirstPossibleNumberForTheDay(date: Date): Promise<string> {
        const [results] = await pool.execute('SELECT `dailyNumber` FROM `apiaries` WHERE `startTime`= :date ORDER BY `dailyNumber` ASC', {
            date:   date.toLocaleDateString('sv'),
        }) as ApiaryRecordResults;

        //first sort array by dailyNumber
        const arrayOfNums = results.map(elem=> Number(elem.dailyNumber)).sort((a, b)=> a-b);

        //than find first consecutive number, so if numbers are 00001, 00002, 00004, the first consecutive number will be 00003
        const dailyNumber = getSuggestedNumberForForm(arrayOfNums);

        //Yes, it's redundant usage of variable, but it's easier to read the code
        return dailyNumber;
    }

}