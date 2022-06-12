import {ValidationError} from "./errors";
import {createApiaryIdNumber} from "./functions";
import {ApiaryRecord} from "../records/apiary.record";

export const validateDatesFromAndTo =(dateFrom: string, dateTo: string): void=>{
    if (!dateFrom || !dateTo){
        throw new ValidationError(`There must be two date from and to what date.`)
    }
    if (new Date(dateFrom) > new Date(dateTo)){
        throw new ValidationError(`Date From must be equal od earlier than Date To.`)
    }
    if (dateFrom[4] !== '-' || dateFrom[7] !== '-' || dateTo[4] !== '-' || dateTo[7] !== '-' || dateFrom.length !== 10 || dateTo.length !== 10){
        throw new ValidationError(`Date format is wrong, are you sure you have sent data in this format YYYY-MM-DD?`)
    }
}

export const createCheckAndInsertNewApiary = async (startTime: string, dailyNumber: string, name: string): Promise<ApiaryRecord>=>{
    //get rid of dashes from date
    const fixDateDash = startTime.split('-').join('');
    if (await ApiaryRecord.checkIfIdExistsInDataBase(startTime, dailyNumber)){
        throw new ValidationError('Sorry, the Apiary number you choose was already chosen today. Try again with different number.')
    }

    const {id, controlSum} = createApiaryIdNumber(fixDateDash, dailyNumber);

    const newApiary = new ApiaryRecord({id, name, controlSum, dailyNumber, startTime})
    await newApiary.insert();

return {id, name, controlSum, dailyNumber, startTime} as ApiaryRecord;
}