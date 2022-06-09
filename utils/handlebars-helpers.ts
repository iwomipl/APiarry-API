import {fillingNumberToHaveFiveDigits} from "./functions";

export const handlebarsHelpers = {
    oneToMoreDigits: (digits: string)=> fillingNumberToHaveFiveDigits(digits),
}