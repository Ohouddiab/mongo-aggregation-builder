var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
         * @param arg object {from,localField,foreignField,as} from and localField are required.
         */
        this.lookup = function (arg, options) {
            if (options && options.alone && this.alone(`${options.alone}_lookup`))
                return this;
            if (options && options.only && this.only(`${options.only}`))
                return this;
            let stage = {
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
                        preserveNullAndEmptyArrays: options.preserveNullAndEmptyArrays == false ? false : true,
                    },
                });
            return this;
        };
        this.matchSmart = function (arg, options) {
            let stage;
            if (this.aggs.length && this.aggs[this.aggs.length - 1].$match) {
                stage = this.aggs[this.aggs.length - 1].$match;
            }
            else {
                stage = {
                    $match: {},
                };
            }
            if (options && options.or) {
                stage.$match.$or = stage.$match.$or || [];
                stage.$match.$or.push(arg);
            }
            else {
                stage.$match.$and = stage.$match.$and || [];
                stage.$match.$and.push(arg);
            }
            this.aggs.push(stage);
            return this;
        };
        this.match = function (arg, options) {
            if (options && options.only && this.only(`${options.only}`))
                return this;
            if (options && options.alone && this.alone(`${options.alone}_match`))
                return this;
            if (!this.isIf)
                return this;
            if (options.smart || options.or || options.and)
                return this.matchSmart(arg, options);
            let stage;
            if (this.aggs.length && this.aggs[this.aggs.length - 1].$match) {
                stage = this.aggs[this.aggs.length - 1].$match;
            }
            else {
                stage = {
                    $match: {},
                };
            }
            Object.assign(stage.$match, arg);
            this.aggs.push(stage);
            return this;
        };
        this.addFields = function (filelds, options) {
            if (options && options.only && this.only(`${options.only}`))
                return this;
            if (options && options.alone && this.alone(`${options.alone}_addFields`))
                return this;
            this.aggs.push({ $addFields: filelds });
            return this;
        };
        this.project = function (projection, options) {
            if (options && options.only && this.only(`${options.only}`))
                return this;
            if (options && options.alone && this.alone(`${options.alone}_project`))
                return this;
            this.aggs.push({ $project: projection });
            return this;
        };
        this.limit = function (limit, options) {
            if (options && options.only && this.only(`${options.only}`))
                return this;
            if (options && options.alone && this.alone(`${options.alone}_project`))
                return this;
            this.aggs.push({ $limit: limit });
            return this;
        };
        this.concat = function (arr) {
            return { $concat: arr };
        };
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
         * @method  eq Operator
         */
        this.eq = function (arg1, arg2) {
            let arr;
            if (arg2) {
                arr = [arg1, arg2];
            }
            else if (!Array.isArray(arg1)) {
                arr = [arg1];
            }
            else {
                arr = arg1;
            }
            return { $eq: arr };
        };
        this.dateToString = function (date, format, timezone) {
            let res = {
                date: date,
                format: format && format != false ? format : "%Y-%m-%d",
                timezone: timezone,
            };
            if (timezone)
                res.timezone = timezone;
            return res;
        };
        this.convert = function (input, to) {
            return { $convert: { input: input, to: to } };
        };
        this.toObjectId = function (arg) {
            return { $toObjectId: arg };
        };
        this.year = function (date, timezone) {
            return { $year: { date: date, timezone: timezone ? timezone : undefined } };
        };
        this.week = function (date, timezone) {
            return { $week: { date: date, timezone: timezone ? timezone : undefined } };
        };
        this.month = function (date, timezone) {
            return {
                $month: { date: date, timezone: timezone ? timezone : undefined },
            };
        };
        this.dayOfMonth = function (date, timezone) {
            return {
                $dayOfMonth: { date: date, timezone: timezone ? timezone : undefined },
            };
        };
        this.isArray = function (arg) {
            return { $isArray: arg };
        };
        this.commit = function () {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.model.aggregate(this.aggs).option(this.opts);
            });
        };
        this.get = function () {
            return this.aggs;
        };
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
            }
            else {
                return true;
            }
        };
        this.only = function (key) {
            return Object.values(this.alones).includes(key) ? false : true;
        };
        this.isIf = false;
        this.if = function (condition, options) {
            if (condition)
                this.isIf = true;
        };
        this.model = model;
        this.aggs = this.aggs || [];
    }
}
