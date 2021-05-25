import convert from 'xml-js';
import moment from 'moment';
import Logger from '../../logger/logger';

export const getCurrentTimestamp = () : string => {
  return moment().format('YYYY-MM-DDTHH:mm:ss.SSS')
}

export const transformXML = (result: any): any => {
  const xmlToJson = convert.xml2json(result, {compact: true, spaces: 4});
  // remove ns:
  const transformed = xmlToJson.replace(new RegExp(/ns\d{1,2}:/g), "")
  return transformed
}

export const validatePersonalid = (sid: string) : boolean => {
  // Return true when the string passed in is a valid sid format
  // and the sid passes the Luhn algorithm test

  // regex should cover if personalid is in correct length, century and format
  if (/^(19|20)?(\d{6}([-])\d{4}|(?!19|20)\d{10})/.test(sid)) {
      Logger.info(`${sid} passes regex check`)
  } else {
      Logger.warn(`${sid} did not pass regex check`)
      return false
  }

  const luhn = checkLuhn(sid);

  if (!luhn) {
      Logger.warn(`${sid} did not pass the luhn test`)
  } else {
      Logger.info(`${sid} did pass the luhn test`)
  }

  return luhn;
}

// https://sv.m.wikipedia.org/wiki/Luhn-algoritmen#Kontroll_av_nummer
// - + are removed and if 12 digits remove the first 2 - only keep ÅÅMMDDNNNC
const checkLuhn = (sid: string) : boolean => {

  sid = sid.replace(/\D/g, "");
  if (sid.length === 12) {
      sid = sid.substr(2)
  }

  let nCheck = 0;
  let bEven = false;

  for (let n = sid.length - 1; n >= 0; n--) {
    const cDigit = sid.charAt(n)
    let nDigit = parseInt(cDigit, 10);

    if (bEven && (nDigit *= 2) > 9) {
      nDigit -= 9;
    }

    nCheck += nDigit;
    bEven = !bEven;
  }

  return (nCheck % 10) === 0;
}

// SparAPI 2019.1 only takes format YYYYMMDDNNNC
// this service also supports YYMMDD-NNNC & YYMMDDNNNC
// so we'll need to convert this to valid SparAPI format
export const validSparID = (sid: string) : string => {
  if (sid.includes("-")) {
    sid = sid.replace(/-/, "")
  }

  const year = sid.substring(0,2)
  const currentYear = moment().format('YY')

  if ( parseInt(year, 10) <= parseInt(currentYear, 10) ) {
    return `20${sid}`
  } else {
    return `19${sid}`
  }

}