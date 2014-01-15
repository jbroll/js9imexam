
var 3plot_plugin = require("./imexam_3plot")

JS9.RegisterPlugin({ category: "imexam", name: "3plot", onInit: 3plot_plugin.init, onChange: 3plot_plugin.onChange })
