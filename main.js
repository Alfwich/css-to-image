function renderCss() {
    const inputTextArea = document.getElementById('input');
    const outputArea = document.getElementById('output-area');
    const cssText = inputTextArea.value;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var inlineCss = extractInlineCssFromStyle(cssText);
    console.log(inlineCss);
    canvas.width = parseInt(inlineCss.width);
    canvas.height = parseInt(inlineCss.height);

    var data =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${inlineCss.width}" height="${inlineCss.height}">` +
        '<foreignObject width="100%" height="100%">' +
        `<div xmlns="http://www.w3.org/1999/xhtml" style="${inlineCss.data}"></div>` +
        '</foreignObject>' +
        '</svg>';

    var DOMURL = window.URL || window.webkitURL || window;

    var img = new Image();
    var svg = new Blob([data], { type: 'image/svg+xml' });
    var url = DOMURL.createObjectURL(svg);

    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        DOMURL.revokeObjectURL(url);
    };

    img.src = url;

    outputArea.innerHTML = '';
    outputArea.appendChild(canvas);
}

function extractInlineCssFromStyle(cssText) {
    const rawStyle = cssText.substr(cssText.indexOf('{'));
    const styles = document.getElementById('style');
    styles.innerHTML = `#DYNAMIC-STYLE${rawStyle}`;
    const style = document.styleSheets[0].cssRules[0].style;
    rawInlineStyles = [];
    for (var i = 0; i < style.length; i++) {
        const key = style[i];
        rawInlineStyles.push(`${key}:${style[key]}`);
    }

    return {
        data: rawInlineStyles.join(';'),
        width: style['width'] || 1000,
        height: style['height'] || 1000
    };
}

function saveHash(ctx) {
    window.location.hash = encodeURI(ctx.value);
}

window.onload = () => {
    const inputTextArea = document.getElementById('input');
    inputTextArea.value = decodeURI(window.location.hash).substr(1);
};
