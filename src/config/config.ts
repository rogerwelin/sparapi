
export interface ConfigSpar {
    SparApiURL: string,
    KundNrLeveransMottagare: string,
    KundNrSlutkund: string,
    OrgNrSlutkund: string,
    UppdragsId: string,
    SlutAnvandarId: string,
}

export const config = () : ConfigSpar => {
  return {
    SparApiURL: process.env.SparApiURL,
    KundNrLeveransMottagare: process.env.KundNrLeveransMottagare,
    KundNrSlutkund: process.env.KundNrSlutkund,
    OrgNrSlutkund: process.env.OrgNrSlutkund,
    UppdragsId: process.env.UppdragsId,
    SlutAnvandarId: process.env.SlutAnvandarId
  }
}