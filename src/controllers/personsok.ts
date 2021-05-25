import axios from 'axios';
import fs from 'fs';
import https from 'https';
import { transformXML, validatePersonalid, getCurrentTimestamp, validSparID } from './utils/util';
import Logger from '../logger/logger';
import { config, ConfigSpar } from '../config/config';

const transport = new https.Agent({
  cert: fs.readFileSync("./tls/privat.crt"),
  key: fs.readFileSync("./tls/privat.key"),
});

export const personFraga = async (sid: string) => {

  const sparConf = config();

  const isValidSid = validatePersonalid(sid)
  if (!isValidSid) {
    throw new Error(`${sid} is not a valid swedish id`)
  }

  // if not 12 characters we need to add the first to YY as SparAPI expects this
  if (sid.length !== 12) {
    sid = validSparID(sid)
  }

  const timestamp = getCurrentTimestamp()
  const soapPayload = soapData(sid, timestamp, sparConf)

  try {
    const response = await axios.post(sparConf.SparApiURL, soapPayload, {
      headers: {
        "Content-Type": "text/xml",
      },
      httpsAgent: transport,
  })
  const result = response.data;

  try {
    const transformedResp = transformXML(result);
    const obj = JSON.parse(transformedResp)["S:Envelope"]["S:Body"];
    delete obj.SPARPersonsokningSvar._attributes;
    return obj
  } catch (err) {
    Logger.error('could not parse response')
    throw new Error('could not parse object')
  }

  } catch (err) {
    if (err && err.response) {
      Logger.error(err.response.data)
      throw new Error(err.response.statusText)
    }
    Logger.error(`Failed establish connection to SparAPI: ${err}`);
    throw new Error('Error while trying to establish connection to SparAPI');
  }
};


const soapData = (sid : string, date : string, conf : ConfigSpar) : string => {
  return `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
  <Header />
  <Body>
    <SPARPersonsokningFraga xmlns="http://statenspersonadressregister.se/schema/komponent/sok/personsokningsfraga-1.0"
      xmlns:id="http://statenspersonadressregister.se/schema/komponent/sok/identifieringsinformation-1.0"
      xmlns:sok="http://statenspersonadressregister.se/schema/komponent/sok/personsokningsokparametrar-1.0"
      xmlns:argument="http://statenspersonadressregister.se/schema/komponent/sok/sokargument-1.1"
      xmlns:person="http://statenspersonadressregister.se/schema/komponent/person/person-1.1">
      <id:IdentifieringsInformation>
        <id:KundNrLeveransMottagare>${conf.KundNrLeveransMottagare}</id:KundNrLeveransMottagare>
        <id:KundNrSlutkund>${conf.KundNrSlutkund}</id:KundNrSlutkund>
        <id:OrgNrSlutkund>${conf.OrgNrSlutkund}</id:OrgNrSlutkund>
        <id:UppdragsId>${conf.UppdragsId}</id:UppdragsId>
        <id:SlutAnvandarId>${conf.SlutAnvandarId}</id:SlutAnvandarId>
        <id:Tidsstampel>${date}</id:Tidsstampel>
      </id:IdentifieringsInformation>
      <sok:PersonsokningFraga>
        <argument:PersonId>
          <person:FysiskPersonId>${sid}</person:FysiskPersonId>
        </argument:PersonId>
      </sok:PersonsokningFraga>
    </SPARPersonsokningFraga>
  </Body>
  </Envelope>`
}