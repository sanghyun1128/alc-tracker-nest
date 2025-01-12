export enum WineCategoryEnum {
  RED = 'red',
  WHITE = 'white',
  ROSE = 'rose',
  SPARKLING = 'sparkling',
  DESSERT = 'dessert',
  NATURAL = 'natural',
  OTHER = 'other',
}

export enum GrapeVarietyEnum {
  CABERNET_SAUVIGNON = 'cabernet_sauvignon',
  MERLOT = 'merlot',
  PINOT_NOIR = 'pinot_noir',
  SYRAH = 'syrah',
  GRENACHE = 'grenache',
  SANGIOVESE = 'sangiovese',
  NEBBIOLO = 'nebbiolo',
  TEMPRANILLO = 'tempranillo',
  ZINFANDEL = 'zinfandel',
  MALBEC = 'malbec',
  SHIRAZ = 'shiraz',
  CHARDONNAY = 'chardonnay',
  SAUVIGNON_BLANC = 'sauvignon_blanc',
  RIESLING = 'riesling',
  PINOT_GRIS = 'pinot_gris',
  CHENIN_BLANC = 'chenin_blanc',
  SEMILLON = 'semillon',
  VIOGNIER = 'viognier',
  MUSCAT = 'muscat',
  OTHER = 'other',
}

export enum WineRegionEnum {
  FRANCE = 'france',
  ITALY = 'italy',
  SPAIN = 'spain',
  GERMANY = 'germany',
  PORTUGAL = 'portugal',
  AUSTRIA = 'austria',
  USA = 'usa',
  ARGENTINA = 'argentina',
  CHILE = 'chile',
  AUSTRALIA = 'australia',
  NEW_ZEALAND = 'new_zealand',
  SOUTH_AFRICA = 'south_africa',
  OTHER = 'other',
}

export enum FranceAppellationEnum {
  BORDEAUX = 'bordeaux',
  BURGUNDY = 'burgundy',
  CHAMPAGNE = 'champagne',
  ALSACE = 'alsace',
  LOIRE = 'loire',
  RHONE = 'rhone',
  PROVENCE = 'provence',
  SAUTERNES = 'sauternes',
  OTHER = 'other',
}

export enum ItalyAppellationEnum {
  BAROLO = 'barolo',
  BARBARESCO = 'barbaresco',
  CHIANTI = 'chianti',
  AMARONE = 'amarone',
  BRUNELLO = 'brunello',
  PROSECCO = 'prosecco',
  OTHER = 'other',
}

export enum SpainAppellationEnum {
  RIOJA = 'rioja',
  RIBERA_DEL_DUERO = 'ribera_del_duero',
  PRIORAT = 'priorat',
  CAVA = 'cava',
  SHERRY = 'sherry',
  OTHER = 'other',
}

export enum GermanyAppellationEnum {
  MOSEL = 'mosel',
  RHEINGAU = 'rheingau',
  OTHER = 'other',
}

export enum PortugalAppellationEnum {
  PORTO = 'porto',
  MADEIRA = 'madeira',
  DOURO = 'douro',
  OTHER = 'other',
}

export enum AustriaAppellationEnum {
  WACHAU = 'wachau',
  BURGENLAND = 'burgenland',
  KAMPTAL = 'kamptal',
  KREMSTAL = 'kremstal',
  OTHER = 'other',
}

export enum UsaAppellationEnum {
  NAPA_VALLEY = 'napa_valley',
  SONOMA = 'sonoma',
  OREGON = 'oregon',
  OTHER = 'other',
}

export enum ArgentinaAppellationEnum {
  MENDOZA = 'mendoza',
  SALTA = 'salta',
  OTHER = 'other',
}

export enum ChileAppellationEnum {
  ACONCAGUA = 'aconcagua',
  CASABLANCA = 'casablanca',
  COLCHAGUA = 'colchagua',
  OTHER = 'other',
}

export enum AustraliaAppellationEnum {
  BAROSSA_VALLEY = 'barossa_valley',
  MCLAREN_VALE = 'mclaren_vale',
  YARRA_VALLEY = 'yarra_valley',
  OTHER = 'other',
}

export enum NewZealandAppellationEnum {
  MARLBOROUGH = 'marlborough',
  CENTRAL_OTAGO = 'central_otago',
  OTHER = 'other',
}

export enum SouthAfricaAppellationEnum {
  STELLENBOSCH = 'stellenbosch',
  SWARTLAND = 'swartland',
  OTHER = 'other',
}

export enum OtherAppellationEnum {
  TOKAJI = 'tokaji',
  OTHER = 'other',
}

export const CombinedAppellationEnum = {
  ...FranceAppellationEnum,
  ...ItalyAppellationEnum,
  ...SpainAppellationEnum,
  ...GermanyAppellationEnum,
  ...PortugalAppellationEnum,
  ...AustriaAppellationEnum,
  ...UsaAppellationEnum,
  ...ArgentinaAppellationEnum,
  ...ChileAppellationEnum,
  ...AustraliaAppellationEnum,
  ...NewZealandAppellationEnum,
  ...SouthAfricaAppellationEnum,
  ...OtherAppellationEnum,
} as const;

export type CombinedAppellationType = (typeof CombinedAppellationEnum)[keyof typeof CombinedAppellationEnum];
