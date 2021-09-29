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
interface Lookupstage {
  $lookup: Lookup;
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
  constructor(model?: any) {
    this.model = model;
    this.aggs = this.aggs || [];
  }

  openStage: (suffix: string, options?: Options) => boolean = (
    suffix,
    options
  ) => {
    try {
      if (!this.isIf) {
        this.isIf = true;
        return false;
      }
      this.isIf = true;

      if (options && options.alone && this.alone(`${options.alone}_${suffix}`))
        return false;
      if (options && options.notOnly && this.notOnly(`${options.notOnly}`))
        return false;
      if (options && options.only && this.only(`${options.only}`)) return false;
      return true;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };
  closeStage: (stage: any, options?: Options) => void = (stage, options) => {
    try {
      if (this.isFacet) {
        const latestStage = this.aggs[this.aggs.length - 1];
        let key: string = this.currentFacetKey || "";
        if (
          !latestStage.hasOwnProperty("$facet") ||
          !Array.isArray(latestStage.$facet[key])
        )
          throw "Start facet stage first";
        latestStage.$facet[key].push(stage);
      } else this.aggs.push(stage);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };
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
  lookup: (arg: Lookup, options?: Options) => AggregationBuilder = function (
    arg,
    options
  ) {
    if (!this.openStage("lookup", options)) return this;

    let stage: any;
    if (arg && arg.pipeline) {
      /**
       * @see pipelineLookup
       */
      stage = { $lookup: {} };
      if (!arg.pipeline)
        throw "key 'pipeline' is required to build lookup aggregation stage";
      if (!arg.from)
        throw "key 'from' is required to build lookup aggregation stage";
      stage.$lookup.from = arg.from;
      stage.$lookup.let = arg.let;
      stage.$lookup.pipeline = arg.pipeline || [];
      stage.$lookup.as = arg.as || arg.as;
      this.closeStage(stage);
    } else if (arg && arg.localField) {
      /**
       * @see Lookup
       */
      stage = { $lookup: {} };
      if (arg && !arg.from)
        throw "key 'from'  is required to build lookup aggregation stage";
      if (arg && !arg.localField)
        throw "key 'localField'  is required to build lookup aggregation stage";
      stage.$lookup.from = arg.from;
      stage.$lookup.localField = arg.localField;
      stage.$lookup.foreignField = arg.foreignField || "_id";
      stage.$lookup.as = arg.as || arg.localField;
      this.closeStage(stage);
    }
    if (options && options.unwind) {
      /**
       * @see unwind
       */
      const unwindStage = {
        $unwind: {
          path: `$${stage.$lookup.as}`,
          preserveNullAndEmptyArrays:
            options.preserveNullAndEmptyArrays == false ? false : true,
        },
      };
      this.closeStage(unwindStage);
    }
    return this;
  };
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
  unwind: (arg: Unwind, options?: Options) => AggregationBuilder = function (
    arg,
    options
  ) {
    if (!this.openStage("unwind", options)) return this;
    /**
     * @see Unwind
     */
    const stage = { $unwind: arg };
    this.closeStage(stage);
    return this;
  };
  /**
   *  @method matchSmart Stage
   * Filters the documents to pass only the documents that match the specified condition(s)
   * @type {[propName: string]: any} - arg
   * @return this stage
   */
  matchSmart: (arg: Match, options?: Options) => AggregationBuilder = function (
    arg,
    options
  ) {
    if (!this.openStage("match", options)) return this;
    let stage;
    /**
     * @see Match
     */
    if (this.aggs.length && this.aggs[this.aggs.length - 1].$match)
      stage = this.aggs.pop();
    else stage = { $match: {} };

    if (options && options.or) {
      stage.$match.$or = stage.$match.$or || [];
      stage.$match.$or.push(arg);
    } else {
      stage.$match.$and = stage.$match.$and || [];
      stage.$match.$and.push(arg);
    }

    this.closeStage(stage);
    return this;
  };
  /**
   * @method match Stage
   * Filters the documents to pass only the documents that match the specified condition(s)
   * @type {[propName: string]: any} - arg
   * @return this stage
   *    */
  match: (arg: Match, options?: Options) => AggregationBuilder = function (
    arg,
    options
  ) {
    if (!this.openStage("match", options)) return this;
    if (options && (options.smart || options.or || options.and))
      return this.matchSmart(arg, options);
    let stage;
    /**
     * @see Match
     */
    if (this.aggs.length && this.aggs[this.aggs.length - 1].$match)
      stage = this.aggs.pop();
    else stage = { $match: {} };

    Object.assign(stage.$match, arg);
    this.closeStage(stage);
    return this;
  };
  /**
   * @method addFields Stage
   * Adds new fields to documents
   * @type {[propName: string]: string | any} - fields,
   * @return this stage
   */
  addFields: (fields: AddFields, options?: Options) => AggregationBuilder =
    function (fields, options) {
      if (!this.openStage("addFields", options)) return this;
      /**
       * @see AddFields
       */
      const stage = { $addFields: fields };
      this.closeStage(stage);
      return this;
    };
  /**
   * @method project Stage
   * specified fields can be existing fields from the input documents or newly computed fields.
   * @type {[propName: string]: number | string | any} - projection
   * @return this stage
   */
  project: (projection: Project, options?: Options) => AggregationBuilder = (
    projection,
    options
  ) => {
    try {
      if (!this.openStage("project", options)) return this;
      /**
       * @see Project
       */
      const stage = { $project: projection };
      this.closeStage(stage);
      return this;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };
  amendProject: (projection: Project, options?: Options) => AggregationBuilder =
    (projection, options) => {
      try {
        if (!this.openStage("project", options)) return this;
        let latestStage = this.aggs[this.aggs.length - 1];
        if (!latestStage.hasOwnProperty("$project")) {
          if (!this.isFacet) return this;
          else {
            const key: string = this.currentFacetKey || "";
            latestStage =
              latestStage.$facet[key][latestStage.$facet[key].length - 1];
            if (!latestStage.hasOwnProperty("$project")) return this;
          }
        }
        Object.assign(latestStage.$project, projection);
        return this;
      } catch (e) {
        console.error(e);
        throw e;
      }
    };
  /**
   * @method limit Stage
   * Limits the number of documents passed to the next stage in the pipeline.
   * @type {Number} - Limit
   * @return this stage
   */
  limit: (limit: Number, options?: Options) => AggregationBuilder = function (
    limit,
    options
  ) {
    if (!this.openStage("limit", options)) return this;
    const stage = { $limit: limit };
    this.closeStage(stage);
    return this;
  };

  /**
   * @method skip Stage
   *Skips over the specified number of documents that pass into the stage and passes the remaining documents to the next stage in the pipeline.
   * @type {Number} - skip
   * @return this stage
   */
  skip: (skip: Number, options?: Options) => AggregationBuilder = function (
    skip,
    options
  ) {
    if (!this.openStage("skip", options)) return this;
    const stage = { $skip: skip };
    this.closeStage(stage);
    return this;
  };
  /**
   * @method set Stage
   * replaces the value of a field with the specified value.
   *  @type {[propName: string]: string | any} - field
   * @return this stage
   */
  set: (field: Set, options?: Options) => AggregationBuilder = function (
    field,
    options
  ) {
    if (!this.openStage("set", options)) return this;
    /**
     * @see Set
     */
    const stage = { $set: field };
    this.closeStage(stage);
    return this;
  };
  /**
   * @method group Stage
   * Groups input documents by the specified _id expression and for each distinct grouping, outputs a document.The _id field of each output document contains the unique group by value.
   * @type {Group} - arg
   * @type { _id: string | null | any} - Group._id;
   * @type {[propName: string]: any} - Group.propName
   * @return this stage
   */
  group: (id: any, arg: Group, options?: Options) => AggregationBuilder =
    function (id, arg, options) {
      if (!this.openStage("group", options)) return this;
      let stage: any;
      /**
       * @see Group
       *
       */
      stage = { $group: arg };
      stage.$group._id = id;
      if (options?.checkLookup?.length) {
        options.checkLookup.forEach((key) => {
          if (stage.$group._id[key]) {
            stage.$group._id[key] = `${stage.$group._id[key]}._id`;
          }
        });
      }
      this.closeStage(stage);
      return this;
    };
  /**
   * @method amendGroup Stage
   * *****
   * @type {Group} - arg
   * @type { _id: string | null | any} - Group._id;
   * @type {[propName: string]: any} - Group.propName
   * @return this stage
   */
  amendGroup: (
    id: any,
    arg: Group,
    lookup_arg?: Lookup,
    options?: amendGroupOptions
  ) => AggregationBuilder = function (id, arg, lookup_arg, options) {
    try {
      if (!this.openStage("group", options)) return this;

      const latestStage = this.aggs[this.aggs.length - 1];
      if (!latestStage.hasOwnProperty("$group")) return this;

      if (!latestStage.$group._id) latestStage.$group._id = {};
      else if (typeof latestStage.$group._id == "string")
        throw new Error("group._id is String, please convert it to object");

      Object.assign(latestStage.$group._id, id);
      Object.assign(latestStage.$group, arg);

      if (options?.applyLookup) {
        this.aggs.pop();
        this.lookup(lookup_arg, options?.lookupOptions);
        this.closeStage(latestStage);
      }
      return this;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };
  /**
   * @method sort Stage
   * Sorts all input documents and returns them to the pipeline in sorted order.
   *  @type {Sort} - sortOrder
   * [1-->Sort ascending; -1-->Sort descending].
   * @see Sort
   * @return this stage
   */
  sort: (sortOrder: Sort, options?: Options) => AggregationBuilder = function (
    sortOrder,
    options
  ) {
    if (!this.openStage("sort", options)) return this;
    const stage = { $sort: sortOrder };
    this.closeStage(stage);
    return this;
  };
  /**
   * @method facet Stage
   * Processes multiple aggregation pipelines within a single stage on the same set of input documents.
   * @type {[propName: string]: any[]} - arg
   * @return this stage
   */
  facet: (arg: Facet, options?: Options) => AggregationBuilder = function (
    arg,
    options
  ) {
    if (!this.openStage("facet", options)) return this;
    let stage: any;
    /**
     * @see Facet
     */
    stage = { $facet: arg };
    this.closeStage(stage);
    return this;
  };
  isFacet: boolean = false;
  currentFacetKey: string | undefined = undefined;
  startFacet: (stage_name: string, options?: Options) => AggregationBuilder = (
    stage_name,
    options
  ) => {
    try {
      if (!this.openStage("facet", options)) return this;
      const latestStage = this.aggs[this.aggs.length - 1];
      if (latestStage.hasOwnProperty("$facet")) {
        Object.assign(latestStage.$facet, { [stage_name]: [] });
      } else {
        let stage: any;
        /**
         * @see Facet
         */
        stage = { $facet: { [stage_name]: [] } };
        this.closeStage(stage);
      }
      this.isFacet = true;
      this.currentFacetKey = stage_name;
      return this;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };
  endFacet: (options?: Options) => AggregationBuilder = (options) => {
    if (!this.openStage("facet", options)) return this;
    this.isFacet = false;
    this.currentFacetKey = undefined;
    return this;
  };
  /**
   * @method replaceRoot Stage
   * Replaces the input document with the specified document.
   *  @type {Any} - newRoot
   * @return this stage
   */
  replaceRoot: (key: string | any, options?: Options) => AggregationBuilder = (
    key,
    options
  ) => {
    if (!this.openStage("replaceRoot", options)) return this;
    let stage
    if(typeof key == "string")
     stage = { $replaceRoot: { newRoot: `$${key}` } };
    else
      stage = { $replaceRoot: { newRoot: key } };

    this.closeStage(stage);
    return this;
  };
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
  dateFromString = function (
    dateString: String | any,
    format?: String | any,
    timezone?: string | any,
    onNull?: string | any,
    options?: Options
  ) {
    try {
      const stage: {
        $dateFromString: {
          dateString: string | any;
          format?: string;
          timezone?: string;
          onNull?: string;
        };
      } = {
        $dateFromString: {
          dateString: dateString,
        },
      };
      if (format) {
        stage.$dateFromString.format = format;
      }
      if (timezone) {
        stage.$dateFromString.timezone = timezone;
      }
      if (onNull) {
        stage.$dateFromString.onNull = onNull;
      }

      return stage;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };
  /**
   * @method reduceAndConcat Stage
   * Replaces the input document with the specified document.
   *  @type {Any} - newRoot
   * @return this stage
   */
  reduceAndConcat: (
    input: string,
    initialValue: any,
    key?: string,
    condition?: any,
    options?: reduceAndConcatOptions
  ) => any = (input, initialValue, key, condition, options) => {
    if (input[0] != "$") input = `$${input}`;

    const stage = {
      $reduce: {
        input: input,
        initialValue: initialValue,
        in: {},
      },
    };
    if (options?.withCondition) {
      stage.$reduce.in = {
        $concat: [
          "$$value",
          {
            $cond: [
              {
                $and: [{ $gt: [{ $strLenCP: "$$value" }, 0] }, condition],
              },
              " | ",
              "",
            ],
          },
          {
            $cond: [condition, key ? `$$this.${key}` : "$$this", ""],
          },
        ],
      };
    } else {
      stage.$reduce.in = {
        $concat: [
          "$$value",
          {
            $cond: [{ $gt: [{ $strLenCP: "$$value" }, 1] }, " | ", ""],
          },
          key ? `$$this.${key}` : "$$this",
        ],
      };
    }
    return stage;
  };
  // /**
  //  * @method  dateFromString   Operator
  //  * Converts a date/time string to a date object.
  //  * @type { String | Any} - dateString : The date/time string to convert to a date object.
  //  * @type {String | Any} - format : Optional. The date format specification of the dateString
  //  * @type {String | Any} - timezone : 	Optional. The time zone to use to format the date.
  //  * @type {String | Any} - onError : Optional. If $dateFromString encounters an error while parsing the given dateString
  //  * @type {String | Any} - onNull :Optional. If the dateString provided to $dateFromString is null or missing,
  //  * @returns this stage
  //  */
  // dateFromString = function (dateString: String | any, format?: String | any, timezone?: string | any, onNull?: string | any, options?: Options) {
  //   try {
  //     const stage: {
  //       $dateFromString: {
  //         dateString: string | any;
  //         format?: string;
  //         timezone?: string;
  //         onNull?: string;
  //       };
  //     } = { $dateFromString: { dateString: dateString } };
  //     if (format) stage.$dateFromString.format = format;
  //     if (timezone) stage.$dateFromString.timezone = timezone;
  //     if (onNull) stage.$dateFromString.onNull = onNull;
  //     return stage;
  //   } catch (e) {
  //     console.error(e);
  //     throw e;
  //   }
  // };
  /**
   * Concatenates strings and returns the concatenated string.
   * @method concat Operator
   *  @type { any[] } - arr
   *  can be any valid expression as long as they resolve to strings.
   * @return This operator
   */
  concat = function (arr: any[]) {
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

    if (arg2 !== undefined) {
      arr = [arg1, arg2];
    } else if (!Array.isArray(arg1)) {
      arr = [arg1];
    } else {
      arr = arg1;
    }
    return { $eq: arr };
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
  ne = function (arg1: any, arg2: any) {
    let arr;

    if (arg2 !== undefined) {
      arr = [arg1, arg2];
    } else if (!Array.isArray(arg1)) {
      arr = [arg1];
    } else {
      arr = arg1;
    }
    return { $ne: arr };
  };
  /**
   * Converts a date object to a string according to a user-specified format.
   * @method  dateToString Operator
   *  @type {string} date -The date to convert to string.must be a valid expression that resolves to a Date, a Timestamp, or an ObjectID.
   *  @type {*} format -Optional- The date format specification
   *  @type {string} timezone -Optional- The timezone of the operation result
   * @return this operator
   */
  dateToString = function (
    date: String | any,
    format?: any,
    timezone?: String
  ) {
    let res: Res = {
      date: date,
      format: format && format != false ? format : "%Y-%m-%d",
      timezone: timezone,
    };
    if (timezone) res.timezone = timezone;
    return { $dateToString: res };
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
    let data: Convert = {
      input: input,
      to: to,
    };
    return { $convert: data };
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
   * @type {Number|null} - d
   * @returns console.dir(this.aggs,{depth:depth|null})
   */
  show = function (d?: Number) {
    let depth = d ? d : null;
    console.dir(this.aggs, { depth: depth || null });
    return this;
  };
  /**
   * @method alone Operator
   * @type {String} - key
   * @returns Boolean
   */
  alones: any = {};
  alone = function (key: string) {
    if (!this.alones[key]) {
      this.alones[key] = key.split("_")[0];
      return false;
    } else {
      return true;
    }
  };
  /**
   * @method only Operator
   * @type {String} - key
   * @returns Boolean
   */
  only = function (key: String) {
    return Object.values(this.alones).includes(key) ? false : true;
  };
  notOnly: (key: String) => Boolean = (key) => {
    try {
      return !this.only(key);
    } catch (e) {
      throw e;
    }
  };
  isIf: Boolean = true;
  if: (condition: any, options?: Options) => AggregationBuilder = function (
    condition,
    options
  ) {
    // if  = function (condition: any, options: Options) {
    if (condition) this.isIf = true;
    else this.isIf = false;
    return this;
  };

  /**
   * @method addToSet Operator
   * Returns an array of all unique values that results from applying an expression to each document in a group of documents that share the same group by key
   *$addToSet is only available in the $group stage.
   * @type {*} - key
   * @returns this operator
   */
  addToSet = function (key: any) {
    return { $addToSet: key };
  };
  /**
   * @method avg Operator
   * Returns the average value of the numeric values. $avg ignores non-numeric values.
   * @type {*} - key
   * @returns this operator
   */
  avg = function (key: any) {
    return { $avg: key };
  };
  /**
   * @method first Operator
   * Returns the first element in an array.
   * @type {string} - key
   * @returns this operator
   */
  first = function (key: string) {
    return { $first: key };
  };
  /**
   * @method last Operator
   * Returns the last element in an array.
   * @type {string} - key
   * @returns this operator
   */
  last = function (key: string) {
    return { $last: key };
  };
  /**
   * @method max Operator
   * Returns the maximum value
   * @type {string} - key
   * @returns this operator
   */
  max = function (key: string) {
    return { $max: key };
  };
  /**
   * @method min Operator
   * Returns the minimum value
   * @type {string} - key
   * @returns this operator
   */
  min = function (key: string) {
    return { $min: key };
  };
  /**
   * @method sum Operator
   * Calculates and returns the sum of numeric values. $sum ignores non-numeric values.
   * @type {string|Number| any[]} - data
   * @returns this operator
   */
  sum = function (data: string | Number | any[]) {
    return { $sum: data };
  };
  /**
   * @method multiply Operator
   * Multiplies numbers together and returns the result. Pass the arguments to $multiply in an array.
   * @type {string|number} - key1
   * @type {string|number} - key2
   * @returns this operator
   */
  multiply = function (key1: string | number, key2: string | number) {
    return { $multiply: [key1, key2] };
  };
  /**
   * @method in Operator
   * Returns a boolean indicating whether a specified value is in an array.
   * @type {any[]} - key
   * @returns this operator
   */
  in = function (key: any[]) {
    return { $in: key };
  };
  /**
   * @method size Operator
   * Counts and returns the total number of items in an array.
   * @type {any} - key
   * @returns this operator
   */
  size = function (key: any) {
    return { $size: key };
  };
  /**
   * @method mergeObjects Operator
   * Combines multiple documents into a single document.
   * @type {string|any[]} - key
   * @returns this operator
   */
  mergeObjects = function (key: string | any[]) {
    return { $mergeObjects: key };
  };
  /**
   * @method concatArrays Operator
   * Concatenates arrays to return the concatenated array.
   * @type {any[]} - arr1
   * @type {any[]} - arr2 ,
   * @returns this operator
   */
  concatArrays = function (arr1: any[], arr2: any[]) {
    return { $concatArrays: [arr1, arr2] };
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
  accumulator = function (args: Accumulator) {
    /**
     * @see Accumulator
     */
    return { $accumulator: args };
  };
  /**
   * @method round Operator
   * Rounds a number to a whole integer or to a specified decimal place.
   * @type {String|Number} - num
   * @type {Number} - place
   * @returns this operator
   */
  round = function (num: String | Number, place: Number) {
    return { $round: [num, place] };
  };
  /**
   * @method pull Operator
   * The $pull operator  removes from an existing array all instances of a value or values that match a specified condition.
   * @type {*} - arg
   * @returns this operator
   */
  pull = function (arg: any) {
    return { $pull: arg };
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
  reduce = function (arg: Reduce) {
    /**
     * @see Reduce
     */
    return { $reduce: arg };
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
   * @type {any[] } - arg
   * @returns this operator
   */
  arrayElemAt = function (key: any[]) {
    return { $arrayElemAt: key };
  };
  /**
   * @method  or Operator
   * The $or operator performs a logical OR operation on an array of two or more <expressions>
   * and selects the documents that satisfy at least one of the <expressions>.
   * @type {any} - arg
   * @returns this operator
   */
  or = function (arg: any[]) {
    return { $or: arg };
  };
  /**
   * @method  and Operator
   * $and performs a logical AND operation on an array of one or more expressions
   * and selects the documents that satisfy all the expressions in the array.
   * @type {any} - arg
   * @returns this operator
   */
  and = function (arg: any[]) {
    return { $and: arg };
  };
  /**
   * @method  gt Operator
   * selects those documents where the value of the field is greater than (i.e. >) the specified value
   * @type {any} - arr1
   * @type {any} - arr2
   * @returns this operator
   */
  gt = function (arg1: any, arg2: any) {
    let arr;
    if (arg2 !== undefined) arr = [arg1, arg2];
    else if (!Array.isArray(arg1)) arr = [arg1];
    else arr = arg1;
    return { $gt: arr };
  };
  /**
   * @method  gte Operator
   * selects the documents where the value of the field is greater than or equal to (i.e. >=) a specified value (e.g. value.)
   * @type {any } - arr1
   * @type {any} - arr2
   * @returns this operator
   */
  gte = function (arg1: any, arg2: any) {
    let arr;
    if (arg2 !== undefined) arr = [arg1, arg2];
    else if (!Array.isArray(arg1)) arr = [arg1];
    else arr = arg1;
    return { $gte: arr };
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
  lt = function (arg1: any, arg2: any) {
    let arr;

    if (arg2 !== undefined) {
      arr = [arg1, arg2];
    } else if (!Array.isArray(arg1)) {
      arr = [arg1];
    } else {
      arr = arg1;
    }
    return { $lt: arr };
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
  lte = function (arg1: any, arg2: any) {
    let arr;

    if (arg2 !== undefined) {
      arr = [arg1, arg2];
    } else if (!Array.isArray(arg1)) {
      arr = [arg1];
    } else {
      arr = arg1;
    }
    return { $lte: arr };
  };
  /**
   * @method  push Operator
   * The $push operator appends a specified value to an array.
   * If the field is not an array, the operation will fail.
   * @type { string|number[]} - arg
   * @returns this operator
   */
  push = function (arg: string | number[]) {
    return { $push: arg };
  };
  /**
   * @method  expr Operator
   * Allows the use of aggregation expressions within the query language.
   * @type { any} - arg
   * @returns this operator
   */
  expr = function (arg: any) {
    return { $expr: arg };
  };
  /**
   * @method  strLenCP Operator
   * Returns the number of UTF-8 code points in the specified string.
   * @type {String} - str
   * @returns this operator
   */
  strLenCP = function (str: string) {
    return { $strLenCP: str };
  };
  /**
   * @method  subtract  Operator
   * Subtracts two numbers to return the difference
   * @type {Number | String | Any} - exp1
   * @type {Number | String | Any} - exp2

   * @returns this operator
   */
  subtract = function (
    exp1: Number | String | any,
    exp2: Number | String | any
  ) {
    return { $subtract: [exp1, exp2] };
  };
  /**
   * @method  divide  Operator
   * Divides one number by another and returns the result.
   * @type {Number | String | Any} - exp1
   * @type {Number | String | Any} - exp2
   * @returns this operator
   */
  divide = function (exp1: Number | String | any, exp2: Number | String | any) {
    return { $divide: [exp1, exp2] };
  };
  /**
   * @method  add  Operator
   * Adds numbers together or adds numbers and a date.
   * @type {Number | String | Any} - exp1
   * @type {Number | String | Any} - exp2
   * @returns this operator
   */
  add = function (exp1: Number | String | any, exp2: Number | String | any) {
    return { $add: [exp1, exp2] };
  };
  /**
   * @method  function  Operator
   *Defines a custom aggregation function or expression in JavaScript.
   * @type {Any} - body
   * @type { Any[]} - args
   * @type {string} - lang
   * @returns this operator
   */
  function = function (body: any, args: any[], lang: string) {
    return {
      $function: {
        body: body,
        args: args,
        lang: lang,
      },
    };
  };
  /**
   * @method  isNumber Operator
   * checks if the specified expression resolves to one of the following numeric BSON
   * @type {string | number} - arg
   * @returns this operator
   */
  isNumber = function (arg: string | number) {
    return { $isNumber: arg };
  };
  /**
   * @method switch Stage
   * Evaluates a series of case expressions. When it finds an expression which evaluates to true,
   *  $switch executes a specified expression and breaks out of the control flow.
   * @type {[propName: string]: any[]} - branches
   * @type {string|any} - arg
   * @return this operator
   */
  switch = function (
    branches: { [propName: string]: any },
    arg?: string | any
  ) {
    try {
      const stage: {
        $switch: {
          branches: { [propName: string]: any };
          default?: string;
        };
      } = { $switch: { branches: branches } };
      if (arg) stage.$switch.default = arg;
      return stage;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };
  /**
   * @method  map  Operator
   * Applies an expression to each item in an array and returns an array with the applied results.
   * * @type { String } - inputAn expression that resolves to an array.
   * @type { String } - as - Optional. A name for the variable that represents each individual element of the input array.
   * @type {any} -expr  -An expression that is applied to each element of the input array.
   * @returns this operator
   */
  map = function (input: string, as?: string, expr?: any) {
    try {
      const stage: {
        $map: {
          input: string;
          as?: string;
          in: any;
        };
      } = { $map: { input: input, in: expr } };
      if (as) stage.$map.as = as;
      return stage;
    } catch (e) {
      console.error(e);
      throw e;
    }
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
  substr = function (str: string, start: number, length: number): any {
    try {
      return { $substr: [str, start, length] };
    } catch (e) {
      console.error(e);
      throw e;
    }
  };
  //   /**
  //  * @method  isArray  Operator
  //  * Determines if the operand is an array. Returns a boolean.
  //  * @type { any } - arg -can be any valid expression.
  //  * @returns this operator
  //  */
  //    isArray = function (arg: any): any {
  //     try {
  //       return { $isArray: arg };
  //     } catch (e) {
  //       console.error(e);
  //       throw e;
  //     }
  //   };
}
