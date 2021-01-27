"use strict";
var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {},
    Prism = function() {
        var l = /\blang(?:uage)?-(\w+)\b/i,
            t = 0,
            C = _self.Prism = {
                manual: _self.Prism && _self.Prism.manual,
                util: {
                    encode: function(e) {
                        return e instanceof s ? new s(e.type, C.util.encode(e.content), e.alias) : "Array" === C.util.type(e) ? e.map(C.util.encode) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ")
                    },
                    type: function(e) {
                        return Object.prototype.toString.call(e).match(/\[object (\w+)\]/)[1]
                    },
                    objId: function(e) {
                        return e.__id || Object.defineProperty(e, "__id", {
                            value: ++t
                        }), e.__id
                    },
                    clone: function(e) {
                        switch (C.util.type(e)) {
                            case "Object":
                                var t = {};
                                for (var a in e) e.hasOwnProperty(a) && (t[a] = C.util.clone(e[a]));
                                return t;
                            case "Array":
                                return e.map && e.map(function(e) {
                                    return C.util.clone(e)
                                })
                        }
                        return e
                    }
                },
                languages: {
                    extend: function(e, t) {
                        var a = C.util.clone(C.languages[e]);
                        for (var n in t) a[n] = t[n];
                        return a
                    },
                    insertBefore: function(a, e, t, n) {
                        var r = (n = n || C.languages)[a];
                        if (2 == arguments.length) {
                            for (var i in t = e) t.hasOwnProperty(i) && (r[i] = t[i]);
                            return r
                        }
                        var s = {};
                        for (var o in r)
                            if (r.hasOwnProperty(o)) {
                                if (o == e)
                                    for (var i in t) t.hasOwnProperty(i) && (s[i] = t[i]);
                                s[o] = r[o]
                            } return C.languages.DFS(C.languages, function(e, t) {
                            t === n[a] && e != a && (this[e] = s)
                        }), n[a] = s
                    },
                    DFS: function(e, t, a, n) {
                        for (var r in n = n || {}, e) e.hasOwnProperty(r) && (t.call(e, r, e[r], a || r), "Object" !== C.util.type(e[r]) || n[C.util.objId(e[r])] ? "Array" !== C.util.type(e[r]) || n[C.util.objId(e[r])] || (n[C.util.objId(e[r])] = !0, C.languages.DFS(e[r], t, r, n)) : (n[C.util.objId(e[r])] = !0, C.languages.DFS(e[r], t, null, n)))
                    }
                },
                plugins: {},
                highlightAll: function(e, t) {
                    var a = {
                        callback: t,
                        selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
                    };
                    C.hooks.run("before-highlightall", a);
                    for (var n, r = a.elements || document.querySelectorAll(a.selector), i = 0; n = r[i++];) C.highlightElement(n, !0 === e, a.callback)
                },
                highlightElement: function(e, t, a) {
                    for (var n, r, i = e; i && !l.test(i.className);) i = i.parentNode;
                    i && (n = (i.className.match(l) || [, ""])[1].toLowerCase(), r = C.languages[n]), e.className = e.className.replace(l, "").replace(/\s+/g, " ") + " language-" + n, i = e.parentNode, /pre/i.test(i.nodeName) && (i.className = i.className.replace(l, "").replace(/\s+/g, " ") + " language-" + n);
                    var s = {
                        element: e,
                        language: n,
                        grammar: r,
                        code: e.textContent
                    };
                    if (C.hooks.run("before-sanity-check", s), !s.code || !s.grammar) return s.code && (s.element.textContent = s.code), void C.hooks.run("complete", s);
                    if (C.hooks.run("before-highlight", s), t && _self.Worker) {
                        var o = new Worker(C.filename);
                        o.onmessage = function(e) {
                            s.highlightedCode = e.data, C.hooks.run("before-insert", s), s.element.innerHTML = s.highlightedCode, a && a.call(s.element), C.hooks.run("after-highlight", s), C.hooks.run("complete", s)
                        }, o.postMessage(JSON.stringify({
                            language: s.language,
                            code: s.code,
                            immediateClose: !0
                        }))
                    } else s.highlightedCode = C.highlight(s.code, s.grammar, s.language), C.hooks.run("before-insert", s), s.element.innerHTML = s.highlightedCode, a && a.call(e), C.hooks.run("after-highlight", s), C.hooks.run("complete", s)
                },
                highlight: function(e, t, a) {
                    var n = C.tokenize(e, t);
                    return s.stringify(C.util.encode(n), a)
                },
                tokenize: function(e, t) {
                    var a = C.Token,
                        n = [e],
                        r = t.rest;
                    if (r) {
                        for (var i in r) t[i] = r[i];
                        delete t.rest
                    }
                    e: for (var i in t)
                        if (t.hasOwnProperty(i) && t[i]) {
                            var s = t[i];
                            s = "Array" === C.util.type(s) ? s : [s];
                            for (var o = 0; o < s.length; ++o) {
                                var l = s[o],
                                    u = l.inside,
                                    c = !!l.lookbehind,
                                    d = !!l.greedy,
                                    g = 0,
                                    p = l.alias;
                                if (d && !l.pattern.global) {
                                    var m = l.pattern.toString().match(/[imuy]*$/)[0];
                                    l.pattern = RegExp(l.pattern.source, m + "g")
                                }
                                l = l.pattern || l;
                                for (var h = 0, f = 0; h < n.length; f += n[h].length, ++h) {
                                    var b = n[h];
                                    if (n.length > e.length) break e;
                                    if (!(b instanceof a)) {
                                        l.lastIndex = 0;
                                        var k = 1;
                                        if (!(A = l.exec(b)) && d && h != n.length - 1) {
                                            if (l.lastIndex = f, !(A = l.exec(e))) break;
                                            for (var w = A.index + (c ? A[1].length : 0), y = A.index + A[0].length, v = h, P = f, x = n.length; v < x && P < y; ++v)(P += n[v].length) <= w && (++h, f = P);
                                            if (n[h] instanceof a || n[v - 1].greedy) continue;
                                            k = v - h, b = e.slice(f, P), A.index -= f
                                        }
                                        if (A) {
                                            c && (g = A[1].length);
                                            y = (w = A.index + g) + (A = A[0].slice(g)).length;
                                            var A, $ = b.slice(0, w),
                                                _ = b.slice(y),
                                                S = [h, k];
                                            $ && S.push($);
                                            var j = new a(i, u ? C.tokenize(A, u) : A, p, A, d);
                                            S.push(j), _ && S.push(_), Array.prototype.splice.apply(n, S)
                                        }
                                    }
                                }
                            }
                        }
                    return n
                },
                hooks: {
                    all: {},
                    add: function(e, t) {
                        var a = C.hooks.all;
                        a[e] = a[e] || [], a[e].push(t)
                    },
                    run: function(e, t) {
                        var a = C.hooks.all[e];
                        if (a && a.length)
                            for (var n, r = 0; n = a[r++];) n(t)
                    }
                }
            },
            s = C.Token = function(e, t, a, n, r) {
                this.type = e, this.content = t, this.alias = a, this.length = 0 | (n || "").length, this.greedy = !!r
            };
        if (s.stringify = function(t, a, e) {
                if ("string" == typeof t) return t;
                if ("Array" === C.util.type(t)) return t.map(function(e) {
                    return s.stringify(e, a, t)
                }).join("");
                var n = {
                    type: t.type,
                    content: s.stringify(t.content, a, e),
                    tag: "span",
                    classes: ["token", t.type],
                    attributes: {},
                    language: a,
                    parent: e
                };
                if ("comment" == n.type && (n.attributes.spellcheck = "true"), t.alias) {
                    var r = "Array" === C.util.type(t.alias) ? t.alias : [t.alias];
                    Array.prototype.push.apply(n.classes, r)
                }
                C.hooks.run("wrap", n);
                var i = Object.keys(n.attributes).map(function(e) {
                    return e + '="' + (n.attributes[e] || "").replace(/"/g, "&quot;") + '"'
                }).join(" ");
                return "<" + n.tag + ' class="' + n.classes.join(" ") + '"' + (i ? " " + i : "") + ">" + n.content + "</" + n.tag + ">"
            }, !_self.document) return _self.addEventListener && _self.addEventListener("message", function(e) {
            var t = JSON.parse(e.data),
                a = t.language,
                n = t.code,
                r = t.immediateClose;
            _self.postMessage(C.highlight(n, C.languages[a], a)), r && _self.close()
        }, !1), _self.Prism;
        var e = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();
        return e && (C.filename = e.src, !document.addEventListener || C.manual || e.hasAttribute("data-manual") || ("loading" !== document.readyState ? window.requestAnimationFrame ? window.requestAnimationFrame(C.highlightAll) : window.setTimeout(C.highlightAll, 16) : document.addEventListener("DOMContentLoaded", C.highlightAll))), _self.Prism
    }();
if ("undefined" != typeof module && module.exports && (module.exports = Prism), "undefined" != typeof global && (global.Prism = Prism), Prism.languages.markup = {
        comment: /<!--[\w\W]*?-->/,
        prolog: /<\?[\w\W]+?\?>/,
        doctype: /<!DOCTYPE[\w\W]+?>/i,
        cdata: /<!\[CDATA\[[\w\W]*?]]>/i,
        tag: {
            pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
            inside: {
                tag: {
                    pattern: /^<\/?[^\s>\/]+/i,
                    inside: {
                        punctuation: /^<\/?/,
                        namespace: /^[^\s>\/:]+:/
                    }
                },
                "attr-value": {
                    pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
                    inside: {
                        punctuation: /[=>"']/
                    }
                },
                punctuation: /\/?>/,
                "attr-name": {
                    pattern: /[^\s>\/]+/,
                    inside: {
                        namespace: /^[^\s>\/:]+:/
                    }
                }
            }
        },
        entity: /&#?[\da-z]{1,8};/i
    }, Prism.hooks.add("wrap", function(e) {
        "entity" === e.type && (e.attributes.title = e.content.replace(/&amp;/, "&"))
    }), Prism.languages.xml = Prism.languages.markup, Prism.languages.html = Prism.languages.markup, Prism.languages.mathml = Prism.languages.markup, Prism.languages.svg = Prism.languages.markup, Prism.languages.css = {
        comment: /\/\*[\w\W]*?\*\//,
        atrule: {
            pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
            inside: {
                rule: /@[\w-]+/
            }
        },
        url: /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
        selector: /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
        string: {
            pattern: /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
            greedy: !0
        },
        property: /(\b|\B)[\w-]+(?=\s*:)/i,
        important: /\B!important\b/i,
        function: /[-a-z0-9]+(?=\()/i,
        punctuation: /[(){};:]/
    }, Prism.languages.css.atrule.inside.rest = Prism.util.clone(Prism.languages.css), Prism.languages.markup && (Prism.languages.insertBefore("markup", "tag", {
        style: {
            pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
            lookbehind: !0,
            inside: Prism.languages.css,
            alias: "language-css"
        }
    }), Prism.languages.insertBefore("inside", "attr-value", {
        "style-attr": {
            pattern: /\s*style=("|').*?\1/i,
            inside: {
                "attr-name": {
                    pattern: /^\s*style/i,
                    inside: Prism.languages.markup.tag.inside
                },
                punctuation: /^\s*=\s*['"]|['"]\s*$/,
                "attr-value": {
                    pattern: /.+/i,
                    inside: Prism.languages.css
                }
            },
            alias: "language-css"
        }
    }, Prism.languages.markup.tag)), Prism.languages.clike = {
        comment: [{
            pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
            lookbehind: !0
        }, {
            pattern: /(^|[^\\:])\/\/.*/,
            lookbehind: !0
        }],
        string: {
            pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
            greedy: !0
        },
        "class-name": {
            pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
            lookbehind: !0,
            inside: {
                punctuation: /(\.|\\)/
            }
        },
        keyword: /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
        boolean: /\b(true|false)\b/,
        function: /[a-z0-9_]+(?=\()/i,
        number: /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
        operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
        punctuation: /[{}[\];(),.:]/
    }, Prism.languages.javascript = Prism.languages.extend("clike", {
        keyword: /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
        number: /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
        function: /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
        operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/
    }), Prism.languages.insertBefore("javascript", "keyword", {
        regex: {
            pattern: /(^|[^\/])\/(?!\/)(\[.+?]|\\.|[^\/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
            lookbehind: !0,
            greedy: !0
        }
    }), Prism.languages.insertBefore("javascript", "string", {
        "template-string": {
            pattern: /`(?:\\\\|\\?[^\\])*?`/,
            greedy: !0,
            inside: {
                interpolation: {
                    pattern: /\$\{[^}]+\}/,
                    inside: {
                        "interpolation-punctuation": {
                            pattern: /^\$\{|\}$/,
                            alias: "punctuation"
                        },
                        rest: Prism.languages.javascript
                    }
                },
                string: /[\s\S]+/
            }
        }
    }), Prism.languages.markup && Prism.languages.insertBefore("markup", "tag", {
        script: {
            pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
            lookbehind: !0,
            inside: Prism.languages.javascript,
            alias: "language-javascript"
        }
    }), Prism.languages.js = Prism.languages.javascript, function(e) {
        var t = {
            variable: [{
                pattern: /\$?\(\([\w\W]+?\)\)/,
                inside: {
                    variable: [{
                        pattern: /(^\$\(\([\w\W]+)\)\)/,
                        lookbehind: !0
                    }, /^\$\(\(/],
                    number: /\b-?(?:0x[\dA-Fa-f]+|\d*\.?\d+(?:[Ee]-?\d+)?)\b/,
                    operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
                    punctuation: /\(\(?|\)\)?|,|;/
                }
            }, {
                pattern: /\$\([^)]+\)|`[^`]+`/,
                inside: {
                    variable: /^\$\(|^`|\)$|`$/
                }
            }, /\$(?:[a-z0-9_#\?\*!@]+|\{[^}]+\})/i]
        };
        e.languages.bash = {
            shebang: {
                pattern: /^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/,
                alias: "important"
            },
            comment: {
                pattern: /(^|[^"{\\])#.*/,
                lookbehind: !0
            },
            string: [{
                pattern: /((?:^|[^<])<<\s*)(?:"|')?(\w+?)(?:"|')?\s*\r?\n(?:[\s\S])*?\r?\n\2/g,
                lookbehind: !0,
                greedy: !0,
                inside: t
            }, {
                pattern: /(["'])(?:\\\\|\\?[^\\])*?\1/g,
                greedy: !0,
                inside: t
            }],
            variable: t.variable,
            function: {
                pattern: /(^|\s|;|\||&)(?:alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|npm|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)(?=$|\s|;|\||&)/,
                lookbehind: !0
            },
            keyword: {
                pattern: /(^|\s|;|\||&)(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|\s|;|\||&)/,
                lookbehind: !0
            },
            boolean: {
                pattern: /(^|\s|;|\||&)(?:true|false)(?=$|\s|;|\||&)/,
                lookbehind: !0
            },
            operator: /&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,
            punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];]/
        };
        var a = t.variable[1].inside;
        a.function = e.languages.bash.function, a.keyword = e.languages.bash.keyword, a.boolean = e.languages.bash.boolean, a.operator = e.languages.bash.operator, a.punctuation = e.languages.bash.punctuation
    }(Prism), function(e) {
        e.languages.ruby = e.languages.extend("clike", {
            comment: /#(?!\{[^\r\n]*?\}).*/,
            keyword: /\b(alias|and|BEGIN|begin|break|case|class|def|define_method|defined|do|each|else|elsif|END|end|ensure|false|for|if|in|module|new|next|nil|not|or|raise|redo|require|rescue|retry|return|self|super|then|throw|true|undef|unless|until|when|while|yield)\b/
        });
        var t = {
            pattern: /#\{[^}]+\}/,
            inside: {
                delimiter: {
                    pattern: /^#\{|\}$/,
                    alias: "tag"
                },
                rest: e.util.clone(e.languages.ruby)
            }
        };
        e.languages.insertBefore("ruby", "keyword", {
            regex: [{
                pattern: /%r([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\1[gim]{0,3}/,
                greedy: !0,
                inside: {
                    interpolation: t
                }
            }, {
                pattern: /%r\((?:[^()\\]|\\[\s\S])*\)[gim]{0,3}/,
                greedy: !0,
                inside: {
                    interpolation: t
                }
            }, {
                pattern: /%r\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}[gim]{0,3}/,
                greedy: !0,
                inside: {
                    interpolation: t
                }
            }, {
                pattern: /%r\[(?:[^\[\]\\]|\\[\s\S])*\][gim]{0,3}/,
                greedy: !0,
                inside: {
                    interpolation: t
                }
            }, {
                pattern: /%r<(?:[^<>\\]|\\[\s\S])*>[gim]{0,3}/,
                greedy: !0,
                inside: {
                    interpolation: t
                }
            }, {
                pattern: /(^|[^\/])\/(?!\/)(\[.+?]|\\.|[^\/\\\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/,
                lookbehind: !0,
                greedy: !0
            }],
            variable: /[@$]+[a-zA-Z_][a-zA-Z_0-9]*(?:[?!]|\b)/,
            symbol: /:[a-zA-Z_][a-zA-Z_0-9]*(?:[?!]|\b)/
        }), e.languages.insertBefore("ruby", "number", {
            builtin: /\b(Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Stat|File|Fixnum|Float|Hash|Integer|IO|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|String|Struct|TMS|Symbol|ThreadGroup|Thread|Time|TrueClass)\b/,
            constant: /\b[A-Z][a-zA-Z_0-9]*(?:[?!]|\b)/
        }), e.languages.ruby.string = [{
            pattern: /%[qQiIwWxs]?([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\1/,
            greedy: !0,
            inside: {
                interpolation: t
            }
        }, {
            pattern: /%[qQiIwWxs]?\((?:[^()\\]|\\[\s\S])*\)/,
            greedy: !0,
            inside: {
                interpolation: t
            }
        }, {
            pattern: /%[qQiIwWxs]?\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}/,
            greedy: !0,
            inside: {
                interpolation: t
            }
        }, {
            pattern: /%[qQiIwWxs]?\[(?:[^\[\]\\]|\\[\s\S])*\]/,
            greedy: !0,
            inside: {
                interpolation: t
            }
        }, {
            pattern: /%[qQiIwWxs]?<(?:[^<>\\]|\\[\s\S])*>/,
            greedy: !0,
            inside: {
                interpolation: t
            }
        }, {
            pattern: /("|')(#\{[^}]+\}|\\(?:\r?\n|\r)|\\?.)*?\1/,
            greedy: !0,
            inside: {
                interpolation: t
            }
        }]
    }(Prism), Prism.languages.git = {
        comment: /^#.*/m,
        deleted: /^[-–].*/m,
        inserted: /^\+.*/m,
        string: /("|')(\\?.)*?\1/m,
        command: {
            pattern: /^.*\$ git .*$/m,
            inside: {
                parameter: /\s(--|-)\w+/m
            }
        },
        coord: /^@@.*@@$/m,
        commit_sha1: /^commit \w{40}$/m
    }, function(n) {
        var e = /\{\{\{[\w\W]+?\}\}\}|\{\{[\w\W]+?\}\}/g;
        n.languages.handlebars = n.languages.extend("markup", {
            handlebars: {
                pattern: e,
                inside: {
                    delimiter: {
                        pattern: /^\{\{\{?|\}\}\}?$/i,
                        alias: "punctuation"
                    },
                    string: /(["'])(\\?.)*?\1/,
                    number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?)\b/,
                    boolean: /\b(true|false)\b/,
                    block: {
                        pattern: /^(\s*~?\s*)[#\/]\S+?(?=\s*~?\s*$|\s)/i,
                        lookbehind: !0,
                        alias: "keyword"
                    },
                    brackets: {
                        pattern: /\[[^\]]+\]/,
                        inside: {
                            punctuation: /\[|\]/,
                            variable: /[\w\W]+/
                        }
                    },
                    punctuation: /[!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~]/,
                    variable: /[^!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~\s]+/
                }
            }
        }), n.languages.insertBefore("handlebars", "tag", {
            "handlebars-comment": {
                pattern: /\{\{![\w\W]*?\}\}/,
                alias: ["handlebars", "comment"]
            }
        }), n.hooks.add("before-highlight", function(t) {
            "handlebars" === t.language && (t.tokenStack = [], t.backupCode = t.code, t.code = t.code.replace(e, function(e) {
                return t.tokenStack.push(e), "___HANDLEBARS" + t.tokenStack.length + "___"
            }))
        }), n.hooks.add("before-insert", function(e) {
            "handlebars" === e.language && (e.code = e.backupCode, delete e.backupCode)
        }), n.hooks.add("after-highlight", function(e) {
            if ("handlebars" === e.language) {
                for (var t, a = 0; t = e.tokenStack[a]; a++) e.highlightedCode = e.highlightedCode.replace("___HANDLEBARS" + (a + 1) + "___", n.highlight(t, e.grammar, "handlebars").replace(/\$/g, "$$$$"));
                e.element.innerHTML = e.highlightedCode
            }
        })
    }(Prism), function(e) {
        e.languages.jade = {
            comment: {
                pattern: /(^([\t ]*))\/\/.*((?:\r?\n|\r)\2[\t ]+.+)*/m,
                lookbehind: !0
            },
            "multiline-script": {
                pattern: /(^([\t ]*)script\b.*\.[\t ]*)((?:\r?\n|\r(?!\n))(?:\2[\t ]+.+|\s*?(?=\r?\n|\r)))+/m,
                lookbehind: !0,
                inside: {
                    rest: e.languages.javascript
                }
            },
            filter: {
                pattern: /(^([\t ]*)):.+((?:\r?\n|\r(?!\n))(?:\2[\t ]+.+|\s*?(?=\r?\n|\r)))+/m,
                lookbehind: !0,
                inside: {
                    "filter-name": {
                        pattern: /^:[\w-]+/,
                        alias: "variable"
                    }
                }
            },
            "multiline-plain-text": {
                pattern: /(^([\t ]*)[\w\-#.]+\.[\t ]*)((?:\r?\n|\r(?!\n))(?:\2[\t ]+.+|\s*?(?=\r?\n|\r)))+/m,
                lookbehind: !0
            },
            markup: {
                pattern: /(^[\t ]*)<.+/m,
                lookbehind: !0,
                inside: {
                    rest: e.languages.markup
                }
            },
            doctype: {
                pattern: /((?:^|\n)[\t ]*)doctype(?: .+)?/,
                lookbehind: !0
            },
            "flow-control": {
                pattern: /(^[\t ]*)(?:if|unless|else|case|when|default|each|while)\b(?: .+)?/m,
                lookbehind: !0,
                inside: {
                    each: {
                        pattern: /^each .+? in\b/,
                        inside: {
                            keyword: /\b(?:each|in)\b/,
                            punctuation: /,/
                        }
                    },
                    branch: {
                        pattern: /^(?:if|unless|else|case|when|default|while)\b/,
                        alias: "keyword"
                    },
                    rest: e.languages.javascript
                }
            },
            keyword: {
                pattern: /(^[\t ]*)(?:block|extends|include|append|prepend)\b.+/m,
                lookbehind: !0
            },
            mixin: [{
                pattern: /(^[\t ]*)mixin .+/m,
                lookbehind: !0,
                inside: {
                    keyword: /^mixin/,
                    function: /\w+(?=\s*\(|\s*$)/,
                    punctuation: /[(),.]/
                }
            }, {
                pattern: /(^[\t ]*)\+.+/m,
                lookbehind: !0,
                inside: {
                    name: {
                        pattern: /^\+\w+/,
                        alias: "function"
                    },
                    rest: e.languages.javascript
                }
            }],
            script: {
                pattern: /(^[\t ]*script(?:(?:&[^(]+)?\([^)]+\))*[\t ]+).+/m,
                lookbehind: !0,
                inside: {
                    rest: e.languages.javascript
                }
            },
            "plain-text": {
                pattern: /(^[\t ]*(?!-)[\w\-#.]*[\w\-](?:(?:&[^(]+)?\([^)]+\))*\/?[\t ]+).+/m,
                lookbehind: !0
            },
            tag: {
                pattern: /(^[\t ]*)(?!-)[\w\-#.]*[\w\-](?:(?:&[^(]+)?\([^)]+\))*\/?:?/m,
                lookbehind: !0,
                inside: {
                    attributes: [{
                        pattern: /&[^(]+\([^)]+\)/,
                        inside: {
                            rest: e.languages.javascript
                        }
                    }, {
                        pattern: /\([^)]+\)/,
                        inside: {
                            "attr-value": {
                                pattern: /(=\s*)(?:\{[^}]*\}|[^,)\r\n]+)/,
                                lookbehind: !0,
                                inside: {
                                    rest: e.languages.javascript
                                }
                            },
                            "attr-name": /[\w-]+(?=\s*!?=|\s*[,)])/,
                            punctuation: /[!=(),]+/
                        }
                    }],
                    punctuation: /:/
                }
            },
            code: [{
                pattern: /(^[\t ]*(?:-|!?=)).+/m,
                lookbehind: !0,
                inside: {
                    rest: e.languages.javascript
                }
            }],
            punctuation: /[.\-!=|]+/
        };
        for (var t = [{
                filter: "atpl",
                language: "twig"
            }, {
                filter: "coffee",
                language: "coffeescript"
            }, "ejs", "handlebars", "hogan", "less", "livescript", "markdown", "mustache", "plates", {
                filter: "sass",
                language: "scss"
            }, "stylus", "swig"], a = {}, n = 0, r = t.length; n < r; n++) {
            var i = t[n];
            i = "string" == typeof i ? {
                filter: i,
                language: i
            } : i, e.languages[i.language] && (a["filter-" + i.filter] = {
                pattern: RegExp("(^([\\t ]*)):{{filter_name}}((?:\\r?\\n|\\r(?!\\n))(?:\\2[\\t ]+.+|\\s*?(?=\\r?\\n|\\r)))+".replace("{{filter_name}}", i.filter), "m"),
                lookbehind: !0,
                inside: {
                    "filter-name": {
                        pattern: /^:[\w-]+/,
                        alias: "variable"
                    },
                    rest: e.languages[i.language]
                }
            })
        }
        e.languages.insertBefore("jade", "filter", a)
    }(Prism), Prism.languages.json = {
        property: /"(?:\\.|[^\\"])*"(?=\s*:)/gi,
        string: /"(?!:)(?:\\.|[^\\"])*"(?!:)/g,
        number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?)\b/g,
        punctuation: /[{}[\]);,]/g,
        operator: /:/g,
        boolean: /\b(true|false)\b/gi,
        null: /\bnull\b/gi
    }, Prism.languages.jsonp = Prism.languages.json, Prism.languages.markdown = Prism.languages.extend("markup", {}), Prism.languages.insertBefore("markdown", "prolog", {
        blockquote: {
            pattern: /^>(?:[\t ]*>)*/m,
            alias: "punctuation"
        },
        code: [{
            pattern: /^(?: {4}|\t).+/m,
            alias: "keyword"
        }, {
            pattern: /``.+?``|`[^`\n]+`/,
            alias: "keyword"
        }],
        title: [{
            pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/,
            alias: "important",
            inside: {
                punctuation: /==+$|--+$/
            }
        }, {
            pattern: /(^\s*)#+.+/m,
            lookbehind: !0,
            alias: "important",
            inside: {
                punctuation: /^#+|#+$/
            }
        }],
        hr: {
            pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,
            lookbehind: !0,
            alias: "punctuation"
        },
        list: {
            pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
            lookbehind: !0,
            alias: "punctuation"
        },
        "url-reference": {
            pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
            inside: {
                variable: {
                    pattern: /^(!?\[)[^\]]+/,
                    lookbehind: !0
                },
                string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
                punctuation: /^[\[\]!:]|[<>]/
            },
            alias: "url"
        },
        bold: {
            pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
            lookbehind: !0,
            inside: {
                punctuation: /^\*\*|^__|\*\*$|__$/
            }
        },
        italic: {
            pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
            lookbehind: !0,
            inside: {
                punctuation: /^[*_]|[*_]$/
            }
        },
        url: {
            pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
            inside: {
                variable: {
                    pattern: /(!?\[)[^\]]+(?=\]$)/,
                    lookbehind: !0
                },
                string: {
                    pattern: /"(?:\\.|[^"\\])*"(?=\)$)/
                }
            }
        }
    }), Prism.languages.markdown.bold.inside.url = Prism.util.clone(Prism.languages.markdown.url), Prism.languages.markdown.italic.inside.url = Prism.util.clone(Prism.languages.markdown.url), Prism.languages.markdown.bold.inside.italic = Prism.util.clone(Prism.languages.markdown.italic), Prism.languages.markdown.italic.inside.bold = Prism.util.clone(Prism.languages.markdown.bold), Prism.languages.php = Prism.languages.extend("clike", {
        keyword: /\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i,
        constant: /\b[A-Z0-9_]{2,}\b/,
        comment: {
            pattern: /(^|[^\\])(?:\/\*[\w\W]*?\*\/|\/\/.*)/,
            lookbehind: !0,
            greedy: !0
        }
    }), Prism.languages.insertBefore("php", "class-name", {
        "shell-comment": {
            pattern: /(^|[^\\])#.*/,
            lookbehind: !0,
            alias: "comment"
        }
    }), Prism.languages.insertBefore("php", "keyword", {
        delimiter: /\?>|<\?(?:php)?/i,
        variable: /\$\w+\b/i,
        package: {
            pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
            lookbehind: !0,
            inside: {
                punctuation: /\\/
            }
        }
    }), Prism.languages.insertBefore("php", "operator", {
        property: {
            pattern: /(->)[\w]+/,
            lookbehind: !0
        }
    }), Prism.languages.markup && (Prism.hooks.add("before-highlight", function(t) {
        "php" === t.language && (t.tokenStack = [], t.backupCode = t.code, t.code = t.code.replace(/(?:<\?php|<\?)[\w\W]*?(?:\?>)/gi, function(e) {
            return t.tokenStack.push(e), "{{{PHP" + t.tokenStack.length + "}}}"
        }))
    }), Prism.hooks.add("before-insert", function(e) {
        "php" === e.language && (e.code = e.backupCode, delete e.backupCode)
    }), Prism.hooks.add("after-highlight", function(e) {
        if ("php" === e.language) {
            for (var t, a = 0; t = e.tokenStack[a]; a++) e.highlightedCode = e.highlightedCode.replace("{{{PHP" + (a + 1) + "}}}", Prism.highlight(t, e.grammar, "php").replace(/\$/g, "$$$$"));
            e.element.innerHTML = e.highlightedCode
        }
    }), Prism.hooks.add("wrap", function(e) {
        "php" === e.language && "markup" === e.type && (e.content = e.content.replace(/(\{\{\{PHP[0-9]+\}\}\})/g, '<span class="token php">$1</span>'))
    }), Prism.languages.insertBefore("php", "comment", {
        markup: {
            pattern: /<[^?]\/?(.*?)>/,
            inside: Prism.languages.markup
        },
        php: /\{\{\{PHP[0-9]+\}\}\}/
    })), function(e) {
        var t = e.util.clone(e.languages.javascript);
        e.languages.jsx = e.languages.extend("markup", t), e.languages.jsx.tag.pattern = /<\/?[\w\.:-]+\s*(?:\s+(?:[\w\.:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+|(\{[\w\W]*?\})))?|\{\.{3}\w+\})\s*)*\/?>/i, e.languages.jsx.tag.inside["attr-value"].pattern = /=(?!\{)(?:('|")[\w\W]*?(\1)|[^\s>]+)/i, e.languages.insertBefore("inside", "attr-name", {
            spread: {
                pattern: /\{\.{3}\w+\}/,
                inside: {
                    punctuation: /\{|\}|\./,
                    "attr-value": /\w+/
                }
            }
        }, e.languages.jsx.tag);
        var a = e.util.clone(e.languages.jsx);
        delete a.punctuation, a = e.languages.insertBefore("jsx", "operator", {
            punctuation: /=(?={)|[{}[\];(),.:]/
        }, {
            jsx: a
        }), e.languages.insertBefore("inside", "attr-value", {
            script: {
                pattern: /=(\{(?:\{[^}]*\}|[^}])+\})/i,
                inside: a,
                alias: "language-javascript"
            }
        }, e.languages.jsx.tag)
    }(Prism), function(e) {
        e.languages.sass = e.languages.extend("css", {
            comment: {
                pattern: /^([ \t]*)\/[\/*].*(?:(?:\r?\n|\r)\1[ \t]+.+)*/m,
                lookbehind: !0
            }
        }), e.languages.insertBefore("sass", "atrule", {
            "atrule-line": {
                pattern: /^(?:[ \t]*)[@+=].+/m,
                inside: {
                    atrule: /(?:@[\w-]+|[+=])/m
                }
            }
        }), delete e.languages.sass.atrule;
        var t = /((\$[-_\w]+)|(#\{\$[-_\w]+\}))/i,
            a = [/[+*\/%]|[=!]=|<=?|>=?|\b(?:and|or|not)\b/, {
                pattern: /(\s+)-(?=\s)/,
                lookbehind: !0
            }];
        e.languages.insertBefore("sass", "property", {
            "variable-line": {
                pattern: /^[ \t]*\$.+/m,
                inside: {
                    punctuation: /:/,
                    variable: t,
                    operator: a
                }
            },
            "property-line": {
                pattern: /^[ \t]*(?:[^:\s]+ *:.*|:[^:\s]+.*)/m,
                inside: {
                    property: [/[^:\s]+(?=\s*:)/, {
                        pattern: /(:)[^:\s]+/,
                        lookbehind: !0
                    }],
                    punctuation: /:/,
                    variable: t,
                    operator: a,
                    important: e.languages.sass.important
                }
            }
        }), delete e.languages.sass.property, delete e.languages.sass.important, delete e.languages.sass.selector, e.languages.insertBefore("sass", "punctuation", {
            selector: {
                pattern: /([ \t]*)\S(?:,?[^,\r\n]+)*(?:,(?:\r?\n|\r)\1[ \t]+\S(?:,?[^,\r\n]+)*)*/,
                lookbehind: !0
            }
        })
    }(Prism), Prism.languages.scss = Prism.languages.extend("css", {
        comment: {
            pattern: /(^|[^\\])(?:\/\*[\w\W]*?\*\/|\/\/.*)/,
            lookbehind: !0
        },
        atrule: {
            pattern: /@[\w-]+(?:\([^()]+\)|[^(])*?(?=\s+[{;])/,
            inside: {
                rule: /@[\w-]+/
            }
        },
        url: /(?:[-a-z]+-)*url(?=\()/i,
        selector: {
            pattern: /(?=\S)[^@;\{\}\(\)]?([^@;\{\}\(\)]|&|#\{\$[-_\w]+\})+(?=\s*\{(\}|\s|[^\}]+(:|\{)[^\}]+))/m,
            inside: {
                parent: {
                    pattern: /&/,
                    alias: "important"
                },
                placeholder: /%[-_\w]+/,
                variable: /\$[-_\w]+|#\{\$[-_\w]+\}/
            }
        }
    }), Prism.languages.insertBefore("scss", "atrule", {
        keyword: [/@(?:if|else(?: if)?|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)/i, {
            pattern: /( +)(?:from|through)(?= )/,
            lookbehind: !0
        }]
    }), Prism.languages.scss.property = {
        pattern: /(?:[\w-]|\$[-_\w]+|#\{\$[-_\w]+\})+(?=\s*:)/i,
        inside: {
            variable: /\$[-_\w]+|#\{\$[-_\w]+\}/
        }
    }, Prism.languages.insertBefore("scss", "important", {
        variable: /\$[-_\w]+|#\{\$[-_\w]+\}/
    }), Prism.languages.insertBefore("scss", "function", {
        placeholder: {
            pattern: /%[-_\w]+/,
            alias: "selector"
        },
        statement: {
            pattern: /\B!(?:default|optional)\b/i,
            alias: "keyword"
        },
        boolean: /\b(?:true|false)\b/,
        null: /\bnull\b/,
        operator: {
            pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/,
            lookbehind: !0
        }
    }), Prism.languages.scss.atrule.inside.rest = Prism.util.clone(Prism.languages.scss), Prism.languages.typescript = Prism.languages.extend("javascript", {
        keyword: /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield|false|true|module|declare|constructor|string|Function|any|number|boolean|Array|enum|symbol|namespace|abstract|require|type)\b/
    }), Prism.languages.ts = Prism.languages.typescript, Prism.languages.yaml = {
        scalar: {
            pattern: /([\-:]\s*(![^\s]+)?[ \t]*[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)[^\r\n]+(?:\3[^\r\n]+)*)/,
            lookbehind: !0,
            alias: "string"
        },
        comment: /#.*/,
        key: {
            pattern: /(\s*(?:^|[:\-,[{\r\n?])[ \t]*(![^\s]+)?[ \t]*)[^\r\n{[\]},#\s]+?(?=\s*:\s)/,
            lookbehind: !0,
            alias: "atrule"
        },
        directive: {
            pattern: /(^[ \t]*)%.+/m,
            lookbehind: !0,
            alias: "important"
        },
        datetime: {
            pattern: /([:\-,[{]\s*(![^\s]+)?[ \t]*)(\d{4}-\d\d?-\d\d?([tT]|[ \t]+)\d\d?:\d{2}:\d{2}(\.\d*)?[ \t]*(Z|[-+]\d\d?(:\d{2})?)?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(:\d{2}(\.\d*)?)?)(?=[ \t]*($|,|]|}))/m,
            lookbehind: !0,
            alias: "number"
        },
        boolean: {
            pattern: /([:\-,[{]\s*(![^\s]+)?[ \t]*)(true|false)[ \t]*(?=$|,|]|})/im,
            lookbehind: !0,
            alias: "important"
        },
        null: {
            pattern: /([:\-,[{]\s*(![^\s]+)?[ \t]*)(null|~)[ \t]*(?=$|,|]|})/im,
            lookbehind: !0,
            alias: "important"
        },
        string: {
            pattern: /([:\-,[{]\s*(![^\s]+)?[ \t]*)("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')(?=[ \t]*($|,|]|}))/m,
            lookbehind: !0,
            greedy: !0
        },
        number: {
            pattern: /([:\-,[{]\s*(![^\s]+)?[ \t]*)[+\-]?(0x[\da-f]+|0o[0-7]+|(\d+\.?\d*|\.?\d+)(e[\+\-]?\d+)?|\.inf|\.nan)[ \t]*(?=$|,|]|})/im,
            lookbehind: !0
        },
        tag: /![^\s]+/,
        important: /[&*][\w]+/,
        punctuation: /---|[:[\]{}\-,|>?]|\.\.\./
    }, function() {
        function r(e, t) {
            return Array.prototype.slice.call((t || document).querySelectorAll(e))
        }

        function d(e, t) {
            return t = " " + t + " ", -1 < (" " + e.className + " ").replace(/[\n\t]/g, " ").indexOf(t)
        }

        function i(e, t, a) {
            for (var n, r = t.replace(/\s+/g, "").split(","), i = +e.getAttribute("data-line-offset") || 0, s = (g() ? parseInt : parseFloat)(getComputedStyle(e).lineHeight), o = 0; n = r[o++];) {
                var l = +(n = n.split("-"))[0],
                    u = +n[1] || l,
                    c = document.createElement("div");
                c.textContent = Array(u - l + 2).join(" \n"), c.setAttribute("aria-hidden", "true"), c.className = (a || "") + " line-highlight", d(e, "line-numbers") || (c.setAttribute("data-start", l), l < u && c.setAttribute("data-end", u)), c.style.top = (l - i - 1) * s + "px", d(e, "line-numbers") ? e.appendChild(c) : (e.querySelector("code") || e).appendChild(c)
            }
        }

        function n() {
            var e = location.hash.slice(1);
            r(".temporary.line-highlight").forEach(function(e) {
                e.parentNode.removeChild(e)
            });
            var t = (e.match(/\.([\d,-]+)$/) || [, ""])[1];
            if (t && !document.getElementById(e)) {
                var a = e.slice(0, e.lastIndexOf(".")),
                    n = document.getElementById(a);
                n && (n.hasAttribute("data-line") || n.setAttribute("data-line", ""), i(n, t, "temporary "), document.querySelector(".temporary.line-highlight").scrollIntoView())
            }
        }
        if ("undefined" != typeof self && self.Prism && self.document && document.querySelector) {
            var g = function() {
                    if (void 0 === t) {
                        var e = document.createElement("div");
                        e.style.fontSize = "13px", e.style.lineHeight = "1.5", e.style.padding = 0, e.style.border = 0, e.innerHTML = "&nbsp;<br />&nbsp;", document.body.appendChild(e), t = 38 === e.offsetHeight, document.body.removeChild(e)
                    }
                    return t
                },
                s = 0;
            Prism.hooks.add("before-sanity-check", function(e) {
                var t = e.element.parentNode,
                    a = t && t.getAttribute("data-line");
                if (t && a && /pre/i.test(t.nodeName)) {
                    var n = 0;
                    r(".line-highlight", t).forEach(function(e) {
                        n += e.textContent.length, e.parentNode.removeChild(e)
                    }), n && /^( \n)+$/.test(e.code.slice(-n)) && (e.code = e.code.slice(0, -n))
                }
            }), Prism.hooks.add("complete", function(e) {
                var t = e.element.parentNode,
                    a = t && t.getAttribute("data-line");
                t && a && /pre/i.test(t.nodeName) && (clearTimeout(s), i(t, a), s = setTimeout(n, 1))
            }), window.addEventListener && window.addEventListener("hashchange", n)
        }
        var t
    }(), "serviceWorker" in navigator && "caches" in window) {
    var checkIfArticleIsInCache = function() {
            return caches.keys().then(function(e) {
                return e.includes(cacheName)
            })
        },
        saveArticleToCache = function() {
            var e = document.querySelector(".versionedAsset").href.split("?v=")[1],
                t = ["httsp://cdn.nafcodes.com/assets/built/global.css?v=".concat(e), "httsp://cdn.nafcodes.com/assets/built/global.js?v=".concat(e), "httsp://cdn.nafcodes.com/assets/built/post.js?v=".concat(e)];
            return caches.open(cacheName).then(function(e) {
                return e.addAll([articlePath].concat(t))
            })
        },
        saveArticleToLocalStorage = function() {
            var e = JSON.parse(localStorage.getItem("articles") || "[]");
            return e.push(article), localStorage.setItem("articles", JSON.stringify(e)), Promise.resolve()
        },
        removeArticleFromCache = function() {
            return caches.delete(cacheName)
        },
        removeArticleFromLocalStorage = function() {
            var e = JSON.parse(localStorage.getItem("articles") || "[]");
            return e = e.filter(function(e) {
                if (e.path !== article.path) return e
            }), localStorage.setItem("articles", JSON.stringify(e)), Promise.resolve()
        },
        updateButton = function(e) {
            saveArticleButton.querySelector(".label").textContent = e ? "Sudah ditandai! Klik untuk membatalkan." : "Tandai!", e ? saveArticleButton.classList.add("saved") : saveArticleButton.classList.remove("saved")
        },
        saveArticleButton = document.getElementById("save"),
        articlePath = window.location.pathname,
        cacheName = "article-" + articlePath.replace(/\//g, ""),
        article = {
            path: articlePath,
            title: document.querySelector(".post__title").textContent
        };
    saveArticleButton.removeAttribute("hidden"), saveArticleButton.addEventListener("click", function(e) {
        checkIfArticleIsInCache().then(function(e) {
            e ? removeArticleFromCache().then(function() {
                return removeArticleFromLocalStorage()
            }).then(function() {
                return updateButton(!1)
            }) : saveArticleToCache().then(function() {
                return saveArticleToLocalStorage()
            }).then(function() {
                return updateButton(!0)
            })
        })
    }), checkIfArticleIsInCache().then(updateButton)
}