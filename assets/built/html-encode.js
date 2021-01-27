var select = document.getElementById("tag");
inputUrl = document.getElementById("url");
inputText = document.getElementById("text");
textarea = document.getElementById("content");
result = document.getElementById("content");
cpy = document.getElementById('copy');
rst = document.getElementById("reset");
document.addEventListener("DOMContentLoaded", function(event) {
    if (select.value == "a" || select.value == "img" || select.value == "picture" || select.value == "audio" || select.value == "video" || select.value == "iframe" || select.value == "embed") {
        inputUrl.disabled = false;
        inputText.disabled = false;
        textarea.disabled = true;
    } else {
        inputUrl.disabled = true;
        inputText.disabled = true;
        textarea.disabled = false;
    }
});
select.onchange = function() {
    if (this.value == "a" || select.value == "img" || select.value == "picture" || select.value == "audio" || select.value == "video" || select.value == "iframe" || select.value == "embed") {
        inputUrl.disabled = false;
        inputText.disabled = false;
        textarea.disabled = true;
    } else {
        inputUrl.disabled = true;
        inputText.disabled = true;
        textarea.disabled = false;
    }
};
if (window.location.search) {
    var config = q2o(window.location.search);
    tag = config.tag;
    if (config.content) {
        var content = config.content;
        content = content.replace(/\+/g, " ");
        content = content.replace(/\&/g, "&amp;amp;");
        content = content.replace(/\</g, "&amp;lt;");
        content = content.replace(/\>/g, "&amp;gt;");
        content = content.replace(/\"/g, "&amp;quot;");
        content = content.replace(/\'/g, "&amp;apos;");
        config.content = content;
        if (config.tag != "") {
            result.value = '<i title="' + tag + '">' + content + '</i>', result.select(), result.focus();
        } else {
            result.value = content, result.select(), result.focus();
        }
    } else {
        var text = config.text;
            text = text.replace(/\+/g, " ");
            text = text.replace(/\&/g, "&amp;amp;");
            text = text.replace(/\</g, "&amp;lt;");
            text = text.replace(/\>/g, "&amp;gt;");
            text = text.replace(/\"/g, "&amp;quot;");
            text = text.replace(/\'/g, "&amp;apos;");
            config.text = text;
            url = config.url;
            url = url.replace(/\+/g, "");
            url = url.replace(/https:\/\//g, "//");
            config.url = url;
        if (config.tag == "a") {
            result.value = '<i title="' + tag + '">[' + text + '](' + url + ')</i>', result.select(), result.focus();
        } else if (config.tag == "img" || config.tag == "picture" || config.tag == "audio" || config.tag == "video" || config.tag == "iframe" || config.tag == "embed") {
            result.value = '<i title="' + tag + '">![' + text + '](' + url + ')</i>', result.select(), result.focus();
        } else {
            result.value = "", result.focus();
        };
    };
};
cpy.onclick = function() {
    var incopy = result.value;
    result.value = incopy;
    result.focus(), result.select(), document.execCommand("copy");
};
rst.onclick = function() {
    return result.value = "", result.focus();
};
document.addEventListener('DOMContentLoaded', function() {
    function addDefaultScheme(target) {
        if (target.value.match(/^(?!https?:).+\..+/)) {
            target.value = "https://" + target.value;
        }
    }
    var elements = document.querySelectorAll("input[type=url]");
    Array.prototype.forEach.call(elements, function(el, i) {
        el.addEventListener("blur", function(e) {
            addDefaultScheme(e.target);
        });
        el.addEventListener("keydown", function(e) {
            if (e.keyCode == 13) {
                addDefaultScheme(e.target);
            }
        });
    });
});