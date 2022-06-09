export type newIdString = {
    id: string;
    controlSum: string;
}
export const createApiaryIdNumber = (date: string, code: string): newIdString => {
    const concatNumbers = Number(([date, code]).join(''));
    const arrayOfNumbersFromConcatNumbers = Array.from(concatNumbers.toString(), num => Number(num));
    const multiplyingEffect = arrayOfNumbersFromConcatNumbers.reduce((prev, curr): number => {
        if (curr !== 0) {
            return prev * curr;
        }
        return prev;
    }, concatNumbers);
    //in case, multiplyingEffect exceeds max number in js "9007199254740991" i used toFixed() method
    // to get the same number as in second example
    const stringedMultiplyingEffect = multiplyingEffect.toFixed().toString();
    const controlSum = stringedMultiplyingEffect[1] + stringedMultiplyingEffect[6] + stringedMultiplyingEffect[stringedMultiplyingEffect.length - 1]
    const id = concatNumbers + controlSum;

    return {id, controlSum};
}

export const getSuggestedNumberForForm = (arrayOfNumbers: number[]): string=>{
    if (arrayOfNumbers.length === 0 || arrayOfNumbers[0] !== 1){
        return '00001';
    }
    const firstNumberWhichIsNotOneMore = arrayOfNumbers.filter((number, index)=>{
        return arrayOfNumbers[index+1] !== number+1;
    });
    const numberWithAddedZerosAndChangedToString = fillingNumberToHaveFiveDigits((firstNumberWhichIsNotOneMore[0]+1).toString());

    return numberWithAddedZerosAndChangedToString;
}

export const fillingNumberToHaveFiveDigits = (number: string): string =>{
    let changedNumber = ([number]).join('').split('');
    if (changedNumber.length === 5){
        return changedNumber.join('');
    }
    do {
        changedNumber.unshift('0');
    } while (changedNumber.length <5)

    return changedNumber.join('');
}