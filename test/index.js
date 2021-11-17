import { AggregationBuilder } from "mongo-aggregation-builder";
const agg = new AggregationBuilder();

// var _ = require('lodash');
// _.find({});
// new AggregationBuilder.project({});
const agg1 = agg
  .addFields(
    agg.dateToString(agg.convert("$time", "date"), "%y-%m-%d", "Asia/Aamman")
  )
  .sort({ time: -1 })
  .match({ latest: true, company_namespace: agg.in[("demosv", "time")] })
  .addFields({ allItems: agg.concatArrays("$items", "$return_items") })
  .project({ items: 0, return_items: 0 })
  .unwind("$allItems")
  .match({})
  .facet({
    docs: new AggregationBuilder()
      .addFields(
        agg.dateToString(
          agg.convert("$time", "date"),
          "%y-%m-%d",
          "Asia/Aamman"
        )
      )
      .addFields({
        "Rep Name": agg.concat(["$creator.type", " ", "$creator.name"]),
        "Client name": "$client_name",
        "Serial #": agg.cond(
          agg.eq("$allItems.class", "return"),
          "$return_serial_number.formatted",
          "$serial_number.formatted"
        ),
        "Issue date": "$issue_date",
        Type: "$allItems.class",
        Product: "$allItems.variant.product_name",
        Variant: "$allItems.variant.variant_name",
        "Measure unit": "$allItems.measureunit.name",
        Price: "$allItems.discounted_price",
        Currency: "$currency",
        Quantity: agg.cond(
          agg.eq("$allItems.class", "return"),
          { $multiply: [-1, "$allItems.qty"] },
          "$allItems.qty"
        ),
        "Tax rate": "$allItems.tax.name",
        Status: "$status",
        line_total: "$allItems.line_total",
      })
      .project({
        _id: 1,
        "Rep Name": 1,
        "Client name": 1,
        "Issue date": 1,
        Type: 1,
        "Serial #": 1,
        Product: 1,
        Variant: 1,
        "Product/Variant": 1,
        "Measure unit": 1,
        Price: 1,
        Currency: 1,
        Quantity: 1,
        "Tax rate": 1,
        Status: 1,
        pre_total: 1,
        return_total: 1,
        total: 1,
        line_total: 1,
      })
      .sort({ _id: -1 })
      .skip(0)
      .limit(20)
      .get(),

    pageInfo: new AggregationBuilder()
      .group({ _id: null, count: agg.sum(1) })
      .get(),

    absolute_total: new AggregationBuilder()
      .group({
        _id: null,
        total: agg.sum("$allItems.line_total"),
        pre_total: agg.sum(
          agg.cond(
            agg.eq("$allItems.class", "invoice"),
            "$allItems.line_total",
            0
          )
        ),
        return_total: agg.sum(
          agg.cond(
            agg.eq("$allItems.class", "return"),
            "$allItems.line_total",
            0
          )
        ),
      })
      .project({
        _id: 0,
        absolute_total: agg.ifNull(["return_total", 1]),
        return_total: agg.round("$value", 1),
        total: agg.arrayElemAt(["$allItem", 0]),
        results: agg.reduce({
          input: "$allItem",
          initalValue: 0,
          in: agg.sum("$return_total"),
        }),
        items: agg.filter({
          input: "$allItems",
          cond: agg.eq("$pre_total", "$return_total"),
        }),
      })
      .get(),
  })
  .replaceRoot({ newRoot: "$name" })
  .show();

// const agg2 = [
//   {
//     $match: { latest: true, company_namespace: { $in: ["demosv"] } },
//   },
//   {
//     $addFields: {
//       allItems: { $concatArrays: ["$items", "$return_items"] },
//     },
//   },
//   { $project: { items: 0, return_items: 0 } },
//   { $unwind: "$allItems" },
//   { $match: {} },
//   {
//     $facet: {
//       docs: [
//         {
//           $addFields: {
//             "Rep Name": { $concat: ["$creator.type", " ", "$creator.name"] },
//             "Client name": "$client_name",
//             "Serial #": {
//               $cond: [
//                 { $eq: ["$allItems.class", "return"] },
//                 "$return_serial_number.formatted",
//                 "$serial_number.formatted",
//               ],
//             },
//             "Issue date": "$issue_date",
//             Type: "$allItems.class",
//             Product: "$allItems.variant.product_name",
//             Variant: "$allItems.variant.variant_name",
//             "Measure unit": "$allItems.measureunit.name",
//             Price: "$allItems.discounted_price",
//             Currency: "$currency",
//             Quantity: {
//               $cond: [
//                 { $eq: ["$allItems.class", "return"] },
//                 { $multiply: [-1, "$allItems.qty"] },
//                 "$allItems.qty",
//               ],
//             },
//             "Tax rate": "$allItems.tax.name",
//             Status: "$status",
//             line_total: "$allItems.line_total",
//           },
//         },
//         {
//           $project: {
//             _id: 1,
//             "Rep Name": 1,
//             "Client name": 1,
//             "Issue date": 1,
//             Type: 1,
//             "Serial #": 1,
//             Product: 1,
//             Variant: 1,
//             "Product/Variant": 1,
//             "Measure unit": 1,
//             Price: 1,
//             Currency: 1,
//             Quantity: 1,
//             "Tax rate": 1,
//             Status: 1,
//             pre_total: 1,
//             return_total: 1,
//             total: 1,
//             line_total: 1,
//           },
//         },
//         { $sort: { _id: -1 } },
//         { $skip: 0 },
//         { $limit: 20 },
//       ],
//       pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
//       absolute_total: [
//         {
//           $group: {
//             _id: null,

//             total: { $sum: "$allItems.line_total" },
//             pre_total: {
//               $sum: {
//                 $cond: [
//                   { $eq: ["$allItems.class", "invoice"] },
//                   "$allItems.line_total",
//                   0,
//                 ],
//               },
//             },
//             return_total: {
//               $sum: {
//                 $cond: [
//                   { $eq: ["$allItems.class", "return"] },
//                   "$allItems.line_total",
//                   0,
//                 ],
//               },
//             },
//           },
//         },
//         { $project: { _id: 0 } },
//       ],
//     },
//   },
// ];
// const aggg = JSON.parse(JSON.stringify(agg1));
// // console.dir({ agg1: aggg.aggs, agg2 }, { depth: null })
// // console.log(_.isEqual(aggg.aggs, agg2))
// console.log(
//   JSON.parse(JSON.stringify(agg2)) == JSON.parse(JSON.stringify(aggg.aggs))
// )
