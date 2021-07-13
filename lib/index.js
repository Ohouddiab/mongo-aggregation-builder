var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
export class AggregationBuilder {
  constructor(model) {
    this.opts = {
      allowDiskUse: true,
      serializeFunctions: true,
    };
    this.aggs = [];
    this.option = function (options) {
      this.opts.allowDiskUse = options.allowDiskUse || true;
      this.opts.serializeFunctions = options.serializeFunctions || true;
    };
    //console.log("this model", this.model);
    /**
     * @function lookup Stage
     * Performs a left outer join to an unsharded collection in the same database to filter in documents from the "joined" collection for processing. To each input document, the $lookup stage adds a new array field whose elements are the matching documents from the "joined" collection. The $lookup stage passes these reshaped documents to the next stage.
     * @type Lookup-arg {from:string,localField:string,foreignField:string,as:string} from and localField are required.
     * @type pipelineLookup-arg {from:string,let:_let,pipeline:any[],as:string} from and pipeline are required.
     * @return this stage
     */
    this.lookup = function (arg, options) {
      if (options && options.alone && this.alone(`${options.alone}_lookup`))
        return this;
      if (options && options.only && this.only(`${options.only}`)) return this;
      let stage;
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
    this.unwind = function (arg, options) {
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
    this.matchSmart = function (arg, options) {
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
    this.match = function (arg, options) {
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
    this.addFields = function (filelds, options) {
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
    this.project = function (projection, options) {
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
    this.limit = function (limit, options) {
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
    this.skip = function (skip, options) {
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
    this.set = function (field, options) {
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
    this.group = function (arg, options) {
      if (options && options.alone && this.alone(`${options.alone}_group`))
        return this;
      if (options && options.only && this.only(`${options.only}`)) return this;
      let stage;
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
    this.sort = function (sortOrder, options) {
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
    this.facet = function (arg, options) {
      if (options && options.only && this.only(`${options.only}`)) return this;
      if (options && options.alone && this.alone(`${options.alone}_facet`))
        return this;
      let stage;
      stage = { $facet: arg };
      this.aggs.push(stage);
      this.isIf = false;
      return this;
    };
    /**
     * Concatenates strings and returns the concatenated string.
     * @method concat Operator
     *  @type {string[]}-arr  can be any valid expression as long as they resolve to strings.
     * @return This operator
     */
    this.concat = function (arr) {
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
    this.cond = function (IF, THEN, ELSE) {
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
    this.eq = function (arg1, arg2) {
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
    this.dateToString = function (date, format, timezone) {
      let res = {
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
    this.convert = function (input, to) {
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
    this.toObjectId = function (arg) {
      return { $toObjectId: arg };
    };
    /**
     * Returns the year portion of a date.
     * @method  year Operator
     * @type {string} date -	The date to which the operator is applied { Date, a Timestamp, or an ObjectID}.
     * @type {string} timezone -Optional-The timezone of the operation result.
     * @return this Operator
     */
    this.year = function (date, timezone) {
      return {
        $year: { date: date, timezone: timezone ? timezone : undefined },
      };
    };
    /**
     * Return the week of the year for a date as a number between 0 and 53.
     * @method  week Operator
     * @type {string} date -	The date to which the operator is applied { Date, a Timestamp, or an ObjectID}.
     * @type {string} timezone -Optional-The timezone of the operation result.
     * @return this Operator
     */
    this.week = function (date, timezone) {
      return {
        $week: { date: date, timezone: timezone ? timezone : undefined },
      };
    };
    /**
     *  Return the month of a date as a number between 1 and 12
     * @method  month Operator
     * @type {string} date -	The date to which the operator is applied { Date, a Timestamp, or an ObjectID}.
     * @type {string} timezone -Optional-The timezone of the operation result.
     * @return this Operator
     */
    this.month = function (date, timezone) {
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
    this.dayOfMonth = function (date, timezone) {
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
    this.isArray = function (arg) {
      return { $isArray: arg };
    };
    /**
     *
     * @returns
     */
    this.commit = function () {
      return __awaiter(this, void 0, void 0, function* () {
        return yield this.model.aggregate(this.aggs).option(this.opts);
      });
    };
    this.get = function () {
      return this.aggs;
    };
    /**
     * @method show Operator
     * @type {Number|null} d
     * @returns console.dir(this.aggs,{depth:depth|null})
     */
    this.show = function (d) {
      let depth = d ? d : null;
      console.dir(this.aggs, { depth: depth || null });
      return this;
    };
    this.alones = {};
    this.alone = function (key) {
      if (this.alones[key]) {
        this.alones[key] = key.split("_")[0];
        return false;
      } else {
        return true;
      }
    };
    this.only = function (key) {
      return Object.values(this.alones).includes(key) ? false : true;
    };
    this.isIf = false;
    this.if = function (condition, options) {
      if (condition) this.isIf = true;
    };
    /**
     * @method addToSet Operator
     * Returns an array of all unique values that results from applying an expression to each document in a group of documents that share the same group by key
     *$addToSet is only available in the $group stage.
     * @type {*} key
     * @returns this operator
     */
    this.addToSet = function (key) {
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
    this.avg = function (key) {
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
    this.first = function (key) {
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
    this.last = function (key) {
      return { $last: key };
    };
    /**
     * @method max Operator
     * Returns the maximum value
     * @type {string} key
     * @returns this operator
     */
    this.max = function (key) {
      return { $max: key };
    };
    /**
     * @method min Operator
     * Returns the minimum value
     * @type {string} key
     * @returns this operator
     */
    this.min = function (key) {
      return { $min: key };
    };
    /**
     * @method push Operator
     *The $push operator appends a specified value to an array.
     *If the field is not an array, the operation will fail.
     * @type {*} data
     * @returns this operator
     */
    this.push = function (data) {
      return { $push: data };
    };
    /**
     * @method sum Operator
     * Calculates and returns the sum of numeric values. $sum ignores non-numeric values.
     * @type {string|1| any[]} data
     * @returns this operator
     */
    this.sum = function (data) {
      return { $sum: data };
    };
    /**
     * @method multiply Operator
     * Multiplies numbers together and returns the result. Pass the arguments to $multiply in an array.
     * @type {string|number} key1
     * @type {string|number} key2
     * @returns this operator
     */
    this.multiply = function (key1, key2) {
      return { $multiply: [key1, key2] };
    };
    /**
     * @method in Operator
     * Returns a boolean indicating whether a specified value is in an array.
     * @type {any[]} key
     * @returns this operator
     */
    this.in = function (key) {
      return { $in: key };
    };
    /**
     * @method size Operator
     * Counts and returns the total number of items in an array.
     * @type {string} ke
     *y
     * @returns this operator
     */
    this.size = function (key) {
      return { $size: key };
    };
    /**
     * @method mergeObjects Operator
     * Combines multiple documents into a single document.
     * @type {string|any[]} key
     * @returns this operator
     */
    this.mergeObjects = function (key) {
      return { $mergeObjects: key };
    };
    /**
     * @method concatArrays Operator
     * Concatenates arrays to return the concatenated array.
     * @type {any[]} arr1
     * @type {any[]} arr2 ,
     * @returns this operator
     */
    this.concatArrays = function (arr1, arr2) {
      return { $concatArrays: [arr1, arr2] };
    };
    /**
     * @method  accumulator Operator
     * Accumulators are operators that maintain their state as documents progress through the pipeline.
     * @type {Accumulator}-args {init:any;initArgs?: any[];accumulate:any;accumulateArgs: string[];merge: any;finalize?:any;lang: string}
     * @returns this operator
     */
    this.accumulator = function (args) {
      return { $accumulator: args };
    };
    this.model = model;
    this.aggs = this.aggs || [];
  }
}
