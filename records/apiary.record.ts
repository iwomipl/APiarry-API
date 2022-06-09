import {ValidationError} from "../utils/errors";


export class ApiaryRecord {
    public id?: string;
    public name: string;
    public dailyNumber?: number;
    public startTime: Date;
    public controlNumber?: number;

    constructor(obj: Omit<ApiaryRecord, 'insert' | 'delete'>) {
        const {id, name, dailyNumber, startTime, controlNumber} = obj;
        if(name.length <3 || name.length >50){
            throw new ValidationError(`Name of apiary must be between 3 and 50 letters long. Now it is ${name.length} letters long.`);
        }

        // this.id = id;
        this.name = name;
        // this.dailyNumber = dailyNumber;
        this.startTime = startTime;
        // this.controlNumber = controlNumber;
    }

    //add new apiary to database
    async insert(): Promise<void>{

    }

    //delete apiary from database
    async delete(): Promise<void>{

    }

    //Get list of all apiaries
    static async listAll(): Promise<void>{

    }

}