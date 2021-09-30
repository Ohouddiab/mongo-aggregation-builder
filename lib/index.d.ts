interface AggregationOptions {
    /**
     * allowDiskUse() allows MongoDB to use temporary files on disk to store data exceeding the 100 megabyte
     * system memory limit while processing a blocking sort operation. If MongoDB requires using more than 100
     * megabytes of system memory for the blocking sort operation, MongoDB returns an error unless the query
     * specifies cursor.allowDiskUse().
     * @type {Boolean} allowDiskUse
     */
    allowDiskUse: Boolean;
    /**
     * Specifies whether to serialize functions on any object passed to the server
     * @type {Boolean} serializeFunctions
     */
    serializeFunctions: Boolean;
}
interface Options {
    and?: boolean;
    or?: boolean;
    smart?: boolean;
    only?: string;
    notOnly?: string;
    alone?: string;
    preserveNullAndEmptyArrays?: boolean;
    unwind?: boolean;
    checkLookup?: string[];
}
interface Lookup {
    /**
     * @type  {String}  from - "required", collection to join,
     */
    from: String;
    /**
     * @type  {String}  localField - field from the input documents,
     */
    localField?: String;
    /**
     * @type  {String}  foreignField - field from the documents of the "from" collection,
     */
    foreignField?: String;
    /**
     * @type  {any} let - Optional. Specifies the variables to use in the pipeline stages.
     * @example { <var_1>: <$expression>, …, <var_n>: <$expression> },  */
    let?: any;
    /**
     * @type  {any} pipeline - [ pipeline to run on joined collection ],
     */
    pipeline?: any[];
    /**
     * @type  {String}  as - Optional. output array field.
     */
    as?: String;
}
interface Res {
    /**
     *  @type {string} date -The date to convert to string.must be a valid expression that resolves to a Date, a Timestamp, or an ObjectID.
     */
    date: String | any;
    /**
     *  @type {*} format -Optional- The date format specification
     */
    format: any;
    /**
     *  @type {string} timezone -Optional- The timezone of the operation result   */
    timezone?: String;
}
interface Convert {
    input: any;
    to: String;
}
interface Facet {
    /**
  * @example
  *  {
      <outputField1>: [ <stage1>, <stage2>, ... ],
      <outputField2>: [ <stage1>, <stage2>, ... ],
      ...
   }
  */
    [propName: string]: any[];
}
interface AddFields {
    /**
     * @example
     * { <newField>: <expression>, ... }
     */
    [propName: string]: string | any;
}
interface Set {
    /**
     * @example
     * { <field1>: <value1>, ... }
     */
    [propName: string]: string | any;
}
interface Project {
    /**
     * @example
     *  {"<field1>": 0, "<field2>": 0, ... }
     */
    [propName: string]: number | string | any;
}
interface Match {
    /**
     * @example
     * { $expr: { <aggregation expression> } }
     */
    [propName: string]: any;
}
interface Group {
    /**
  * @type {string|null|any} _id
  * @example
  *   {
      _id: <expression>, // Group By Expression
      <field1>: { <accumulator1> : <expression1> },
      ...
    }
  */
    _id?: string | null | any;
    [propName: string]: any;
}
interface Accumulator {
    /**
     * @type  {any} init - Function used to initialize the state.
     * @example
     * function (<initArg1>, <initArg2>, ...) {
     *...
     * return <initialState>}
     */
    init: any;
    /**
     * @type {any[]} initArgs - Optional. Arguments passed to the init function.
     */
    initArgs?: any[];
    /**
     * @type {any}  accumulate - Function used to accumulate documents.
     * @example
     *  function(state, <accumArg1>, <accumArg2>, ...) {
     * ...
   * return <newState>
  }
     */
    accumulate: any;
    /**
     * @type {any}  accumulateArgs - Arguments passed to the accumulate function
     */
    accumulateArgs: string[];
    /**
     * @type {String |any}  merge - Function used to merge two internal states.
     */
    merge: string | any;
    /**
     * @type {String | any} finalize - Optional. Function used to update the result of the accumulation.
     */
    finalize?: string | any;
    /**
     * @type {String} lang - The language used in the $accumulator code.
     */
    lang: string;
}
interface Unwind {
    /**
     * @type {string} path - field path;
     */
    path: string;
    /**
     * @type {string} includeArrayIndex - Optional.
     * The name of a new field to hold the array index of the element.;
     */
    includeArrayIndex?: string;
    /**
     * @type {boolean} preserveNullAndEmptyArrays- Optional.
     * If true, if the path is null, missing, or an empty array, $unwind outputs the document.
     * If false, if path is null, missing, or an empty array, $unwind does not output a document.
     * The default value is false.;
     */
    preserveNullAndEmptyArrays?: boolean;
}
interface Reduce {
    /**
     * @type {any[]|string} input - Can be any valid expression that resolves to an array.
     */
    input: any[] | string;
    /**
     * @type {any} initialValue - The initial cumulative value set before in is applied to the first element of the input array.
     */
    initialValue: any;
    /**
     * @type {any} in - A valid expression that $reduce applies to each element in the input array in left-to-right order.
     */
    in: any;
}
interface Filter {
    /**
     * @type {string|any[]} input - An expression that resolves to an array.
     */
    input: string | any[];
    /**
     * @type {string} as - Optional. A name for the variable that represents each individual element of the input array
     */
    as?: String;
    /**
     * @type {any} cond - An expression that resolves to a boolean value used to determine if an element should be included in the output array.
     */
    cond: any;
}
interface Sort {
    /**
     * @example
     *   { $sort: { <field1>: <sort order>, <field2>: <sort order> ... } }
     */
    [propName: string]: Number;
}
interface amendGroupOptions extends Options {
    applyLookup?: boolean;
    lookupOptions?: Options;
}
interface reduceAndConcatOptions extends Options {
    withCondition?: boolean;
}
export default class AggregationBuilder {
    opts: AggregationOptions;
    model: any;
    aggs: any[];
    option: (options: AggregationOptions) => void;
    constructor(model?: any);
    openStage: (suffix: string, options?: Options) => boolean;
    closeStage: (stage: any, options?: Options) => void;
    /**
     * @method lookup Stage
     * Performs a left outer join to an unsharded collection in the same database to filter in documents from the "joined" collection for processing.
     * To each input document, the $lookup stage adds a new array field whose elements are the matching documents from the "joined" collection. The $lookup stage passes these reshaped documents to the next stage.
     * @type {Lookup } - arg
     * @type {string} Lookup.from - collection to join.
     * @type {String} Lookup.localField - Optional. field from the input documents.
     * @type {String} Lookup.foreignField - Optional. field from the documents of the "from" collection,
     * @type {_let} Lookup.let - Optional. Specifies variables to use in the pipeline stages
     * @type {any} Lookup.pipeline - Optional. [ pipeline to run on joined collection ],
     * @type {String} Lookup.as - Optional. output array field
     * @return this stage
     */
    lookup: (arg: Lookup, options?: Options) => AggregationBuilder;
    /**
     *  @method unwind Stage
     * Filters the documents to pass only the documents that match the specified condition(s)Deconstructs an array field from the input documents to output a document for each element. Each output document is the input document with the value of the array field replaced by the element.
     * @type {Unwind} - arg,
     * @type  {string} path - field path;
     * @type {string} includeArrayIndex - Optional. The name of a new field to hold the array index of the element;
     * @type {boolean} preserveNullAndEmptyArrays- Optional. If true, if the path is null, missing, or an empty array, $unwind outputs the document.
    If false, if path is null, missing, or an empty array, $unwind does not output a document. The default value is false.;
     * @return this stage
     */
    unwind: (arg: Unwind, options?: Options) => AggregationBuilder;
    /**
     *  @method matchSmart Stage
     * Filters the documents to pass only the documents that match the specified condition(s)
     * @type {[propName: string]: any} - arg
     * @return this stage
     */
    matchSmart: (arg: Match, options?: Options) => AggregationBuilder;
    /**
     * @method match Stage
     * Filters the documents to pass only the documents that match the specified condition(s)
     * @type {[propName: string]: any} - arg
     * @return this stage
     *    */
    match: (arg: Match, options?: Options) => AggregationBuilder;
    /**
     * @method addFields Stage
     * Adds new fields to documents
     * @type {[propName: string]: string | any} - fields,
     * @return this stage
     */
    addFields: (fields: AddFields, options?: Options) => AggregationBuilder;
    /**
     * @method project Stage
     * specified fields can be existing fields from the input documents or newly computed fields.
     * @type {[propName: string]: number | string | any} - projection
     * @return this stage
     */
    project: (projection: Project, options?: Options) => AggregationBuilder;
    amendProject: (projection: Project, options?: Options) => AggregationBuilder;
    /**
     * @method limit Stage
     * Limits the number of documents passed to the next stage in the pipeline.
     * @type {Number} - Limit
     * @return this stage
     */
    limit: (limit: Number, options?: Options) => AggregationBuilder;
    /**
     * @method skip Stage
     *Skips over the specified number of documents that pass into the stage and passes the remaining documents to the next stage in the pipeline.
     * @type {Number} - skip
     * @return this stage
     */
    skip: (skip: Number, options?: Options) => AggregationBuilder;
    /**
     * @method set Stage
     * replaces the value of a field with the specified value.
     *  @type {[propName: string]: string | any} - field
     * @return this stage
     */
    set: (field: Set, options?: Options) => AggregationBuilder;
    /**
     * @method group Stage
     * Groups input documents by the specified _id expression and for each distinct grouping, outputs a document.The _id field of each output document contains the unique group by value.
     * @type {Group} - arg
     * @type { _id: string | null | any} - Group._id;
     * @type {[propName: string]: any} - Group.propName
     * @return this stage
     */
    group: (id: any, arg: Group, options?: Options) => AggregationBuilder;
    /**
     * @method amendGroup Stage
     * *****
     * @type {Group} - arg
     * @type { _id: string | null | any} - Group._id;
     * @type {[propName: string]: any} - Group.propName
     * @return this stage
     */
    amendGroup: (id: any, arg: Group, lookup_arg?: Lookup, options?: amendGroupOptions) => AggregationBuilder;
    /**
     * @method sort Stage
     * Sorts all input documents and returns them to the pipeline in sorted order.
     *  @type {Sort} - sortOrder
     * [1-->Sort ascending; -1-->Sort descending].
     * @see Sort
     * @return this stage
     */
    sort: (sortOrder: Sort, options?: Options) => AggregationBuilder;
    /**
     * @method facet Stage
     * Processes multiple aggregation pipelines within a single stage on the same set of input documents.
     * @type {[propName: string]: any[]} - arg
     * @return this stage
     */
    facet: (arg: Facet, options?: Options) => AggregationBuilder;
    isFacet: boolean;
    currentFacetKey: string | undefined;
    startFacet: (stage_name: string, options?: Options) => AggregationBuilder;
    endFacet: (options?: Options) => AggregationBuilder;
    /**
     * @method replaceRoot Stage
     * Replaces the input document with the specified document.
     *  @type {Any} - newRoot
     * @return this stage
     */
    replaceRoot: (key: string | any, options?: Options) => AggregationBuilder;
    /**
     * @method  dateFromString   Operator
     * Converts a date/time string to a date object.
     * @type { String | Any} - dateString : The date/time string to convert to a date object.
     * @type {String | Any} - format : Optional. The date format specification of the dateString
     * @type {String | Any} - timezone : 	Optional. The time zone to use to format the date.
     * @type {String | Any} - onError : Optional. If $dateFromString encounters an error while parsing the given dateString
     * @type {String | Any} - onNull :Optional. If the dateString provided to $dateFromString is null or missing,
     * @returns this stage
     */
    dateFromString: (dateString: String | any, format?: String | any, timezone?: string | any, onNull?: string | any, options?: Options | undefined) => {
        $dateFromString: {
            dateString: string | any;
            format?: string | undefined;
            timezone?: string | undefined;
            onNull?: string | undefined;
        };
    };
    /**
     * @method reduceAndConcat Stage
     * Replaces the input document with the specified document.
     *  @type {Any} - newRoot
     * @return this stage
     */
    reduceAndConcat: (input: string, initialValue: any, key?: string, condition?: any, options?: reduceAndConcatOptions) => any;
    /**
     * Concatenates strings and returns the concatenated string.
     * @method concat Operator
     *  @type { any[] } - arr
     *  can be any valid expression as long as they resolve to strings.
     * @return This operator
     */
    concat: (arr: any[]) => {
        $concat: any[];
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
     * Compares two values and returns:
     * true when the values are not equivalent.
     * false when the values are equivalent.
     * @method  ne Operator
     *  @type {*} arg1 -expression1
     *  @type {*} arg2 -expression2
     * @return this operator
     */
    ne: (arg1: any, arg2: any) => {
        $ne: any[];
    };
    /**
     * Converts a date object to a string according to a user-specified format.
     * @method  dateToString Operator
     *  @type {string} date -The date to convert to string.must be a valid expression that resolves to a Date, a Timestamp, or an ObjectID.
     *  @type {*} format -Optional- The date format specification
     *  @type {string} timezone -Optional- The timezone of the operation result
     * @return this operator
     */
    dateToString: (date: String | any, format?: any, timezone?: String | undefined) => {
        $dateToString: Res;
    };
    /**
     * Converts a value to a specified type.
     * @method  convert Operator
     *  @type {*} input -The argument can be any valid expression.
     *  @type {string} to -{"double","string","objectId","bool","date","int","long","decimal"}
     * @return this operator
     *
     */
    convert: (input: any, to: String) => {
        $convert: Convert;
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
     * @type {Number|null} - d
     * @returns console.dir(this.aggs,{depth:depth|null})
     */
    show: (d?: Number | undefined) => any;
    /**
     * @method alone Operator
     * @type {String} - key
     * @returns Boolean
     */
    alones: any;
    alone: (key: string) => boolean;
    /**
     * @method only Operator
     * @type {String} - key
     * @returns Boolean
     */
    only: (key: String) => boolean;
    notOnly: (key: String) => Boolean;
    isIf: Boolean;
    if: (condition: any, options?: Options) => AggregationBuilder;
    /**
     * @method addToSet Operator
     * Returns an array of all unique values that results from applying an expression to each document in a group of documents that share the same group by key
     *$addToSet is only available in the $group stage.
     * @type {*} - key
     * @returns this operator
     */
    addToSet: (key: any) => {
        $addToSet: any;
    };
    /**
     * @method avg Operator
     * Returns the average value of the numeric values. $avg ignores non-numeric values.
     * @type {*} - key
     * @returns this operator
     */
    avg: (key: any) => {
        $avg: any;
    };
    /**
     * @method first Operator
     * Returns the first element in an array.
     * @type {string} - key
     * @returns this operator
     */
    first: (key: string) => {
        $first: string;
    };
    /**
     * @method last Operator
     * Returns the last element in an array.
     * @type {string} - key
     * @returns this operator
     */
    last: (key: string) => {
        $last: string;
    };
    /**
     * @method max Operator
     * Returns the maximum value
     * @type {string} - key
     * @returns this operator
     */
    max: (key: string) => {
        $max: string;
    };
    /**
     * @method min Operator
     * Returns the minimum value
     * @type {string} - key
     * @returns this operator
     */
    min: (key: string) => {
        $min: string;
    };
    /**
     * @method sum Operator
     * Calculates and returns the sum of numeric values. $sum ignores non-numeric values.
     * @type {string|Number| any[]} - data
     * @returns this operator
     */
    sum: (data: string | Number | any[]) => {
        $sum: string | Number | any[];
    };
    /**
     * @method multiply Operator
     * Multiplies numbers together and returns the result. Pass the arguments to $multiply in an array.
     * @type {string|number} - key1
     * @type {string|number} - key2
     * @returns this operator
     */
    multiply: (key1: string | number, key2: string | number) => {
        $multiply: (string | number)[];
    };
    /**
     * @method in Operator
     * Returns a boolean indicating whether a specified value is in an array.
     * @type {any[]} - key
     * @returns this operator
     */
    in: (key: any[]) => {
        $in: any[];
    };
    /**
     * @method size Operator
     * Counts and returns the total number of items in an array.
     * @type {any} - key
     * @returns this operator
     */
    size: (key: any) => {
        $size: any;
    };
    /**
     * @method mergeObjects Operator
     * Combines multiple documents into a single document.
     * @type {string|any[]} - key
     * @returns this operator
     */
    mergeObjects: (key: string | any[]) => {
        $mergeObjects: string | any[];
    };
    /**
     * @method concatArrays Operator
     * Concatenates arrays to return the concatenated array.
     * @type {any[]} - arr1
     * @type {any[]} - arr2 ,
     * @returns this operator
     */
    concatArrays: (arr1: any[], arr2: any[]) => {
        $concatArrays: any[][];
    };
    /**
     * @method  accumulator Operator
     * Accumulators are operators that maintain their state as documents progress through the pipeline.
     * @type {Accumulator} - arg
     * @type  {init:any} - Accumulator.init
     * @type {initArgs?: any[]} - Accumulator.initArgs
     * @type {accumulate:any} - Accumulator.accumulate
     * @type {accumulateArgs: - string[]} - Accumulator.accumulateArgs
     * @type {merge: any} - Accumulator.merge
     * @type {finalize?:any} - Accumulator.finalize
     * @type {lang: string} - Accumulator.lang
     * @returns this operator
     */
    accumulator: (args: Accumulator) => {
        $accumulator: Accumulator;
    };
    /**
     * @method round Operator
     * Rounds a number to a whole integer or to a specified decimal place.
     * @type {String|Number} - num
     * @type {Number} - place
     * @returns this operator
     */
    round: (num: String | Number, place: Number) => {
        $round: (String | Number)[];
    };
    /**
     * @method pull Operator
     * The $pull operator  removes from an existing array all instances of a value or values that match a specified condition.
     * @type {*} - arg
     * @returns this operator
     */
    pull: (arg: any) => {
        $pull: any;
    };
    /**
     * @method reduce Operator
     * Applies an expression to each element in an array and combines them into a single value.
     * @type {Reduce} - arg
     * @type  {input: any[] | string} - Reduce.input
     * @type {initialValue: any} - Reduce.initialValue
     * @type {in: any} - Reduce.in
     * @returns this operator
     */
    reduce: (arg: Reduce) => {
        $reduce: Reduce;
    };
    /**
     * @method filter Operator
     * Selects a subset of an array to return based on the specified condition. Returns an array with only those elements that match the condition. The returned elements are in the original order.
     * @type {Filter} - arg
     * @type {input: string|any[]} - Filter.input
     * @type {as?: String} - Filter.as
     * @type {cond: any } - Filter.cond
     * @returns this operator
     */
    filter: (arg: Filter) => {
        $filter: Filter;
    };
    /**
     * @method ifNull Operator
     * Evaluates an expression and returns the value of the expression if the expression evaluates to a non-null value. If the expression evaluates to a null value, including instances of undefined values or missing fields, returns the value of the replacement expression.
     * @type {any[] }-arg
     * @returns this operator
     */
    ifNull: (key: any[]) => {
        $ifNull: any[];
    };
    /**
     * @method  arrayElemAt Operator
     * Returns the element at the specified array index.
     * @type {any[] } - arg
     * @returns this operator
     */
    arrayElemAt: (key: any[]) => {
        $arrayElemAt: any[];
    };
    /**
     * @method  or Operator
     * The $or operator performs a logical OR operation on an array of two or more <expressions>
     * and selects the documents that satisfy at least one of the <expressions>.
     * @type {any} - arg
     * @returns this operator
     */
    or: (arg: any[]) => {
        $or: any[];
    };
    /**
     * @method  and Operator
     * $and performs a logical AND operation on an array of one or more expressions
     * and selects the documents that satisfy all the expressions in the array.
     * @type {any} - arg
     * @returns this operator
     */
    and: (arg: any[]) => {
        $and: any[];
    };
    /**
     * @method  gt Operator
     * selects those documents where the value of the field is greater than (i.e. >) the specified value
     * @type {any} - arr1
     * @type {any} - arr2
     * @returns this operator
     */
    gt: (arg1: any, arg2: any) => {
        $gt: any[];
    };
    /**
     * @method  gte Operator
     * selects the documents where the value of the field is greater than or equal to (i.e. >=) a specified value (e.g. value.)
     * @type {any } - arr1
     * @type {any} - arr2
     * @returns this operator
     */
    gte: (arg1: any, arg2: any) => {
        $gte: any[];
    };
    /**
     * @method  lt Operator
     * Compares two values and returns:
     * true when the first value is less than the second value.
     * false when the first value is greater than or equivalent to the second value.
     * @type {any } - arr1
     * @type {any} - arr2
     * @returns this operator
     */
    lt: (arg1: any, arg2: any) => {
        $lt: any[];
    };
    /**
     * @method  lte Operator
     * Compares two values and returns:
     * true when the first value is less than or equivalent to the second value.
     * false when the first value is greater than the second value.
     * @type {any } - arr1
     * @type {any} - arr2
     * @returns this operator
     */
    lte: (arg1: any, arg2: any) => {
        $lte: any[];
    };
    /**
     * @method  push Operator
     * The $push operator appends a specified value to an array.
     * If the field is not an array, the operation will fail.
     * @type { string|number[]} - arg
     * @returns this operator
     */
    push: (arg: string | number[]) => {
        $push: string | number[];
    };
    /**
     * @method  expr Operator
     * Allows the use of aggregation expressions within the query language.
     * @type { any} - arg
     * @returns this operator
     */
    expr: (arg: any) => {
        $expr: any;
    };
    /**
     * @method  strLenCP Operator
     * Returns the number of UTF-8 code points in the specified string.
     * @type {String} - str
     * @returns this operator
     */
    strLenCP: (str: string) => {
        $strLenCP: string;
    };
    /**
     * @method  subtract  Operator
     * Subtracts two numbers to return the difference
     * @type {Number | String | Any} - exp1
     * @type {Number | String | Any} - exp2
  
     * @returns this operator
     */
    subtract: (exp1: Number | String | any, exp2: Number | String | any) => {
        $subtract: any[];
    };
    /**
     * @method  divide  Operator
     * Divides one number by another and returns the result.
     * @type {Number | String | Any} - exp1
     * @type {Number | String | Any} - exp2
     * @returns this operator
     */
    divide: (exp1: Number | String | any, exp2: Number | String | any) => {
        $divide: any[];
    };
    /**
     * @method  add  Operator
     * Adds numbers together or adds numbers and a date.
     * @type {Number | String | Any} - exp1
     * @type {Number | String | Any} - exp2
     * @returns this operator
     */
    add: (exp1: Number | String | any, exp2: Number | String | any) => {
        $add: any[];
    };
    /**
     * @method  function  Operator
     *Defines a custom aggregation function or expression in JavaScript.
     * @type {Any} - body
     * @type { Any[]} - args
     * @type {string} - lang
     * @returns this operator
     */
    function: (body: any, args: any[], lang: string) => {
        $function: {
            body: any;
            args: any[];
            lang: string;
        };
    };
    /**
     * @method  isNumber Operator
     * checks if the specified expression resolves to one of the following numeric BSON
     * @type {string | number} - arg
     * @returns this operator
     */
    isNumber: (arg: string | number) => {
        $isNumber: string | number;
    };
    /**
     * @method switch Stage
     * Evaluates a series of case expressions. When it finds an expression which evaluates to true,
     *  $switch executes a specified expression and breaks out of the control flow.
     * @type {[propName: string]: any[]} - branches
     * @type {string|any} - arg
     * @return this operator
     */
    switch: (branches: {
        [propName: string]: any;
    }, arg?: string | any) => {
        $switch: {
            branches: {
                [propName: string]: any;
            };
            default?: string | undefined;
        };
    };
    /**
     * @method  map  Operator
     * Applies an expression to each item in an array and returns an array with the applied results.
     * * @type { String } - inputAn expression that resolves to an array.
     * @type { String } - as - Optional. A name for the variable that represents each individual element of the input array.
     * @type {any} -expr  -An expression that is applied to each element of the input array.
     * @returns this operator
     */
    map: (input: string, as?: string | undefined, expr?: any) => {
        $map: {
            input: string;
            as?: string | undefined;
            in: any;
        };
    };
    /**
     * @method  substr  Operator
     * Returns a substring of a string,
     * starting at a specified index position and including the specified number of characters.
     * The index is zero-based.
     * @type { String } - str
     * @type { Number } - start - If <start> is a negative number, $substr returns an empty string "".
     * @type { Number } - length  -If <length> is a negative number, $substr returns a substring that
     *  starts at the specified index and includes the rest of the string.
     * @returns this operator
     */
    substr: (str: string, start: number, length: number) => any;
}
export {};
