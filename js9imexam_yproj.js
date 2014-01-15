
var yproj_plugin = require("./imexam_yproj")

JS9.RegisterPlugin({ category: "imexam", name: "yproj", onInit: yproj_plugin.init, onChange: yproj_plugin.onChange })
