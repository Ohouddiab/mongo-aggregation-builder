interface Options {
    allowDiskUse: Boolean;
    serializeFunctions: Boolean;
  }
  interface Lookup {
    from?: String;
    localField?: String;
    foreignField?: String;
    as?: String;
  }
  interface Lookupstage {
    $lookup: Lookup;
  }
  
  export default class aggregationBuilder {
    opts: Options = {
      allowDiskUse: true,
      serializeFunctions: true,
    };
    model: any;
    aggs: any[];
    option = function (options: Options) {
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
     * @param arg object {from,localField,foreignField,as} from and localField are required.
     */
  
    lookup = function (arg, options) {
      if (options && options.alone && this.alone(`${options.alone}_lookup`))
        return this;
      if (options && options.only && this.only(`${options.only}`)) return this;
      let stage: Lookupstage = {
        $lookup: {},
      };
      if (!arg.from)
        throw "key 'from'  is required to build lookup aggregation stage";
      if (!arg.localField)
        throw "key 'localField'  is required to build lookup aggregation stage";
      stage.$lookup.from = arg.from;
      stage.$lookup.localField = arg.localField;
      stage.$lookup.foreignField = arg.foreignField || "_id";
      stage.$lookup.as = arg.as || arg.localField;
      //   }
      this.aggs.push(stage);
      if (options && options.unwind)
        this.aggs.push({
          $unwind: {
            path: `$${stage.$lookup.as}`,
            preserveNullAndEmptyArrays:
              options.preserveNullAndEmptyArrays == false ? false : true,
          },
        });
      return this;
    };
    matchSmart = function (arg, options) {
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
      return this;
    };
    match = function (arg, options) {
      if (options && options.only && this.only(`${options.only}`)) return this;
      if (options && options.alone && this.alone(`${options.alone}_match`))
        return this;
      if (!this.isIf) return this;
      if (options.smart || options.or || options.and)
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
      return this;
    };
    addFields = function (filelds, options) {
      if (options && options.only && this.only(`${options.only}`)) return this;
      if (options && options.alone && this.alone(`${options.alone}_addFields`))
        return this;
      this.aggs.push({ $addFields: filelds });
      return this;
    };
    project = function (projection, options) {
      if (options && options.only && this.only(`${options.only}`)) return this;
      if (options && options.alone && this.alone(`${options.alone}_project`))
        return this;
  
      this.aggs.push({ $project: projection });
      return this;
    };
    limit = function (limit, options) {
      if (options && options.only && this.only(`${options.only}`)) return this;
      if (options && options.alone && this.alone(`${options.alone}_project`))
        return this;
      this.aggs.push({ $limit: limit });
      return this;
    };
    concat = function (arr) {
      return { $concat: arr };
    };
    cond = function (IF, THEN, ELSE) {
      return {
        $cond: {
          if: IF,
          then: THEN,
          else: ELSE,
        },
      };
    };
  
    /**
     * @method  eq Operator
     */
    eq = function (arg1, arg2) {
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
    dateToString = function (date, format, timezone) {
      let res = {
        date: date,
        format: format && format != false ? format : "%Y-%m-%d",
        timezone: String,
      };
      if (timezone) res.timezone = timezone;
      return res;
    };
    convert = function (input, to) {
      return { $convert: { input: input, to: to } };
    };
    toObjectId = function (arg) {
      return { $toObjectId: arg };
    };
    year = function (date, timezone) {
      return { $year: { date: date, timezone: timezone ? timezone : undefined } };
    };
    week = function (date, timezone) {
      return { $week: { date: date, timezone: timezone ? timezone : undefined } };
    };
    month = function (date, timezone) {
      return {
        $month: { date: date, timezone: timezone ? timezone : undefined },
      };
    };
    dayOfMonth = function (date, timezone) {
      return {
        $dayOfMonth: { date: date, timezone: timezone ? timezone : undefined },
      };
    };
    isArray = function (arg) {
      return { $isArray: arg };
    };
  
    commit = async function () {
      return await this.model.aggregate(this.aggs).option(this.opts);
    };
    get = function () {
      return this.aggs;
    };
    show = function (d) {
      let depth = d ? d : null;
      console.dir(this.aggs, { depth: depth || null });
      return this;
    };
    alones = {};
    alone = function (key) {
      if (this.alones[key]) {
        this.alones[key] = key.split("_")[0];
        return false;
      } else {
        return true;
      }
    };
    only = function (key) {
      return Object.values(this.alones).includes(key) ? false : true;
    };
    isIf: Boolean;
    if = function (condition, options) {
      if (condition) this.isIf = true;
    };
  }
  