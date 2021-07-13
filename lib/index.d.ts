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
/** @param _let: { <var_1>: <$expression>, …, <var_n>: <$expression> },  */
declare type _let = string;
declare type Lookup = {
    from: String;
    localField?: String;
    foreignField?: String;
    as?: String;
};
declare type pipelineLookup = {
    from: String;
    let?: _let;
    pipeline?: any[];
    as?: String;
};
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
     * Performs a left outer join to an unsharded collection in the same database to filter in documents from the "joined" collection for processing. To each input document, the $lookup stage adds a new array field whose elements are the matching documents from the "joined" collection. The $lookup stage passes these reshaped documents to the next stage.
     * @type Lookup {from:string,localField:string,foreignField:string,as:string} from and localField are required.
     * @type pipelineLookup {from:string,let:_let,pipeline:any[],as:string} from and pipeline are required.
     * @return this stage
     */
    lookup: (arg: Lookup & pipelineLookup, options: Options) => any;
    /**
     *  @function matchSmart Stage
     * Filters the documents to pass only the documents that match the specified condition(s)
     * @type {any} arg
     * @return this stage
     */
    matchSmart: (arg: any, options: Options) => any;
    /**
     * @function match Stage
     * Filters the documents to pass only the documents that match the specified condition(s)
     * @type {*} arg
     * @return this stage
     *    */
    match: (arg: any, options: Options) => any;
    /**
     * @function addFields Stage
     * Adds new fields to documents
     * @type {*} filelds
     * @return this stage
     */
    addFields: (filelds: any, options: Options) => any;
    /**
     * @function project Stage
     * specified fields can be existing fields from the input documents or newly computed fields.
     * @type {*} projection
     * @return this stage
     */
    project: (projection: any, options: Options) => any;
    /**
     * @function limit Stage
     * Limits the number of documents passed to the next stage in the pipeline.
     * @type {number} Limit
     * @return this stage
     */
    limit: (limit: Number, options: Options) => any;
    /**
     * @function skip Stage
     *Skips over the specified number of documents that pass into the stage and passes the remaining documents to the next stage in the pipeline.
     * @type {number} skip
     * @return this stage
     */
    skip: (skip: Number, options: Options) => any;
    /**
     * @function set Stage
     * replaces the value of a field with the specified value.
     *  @type {*} field
     * @return this stage
     */
    set: (field: any, options: Options) => any;
    /**
     * @function group Stage
     * Groups input documents by the specified _id expression and for each distinct grouping, outputs a document.The _id field of each output document contains the unique group by value.
     *  @type {*} arg
     * @return this stage
     */
    group: (arg: any, options: Options) => any;
    /**
     * @function sort Stage
     * Sorts all input documents and returns them to the pipeline in sorted order.
     *  @type {number} sortOrder - [1-->Sort ascending. -1-->Sort descending].
     * @return this stage
     */
    sort: (sortOrder: number, options: Options) => any;
    /**
     * @function facet Stage
     * Processes multiple aggregation pipelines within a single stage on the same set of input documents.
     *  @type {any} arg
     * @return this stage
     */
    facet: (arg: any, options: Options) => any;
    /**
     * Concatenates strings and returns the concatenated string.
     * @method concat Operator
     *  @type {string[]} arr -  can be any valid expression as long as they resolve to strings.
     * @return This operator
     */
    concat: (arr: []) => {
        $concat: [];
    };
    /**
     * Evaluates a boolean expression to return one of the two specified return expressions.
     * @method cond Operator
     *  @type {*} IF - boolean expression
     *  @type {*} THEN - true case
     *  @type {*} ELSE - false case
     * @return this operator
     *   all three arguments are requires
     */
    cond: (IF: any, THEN: any, ELSE: any) => {
        $cond: {
            if: any;
            then: any;
            else: any;
        };
    };
    /**
     * Compares two values and returns:
     * true when the values are equivalent.
     * false when the values are not equivalent.
     *
     * @method  eq Operator
     *  @type {*} arg1 -expression1
     *  @type {*} arg2 -expression2
     * @return this operator
     */
    eq: (arg1: any, arg2: any) => {
        $eq: any[];
    };
    /**
     * Converts a date object to a string according to a user-specified format.
     * @method  dateToString Operator
     *  @type {string} date -The date to convert to string.must be a valid expression that resolves to a Date, a Timestamp, or an ObjectID.
     *  @type {*} format -Optional- The date format specification
     *  @type {string} timezone -Optional- The timezone of the operation result
     * @return this operator
     */
    dateToString: (date: String, format?: any, timezone?: String | undefined) => Res;
    /**
     * Converts a value to a specified type.
     * @method  convert Operator
     *  @type {*} input -The argument can be any valid expression.
     *  @type {string} to -{"double","string","objectId","bool","date","int","long","decimal"}
     * @return this operator
     *
     */
    convert: (input: any, to: String) => {
        $convert: {
            input: any;
            to: String;
        };
    };
    /**
     * Converts a value to an ObjectId().
     *an ObjectId for the hexadecimal string of length 24.
     * You cannot convert a string value that is not a hexadecimal string of length 24.
     * @method  toObjectId Operator
     * @type {string} arg - string of length 24.
     * @return this Operator
     */
    toObjectId: (arg: String) => {
        $toObjectId: String;
    };
    /**
     * Returns the year portion of a date.
     * @method  year Operator
     * @type {string} date -	The date to which the operator is applied { Date, a Timestamp, or an ObjectID}.
     * @type {string} timezone -Optional-The timezone of the operation result.
     * @return this Operator
     */
    year: (date: String, timezone?: String | undefined) => {
        $year: {
            date: String;
            timezone: String | undefined;
        };
    };
    /**
     * Return the week of the year for a date as a number between 0 and 53.
     * @method  week Operator
     * @type {string} date -	The date to which the operator is applied { Date, a Timestamp, or an ObjectID}.
     * @type {string} timezone -Optional-The timezone of the operation result.
     * @return this Operator
     */
    week: (date: String, timezone?: String | undefined) => {
        $week: {
            date: String;
            timezone: String | undefined;
        };
    };
    /**
     *  Return the month of a date as a number between 1 and 12
     * @method  month Operator
     * @type {string} date -	The date to which the operator is applied { Date, a Timestamp, or an ObjectID}.
     * @type {string} timezone -Optional-The timezone of the operation result.
     * @return this Operator
     */
    month: (date: String, timezone?: String | undefined) => {
        $month: {
            date: String;
            timezone: String | undefined;
        };
    };
    /**
     * Return the day of the month for a date as a number between 1 and 31.
     * @method  dayOfMonth Operator
     * @type {string} date - The date to which the operator is applied { Date, a Timestamp, or an ObjectID}.
     * @type {string} timezone -Optional-The timezone of the operation result.
     * @return this Operator
     *
     */
    dayOfMonth: (date: String, timezone?: String | undefined) => {
        $dayOfMonth: {
            date: String;
            timezone: String | undefined;
        };
    };
    /**
     * Determines if the operand is an array. Returns a boolean.
     * @method isArray Operator
     * @type {any} arg - can be any valid expression.
     * @return this Operator
     *
     */
    isArray: (arg: any) => {
        $isArray: any;
    };
    /**
     *
     * @returns
     */
    commit: () => Promise<any>;
    get: () => any;
    /**
     * @method show Operator
     * @type {Number|null} d
     * @returns console.dir(this.aggs,{depth:depth|null})
     */
    show: (d: Number) => any;
    alones: any;
    alone: (key: any) => boolean;
    only: (key: String) => boolean;
    isIf: Boolean;
    if: (condition: any, options: Options) => void;
    /**
     * @method addToSet Operator
     * Returns an array of all unique values that results from applying an expression to each document in a group of documents that share the same group by key
     *$addToSet is only available in the $group stage.
     * @type {*} key
     * @returns this operator
     */
    addToSet: (key: any) => {
        $addToSet: any;
    };
    /**
     * @method avg Operator
     * Returns the average value of the numeric values. $avg ignores non-numeric values.
     * @type {*} key
     * @returns this operator
     */
    avg: (key: any) => {
        $avg: any;
    };
    /**
     * @method first Operator
     * Returns the first element in an array.
     * @type {string} key
     * @returns this operator
     */
    first: (key: string) => {
        $first: string;
    };
    /**
     * @method last Operator
     * Returns the last element in an array.
     * @type {string} key
     * @returns this operator
     */
    last: (key: string) => {
        $last: string;
    };
    /**
     * @method max Operator
     * Returns the maximum value
     * @type {string} key
     * @returns this operator
     */
    max: (key: string) => {
        $max: string;
    };
    /**
     * @method min Operator
     * Returns the minimum value
     * @type {string} key
     * @returns this operator
     */
    min: (key: string) => {
        $min: string;
    };
    /**
     * @method push Operator
     *The $push operator appends a specified value to an array.
     *If the field is not an array, the operation will fail.
     * @type {*} data
     * @returns this operator
     */
    push: (data: any) => {
        $push: any;
    };
    /**
     * @method sum Operator
     * Calculates and returns the sum of numeric values. $sum ignores non-numeric values.
     * @type {string|1| any[]} data
     * @returns this operator
     */
    sum: (data: string | 1 | any[]) => {
        $sum: string | any[] | 1;
    };
    /**
     * @method multiply Operator
     * Multiplies numbers together and returns the result. Pass the arguments to $multiply in an array.
     * @type {string|number} key1
     * @type {string|number} key2
     * @returns this operator
     */
    multiply: (key1: string | number, key2: string | number) => {
        $multiply: (string | number)[];
    };
    /**
     * @method in Operator
     * Returns a boolean indicating whether a specified value is in an array.
     * @type {any[]} key
     * @returns this operator
     */
    in: (key: any[]) => {
        $in: any[];
    };
    /**
     * @method size Operator
     * Counts and returns the total number of items in an array.
     * @type {string} ke
     *y
     * @returns this operator
     */
    size: (key: string) => {
        $size: string;
    };
    /**
     * @method mergeObjects Operator
     * Combines multiple documents into a single document.
     * @type {string|any[]} key
     * @returns this operator
     */
    mergeObjects: (key: string | any[]) => {
        $mergeObjects: string | any[];
    };
    /**
     * @method concatArrays Operator
     * Concatenates arrays to return the concatenated array.
     * @type {any[]} arr1
     * @type {any[]} arr2 ,
     * @returns this operator
     */
    concatArrays: (arr1: any[], arr2: any[]) => {
        $concatArrays: any[][];
    };
}
export {};
