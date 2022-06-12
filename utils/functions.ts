import {ValidationError} from "./errors";

export type newIdString = {
    id: string;
    controlSum: string;
}
export const createApiaryIdNumber = (date: string, code: string): newIdString => {

    //creating string out of string created from two strings, this must be a number, and is used in reducer function as base prev value
    const concatStringOfNumbers = date+code;

    if (!isNaN(Number(concatStringOfNumbers))){
    //creating array of numbers from variable above
    const arrayOfNumbersFromConcatNumbers = Array.from(concatStringOfNumbers, num => Number(num));

    //reduce function, which multiplies everything but zeros
    const multiplyingEffect = arrayOfNumbersFromConcatNumbers.reduce((prev, curr): number => {
        if (curr !== 0) {
            return prev * curr;
        }
        return prev;
    }, Number(concatStringOfNumbers));
    //in case, multiplyingEffect exceeds max number in js "9007199254740991" i used toFixed() method
    // to get the same number as in second example
    const stringedMultiplyingEffect = multiplyingEffect.toFixed().toString();

    //creating controlSum out of second, seventh and last digit of multiplyingEffect
    const controlSum = stringedMultiplyingEffect[1] + stringedMultiplyingEffect[6] + stringedMultiplyingEffect[stringedMultiplyingEffect.length - 1]

    //creating id of apiary
    const id = concatStringOfNumbers + controlSum;

    return {id, controlSum};
    } else {
        throw new ValidationError('Invalid date or number. Try again.');
    }
}

export const getSuggestedNumberForForm = (arrayOfNumbers: number[]): string=>{
    if (arrayOfNumbers.length === 0 || arrayOfNumbers[0] !== 1){
        return '00001';
    }

    //filter thru array, and find first number that is not one bigger, than last one
    const firstNumberWhichIsNotOneMore = arrayOfNumbers.filter((number, index)=>{
        return arrayOfNumbers[index+1] !== number+1;
    });

    //if number starts on zero (and js cuts it out) or is shorter than 5 digits, we're filling the number to 5 with zeros before the number
    const numberWithAddedZerosAndChangedToString = fillingNumberToHaveFiveDigits((firstNumberWhichIsNotOneMore[0]+1).toString());

    //Yes, it's redundant usage of variable, but it's easier to read the code
    return numberWithAddedZerosAndChangedToString;
}

export const fillingNumberToHaveFiveDigits = (number: string): string =>{
    //change string into an array
    let changedNumber = number.split('');
    if (changedNumber.length === 5){
        return changedNumber.join('');
    }
    //if array is shorter than 5 digits add 0 as first element
    do {
        changedNumber.unshift('0');
    } while (changedNumber.length <5)

    //change it to string and send it back
    return changedNumber.join('');
}