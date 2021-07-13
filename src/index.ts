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
type _let = string;

type Lookup = {
  from: String;
  localField?: String;
  foreignField?: String;
  as?: String;
};

type pipelineLookup = {
  from: String;
  let?: _let;
  pipeline?: any[];
  as?: String;
};

type _lookup = Lookup & pipelineLookup;
interface Lookupstage {
  $lookup: Lookup;
}
interface Res {
  date: String;
  format: any;
  timezone?: String;
}
interface Facet {
  [propName: string]: any[];
}
interface AddFields {
  [propName: string]: string | any;
}
interface Set {
  [propName: string]: string | any;
}
interface Project {
  [propName: string]: number | string | any;
}
interface Match {
  [propName: string]: any;
}
interface Group {
  _id: string | {} | null;
  [propName: string]: any;
}
interface Accumulator {
  init: any;
  initArgs?: any[];
  accumulate: any;
  accumulateArgs: string[];
  merge: any;
  finalize?: any;
  lang: string;
}
interface Unwind {
  path: string;
  includeArrayIndex?: string;
  preserveNullAndEmptyArrays?: boolean;
}
interface Reduce {
  input: any[] | string;
  initialValue: any;
  in: any;
}
interface Filter {
  input: any[];
  as?: String;
  cond: any;
}

export class AggregationBuilder {
  opts: AggregationOptions = {
    allowDiskUse: true,
    serializeFunctions: true,
  };
  model: any;
  aggs: any[] = [];
  option = function (options: AggregationOptions) {
    this.opts.allowDiskUse = options.allowDiskUse || true;
    this.opts.serializeFunctions = options.serializeFunctions || true;
  };
  constructor(model: any) {
    this.model = model;
    this.aggs = this.aggs || [];
  }
  //console.log("this model", this.model);
  /**
   * @function lookup Stage
   * Performs a left outer join to an unsharded collection in the same database to filter in documents from the "joined" collection for processing. To each input document, the $lookup stage adds a new array field whose elements are the matching documents from the "joined" collection. The $lookup stage passes these reshaped documents to the next stage.
   * @type Lookup-arg {from:string,localField:string,foreignField:string,as:string} from and localField are required.
   * @type pipelineLookup-arg {from:string,let:_let,pipeline:any[],as:string} from and pipeline are required.
   * @return this stage
   */
  lookup: (
    arg: Lookup & pipelineLookup,
    options: Options
  ) => AggregationBuilder = function (arg, options) {
    if (options && options.alone && this.alone(`${options.alone}_lookup`))
      return this;
    if (options && options.only && this.only(`${options.only}`)) return this;
    let stage: any;
    if (arg && arg.pipeline) {
      stage = { $lookup: {} };
      if (!arg.pipeline)
        throw "key 'pipeline'  is required to build lookup aggregation stage";
      if (!arg.from)
        throw "key 'from'  is required to build lookup aggregation stage";
      stage.$lookup.from = arg.from;
      stage.$lookup.let = arg.let;
      stage.$lookup.pipeline = arg.pipeline || [];
      stage.$lookup.as = arg.as || arg.as;
      this.aggs.push(stage);
    } else if (arg && arg.localField) {
      stage = { $lookup: {} };
      if (arg && !arg.from)
        throw "key 'from'  is required to build lookup aggregation stage";
      if (arg && !arg.localField)
        throw "key 'localField'  is required to build lookup aggregation stage";
      stage.$lookup.from = arg.from;
      stage.$lookup.localField = arg.localField;
      stage.$lookup.foreignField = arg.foreignField || "_id";
      stage.$lookup.as = arg.as || arg.localField;
      this.aggs.push(stage);
    }
    if (options && options.unwind)
      this.aggs.push({
        $unwind: {
          path: `$${stage.$lookup.as}`,
          preserveNullAndEmptyArrays:
            options.preserveNullAndEmptyArrays == false ? false : true,
        },
      });
    // this.isIf = false
    return this;
  };
  /**
   *  @function unwind Stage
   * Filters the documents to pass only the documents that match the specified condition(s)Deconstructs an array field from the input documents to output a document for each element. Each output document is the input document with the value of the array field replaced by the element.
   * @type {Unwind}-arg,{path: string; includeArrayIndex?: string preserveNullAndEmptyArrays?:boolean}
   * @return this stage
   */
  unwind: (arg: Unwind, options: Options) => AggregationBuilder = function (
    arg,
    options
  ) {
    if (options && options.only && this.only(`${options.only}`)) return this;
    if (options && options.alone && this.alone(`${options.alone}_unwind`))
      return this;
    this.aggs.push({ $unwind: arg });
    this.isIf = false;
    return this;
  };
  /**
   *  @function matchSmart Stage
   * Filters the documents to pass only the documents that match the specified condition(s)
   * @type {Match}-arg   {[propName: string]: any}
   * @return this stage
   */
  matchSmart: (arg: Match, options: Options) => AggregationBuilder = function (
    arg: Match,
    options: Options
  ) {
    let stage;
    if (this.aggs.length && this.aggs[this.aggs.length - 1].$match) {
      stage = this.aggs[this.aggs.length - 1].$match;
    } else {
      stage = {
        $match: {},
      };
    }
    if (options && options.or) {
      stage.$match.$or = stage.$match.$or || [];
      stage.$match.$or.push(arg);
    } else {
      stage.$match.$and = stage.$match.$and || [];
      stage.$match.$and.push(arg);
    }
    this.aggs.push(stage);
    this.isIf = false;
    return this;
  };
  /**
   * @function match Stage
   * Filters the documents to pass only the documents that match the specified condition(s)
   * @type {Match}-arg  {[propName: string]: any}
   * @return this stage
   *    */
  match: (arg: Match, options: Options) => AggregationBuilder = function (
    arg: Match,
    options: Options
  ) {
    if (options && options.only && this.only(`${options.only}`)) return this;
    if (options && options.alone && this.alone(`${options.alone}_match`))
      return this;
    if (this.isIf) return this;
    if (options && (options.smart || options.or || options.and))
      return this.matchSmart(arg, options);
    let stage;
    if (this.aggs.length && this.aggs[this.aggs.length - 1].$match) {
      stage = this.aggs[this.aggs.length - 1].$match;
    } else {
      stage = {
        $match: {},
      };
    }
    Object.assign(stage.$match, arg);
    this.aggs.push(stage);
    this.isIf = false;
    return this;
  };
  /**
   * @function addFields Stage
   * Adds new fields to documents
   * @type {AddFields}-filelds , {[propName: string]: string|any};
   * @return this stage
   */
  addFields: (filelds: AddFields, options: Options) => AggregationBuilder =
    function (filelds, options) {
      if (options && options.only && this.only(`${options.only}`)) return this;
      if (options && options.alone && this.alone(`${options.alone}_addFields`))
        return this;
      this.aggs.push({ $addFields: filelds });
      this.isIf = false;
      return this;
    };
  /**
   * @function project Stage
   * specified fields can be existing fields from the input documents or newly computed fields.
   * @type {Project}-projection   {[propName: string]: Number|any}
   * @return this stage
   */
  project: (projection: Project, options: Options) => AggregationBuilder =
    function (projection, options) {
      if (options && options.only && this.only(`${options.only}`)) return this;
      if (options && options.alone && this.alone(`${options.alone}_project`))
        return this;
      this.aggs.push({ $project: projection });
      this.isIf = false;
      return this;
    };
  /**
   * @function limit Stage
   * Limits the number of documents passed to the next stage in the pipeline.
   * @type {Number}-Limit
   * @return this stage
   */
  limit: (limit: Number, options: Options) => AggregationBuilder = function (
    limit,
    options
  ) {
    if (options && options.only && this.only(`${options.only}`)) return this;
    if (options && options.alone && this.alone(`${options.alone}_limit`))
      return this;
    this.aggs.push({ $limit: limit });
    this.isIf = false;
    return this;
  };
  /**
   * @function skip Stage
   *Skips over the specified number of documents that pass into the stage and passes the remaining documents to the next stage in the pipeline.
   * @type {Number}-skip
   * @return this stage
   */
  skip: (skip: Number, options: Options) => AggregationBuilder = function (
    skip: Number,
    options: Options
  ) {
    if (options && options.only && this.only(`${options.only}`)) return this;
    if (options && options.alone && this.alone(`${options.alone}_skip`))
      return this;
    this.aggs.push({ $skip: skip });
    this.isIf = false;
    return this;
  };
  /**
   * @function set Stage
   * replaces the value of a field with the specified value.
   *  @type {Set}-field {[propName: string]:string|any}
   * @return this stage
   */
  set: (field: Set, options: Options) => AggregationBuilder = function (
    field,
    options
  ) {
    if (options && options.only && this.only(`${options.only}`)) return this;
    if (options && options.alone && this.alone(`${options.alone}_set`))
      return this;
    this.aggs.push({ $set: field });
    this.isIf = false;
    return this;
  };
  /**
   * @function group Stage
   * Groups input documents by the specified _id expression and for each distinct grouping, outputs a document.The _id field of each output document contains the unique group by value.
   *  @type {Group}-arg  {_id:null | string|any; [propName: string]: any}
   * @return this stage
   */
  group: (arg: Group, options: Options) => AggregationBuilder = function (
    arg,
    options
  ) {
    if (options && options.alone && this.alone(`${options.alone}_group`))
      return this;
    if (options && options.only && this.only(`${options.only}`)) return this;
    let stage: any;
    stage = { $group: arg };
    stage.$group._id = arg._id;
    this.aggs.push(stage);
    this.isIf = false;
    return this;
  };
  /**
   * @function sort Stage
   * Sorts all input documents and returns them to the pipeline in sorted order.
   *  @type {number}-sortOrder  [1-->Sort ascending; -1-->Sort descending].
   * @return this stage
   */
  sort = function (sortOrder: Number, options: Options) {
    if (options && options.only && this.only(`${options.only}`)) return this;
    if (options && options.alone && this.alone(`${options.alone}_sort`))
      return this;
    this.aggs.push({ $sort: sortOrder });
    this.isIf = false;
    return this;
  };
  /**
   * @function facet Stage
   * Processes multiple aggregation pipelines within a single stage on the same set of input documents.
   *  @type {Facet}-arg , [propName: string]: any[]
   * @return this stage
   */
  facet = function (arg: Facet, options: Options) {
    if (options && options.only && this.only(`${options.only}`)) return this;
    if (options && options.alone && this.alone(`${options.alone}_facet`))
      return this;
    let stage: any;
    stage = { $facet: arg };
    this.aggs.push(stage);
    this.isIf = false;
    return this;
  };
  /**
   * @function replaceRoot Stage
   * Replaces the input document with the specified document.
   *  @type {any}-newRoot
   * @return this stage
   */
  replaceRoot = function (newRoot: any, options: Options) {
    if (options && options.only && this.only(`${options.only}`)) return this;
    if (options && options.alone && this.alone(`${options.alone}_replaceRoot `))
      return this;
    this.aggs.push({ $replaceRoot: newRoot });
    this.isIf = false;
    return this;
  };
  /**
   * Concatenates strings and returns the concatenated string.
   * @method concat Operator
   *  @type {string[]}-arr  can be any valid expression as long as they resolve to strings.
   * @return This operator
   */
  concat = function (arr: []) {
    return { $concat: arr };
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
  cond = function (IF: any, THEN: any, ELSE: any) {
    return {
      $cond: {
        if: IF,
        then: THEN,
        else: ELSE,
      },
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
  eq = function (arg1: any, arg2: any) {
    let arr;

    if (arg2) {
      arr = [arg1, arg2];
    } else if (!Array.isArray(arg1)) {
      arr = [arg1];
    } else {
      arr = arg1;
    }
    return { $eq: arr };
  };

  /**
   * Converts a date object to a string according to a user-specified format.
   * @method  dateToString Operator
   *  @type {string} date -The date to convert to string.must be a valid expression that resolves to a Date, a Timestamp, or an ObjectID.
   *  @type {*} format -Optional- The date format specification
   *  @type {string} timezone -Optional- The timezone of the operation result
   * @return this operator
   */
  dateToString = function (date: String, format?: any, timezone?: String) {
    let res: Res = {
      date: date,
      format: format && format != false ? format : "%Y-%m-%d",
      timezone: timezone,
    };
    if (timezone) res.timezone = timezone;
    return res;
  };
  /**
   * Converts a value to a specified type.
   * @method  convert Operator
   *  @type {*} input -The argument can be any valid expression.
   *  @type {string} to -{"double","string","objectId","bool","date","int","long","decimal"}
   * @return this operator
   *
   */
  convert = function (input: any, to: String) {
    return { $convert: { input: input, to: to } };
  };
  /**
   * Converts a value to an ObjectId().
   *an ObjectId for the hexadecimal string of length 24.
   * You cannot convert a string value that is not a hexadecimal string of length 24.
   * @method  toObjectId Operator
   * @type {string} arg - string of length 24.
   * @return this Operator
   */
  toObjectId = function (arg: String) {
    return { $toObjectId: arg };
  };
  /**
   * Returns the year portion of a date.
   * @method  year Operator
   * @type {string} date -	The date to which the operator is applied { Date, a Timestamp, or an ObjectID}.
   * @type {string} timezone -Optional-The timezone of the operation result.
   * @return this Operator
   */
  year = function (date: String, timezone?: String) {
    return { $year: { date: date, timezone: timezone ? timezone : undefined } };
  };
  /**
   * Return the week of the year for a date as a number between 0 and 53.
   * @method  week Operator
   * @type {string} date -	The date to which the operator is applied { Date, a Timestamp, or an ObjectID}.
   * @type {string} timezone -Optional-The timezone of the operation result.
   * @return this Operator
   */
  week = function (date: String, timezone?: String) {
    return { $week: { date: date, timezone: timezone ? timezone : undefined } };
  };
  /**
   *  Return the month of a date as a number between 1 and 12
   * @method  month Operator
   * @type {string} date -	The date to which the operator is applied { Date, a Timestamp, or an ObjectID}.
   * @type {string} timezone -Optional-The timezone of the operation result.
   * @return this Operator
   */
  month = function (date: String, timezone?: String) {
    return {
      $month: { date: date, timezone: timezone ? timezone : undefined },
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
  dayOfMonth = function (date: String, timezone?: String) {
    return {
      $dayOfMonth: { date: date, timezone: timezone ? timezone : undefined },
    };
  };
  /**
   * Determines if the operand is an array. Returns a boolean.
   * @method isArray Operator
   * @type {any} arg - can be any valid expression.
   * @return this Operator
   *
   */
  isArray = function (arg: any) {
    return { $isArray: arg };
  };
  /**
   *
   * @returns
   */
  commit = async function () {
    return await this.model.aggregate(this.aggs).option(this.opts);
  };
  get = function () {
    return this.aggs;
  };
  /**
   * @method show Operator
   * @type {Number|null} d
   * @returns console.dir(this.aggs,{depth:depth|null})
   */
  show = function (d: Number) {
    let depth = d ? d : null;
    console.dir(this.aggs, { depth: depth || null });
    return this;
  };
  alones: any = {};
  alone = function (key: any) {
    if (this.alones[key]) {
      this.alones[key] = key.split("_")[0];
      return false;
    } else {
      return true;
    }
  };
  only = function (key: String) {
    return Object.values(this.alones).includes(key) ? false : true;
  };
  isIf: Boolean = false;
  if: (condition: any, options: Options) => AggregationBuilder = function (
    condition,
    options
  ) {
    // if  = function (condition: any, options: Options) {
    if (condition) this.isIf = true;
    return this;
  };
  /**
   * @method addToSet Operator
   * Returns an array of all unique values that results from applying an expression to each document in a group of documents that share the same group by key
   *$addToSet is only available in the $group stage.
   * @type {*} key
   * @returns this operator
   */
  addToSet = function (key: any) {
    return {
      $addToSet: key,
    };
  };
  /**
   * @method avg Operator
   * Returns the average value of the numeric values. $avg ignores non-numeric values.
   * @type {*} key
   * @returns this operator
   */
  avg = function (key: any) {
    return {
      $avg: key,
    };
  };
  /**
   * @method first Operator
   * Returns the first element in an array.
   * @type {string} key
   * @returns this operator
   */
  first = function (key: string) {
    return {
      $first: key,
    };
  };
  /**
   * @method last Operator
   * Returns the last element in an array.
   * @type {string} key
   * @returns this operator
   */
  last = function (key: string) {
    return { $last: key };
  };
  /**
   * @method max Operator
   * Returns the maximum value
   * @type {string} key
   * @returns this operator
   */
  max = function (key: string) {
    return { $max: key };
  };
  /**
   * @method min Operator
   * Returns the minimum value
   * @type {string} key
   * @returns this operator
   */
  min = function (key: string) {
    return { $min: key };
  };
  /**
   * @method push Operator
   *The $push operator appends a specified value to an array.
   *If the field is not an array, the operation will fail.
   * @type {*} data
   * @returns this operator
   */

  push = function (data: any) {
    return { $push: data };
  };
  /**
   * @method sum Operator
   * Calculates and returns the sum of numeric values. $sum ignores non-numeric values.
   * @type {string|1| any[]} data
   * @returns this operator
   */
  sum = function (data: string | 1 | any[]) {
    return { $sum: data };
  };
  /**
   * @method multiply Operator
   * Multiplies numbers together and returns the result. Pass the arguments to $multiply in an array.
   * @type {string|number} key1
   * @type {string|number} key2
   * @returns this operator
   */
  multiply = function (key1: string | number, key2: string | number) {
    return { $multiply: [key1, key2] };
  };
  /**
   * @method in Operator
   * Returns a boolean indicating whether a specified value is in an array.
   * @type {any[]} key
   * @returns this operator
   */
  in = function (key: any[]) {
    return { $in: key };
  };
  /**
   * @method size Operator
   * Counts and returns the total number of items in an array.
   * @type {string} ke
   *y
   * @returns this operator
   */
  size = function (key: string) {
    return { $size: key };
  };
  /**
   * @method mergeObjects Operator
   * Combines multiple documents into a single document.
   * @type {string|any[]} key
   * @returns this operator
   */
  mergeObjects = function (key: string | any[]) {
    return { $mergeObjects: key };
  };
  /**
   * @method concatArrays Operator
   * Concatenates arrays to return the concatenated array.
   * @type {any[]} arr1
   * @type {any[]} arr2 ,
   * @returns this operator
   */
  concatArrays = function (arr1: any[], arr2: any[]) {
    return { $concatArrays: [arr1, arr2] };
  };
  /**
   * @method  accumulator Operator
   * Accumulators are operators that maintain their state as documents progress through the pipeline.
   * @type {Accumulator}-args {init:any;initArgs?: any[];accumulate:any;accumulateArgs: string[];merge: any;finalize?:any;lang: string}
   * @returns this operator
   */
  accumulator = function (args: Accumulator) {
    return { $accumulator: args };
  };
  /**
   * @method round Operator
   * Rounds a number to a whole integer or to a specified decimal place.
   * @type {String|Number}-num
   * @type {Number}-place
   * @returns this operator
   */
  round = function (num: String | Number, place: Number) {
    return { $round: [num, place] };
  };
  /**
   * @method pull Operator
   * The $pull operator  removes from an existing array all instances of a value or values that match a specified condition.
   * @type {*}-arg
   * @returns this operator
   */
  pull = function (arg: any) {
    return { $pull: arg };
  };
  /**
   * @method reduce Operator
   * Applies an expression to each element in an array and combines them into a single value.
   * @type {Reduce }-arg  {input: any[] | string;initialValue: any; in: any}
   * @returns this operator
   */
  reduce = function (arg: Reduce) {
    return { $reduce: arg };
  };
  /**
   * @method filter Operator
   * Selects a subset of an array to return based on the specified condition. Returns an array with only those elements that match the condition. The returned elements are in the original order.
   * @type {Filter}-arg  {input: any[]; as?: String;  cond: any }
   * @returns this operator
   */
  filter = function (arg: Filter) {
    return { $filter: arg };
  };
  /**
   * @method ifNull Operator
   * Evaluates an expression and returns the value of the expression if the expression evaluates to a non-null value. If the expression evaluates to a null value, including instances of undefined values or missing fields, returns the value of the replacement expression.
   * @type {any[] }-arg
   * @returns this operator
   */
  ifNull = function (key: any[]) {
    return { $ifNull: key };
  };
  /**
   * @method  arrayElemAt Operator
   * Returns the element at the specified array index.
   * @type {any[] }-arg
   * @returns this operator
   */
  arrayElemAt = function (key: any[]) {
    return { $arrayElemAt: key };
  };
}
