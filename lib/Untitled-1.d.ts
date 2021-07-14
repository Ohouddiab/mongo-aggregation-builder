export class AggregationBuilder {
  constructor(model: any);
  opts: AggregationOptions;
  model: any;
  aggs: any[];
  option: (options: AggregationOptions) => void;
  /**
   * @method lookup Stage
   * Performs a left outer join to an unsharded collection in the same database to filter in documents from the "joined" collection for processing.
   * To each input document, the $lookup stage adds a new array field whose elements are the matching documents from the "joined" collection. The $lookup stage passes these reshaped documents to the next stage.
   * @type {Lookup} - arg
   * @see Lookup
   * @type {pipelineLookup} - arg .
   * @see pipelineLookup
   * @return this stage
   */
  lookup: (
    arg: Lookup & pipelineLookup,
    options: Options
  ) => AggregationBuilder;
  /**
   *  @method unwind Stage
   * Filters the documents to pass only the documents that match the specified condition(s)Deconstructs an array field from the input documents to output a document for each element. Each output document is the input document with the value of the array field replaced by the element.
   * @type {Unwind} - arg,
   * @see Unwind
   * @return this stage
   */
  unwind: (arg: Unwind, options: Options) => AggregationBuilder;
  /**
   *  @method matchSmart Stage
   * Filters the documents to pass only the documents that match the specified condition(s)
   * @type {Match}-arg
   * @see Match
   * @return this stage
   */
  matchSmart: (arg: Match, options: Options) => AggregationBuilder;
  /**
   * @method match Stage
   * Filters the documents to pass only the documents that match the specified condition(s)
   * @type {Match} - arg
   * @see Match
   * @return this stage
   *    */
  match: (arg: Match, options: Options) => AggregationBuilder;
  /**
   * @method addFields Stage
   * Adds new fields to documents
   * @type {AddFields} - filelds ,
   * @see AddFields
   * @return this stage
   */
  addFields: (filelds: AddFields, options: Options) => AggregationBuilder;
  /**
   * @method project Stage
   * specified fields can be existing fields from the input documents or newly computed fields.
   * @type {Project} - projection
   * @see Project
   * @return this stage
   */
  project: (projection: Project, options: Options) => AggregationBuilder;
  /**
   * @method limit Stage
   * Limits the number of documents passed to the next stage in the pipeline.
   * @type {Number} - Limit
   * @return this stage
   */
  limit: (limit: Number, options: Options) => AggregationBuilder;
  /**
   * @method skip Stage
   *Skips over the specified number of documents that pass into the stage and passes the remaining documents to the next stage in the pipeline.
   * @type {Number} - skip
   * @return this stage
   */
  skip: (skip: Number, options: Options) => AggregationBuilder;
  /**
   * @method set Stage
   * replaces the value of a field with the specified value.
   *  @type {Set} - field
   *  @see Set
   * @return this stage
   */
  set: (field: Set, options: Options) => AggregationBuilder;
  /**
   * @method group Stage
   * Groups input documents by the specified _id expression and for each distinct grouping, outputs a document.The _id field of each output document contains the unique group by value.
   *  @type {Group}-arg
   * @see Group
   * @return this stage
   */
  group: (arg: Group, options: Options) => AggregationBuilder;
  /**
   * @method sort Stage
   * Sorts all input documents and returns them to the pipeline in sorted order.
   *  @type {Number} - sortOrder
   * [1-->Sort ascending; -1-->Sort descending].
   * @return this stage
   */
  sort: (sortOrder: Number, options: Options) => AggregationBuilder;
  /**
   * @method facet Stage
   * Processes multiple aggregation pipelines within a single stage on the same set of input documents.
   *  @type {Facet}-arg ,
   * @see Facet
   * @return this stage
   */
  facet: (arg: Facet, options: Options) => AggregationBuilder;
  /**
   * @method replaceRoot Stage
   * Replaces the input document with the specified document.
   *  @type {Any} - newRoot
   * @return this stage
   */
  replaceRoot: (newRoot: any, options: Options) => AggregationBuilder;
  /**
   * Concatenates strings and returns the concatenated string.
   * @method concat Operator
   *  @type { String[] } - arr
   *  can be any valid expression as long as they resolve to strings.
   * @return This operator
   */
  concat: string[];
  /**
   * Evaluates a boolean expression to return one of the two specified return expressions.
   * @method cond Operator
   *  @type {*} IF - boolean expression
   *  @type {*} THEN - true case
   *  @type {*} ELSE - false case
   * @return this operator
   *   all three arguments are requires
   */
  cond: any;
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
  eq: any;
  /**
   * Converts a date object to a string according to a user-specified format.
   * @method  dateToString Operator
   *  @type {string} date -The date to convert to string.must be a valid expression that resolves to a Date, a Timestamp, or an ObjectID.
   *  @type {*} format -Optional- The date format specification
   *  @type {string} timezone -Optional- The timezone of the operation result
   * @return this operator
   */
  dateToString: string;
  /**
   * Converts a value to a specified type.
   * @method  convert Operator
   *  @type {*} input -The argument can be any valid expression.
   *  @type {string} to -{"double","string","objectId","bool","date","int","long","decimal"}
   * @return this operator
   *
   */
  convert: any;
  /**
   * Converts a value to an ObjectId().
   *an ObjectId for the hexadecimal string of length 24.
   * You cannot convert a string value that is not a hexadecimal string of length 24.
   * @method  toObjectId Operator
   * @type {string} arg - string of length 24.
   * @return this Operator
   */
  toObjectId: string;
  /**
   * Returns the year portion of a date.
   * @method  year Operator
   * @type {string} date -	The date to which the operator is applied { Date, a Timestamp, or an ObjectID}.
   * @type {string} timezone -Optional-The timezone of the operation result.
   * @return this Operator
   */
  year: string;
  /**
   * Return the week of the year for a date as a number between 0 and 53.
   * @method  week Operator
   * @type {string} date -	The date to which the operator is applied { Date, a Timestamp, or an ObjectID}.
   * @type {string} timezone -Optional-The timezone of the operation result.
   * @return this Operator
   */
  week: string;
  /**
   *  Return the month of a date as a number between 1 and 12
   * @method  month Operator
   * @type {string} date -	The date to which the operator is applied { Date, a Timestamp, or an ObjectID}.
   * @type {string} timezone -Optional-The timezone of the operation result.
   * @return this Operator
   */
  month: string;
  /**
   * Return the day of the month for a date as a number between 1 and 31.
   * @method  dayOfMonth Operator
   * @type {string} date - The date to which the operator is applied { Date, a Timestamp, or an ObjectID}.
   * @type {string} timezone -Optional-The timezone of the operation result.
   * @return this Operator
   *
   */
  dayOfMonth: string;
  /**
   * Determines if the operand is an array. Returns a boolean.
   * @method isArray Operator
   * @type {any} arg - can be any valid expression.
   * @return this Operator
   *
   */
  isArray: any;
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
  show: number | null;
  alones: any;
  alone: (key: any) => boolean;
  only: (key: String) => boolean;
  isIf: Boolean;
  if: (condition: any, options: Options) => AggregationBuilder;
  /**
   * @method addToSet Operator
   * Returns an array of all unique values that results from applying an expression to each document in a group of documents that share the same group by key
   *$addToSet is only available in the $group stage.
   * @type {*} key
   * @returns this operator
   */
  addToSet: any;
  /**
   * @method avg Operator
   * Returns the average value of the numeric values. $avg ignores non-numeric values.
   * @type {*} key
   * @returns this operator
   */
  avg: any;
  /**
   * @method first Operator
   * Returns the first element in an array.
   * @type {string} key
   * @returns this operator
   */
  first: string;
  /**
   * @method last Operator
   * Returns the last element in an array.
   * @type {string} key
   * @returns this operator
   */
  last: string;
  /**
   * @method max Operator
   * Returns the maximum value
   * @type {string} key
   * @returns this operator
   */
  max: string;
  /**
   * @method min Operator
   * Returns the minimum value
   * @type {string} key
   * @returns this operator
   */
  min: string;
  /**
   * @method push Operator
   *The $push operator appends a specified value to an array.
   *If the field is not an array, the operation will fail.
   * @type {*} data
   * @returns this operator
   */
  push: any;
  /**
   * @method sum Operator
   * Calculates and returns the sum of numeric values. $sum ignores non-numeric values.
   * @type {string|1| any[]} data
   * @returns this operator
   */
  sum: string | 1 | any[];
  /**
   * @method multiply Operator
   * Multiplies numbers together and returns the result. Pass the arguments to $multiply in an array.
   * @type {string|number} key1
   * @type {string|number} key2
   * @returns this operator
   */
  multiply: string | number;
  /**
   * @method in Operator
   * Returns a boolean indicating whether a specified value is in an array.
   * @type {any[]} key
   * @returns this operator
   */
  in: any[];
  /**
   * @method size Operator
   * Counts and returns the total number of items in an array.
   * @type {string} ke
   *y
   * @returns this operator
   */
  size: string;
  /**
   * @method mergeObjects Operator
   * Combines multiple documents into a single document.
   * @type {string|any[]} key
   * @returns this operator
   */
  mergeObjects: string | any[];
  /**
   * @method concatArrays Operator
   * Concatenates arrays to return the concatenated array.
   * @type {any[]} arr1
   * @type {any[]} arr2 ,
   * @returns this operator
   */
  concatArrays: any[];
  /**
   * @method  accumulator Operator
   * Accumulators are operators that maintain their state as documents progress through the pipeline.
   * @type {Accumulator}-args {init:any;initArgs?: any[];accumulate:any;accumulateArgs: string[];merge: any;finalize?:any;lang: string}
   * @returns this operator
   */
  accumulator: Accumulator;
  /**
   * @method round Operator
   * Rounds a number to a whole integer or to a specified decimal place.
   * @type {String|Number}-num
   * @type {Number}-place
   * @returns this operator
   */
  round: string | number;
  /**
   * @method pull Operator
   * The $pull operator  removes from an existing array all instances of a value or values that match a specified condition.
   * @type {*}-arg
   * @returns this operator
   */
  pull: any;
  /**
   * @method reduce Operator
   * Applies an expression to each element in an array and combines them into a single value.
   * @type {Reduce }-arg  {input: any[] | string;initialValue: any; in: any}
   * @returns this operator
   */
  reduce: Reduce;
  /**
   * @method filter Operator
   * Selects a subset of an array to return based on the specified condition. Returns an array with only those elements that match the condition. The returned elements are in the original order.
   * @type {Filter}-arg  {input: any[]; as?: String;  cond: any }
   * @returns this operator
   */
  filter: Filter;
  /**
   * @method ifNull Operator
   * Evaluates an expression and returns the value of the expression if the expression evaluates to a non-null value. If the expression evaluates to a null value, including instances of undefined values or missing fields, returns the value of the replacement expression.
   * @type {any[] }-arg
   * @returns this operator
   */
  ifNull: any[];
  /**
   * @method  arrayElemAt Operator
   * Returns the element at the specified array index.
   * @type {any[] }-arg
   * @returns this operator
   */
  arrayElemAt: any[];
}
interface AggregationOptions {
  allowDiskUse: Boolean;
  serializeFunctions: Boolean;
}
interface Lookup {
  from: String;
  localField?: String | undefined;
  foreignField?: String | undefined;
  as?: String | undefined;
}
interface pipelineLookup {
  from: String;
  let?: string | undefined;
  pipeline?: any[] | undefined;
  as?: String | undefined;
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
interface Unwind {
  path: string;
  includeArrayIndex?: string | undefined;
  preserveNullAndEmptyArrays?: boolean | undefined;
}
interface Match {
  [propName: string]: any;
}
interface AddFields {
  [propName: string]: any;
}
interface Project {
  [propName: string]: any;
}
interface Set {
  [propName: string]: any;
}
interface Group {
  [propName: string]: any;
  _id: string | null | any;
}
interface Facet {
  [propName: string]: any[];
}
interface Accumulator {
  init: any;
  initArgs?: any[] | undefined;
  accumulate: any;
  accumulateArgs: string[];
  merge: string | any;
  finalize?: string | any;
  lang: string;
}
interface Reduce {
  input: any[] | string;
  initialValue: any;
  in: any;
}
interface Filter {
  input: any[];
  as?: String | undefined;
  cond: any;
}
export {};