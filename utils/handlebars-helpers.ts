import {fillingNumberToHaveFiveDigits} from "./functions";
import {ApiaryRecord} from "../records/apiary.record";

export const handlebarsHelpers = {
    oneToMoreDigits: (digits: string)=> fillingNumberToHaveFiveDigits(digits),
    checkIfListExists: (array: ApiaryRecord[])=> array.length > 0,
    findMin: (array: ApiaryRecord[])=> array[0].startTime,
    findMax: (array: ApiaryRecord[])=> array[array.length-1].startTime,
    minOrMax: (array: ApiaryRecord[])=> array[array.length-1].startTime > array[0].startTime,
}