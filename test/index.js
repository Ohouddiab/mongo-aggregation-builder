import {AggregationBuilder} from "./../lib/index.js"
const agg = new AggregationBuilder()
agg
.lookup({ from: "clients", localField: "client" }, { unwind: true })
.match({ company_namespace: ["demosv"] }, { smart: true })
.addFields({
  repClient: agg.concat([
    "$user_name",
    " ",
    agg.cond(agg.eq("$client.name", "WEST"), "WEeSR", "$client.name"),
  ]),
})
.show();