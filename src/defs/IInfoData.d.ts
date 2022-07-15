// To parse this data:
//
//   import { Convert, Welcome } from "./file";
//
//   const welcome = Convert.toWelcome(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface IInfoData {
    id?: string;
    name?: string;
    symbol?: string;
    rank?: number;
    is_new?: boolean;
    is_active?: boolean;
    type?: string;
    tags?: Tag[];
    team?: Team[];
    description?: string;
    message?: string;
    open_source?: boolean;
    started_at?: Date;
    development_status?: string;
    hardware_wallet?: boolean;
    proof_type?: string;
    org_structure?: string;
    hash_algorithm?: string;
    links?: Links;
    links_extended?: LinksExtended[];
    whitepaper?: Whitepaper;
    first_data_at?: Date;
    last_data_at?: Date;
}

export interface Links {
    explorer?: string[];
    facebook?: string[];
    reddit?: string[];
    source_code?: string[];
    website?: string[];
    youtube?: string[];
}

export interface LinksExtended {
    url?: string;
    type?: string;
    stats?: Stats;
}

export interface Stats {
    subscribers?: number;
    contributors?: number;
    stars?: number;
    followers?: number;
}

export interface Tag {
    id?: string;
    name?: string;
    coin_counter?: number;
    ico_counter?: number;
}

export interface Team {
    id?: string;
    name?: string;
    position?: string;
}

export interface Whitepaper {
    link?: string;
    thumbnail?: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toIInfoData(json: string): Welcome {
        return cast(JSON.parse(json), r("Welcome"));
    }

    public static welcomeToJson(value: Welcome): string {
        return JSON.stringify(uncast(value, r("Welcome")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ""): never {
    if (key) {
        throw Error(
            `Invalid value for key "${key}". Expected type ${JSON.stringify(
                typ
            )} but got ${JSON.stringify(val)}`
        );
    }
    throw Error(
        `Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`
    );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach(
            (p: any) => (map[p.json] = { key: p.js, typ: p.typ })
        );
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach(
            (p: any) => (map[p.js] = { key: p.json, typ: p.typ })
        );
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ""): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map((el) => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(
        props: { [k: string]: any },
        additional: any,
        val: any
    ): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach((key) => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key)
                ? val[key]
                : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers")
            ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")
            ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")
            ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    Welcome: o(
        [
            { json: "id", js: "id", typ: u(undefined, "") },
            { json: "name", js: "name", typ: u(undefined, "") },
            { json: "symbol", js: "symbol", typ: u(undefined, "") },
            { json: "rank", js: "rank", typ: u(undefined, 0) },
            { json: "is_new", js: "is_new", typ: u(undefined, true) },
            { json: "is_active", js: "is_active", typ: u(undefined, true) },
            { json: "type", js: "type", typ: u(undefined, "") },
            { json: "tags", js: "tags", typ: u(undefined, a(r("Tag"))) },
            { json: "team", js: "team", typ: u(undefined, a(r("Team"))) },
            { json: "description", js: "description", typ: u(undefined, "") },
            { json: "message", js: "message", typ: u(undefined, "") },
            { json: "open_source", js: "open_source", typ: u(undefined, true) },
            { json: "started_at", js: "started_at", typ: u(undefined, Date) },
            {
                json: "development_status",
                js: "development_status",
                typ: u(undefined, ""),
            },
            {
                json: "hardware_wallet",
                js: "hardware_wallet",
                typ: u(undefined, true),
            },
            { json: "proof_type", js: "proof_type", typ: u(undefined, "") },
            {
                json: "org_structure",
                js: "org_structure",
                typ: u(undefined, ""),
            },
            {
                json: "hash_algorithm",
                js: "hash_algorithm",
                typ: u(undefined, ""),
            },
            { json: "links", js: "links", typ: u(undefined, r("Links")) },
            {
                json: "links_extended",
                js: "links_extended",
                typ: u(undefined, a(r("LinksExtended"))),
            },
            {
                json: "whitepaper",
                js: "whitepaper",
                typ: u(undefined, r("Whitepaper")),
            },
            {
                json: "first_data_at",
                js: "first_data_at",
                typ: u(undefined, Date),
            },
            {
                json: "last_data_at",
                js: "last_data_at",
                typ: u(undefined, Date),
            },
        ],
        false
    ),
    Links: o(
        [
            { json: "explorer", js: "explorer", typ: u(undefined, a("")) },
            { json: "facebook", js: "facebook", typ: u(undefined, a("")) },
            { json: "reddit", js: "reddit", typ: u(undefined, a("")) },
            {
                json: "source_code",
                js: "source_code",
                typ: u(undefined, a("")),
            },
            { json: "website", js: "website", typ: u(undefined, a("")) },
            { json: "youtube", js: "youtube", typ: u(undefined, a("")) },
        ],
        false
    ),
    LinksExtended: o(
        [
            { json: "url", js: "url", typ: u(undefined, "") },
            { json: "type", js: "type", typ: u(undefined, "") },
            { json: "stats", js: "stats", typ: u(undefined, r("Stats")) },
        ],
        false
    ),
    Stats: o(
        [
            { json: "subscribers", js: "subscribers", typ: u(undefined, 0) },
            { json: "contributors", js: "contributors", typ: u(undefined, 0) },
            { json: "stars", js: "stars", typ: u(undefined, 0) },
            { json: "followers", js: "followers", typ: u(undefined, 0) },
        ],
        false
    ),
    Tag: o(
        [
            { json: "id", js: "id", typ: u(undefined, "") },
            { json: "name", js: "name", typ: u(undefined, "") },
            { json: "coin_counter", js: "coin_counter", typ: u(undefined, 0) },
            { json: "ico_counter", js: "ico_counter", typ: u(undefined, 0) },
        ],
        false
    ),
    Team: o(
        [
            { json: "id", js: "id", typ: u(undefined, "") },
            { json: "name", js: "name", typ: u(undefined, "") },
            { json: "position", js: "position", typ: u(undefined, "") },
        ],
        false
    ),
    Whitepaper: o(
        [
            { json: "link", js: "link", typ: u(undefined, "") },
            { json: "thumbnail", js: "thumbnail", typ: u(undefined, "") },
        ],
        false
    ),
};
