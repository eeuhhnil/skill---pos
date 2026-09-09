// Icon — self-contained React wrapper around Lucide icon data.
// Avoids the Lucide-vs-React crash: Lucide must NOT mutate React-managed nodes.
// We render an <i> that React owns but whose children React never reconciles
// (we set innerHTML imperatively), so re-renders elsewhere can't desync the DOM.

window.epIconSvg = function (name, size) {
  var pascal = String(name).split("-").map(function (s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }).join("");
  var node = window.lucide && window.lucide.icons && window.lucide.icons[pascal];
  if (!node) return "";
  var children = node.map(function (c) {
    var tag = c[0], attrs = c[1] || {};
    var a = Object.keys(attrs).map(function (k) { return k + '="' + attrs[k] + '"'; }).join(" ");
    return "<" + tag + " " + a + "></" + tag + ">";
  }).join("");
  var s = size || 20;
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + s + '" height="' + s +
    '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round">' + children + "</svg>";
};

function Icon(props) {
  var ref = React.useRef(null);
  var name = props.n, size = props.size;
  React.useEffect(function () {
    if (ref.current) ref.current.innerHTML = window.epIconSvg(name, size);
  }, [name, size]);
  return React.createElement("i", {
    ref: ref,
    className: "ep-ic" + (props.cls ? " " + props.cls : ""),
    style: props.style,
  });
}
window.Icon = Icon;
