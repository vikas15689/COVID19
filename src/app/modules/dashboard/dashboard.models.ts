export class Summary {

    Global: Global = new Global();
    Countries: Country[];
    Date: string;


}
export class Global {
    NewConfirmed = 0;
    TotalConfirmed = 0;
    NewDeaths = 0;
    TotalDeaths = 0;
    NewRecovered = 0;
    TotalRecovered = 0;
}

export class Country {
    Country: string;
    CountryCode: string;
    Slug: string;
    NewConfirmed: number;
    TotalConfirmed: number;
    NewDeaths: number;
    TotalDeaths: number;
    NewRecovered: number;
    TotalRecovered: number;
    Date: string;
}

export class CountryCount {
    name: string;
    value: number;
    code: string;
    slug:string;

    constructor(code, name, value,slug) {
        this.name = name;
        this.value = value;
        this.code = code;
        this.slug=slug;

    }
}