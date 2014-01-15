
var yproj_plugin = require("./imexam_rproj")

JS9.RegisterPlugin({ category: "imexam", name: "rproj", onInit: yproj_plugin.init, onChange: yproj_plugin.onChange })
