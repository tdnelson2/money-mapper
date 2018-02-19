export const arrayToSentence = (array:string[]):string => {

    let phrase: string = '';

    if (array.length === 1) {
      phrase = array[0];
    } else if (array.length === 2) {
      phrase = array.join(' and ');
    } else if (array.length > 2) {
      let part1 = array
                   .slice(0, array.length - 1)
                   .join(', ');
      phrase = part1 + ' and ' + array[array.length-1];
    }
    return phrase;
}