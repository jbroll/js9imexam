
$("table").delegate('td','mouseover mouseleave', function(e) {
    if (e.type == 'mouseover') {
	$(this).parent().addClass("hover");
	$("colgroup").eq($(this).index()).addClass("hover");
    } else {
	$(this).parent().removeClass("hover");
	$("colgroup").eq($(this).index()).removeClass("hover");
    }
});

String.prototype.repeat = function (x, n) {
    var s = '';
    for (;;) {
	if (n & 1) s += x;
	n >>= 1;
	if (n) x += x;
	else break;
    }
    return s;
}

function htmlTable(x, y) {
    var t = "<table>"

    t += "<column group>".repeat(y);
    t += ( "<tr>" + "<td></td>".repeat(y) + "</tr>" ).repeat(x);
    t += "</table>";

    return t;
}


 $(this).css({"font-size" : newFontSize, "line-height" : newFontSize/1.2 + "px"});

