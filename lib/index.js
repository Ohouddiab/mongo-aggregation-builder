export default class AggregationBuilder {
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
    this.openStage = (suffix, options) => {
      try {
        if (!this.isIf) {
          this.isIf = true;
          return false;
        }
        this.isIf = true;
        if (
          options &&
          options.alone &&
          this.alone(`${options.alone}_${suffix}`)
        )
          return false;
        if (options && options.notOnly && this.notOnly(`${options.notOnly}`))
          return false;
        if (options && options.only && this.only(`${options.only}`))
          return false;
        return true;
      } catch (e) {
        console.error(e);
        throw e;
      }
    };
    this.closeStage = (stage, options) => {
      try {
        if (this.isFacet) {
          const latestStage = this.aggs[this.aggs.length - 1];
          let key = this.currentFacetKey || "";
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
    this.lookup = function (arg, options) {
      if (!this.openStage("lookup", options)) return this;
      let stage;
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
    this.unwind = function (arg, options) {
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
    this.matchSmart = function (arg, options) {
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
    this.match = function (arg, options) {
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
    this.addFields = function (fields, options) {
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
    this.project = (projection, options) => {
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
    this.amendProject = (projection, options) => {
      try {
        if (!this.openStage("project", options)) return this;
        let latestStage = this.aggs[this.aggs.length - 1];
        if (!latestStage.hasOwnProperty("$project")) {
          if (!this.isFacet) return this;
          else {
            const key = this.currentFacetKey || "";
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
    this.limit = function (limit, options) {
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
    this.skip = function (skip, options) {
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
    this.set = function (field, options) {
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
    this.group = function (id, arg, options) {
      if (!this.openStage("group", options)) return this;
      let stage;
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
    this.amendGroup = function (id, arg, lookup_arg, options) {
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
    this.sort = function (sortOrder, options) {
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
    this.facet = function (arg, options) {
      if (!this.openStage("facet", options)) return this;
      let stage;
      /**
       * @see Facet
       */
      stage = { $facet: arg };
      this.closeStage(stage);
      return this;
    };
    this.isFacet = false;
    this.currentFacetKey = undefined;
    this.startFacet = (stage_name, options) => {
      try {
        if (!this.openStage("facet", options)) return this;
        const latestStage = this.aggs[this.aggs.length - 1];
        if (latestStage.hasOwnProperty("$facet")) {
          Object.assign(latestStage.$facet, { [stage_name]: [] });
        } else {
          let stage;
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
    this.endFacet = (options) => {
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
    this.replaceRoot = (key, options) => {
      if (!this.openStage("replaceRoot", options)) return this;
      const stage = { $replaceRoot: { newRoot: `$${key}` } };
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
    this.dateFromString = function (
      dateString,
      format,
      timezone,
      onNull,
      options
    ) {
      try {
        const stage = {
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
    this.reduceAndConcat = (input, initialValue, key, condition, options) => {
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
    this.ne = function (arg1, arg2) {
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
    this.dateToString = function (date, format, timezone) {
      let res = {
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
    this.convert = function (input, to) {
      let data = {
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
    this.commit = async function () {
      return await this.model.aggregate(this.aggs).option(this.opts);
    };
    this.get = function () {
      return this.aggs;
    };
    /**
     * @method show Operator
     * @type {Number|null} - d
     * @returns console.dir(this.aggs,{depth:depth|null})
     */
    this.show = function (d) {
      let depth = d ? d : null;
      console.dir(this.aggs, { depth: depth || null });
      return this;
    };
    /**
     * @method alone Operator
     * @type {String} - key
     * @returns Boolean
     */
    this.alones = {};
    this.alone = function (key) {
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
    this.only = function (key) {
      return Object.values(this.alones).includes(key) ? false : true;
    };
    this.notOnly = (key) => {
      try {
        return !this.only(key);
      } catch (e) {
        throw e;
      }
    };
    this.isIf = true;
    this.if = function (condition, options) {
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
    this.addToSet = function (key) {
      return { $addToSet: key };
    };
    /**
     * @method avg Operator
     * Returns the average value of the numeric values. $avg ignores non-numeric values.
     * @type {*} - key
     * @returns this operator
     */
    this.avg = function (key) {
      return { $avg: key };
    };
    /**
     * @method first Operator
     * Returns the first element in an array.
     * @type {string} - key
     * @returns this operator
     */
    this.first = function (key) {
      return { $first: key };
    };
    /**
     * @method last Operator
     * Returns the last element in an array.
     * @type {string} - key
     * @returns this operator
     */
    this.last = function (key) {
      return { $last: key };
    };
    /**
     * @method max Operator
     * Returns the maximum value
     * @type {string} - key
     * @returns this operator
     */
    this.max = function (key) {
      return { $max: key };
    };
    /**
     * @method min Operator
     * Returns the minimum value
     * @type {string} - key
     * @returns this operator
     */
    this.min = function (key) {
      return { $min: key };
    };
    /**
     * @method sum Operator
     * Calculates and returns the sum of numeric values. $sum ignores non-numeric values.
     * @type {string|Number| any[]} - data
     * @returns this operator
     */
    this.sum = function (data) {
      return { $sum: data };
    };
    /**
     * @method multiply Operator
     * Multiplies numbers together and returns the result. Pass the arguments to $multiply in an array.
     * @type {string|number} - key1
     * @type {string|number} - key2
     * @returns this operator
     */
    this.multiply = function (key1, key2) {
      return { $multiply: [key1, key2] };
    };
    /**
     * @method in Operator
     * Returns a boolean indicating whether a specified value is in an array.
     * @type {any[]} - key
     * @returns this operator
     */
    this.in = function (key) {
      return { $in: key };
    };
    /**
     * @method size Operator
     * Counts and returns the total number of items in an array.
     * @type {string} - key
     * @returns this operator
     */
    this.size = function (key) {
      return { $size: key };
    };
    /**
     * @method mergeObjects Operator
     * Combines multiple documents into a single document.
     * @type {string|any[]} - key
     * @returns this operator
     */
    this.mergeObjects = function (key) {
      return { $mergeObjects: key };
    };
    /**
     * @method concatArrays Operator
     * Concatenates arrays to return the concatenated array.
     * @type {any[]} - arr1
     * @type {any[]} - arr2 ,
     * @returns this operator
     */
    this.concatArrays = function (arr1, arr2) {
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
    this.accumulator = function (args) {
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
    this.round = function (num, place) {
      return { $round: [num, place] };
    };
    /**
     * @method pull Operator
     * The $pull operator  removes from an existing array all instances of a value or values that match a specified condition.
     * @type {*} - arg
     * @returns this operator
     */
    this.pull = function (arg) {
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
    this.reduce = function (arg) {
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
    this.filter = function (arg) {
      return { $filter: arg };
    };
    /**
     * @method ifNull Operator
     * Evaluates an expression and returns the value of the expression if the expression evaluates to a non-null value. If the expression evaluates to a null value, including instances of undefined values or missing fields, returns the value of the replacement expression.
     * @type {any[] }-arg
     * @returns this operator
     */
    this.ifNull = function (key) {
      return { $ifNull: key };
    };
    /**
     * @method  arrayElemAt Operator
     * Returns the element at the specified array index.
     * @type {any[] } - arg
     * @returns this operator
     */
    this.arrayElemAt = function (key) {
      return { $arrayElemAt: key };
    };
    /**
     * @method  or Operator
     * The $or operator performs a logical OR operation on an array of two or more <expressions>
     * and selects the documents that satisfy at least one of the <expressions>.
     * @type {any} - arg
     * @returns this operator
     */
    this.or = function (arg) {
      return { $or: arg };
    };
    /**
     * @method  and Operator
     * $and performs a logical AND operation on an array of one or more expressions
     * and selects the documents that satisfy all the expressions in the array.
     * @type {any} - arg
     * @returns this operator
     */
    this.and = function (arg) {
      return { $and: arg };
    };
    /**
     * @method  gt Operator
     * selects those documents where the value of the field is greater than (i.e. >) the specified value
     * @type {any} - arr1
     * @type {any} - arr2
     * @returns this operator
     */
    this.gt = function (arg1, arg2) {
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
    this.gte = function (arg1, arg2) {
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
    this.lt = function (arg1, arg2) {
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
    this.lte = function (arg1, arg2) {
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
    this.push = function (arg) {
      return { $push: arg };
    };
    /**
     * @method  expr Operator
     * Allows the use of aggregation expressions within the query language.
     * @type { any} - arg
     * @returns this operator
     */
    this.expr = function (arg) {
      return { $expr: arg };
    };
    /**
     * @method  strLenCP Operator
     * Returns the number of UTF-8 code points in the specified string.
     * @type {String} - str
     * @returns this operator
     */
    this.strLenCP = function (str) {
      return { $strLenCP: str };
    };
    /**
         * @method  subtract  Operator
         * Subtracts two numbers to return the difference
         * @type {Number | String | Any} - exp1
         * @type {Number | String | Any} - exp2
      
         * @returns this operator
         */
    this.subtract = function (exp1, exp2) {
      return { $subtract: [exp1, exp2] };
    };
    /**
     * @method  divide  Operator
     * Divides one number by another and returns the result.
     * @type {Number | String | Any} - exp1
     * @type {Number | String | Any} - exp2
     * @returns this operator
     */
    this.divide = function (exp1, exp2) {
      return { $divide: [exp1, exp2] };
    };
    /**
     * @method  add  Operator
     * Adds numbers together or adds numbers and a date.
     * @type {Number | String | Any} - exp1
     * @type {Number | String | Any} - exp2
     * @returns this operator
     */
    this.add = function (exp1, exp2) {
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
    this.function = function (body, args, lang) {
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
    this.isNumber = function (arg) {
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
    this.switch = function (branches, arg) {
      try {
        const stage = { $switch: { branches: branches } };
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
    this.map = function (input, as, expr) {
      try {
        const stage = { $map: { input: input, in: expr } };
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
    this.substr = function (str, start, length) {
      try {
        return { $substr: [str, start, length] };
      } catch (e) {
        console.error(e);
        throw e;
      }
    };
    this.model = model;
    this.aggs = this.aggs || [];
  }
}
