interface AggregationOptions {
    allowDiskUse: Boolean;
    serializeFunctions: Boolean;
}
interface Options {
    and: Boolean;
    or: Boolean;
    smart: Boolean;
    only: Boolean;
    alone: String;
    preserveNullAndEmptyArrays: Boolean;
    unwind: Boolean;
}
interface Lookup {
    from: String;
    localField: String;
    foreignField?: String;
    as?: String;
}
interface Res {
    date: String;
    format: any;
    timezone?: String;
}
export declare class AggregationBuilder {
    opts: AggregationOptions;
    model: any;
    aggs: any[];
    option: (options: AggregationOptions) => void;
    constructor(model: any);
    /**
     * @function lookup Stage
     * @param arg object {from,localField,foreignField,as} from and localField are required.
     */
    lookup: (arg: Lookup, options: Options) => any;
    matchSmart: (arg: any, options: Options) => any;
    match: (arg: any, options: Options) => any;
    addFields: (filelds: any, options: Options) => any;
    project: (projection: any, options: Options) => any;
    limit: (limit: Number, options: Options) => any;
    concat: (arr: []) => {
        $concat: [];
    };
    cond: (IF: any, THEN: any, ELSE: any) => {
        $cond: {
            if: any;
            then: any;
            else: any;
        };
    };
    /**
     * @method  eq Operator
     */
    eq: (arg1: any, arg2: any) => {
        $eq: any[];
    };
    dateToString: (date: String, format: any, timezone?: String | undefined) => Res;
    convert: (input: String, to: String) => {
        $convert: {
            input: String;
            to: String;
        };
    };
    toObjectId: (arg: String) => {
        $toObjectId: String;
    };
    year: (date: String, timezone?: String | undefined) => {
        $year: {
            date: String;
            timezone: String | undefined;
        };
    };
    week: (date: String, timezone?: String | undefined) => {
        $week: {
            date: String;
            timezone: String | undefined;
        };
    };
    month: (date: String, timezone?: String | undefined) => {
        $month: {
            date: String;
            timezone: String | undefined;
        };
    };
    dayOfMonth: (date: String, timezone?: String | undefined) => {
        $dayOfMonth: {
            date: String;
            timezone: String | undefined;
        };
    };
    isArray: (arg: any) => {
        $isArray: any;
    };
    commit: () => Promise<any>;
    get: () => any;
    show: (d: Number) => any;
    alones: any;
    alone: (key: any) => boolean;
    only: (key: String) => boolean;
    isIf: Boolean;
    if: (condition: any, options: Options) => void;
}
export {};
