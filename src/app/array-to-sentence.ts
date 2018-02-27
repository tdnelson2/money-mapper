export const arrayToSentence = (array:string[]):string => {
  if (array.length <= 2) {
    return array.join(' and ');
  } else if (array.length > 2) {
    return array
            .slice(0, array.length - 1)
            .join(', ')
            + ' and ' + array[array.length-1];
  }
}