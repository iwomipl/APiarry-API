export type newIdString = {
    newIdForApirary: string;
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
    const newIdForApirary = concatNumbers + controlSum;

    return {newIdForApirary, controlSum};
}