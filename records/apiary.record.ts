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

    static _validate(name: string, dailyNumber: string, startTime: string): Boolean{
        if ((dailyNumber).toString().length >5 || isNaN(Number(dailyNumber))){
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

    //delete apiary from database
    async delete(): Promise<void> {

    }
    //Get list of all apiaries
    static async listAll(): Promise<ApiaryRecord[]> {
        const [results] = await pool.execute('SELECT * FROM `apiaries`', ) as ApiaryRecordResults;

        return results.map(apiary=> new ApiaryRecord({
            ...apiary,
            startTime: new Date(apiary.startTime).toLocaleDateString('sv'),
            dailyNumber: apiary.dailyNumber ,
        }));
    }

    static async checkIfIdExistsInDataBase(controlSum: string): Promise<Boolean>{
        const [results] = await pool.execute('SELECT `dailyNumber` FROM `apiaries` WHERE `id`=:id', {
                id: controlSum,
        }) as ApiaryRecordResults;

        return results.length >0;
    }

    static async getFirstPossibleNumberForTheDay(date: Date): Promise<string> {
        const [results] = await pool.execute('SELECT `dailyNumber` FROM `apiaries` WHERE `startTime`= :date ORDER BY `dailyNumber` ASC', {
            date:   date.toLocaleDateString('sv'),
        }) as ApiaryRecordResults;
        const arrayOfNums = results.map(elem=> Number(elem.dailyNumber)).sort((a, b)=> a-b);
        const dailyNumber = getSuggestedNumberForForm(arrayOfNums);

        return dailyNumber;
    }

}