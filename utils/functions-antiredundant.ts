import {ValidationError} from "./errors";

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