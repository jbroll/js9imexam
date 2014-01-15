
var xproj_plugin = require("./imexam_xproj")

JS9.RegisterPlugin({ category: "imexam", name: "xproj", onInit: xproj_plugin.init, onChange: xproj_plugin.onChange })
