"use strict";

(function() {
    var e = ace.require("./undomanager").UndoManager;
    var t = e.prototype.execute;
    e.prototype.id_counter = 0;
    e.prototype.execute = function(e) {
        var n = e.args[0];
        for (var i = 0; i < n.length; i++) n[i].delta_array_id = ++this.id_counter;
        t.call(this, e);
    };
    e.prototype.getCurrentId = function() {
        var e = this.$undoStack[this.$undoStack.length - 1];
        if (!e) return 0;
        return e[e.length - 1].delta_array_id;
    };
})();

"use strict";

var oxford_comma = function(e) {
    switch (e.length) {
      case 1:
        return e[0];

      case 2:
        return e[0] + " and " + e[1];

      case 3:
        return e[0] + ", " + e[1] + ", and " + e[2];
    }
};

var rotate = function(e, t) {
    e.style.transform = "rotate(" + t + "deg)";
    e.style.webkitTansform = "rotate(" + t + "deg)";
    e.style.mozTransform = "rotate(" + t + "deg)";
};

var translate = function(e, t, n) {
    var i = t == null ? "" : "translate(" + t + "px," + n + "px)";
    e.style.transform = i;
    e.style.webkitTransform = i;
    e.style.mozTransform = i;
};

var text_multi = function(e, t, n) {
    if (n) {
        t = t.replace(/(\S{25})\S*/g, "$1...");
    }
    e.textContent = t;
    e.innerHTML = e.innerHTML.replace(/\n/g, "<br/>").replace(/\t/g, "&nbsp;&nbsp;&nbsp; ");
};

var escape_str = function(e) {
    e = e || "";
    return e.replace(/[\u00A0-\u9999<>\&]/g, function(e) {
        return "&#" + e.charCodeAt(0) + ";";
    });
};

var hex_print_string = function(e) {
    var t = [];
    for (var n = 0; n < e.length; n++) t.push(e.charCodeAt(n).toString(16));
    console.log(t.join(" "));
};

var js_str_from_utf16 = function(e) {
    var t = new Uint16Array(new Uint8Array([ e.charCodeAt(0), e.charCodeAt(1) ]).buffer);
    var n = t[0] === 65534 ? "be" : "le";
    var i = new Uint8Array(e.length - 2);
    for (var s = 2; s < e.length; s++) i[s - 2] = e.charCodeAt(s);
    return new TextDecoder("utf-16" + n).decode(new Uint16Array(i.buffer));
};

var decode_body = function(e) {
    e = e || "";
    try {
        if (e.substr(0, 2) == String.fromCharCode.call(null, 255, 254) || e.substr(0, 2) == String.fromCharCode.call(null, 254, 255)) return js_str_from_utf16(e); else return decodeURIComponent(escape(e));
    } catch (t) {
        return e;
    }
};

var css_animation = function() {
    var e = [];
    var t = [];
    return function(n, i, s, r) {
        n.classList.remove(i);
        n.offsetTop;
        var o = t.indexOf(n);
        if (o != -1) {
            clearTimeout(e[o]);
            e.splice(o, 1);
            t.splice(o, 1);
        }
        t.push(n);
        e.push(setTimeout(s, r));
        n.classList.add(i);
    };
}();

var stop_propagation = function(e) {
    e.stopPropagation();
};

var prevent_default = function(e) {
    e.preventDefault();
};

var prevent_default_and_stop_propagation = function(e) {
    e.stopPropagation();
    e.preventDefault();
};

var until_success = function(e) {
    var t = undefined;
    var n = function(n, i) {
        var s = function(r) {
            if (t) {
                try {
                    var o = t(r);
                    if (o) return n(o);
                } catch (a) {
                    return i(a);
                }
            }
            return new Promise(e).then(n, s);
        };
        return new Promise(e).then(n, s);
    };
    var i = new Promise(n);
    i.before_retry = function(e) {
        t = e;
        return i;
    };
    return i;
};

var ext_from_filename = function(e) {
    e = e || "";
    return e.slice((Math.max(0, e.lastIndexOf(".")) || Infinity) + 1);
};

var load_script_async = function(e) {
    var t = document.createElement("script");
    t.async = 1;
    t.src = e;
    var n = document.getElementsByTagName("script")[0];
    n.parentNode.insertBefore(t, n);
};

var offline_simple = function() {
    var e = [];
    var t = {
        0: 1,
        1: 500,
        500: 1e3,
        1e3: 2500,
        2500: 5e3,
        5e3: 1e4,
        1e4: 6e4,
        6e4: 6e4
    };
    var n = 0;
    var i = 0;
    var s = function() {
        if (i) return;
        n = 0;
        clearTimeout(i);
        i = setTimeout(d, n);
    };
    var r = function() {
        n = t[n];
        clearTimeout(i);
        console.log("Test of internet access will be made in " + n + "ms.");
        i = setTimeout(d, n);
    };
    var o = function(t, n) {
        if (t !== "online") throw "only 'online' events please.";
        e.push(n);
    };
    var a = function(t) {
        if (t !== "online") throw "only 'online' events please.";
        console.log("internet is available");
        for (var n = 0; n < e.length; n++) e[n]({
            is_online: true
        });
    };
    var d = function() {
        i = 0;
        console.log("testing for internet access");
        var e = new XMLHttpRequest();
        e.open("HEAD", "/img/favicon.ico?_=" + new Date().getTime(), true);
        if (e.timeout != null) e.timeout = 5e3;
        var t = function() {
            if (e.status && e.status < 12e3) a("online"); else r();
        };
        if (e.onprogress === null) {
            e.onerror = r;
            e.ontimeout = r;
            e.onload = t;
        } else {
            e.onreadystatechange = function() {
                if (e.readyState === 4) checkStatus(); else if (e.readyState === 0) r();
            };
        }
        try {
            e.send();
        } catch (n) {
            r();
        }
    };
    return {
        addEventListener: o,
        commence_testing: s
    };
}();

"use strict";

var DropDown = function(e) {
    var t = e.map(function(e) {
        return "<div class='dropdown_item' title='" + escape_str(e) + "'>" + escape_str(e) + "</div>";
    }).join("");
    this.val_array = e.slice(0);
    this.el_list = document.createElement("div");
    this.el_list.className = "dropdown_item_list";
    this.el_list.tabindex = -1;
    this.el_list.style.display = "none";
    this.el_list.innerHTML = t;
    this.el_collapsed = document.createElement("div");
    this.el_collapsed.className = "dropdown_collapsed";
    this.el = document.createElement("div");
    this.el.className = "dropdown";
    this.el.appendChild(this.el_list);
    this.el.appendChild(this.el_collapsed);
    this.ind = 0;
    this.el_collapsed.textContent = e[0];
    this.event_callbacks = {};
    this.open = false;
    this.enabled = true;
    var n = this;
    this.document_mousedown = function(e) {
        n.el_list.style.display = "none";
        n.open = false;
        n.trigger("blur");
        document.removeEventListener("mousedown", n.document_mousedown);
    };
    this.el_collapsed.addEventListener("mousedown", function() {
        if (!n.enabled) return;
        if (!n.trigger("click")) return;
        n.el.parentNode.classList.add("selected");
        n.el_list.style.display = "";
        this.open = true;
        setTimeout(function() {
            n.el_list.focus();
            n.el_list.scrollTop = n.el_list.children[n.ind].offsetTop;
            document.addEventListener("mousedown", n.document_mousedown);
        }, 1);
    });
    var i = function(e) {
        n.SetInd(this.getAttribute("data-ind"));
        n.el_list.style.display = "none";
        n.open = false;
        e.stopPropagation();
        document.removeEventListener("mousedown", n.document_mousedown);
    };
    for (var s = 0; s < this.el_list.children.length; s++) {
        this.el_list.children[s].setAttribute("data-ind", s);
        this.el_list.children[s].addEventListener("click", i);
    }
    return this;
};

DropDown.FakeEvent = function() {
    this.is_stopped = false;
};

DropDown.FakeEvent.prototype.preventDefault = function() {
    this.is_stopped = true;
};

DropDown.FakeEvent.prototype.stopImmediatePropagation = function() {
    this.is_stopped = true;
};

DropDown.prototype.addEventListener = function(e, t) {
    if (!(e in this.event_callbacks)) this.event_callbacks[e] = [];
    this.event_callbacks[e].push(t);
};

DropDown.prototype.trigger = function(e, t) {
    var n = new DropDown.FakeEvent();
    if (e in this.event_callbacks) {
        for (var i = 0; i < this.event_callbacks[e].length; i++) this.event_callbacks[e][i].call(this, n);
        if (n.is_stopped) return false;
    }
    return true;
};

DropDown.prototype.IndexOf = function(e) {
    return this.val_array.indexOf(e);
};

DropDown.prototype.GetVal = function() {
    return this.val_array[this.ind];
};

DropDown.prototype.SetInd = function(e, t) {
    e = Math.min(Math.max(parseInt(e), 0), this.val_array.length - 1);
    if (e === this.ind) return;
    this.el_list.children[this.ind].classList.remove("selected");
    this.el_collapsed.textContent = this.val_array[e];
    this.el_collapsed.title = escape_str(this.val_array[e]);
    this.ind = e;
    this.el_list.children[e].classList.add("selected");
    if (!t) this.trigger("change", {
        ind: e,
        str: this.val_array[e],
        isOpen: this.open
    });
};

DropDown.prototype.SetSelected = function(e) {
    if (e) this.el.parentNode.classList.add("selected"); else this.el.parentNode.classList.remove("selected");
};

"use strict";

dn.menu_id_to_caption = {
    menu_print: "print",
    menu_sharing: "sharing",
    menu_save: "save",
    menu_history: "history",
    menu_file: "current file",
    menu_new: "new",
    menu_open: "new/open",
    menu_find: "find/replace",
    menu_goto: "goto line",
    menu_general_settings: "general settings",
    menu_shortcuts: "shortcuts",
    menu_drive: "drive",
    menu_help: "about/help"
};

dn.shortcuts_list = [ "cut|Ctrl-X|Cmd-X", "copy|Ctrl-C|Cmd-C", "paste|Ctrl-V|Cmd-V", "cycle clipboard|Cltr-[V then left or right arrow]|Cmd-[V then left or right arrow]", "select all|Ctrl-A|Cmd-A", "find|Ctrl(-Alt)-F", "replace|Ctrl-R", "go to line|Ctrl(-Alt)-L", "undo|Ctrl-Z|Cmd-Z", "redo|Ctrl-Shift-Z,Ctrl-Y|Cmd-Shift-Z,Cmd-Y", "autocomplete|Ctrl-Space|Cmd-Space", " | ", "toggle widget|Esc", "save|Ctrl-S|Cmd-S", "print|Ctrl(-Alt)-P|Cmd-P", "file history|Ctrl-H|Cmd-H", "new|Ctrl(-Alt)-N", "open|Ctrl(-Alt)-O", "  | ", "to upper case|Ctrl-U", "to lower case|Ctr-Shift-U", "modify selection|Shift-(Ctrl-)(Alt-) {Down, Up, Left, Right, End, Home, PageDown, PageUp, End}|Shift-(Cmd-)(Alt-) {Down, Up, Left, Right, End, Home, PageDown,End}", "copy lines down|Ctrl-Alt-Down|Cmd-Option-Down", "copy lines up|Ctrl-Alt-Up|Cmd-Option-Up", "center selection||Ctrl-L", "fold all|Alt-0|Option-0", "unfold all|Alt-Shift-0|Option-Shift-0", "go to end|Ctrl-End,Ctrl-Down|Cmd-End,Cmd-Down", "go to line end|Alt-Right,End|Cmd-Right,End,Ctrl-E", "go to line start|Alt-Left,Home|Cmd-Left,Home,Ctrl-A", "go to page down|PageDown|Option-PageDown,Ctrl-V", "go to page up|PageUp|Option-PageUp", "go to start|Ctrl-Home,Ctrl-Up|Cmd-Home,Cmd-Up", "go to word left|Ctrl-Left|Option-Left", "go to word right|Ctrl-Right|Option-Right", "indent|Tab", "outdent|Shift-Tab", "overwrite|Insert", "remove line|Ctrl-D|Cmd-D", "remove to line end||Ctrl-K", "remove to linestart||Option-Backspace", "remove word left||Alt-Backspace,Ctrl-Alt-Backspace", "remove word right||Alt-Delete", "split line||Ctrl-O", "toggle comment|Ctrl-7|Cmd-7", "transpose letters|Ctrl-T" ];

dn.ext_to_mime_type = {
    html: "text/html",
    htm: "text/html",
    js: "text/javascript",
    pl: "application/x-perl",
    xml: "text/xml",
    c: "text/x-csrc",
    cpp: "text/x-c++src",
    h: "text/x-chdr",
    json: "application/json",
    php: "application/x-php",
    svg: "text/html",
    css: "text/css",
    java: "text/x-java",
    py: "text/x-python",
    scala: "scala",
    textile: "textile",
    tex: "application/x-tex",
    bib: "application/x-tex",
    rtf: "application/rtf",
    rtx: "application/rtf",
    sh: "application/x-sh",
    sql: "text/x-sql",
    as: "text/x-actionscript"
};

dn.tooltip_info = {
    save: "Save file contents.  ",
    print: "Open print view in a new tab.  ",
    sharing: "View and modify file's sharing status.",
    "file history": "Explore the file history.  ",
    drive: "Show this file in Google Drive.  ",
    about: "Drive Notepad website.",
    shortcuts: "Keyboard shortcuts.",
    "new": "Create new file in a new tab.  ",
    open: "Launch open dialoag.  ",
    settings_file: "Properties of the current file.",
    settings_general: "Your general Drive Notepad preferences.",
    title: "Click to edit the file's title.",
    description: "Click to edit the file's description."
};

var WHICH = {
    ENTER: 13,
    ESC: 27,
    UP: 38,
    DOWN: 40
};

dn.default_settings = {
    ext: "txt",
    wordWrap: [ true, null, null ],
    wordWrapAt: 80,
    fontSize: 1,
    widget_anchor: [ "l", 50, "t", 10 ],
    showGutterHistory: 1,
    lastDNVersionUsed: "",
    newLineDefault: "windows",
    historyRemovedIsExpanded: true,
    softTabN: 4,
    tabIsHard: 0,
    widgetSub: "general",
    theme: "chrome",
    pane: "",
    pane_open: true,
    find_regex: false,
    find_whole_words: false,
    find_case_sensitive: false,
    help_inner: "main",
    find_goto: false,
    find_replace: false
};

dn.impersonal_settings_keys = [ "wordWrap", "wordWrapAt", "fontSize", "widget_anchor", "showGutterHistory", "historyRemovedIsExpanded", "tabIsHard", "softTabN", "newLineDefault", "widgetSub", "theme", "pane", "pane_open", "find_regex", "find_whole_words", "find_case_sensitive", "help_inner", "find_goto", "find_replace" ];

dn.const_ = {
    auth_timeout: dn.const_.auth_timeout,
    drag_delay_ms: 400,
    drag_shift_px: 40,
    min_font_size: .3,
    max_font_size: 5,
    max_wrap_at: 200,
    min_wrap_at: 20,
    wrap_at_increment: 10,
    max_soft_tab_n: 10,
    min_soft_tab_n: 2,
    detect_tabs_spaces_frac: .9,
    detect_tabs_tabs_frac: .9,
    detect_tabs_n_spaces_frac: .99,
    detect_tabs_n_spaces_frac_for_default: .6,
    font_size_increment: .15,
    error_delay_ms: 5e3,
    find_history_add_delay: 3e3,
    find_history_max_len: 100,
    clipboard_info_delay: 500,
    clipboard_max_length: 20,
    find_max_results_half: 3,
    find_max_prefix_chars: 10,
    find_max_suffix_chars: 60,
    ad_initial_wait: 4 * 60 * 1e3
};

dn.platform = function() {
    if (navigator.platform.indexOf("Win") > -1) return "Windows"; else if (navigator.platform.indexOf("Linux") > -1) return "Linux"; else if (navigator.platform.indexOf("Mac") > -1) return "Mac";
    return null;
}();

"use strict";

dn.FileModel = function() {
    this.is_loaded = false;
    this.file_id = null;
    this.folder_id = null;
    this.title = null;
    this.description = "";
    this.ext = "";
    this.loaded_body = "";
    this.loaded_mime_type = undefined;
    this.chosen_mime_type = "text/plain";
    this.is_read_only = false;
    this.is_shared = false;
    this.properties_chosen = {}, this.properties = {}, this.properties_detected_info = {};
    this.change_callbacks = [];
    return this;
};

dn.FileModel.prototype.addEventListener = function(e, t) {
    if (e !== "change") throw "only change listeners please!";
    this.change_callbacks.push(t);
};

dn.FileModel.prototype.trigger = function(e, t) {
    if (e !== "change") throw "only change events please!";
    for (var n = 0; n < this.change_callbacks.length; n++) this.change_callbacks[n](t);
};

dn.FileModel.prototype.set = function(e) {
    if (e.syntax && e.syntax !== this.properties.syntax) {
        this.properties.syntax = e.syntax;
        if (this.is_loaded) this.compute_syntax();
    }
    if (e.newline && e.newline !== this.properties.newline) {
        this.properties.newline = e.newline;
        if (this.is_loaded) this.compute_newline();
    }
    if (e.tabs && !(this.properties.tabs && e.tabs.val === this.properties.tabs.val && e.tabs.n === this.properties.tabs.n)) {
        this.properties.tabs = e.tabs;
        if (this.is_loaded) this.compute_tabs();
    }
    if (e.title && e.title !== this.title) {
        this.update_mime_type(this.title, e.title);
        this.title = e.title;
        this.trigger("change", {
            property: "title"
        });
        if (this.is_loaded) this.compute_syntax();
    }
    if (e.description && e.description !== this.description) {
        this.description = e.description;
        this.trigger("change", {
            property: "description"
        });
    }
    if (e.is_read_only && e.is_read_only !== this.is_read_only) {
        this.is_read_only = e.is_read_only;
        this.trigger("change", {
            property: "is_read_only"
        });
    }
    if (e.is_shared && e.is_shared !== this.is_shared) {
        this.is_shared = e.is_shared;
        this.trigger("change", {
            property: "is_shared"
        });
    }
    if (e.loaded_mime_type) {
        this.loaded_mime_type = e.loaded_mime_type;
        this.chosen_mime_type = this.loaded_mime_type || "text/plain";
    }
    if (e.is_loaded && ~this.is_loaded) {
        this.is_loaded = true;
        this.compute_newline();
        this.compute_tabs();
        this.compute_syntax();
        this.trigger("change", {
            property: "is_loaded"
        });
    }
};

dn.FileModel.prototype.update_mime_type = function(e, t) {
    old_ext = ext_from_filename(e);
    new_ext = ext_from_filename(t);
    if (new_ext !== old_ext) {
        this.loaded_mime_type = undefined;
        this.chosen_mime_type = dn.ext_to_mime_type[new_ext] || "text/plain";
    }
};

dn.FileModel.prototype.compute_newline = function() {
    var e = this.loaded_body;
    if (this.properties.newline === "windows") this.properties_chosen.newline = "windows"; else if (this.properties.newline === "unix") this.properties_chosen.newline = "unix"; else this.properties.newline = "detect";
    var t = e.indexOf("\n");
    if (t === -1) {
        var n = dn.g_settings.get("newLineDefault");
        this.properties_detected_info.newline = "no newlines detected, default is " + n + "-like";
        if (this.properties.newline === "detect") this.properties_chosen.newline = n;
    } else {
        var i = e.indexOf("\r\n") != -1;
        var s = e.match(/[^\r]\n/) ? true : false;
        if (i && !s) {
            this.properties_detected_info.newline = "detected windows-like newlines";
            if (this.properties.newline === "detect") this.properties_chosen.newline = "windows";
        } else if (s && !i) {
            this.properties_detected_info.newline = "detected unix-like newlines";
            if (this.properties.newline === "detect") this.properties_chosen.newline = "unix";
        } else {
            var n = dn.g_settings.get("newLineDefault");
            this.properties_detected_info.newline = "mixture of newlines detected, default is " + n + "-like";
            this.properties_chosen.newline = n;
        }
    }
    this.trigger("change", {
        property: "newline"
    });
};

dn.FileModel.prototype.compute_syntax = function() {
    var e = this.title;
    this.properties_chosen.syntax = undefined;
    if (this.properties.syntax && this.properties.syntax !== "detect") {
        var t = require("ace/ext/modelist").modes;
        for (var n = 0; n < t.length; n++) if (t[n].caption == this.properties.syntax) {
            this.properties_chosen.syntax = this.properties.syntax;
            break;
        }
        if (this.properties_chosen.syntax === undefined) this.properties.syntax = "detect";
    } else {
        this.properties.syntax = "detect";
    }
    var i = require("ace/ext/modelist").getModeForPath(e).caption;
    this.properties_detected_info.syntax = "detected " + i + " from file extension";
    if (this.properties_chosen.syntax === undefined) this.properties_chosen.syntax = i;
    this.trigger("change", {
        property: "syntax"
    });
};

dn.FileModel.prototype.re_whitepace = /^([^\S\n\r]+)/gm;

dn.FileModel.prototype.compute_tabs = function() {
    var e = this.loaded_body;
    var t = this.properties.tabs;
    try {
        if (t.val === undefined && t.n === undefined) t = JSON.parse(t);
        t = {
            val: t.val,
            n: t.n
        };
        t.n = parseInt(t.n);
        if (!(t.val === "tab" || t.val === "spaces")) throw 0;
        if (!(t.n >= dn.const_.min_soft_tab_n && t.n <= dn.const_.max_soft_tab_n)) t.n = undefined;
        if (t.val === "spaces" && t.n === undefined) throw 0;
    } catch (n) {
        t = {
            val: "detect"
        };
    }
    this.properties.tabs = t;
    if (t.val === "tab") this.properties_chosen.tabs = t; else if (t.val === "spaces") this.properties_chosen.tabs = t; else this.properties_chosen.tabs = undefined;
    var i = e.match(this.re_whitepace) || [];
    var s = 0;
    var r;
    var o = [];
    var a = 0;
    var d = Math.min(i.length, 1e3);
    for (var l = 0; l < d; l++) {
        var _ = i[l];
        var c = _.replace("\t", "");
        if (c.length === 0) s++; else if (c.length !== _.length) a++; else o[_.length] = (o[_.length] || 0) + 1;
    }
    r = d - a - s;
    if (s / d >= dn.const_.detect_tabs_tabs_frac) {
        this.properties_detected_info.tabs = "hard tab indentation detected";
        if (this.properties_chosen.tabs === undefined) this.properties_chosen.tabs = {
            val: "tabs"
        };
        if (this.properties_chosen.tabs.n === undefined) this.properties_chosen.tabs.n = dn.g_settings.get("softTabN");
    } else if (d === 0 || r / d < dn.const_.detect_tabs_spaces_frac) {
        if (this.properties_chosen.tabs === undefined) {
            this.properties_chosen.tabs = {
                val: dn.g_settings.get("tabIsHard") ? "tabs" : "spaces",
                n: dn.g_settings.get("softTabN")
            };
        }
        this.properties_detected_info.tabs = (d === 0 ? "no indentations detected" : "detected mixture of tabs") + ", default is " + (this.properties_chosen.tabs.val == "tabs" ? "hard tabs" : dn.g_settings.get("softTabN") + " spaces");
    } else {
        var u = [];
        for (var f = dn.const_.min_soft_tab_n; f <= dn.const_.max_soft_tab_n; f++) {
            for (var l = f, p = 0; l < o.length; l += f) p += o[l] === undefined ? 0 : o[l];
            u[f] = p;
        }
        var f;
        for (f = dn.const_.max_soft_tab_n; f >= dn.const_.min_soft_tab_n; f--) if (u[f] / r > dn.const_.detect_tabs_n_spaces_frac) {
            this.properties_detected_info.tabs = "detected soft-tabs of " + f + " spaces";
            break;
        }
        if (f < dn.const_.min_soft_tab_n) {
            f = dn.g_settings.get("softTabN");
            if (u[f] / r > dn.const_.detect_tabs_n_spaces_frac_for_default) this.properties_detected_info.tabs = "detected close match to default of " + f + " spaces"; else this.properties_detected_info.tabs = "detected soft-tabs, assuming default " + f + " spaces";
        }
        if (this.properties_chosen.tabs === undefined) this.properties_chosen.tabs = {
            val: "spaces"
        };
        if (this.properties_chosen.tabs.n === undefined) this.properties_chosen.tabs.n = f;
    }
    this.trigger("change", {
        property: "tabs"
    });
};

"use strict";

dn.settings_pane = function() {
    var e = {};
    var t;
    var n = function() {
        e.theme_chooser = document.getElementById("theme_chooser");
        e.button_clear_clipboard = document.getElementById("button_clear_clipboard");
        e.button_clear_find_replace = document.getElementById("button_clear_find_replace");
        e.gutter_history_show = document.getElementById("gutter_history_show");
        e.gutter_history_hide = document.getElementById("gutter_history_hide");
        e.word_wrap_off = document.getElementById("word_wrap_off");
        e.word_wrap_at = document.getElementById("word_wrap_at");
        e.word_wrap_edge = document.getElementById("word_wrap_edge");
        e.font_size_dec = document.getElementById("font_size_dec");
        e.font_size_inc = document.getElementById("font_size_inc");
        e.font_size_text = document.getElementById("font_size_text");
        e.tab_hard = document.getElementById("tab_hard");
        e.tab_soft = document.getElementById("tab_soft");
        e.newline_windows = document.getElementById("newline_menu_windows");
        e.newline_unix = document.getElementById("newline_menu_unix");
        e.tab_soft_text = document.getElementById("tab_soft_text");
        e.tab_soft_dec = document.getElementById("tab_soft_dec");
        e.tab_soft_inc = document.getElementById("tab_soft_inc");
        e.word_wrap_at_text = document.getElementById("word_wrap_at_text");
        e.word_wrap_at_dec = document.getElementById("word_wrap_at_dec");
        e.word_wrap_at_inc = document.getElementById("word_wrap_at_inc");
        dn.g_settings.addEventListener("VALUE_CHANGED", r);
        var n = require("ace/ext/themelist");
        t = new DropDown(Object.keys(n.themesByName));
        t.addEventListener("change", function() {
            dn.g_settings.set("theme", t.GetVal());
        });
        t.addEventListener("blur", function() {
            dn.focus_editor();
        });
        e.theme_chooser.appendChild(t.el);
        e.newline_windows.addEventListener("click", function() {
            dn.g_settings.set("newLineDefault", "windows");
        });
        e.newline_unix.addEventListener("click", function() {
            dn.g_settings.set("newLineDefault", "unix");
        });
        e.tab_hard.addEventListener("click", function() {
            dn.g_settings.set("tabIsHard", 1);
        });
        e.tab_soft.addEventListener("click", function() {
            dn.g_settings.set("tabIsHard", 0);
        });
        e.tab_soft_dec.addEventListener("click", function() {
            var e = dn.g_settings.get("softTabN") - 1;
            e = e < dn.const_.min_soft_tab_n ? dn.const_.min_soft_tab_n : e;
            dn.g_settings.set("softTabN", e);
        });
        e.tab_soft_inc.addEventListener("click", function() {
            var e = dn.g_settings.get("softTabN") + 1;
            e = e > dn.const_.max_soft_tab_n ? dn.const_.max_soft_tab_n : e;
            dn.g_settings.set("softTabN", e);
        });
        e.font_size_dec.addEventListener("click", i);
        e.font_size_inc.addEventListener("click", s);
        e.word_wrap_off.addEventListener("click", function() {
            dn.g_settings.set("wordWrap", [ 0, 0, 0 ]);
        });
        e.word_wrap_at.addEventListener("click", function() {
            var e = dn.g_settings.get("wordWrapAt");
            dn.g_settings.set("wordWrap", [ 1, e, e ]);
        });
        e.word_wrap_at_dec.addEventListener("click", function() {
            var e = dn.g_settings.get("wordWrapAt") - dn.const_.wrap_at_increment;
            e = e < dn.const_.min_wrap_at ? dn.const_.min_wrap_at : e;
            dn.g_settings.set("wordWrapAt", e);
        });
        e.word_wrap_at_inc.addEventListener("click", function() {
            var e = dn.g_settings.get("wordWrapAt") + dn.const_.wrap_at_increment;
            e = e > dn.const_.max_wrap_at ? dn.const_.max_wrap_at : e;
            dn.g_settings.set("wordWrapAt", e);
        });
        e.word_wrap_edge.addEventListener("click", function() {
            dn.g_settings.set("wordWrap", [ 1, null, null ]);
        });
        e.gutter_history_show.addEventListener("click", function() {
            dn.g_settings.set("showGutterHistory", 1);
        });
        e.gutter_history_hide.addEventListener("click", function() {
            dn.g_settings.set("showGutterHistory", 0);
        });
        e.button_clear_clipboard.addEventListener("click", function() {
            dn.g_clipboard.clear();
        });
        e.button_clear_find_replace.addEventListener("click", function() {
            dn.g_find_history.clear();
        });
    };
    var i = function() {
        var e = dn.g_settings.get("fontSize");
        e -= dn.const_.font_size_increment;
        e = e < dn.const_.min_font_size ? dn.const_.min_font_size : e;
        dn.g_settings.set("fontSize", e);
    };
    var s = function() {
        var e = dn.g_settings.get("fontSize");
        e += dn.const_.font_size_increment;
        e = e > dn.const_.max_font_size ? dn.const_.max_font_size : e;
        dn.g_settings.set("fontSize", e);
    };
    var r = function(n) {
        var i = n.newValue;
        switch (n.property) {
          case "showGutterHistory":
            var s = dn.editor.getSession();
            if (i) {
                e.gutter_history_show.classList.add("selected");
                e.gutter_history_hide.classList.remove("selected");
            } else {
                e.gutter_history_hide.classList.add("selected");
                e.gutter_history_show.classList.remove("selected");
            }
            break;

          case "wordWrapAt":
            e.word_wrap_at_text.textContent = i;
            break;

          case "wordWrap":
            if (!i[0]) e.word_wrap_off.classList.add("selected"); else e.word_wrap_off.classList.remove("selected");
            if (i[0] && !i[1]) e.word_wrap_edge.classList.add("selected"); else e.word_wrap_edge.classList.remove("selected");
            if (i[0] && i[1]) e.word_wrap_at.classList.add("selected"); else e.word_wrap_at.classList.remove("selected");
            break;

          case "softTabN":
            e.tab_soft_text.textContent = i;
            break;

          case "tabIsHard":
            if (i) {
                e.tab_soft.classList.remove("selected");
                e.tab_hard.classList.add("selected");
            } else {
                e.tab_soft.classList.add("selected");
                e.tab_hard.classList.remove("selected");
            }
            break;

          case "newLineDefault":
            if (i == "windows") {
                e.newline_unix.classList.remove("selected");
                e.newline_windows.classList.add("selected");
            } else {
                e.newline_unix.classList.add("selected");
                e.newline_windows.classList.remove("selected");
            }
            break;

          case "fontSize":
            var r = dn.get_scroll_line();
            e.font_size_text.textContent = i.toFixed(1);
            break;

          case "theme":
            t.SetInd(t.IndexOf(i), true);
            break;
        }
    };
    return {
        on_document_ready: n
    };
}();

"use strict;";

dn.open_pane = function() {
    var e = {};
    var t;
    var n = function() {
        e.opener_button_a = document.getElementById("opener_button_a");
        e.opener_button_a.addEventListener("click", i);
    };
    var i = function() {
        gapi.load("picker", function() {
            var e = new google.picker.View(google.picker.ViewId.DOCS);
            try {
                if (!t) {
                    t = new google.picker.PickerBuilder().enableFeature(google.picker.Feature.NAV_HIDDEN).setAppId(dn.client_id).setOAuthToken(gapi.auth.getToken().access_token).addView(e).setCallback(s).build();
                    if (!t) throw "could not build picker";
                }
                t.setVisible(true);
            } catch (n) {
                dn.show_error("" + n);
            }
        });
    };
    var s = function(e) {
        if (e.action == google.picker.Action.PICKED) {
            var t = e.docs[0].id;
            var n = "?state=" + JSON.stringify({
                action: "open",
                userId: dn.url_user_id,
                ids: [ t ]
            });
            window.location = n;
        } else if (e.action == "cancel") {
            dn.focus_editor();
        }
    };
    return {
        on_document_ready: n
    };
}();

"use strict";

dn.help_pane = function() {
    var e = {};
    var t = function(t) {
        e.inner_pane_shortcuts.style.display = "none";
        e.inner_pane_tips.style.display = "none";
        e.inner_pane_main.style.display = "none";
        e.button_shortcuts.classList.remove("selected");
        e.button_tips.classList.remove("selected");
        if (t == "tips") {
            e.inner_pane_tips.style.display = "";
            e.button_tips.classList.add("selected");
        } else if (t == "shortcuts") {
            e.inner_pane_shortcuts.style.display = "";
            e.button_shortcuts.classList.add("selected");
        } else {
            e.inner_pane_main.style.display = "";
        }
    };
    var n = function(t) {
        e.user_name.textContent = t;
    };
    var i = function() {
        var t = dn.shortcuts_list;
        var n = {};
        var i = dn.platform;
        if (i == "Windows" || i == "Linux") {
            for (var s = 0; s < t.length; s++) {
                var r = t[s].split("|");
                if (r[1].length) n[r[0]] = r[1];
            }
        } else if (i == "Mac") {
            for (var s = 0; s < t.length; s++) {
                var r = t[s].split("|");
                if (r[1].length) n[r[0]] = r.length > 2 ? r[2] : r[1];
            }
        } else {}
        var o = [];
        for (var a in n) o.push("<div class='shortcut_item'><div class='shortcut_action'>" + a + "</div><div class='shortcut_key'>" + n[a].replace(",", "<br>") + "</div></div>");
        e.inner_pane_shortcuts.innerHTML = [ "<div class='widget_box_title shortcuts_title'>Keyboard Shortcuts ", i ? "(" + i + ")" : "", "</div>", "<div class='shortcuts_header_action'>action</div><div class='shortcuts_header_key'>key</div>", "<div class='shortcuts_list'>", o.join(""), "</div>" ].join("");
    };
    var s = function() {
        e.user_name = document.getElementById("user_name");
        e.inner_pane_shortcuts = document.getElementById("pane_help_shortcuts");
        e.inner_pane_tips = document.getElementById("pane_help_tips");
        e.inner_pane_main = document.getElementById("pane_help_main");
        e.button_shortcuts = document.getElementById("button_view_shortcuts");
        e.button_tips = document.getElementById("button_view_tips");
        e.button_shortcuts.addEventListener("click", function() {
            if (dn.g_settings.get("help_inner") === "shortcuts") dn.g_settings.set("help_inner", "main"); else dn.g_settings.set("help_inner", "shortcuts");
        });
        e.button_tips.addEventListener("click", function() {
            if (dn.g_settings.get("help_inner") === "tips") dn.g_settings.set("help_inner", "main"); else dn.g_settings.set("help_inner", "tips");
        });
        i();
        dn.g_settings.addEventListener("VALUE_CHANGED", function(e) {
            if (e.property === "help_inner") t(e.newValue);
        });
    };
    return {
        on_document_ready: s,
        on_user_name_change: n
    };
}();

"use strict";

dn.filter_api_errors = function(e) {
    if (dn.is_auth_error(e)) {
        dn.pr_auth.reject(e);
        return false;
    } else {
        throw e;
    }
};

dn.is_auth_error = function(e) {
    if (!e) return 2;
    try {
        if (e.status > 200) {
            var t = "status: " + e.status + "   ";
            if (e.result && e.result.error) t += JSON.stringify(e.result.error);
            t += " dn.status: " + JSON.stringify(dn.status);
            t += " stack: " + new Error().stack;
            ga("send", "exception", {
                exDescription: t
            });
        }
    } catch (n) {}
    if (e.type === "token_refresh_required" || e.status === 401) return 1;
    if (e.status === 403) {
        var i = "";
        try {
            i = e.result.error.errors[0].reason;
        } catch (n) {}
        if (i === "domainPolicy") return 0;
        if (i === "insufficientFilePermissions") return 0;
        if (i === "cannotDownloadAbusiveFile") return 0;
        return 1;
    }
    if (e.status === 404) return 0;
    if (e === "timeout") return 3;
    if (e.result && e.result.error && e.result.error.code === -1) return 3;
    if (e.status === 400) return 0;
    if (e.status === 500) return 4;
    return 0;
};

dn.api_error_to_string = function(e) {
    if (!e) return "Error.";
    var t = "";
    try {
        t = e.result.error.errors[0].reason;
    } catch (n) {}
    if (t === "insufficientFilePermissions") return "You do not have permission to modify the file.";
    if (t === "domainPolicy") return "Your domain administrators have disabled Drive apps.";
    if (e.result && e.result.error && e.result.error.message !== undefined) {
        return "" + e.result.error.message;
    } else {
        console.log("Strangely structured error:");
        console.dir(e);
        return "Error. See developer console for details.";
    }
};

dn.handle_auth_error = function(e) {
    dn.status.authorization = -1;
    dn.status.popup_active = 0;
    dn.show_status();
    var t = dn.is_auth_error(e);
    if (t === 0) {
        dn.show_error(dn.api_error_to_string(e));
    } else if (t == 1) {
        dn.reauth_auto();
    } else if (t == 2) {
        dn.toggle_permission(true);
    } else {
        dn.show_error("network error. retrying...");
        offline_simple.commence_testing();
    }
};

dn.reauth_auto_delay_chain = {
    0: 1,
    1: 500,
    500: 1e3,
    1e3: 2500,
    2500: 5e3,
    5e3: 1e4,
    1e4: 6e4,
    6e4: 6e4
};

dn.reauth_auto = function() {
    if (!dn.reauth_auto_timer) {
        if (!dn.reauth_auto_delay) dn.reauth_auto_delay = dn.reauth_auto_delay_chain[0]; else dn.reauth_auto_delay = dn.reauth_auto_delay_chain[dn.reauth_auto_delay];
        dn.status.authorization = 0;
        dn.show_status();
        console.log("issuing auto reauth with delay " + dn.reauth_auto_delay + "ms.");
        dn.reauth_auto_timer = setTimeout(function() {
            dn.reauth_auto_timer = undefined;
            console.log("and now running the auto reauth...");
            Promise.race([ gapi.auth.authorize(dn.auth_map(true)), make_timeout(dn.const_.auth_timeout) ]).then(dn.pr_auth.resolve.bind(dn.pr_auth), dn.pr_auth.reject.bind(dn.pr_auth));
        }, dn.reauth_auto_delay);
    } else {
        console.log("auto reauth already due to be sent");
    }
};

dn.reauth_manual = function() {
    dn.status.popup_active = 1;
    dn.status.authorization = 0;
    dn.show_status();
    Promise.resolve(gapi.auth.authorize(dn.auth_map(false))).then(dn.pr_auth.resolve.bind(dn.pr_auth), dn.pr_auth.reject.bind(dn.pr_auth));
};

dn.request_user_info = function() {
    return gapi.client.request({
        path: "userinfo/v2/me?fields=name"
    });
};

dn.request_file_meta = function() {
    return gapi.client.request({
        path: "/drive/v3/files/" + dn.the_file.file_id,
        params: {
            fields: "id,name,mimeType,description,parents,capabilities,fileExtension,shared,properties"
        }
    });
};

dn.request_file_body = function() {
    return gapi.client.request({
        path: "/drive/v3/files/" + dn.the_file.file_id,
        params: {
            alt: "media"
        },
        headers: {
            contentType: "charset=utf-8"
        }
    });
};

dn.make_multipart_boundary = function() {
    return new Date().getTime() + "" + Math.random() * 10;
};

dn.request_new = function(e, t) {
    var n = {
        name: t
    };
    if (e !== undefined) n["parents"] = [ e ];
    return function() {
        return gapi.client.request({
            path: "/drive/v3/files/",
            method: "POST",
            params: {
                fields: "id,name,mimeType,description,parents,capabilities,fileExtension,shared"
            },
            body: JSON.stringify(n)
        });
    };
};

dn.request_revision_list = function() {
    return gapi.client.request({
        path: "/drive/v3/files/" + dn.the_file.file_id + "/revisions"
    });
};

dn.request_revision_body = function(e) {
    return function() {
        return gapi.client.request({
            path: "/download/drive/v3/files/" + dn.the_file.file_id + "/revisions/" + e,
            params: {
                alt: "media"
            }
        });
    };
};

dn.request_save = function(e) {
    var t = e.body !== undefined;
    var n = {
        properties: {}
    };
    var i = false;
    if (e.title !== undefined) {
        i = true;
        n["name"] = e.title;
    }
    if (e.description !== undefined) {
        i = true;
        n["description"] = e.description;
    }
    if (e.syntax !== undefined) {
        i = true;
        n.properties["aceMode"] = e.syntax;
    }
    if (e.newline !== undefined) {
        i = true;
        n.properties["newline"] = e.newline;
    }
    if (e.tabs !== undefined) {
        i = true;
        n.properties["tabs"] = e.tabs;
    }
    var s = t && i;
    var r = {
        fields: "version"
    };
    if (t) r["uploadType"] = s ? "multipart" : "media";
    var o = {};
    if (s) {
        var a = dn.make_multipart_boundary();
        request_body = "--" + a + "\nContent-Type: application/json; charset=UTF-8\n\n" + JSON.stringify(n) + "\n--" + a + "\nContent-Type: " + e.mimeType + "; charset=UTF-8\n\n" + e.body + "\n--" + a + "--";
        o["Content-Type"] = 'multipart/related; boundary="' + a + '"';
    } else if (t) {
        request_body = e.body;
        o["Content-Type"] = e.mimeType;
    } else {
        request_body = JSON.stringify(n);
    }
    return function() {
        return gapi.client.request({
            path: (t ? "/upload" : "") + "/drive/v3/files/" + dn.the_file.file_id,
            method: "PATCH",
            params: r,
            headers: o,
            body: request_body
        });
    };
};

dn.request_app_data_document = function() {
    return new Promise(function(e, t) {
        dn.app_data_realtime_error = function(e) {
            if (dn.status.realtime_settings < 1) {
                t(e);
            } else {
                if (e.type === "token_refresh_required") {
                    dn.pr_auth.reject(e);
                } else {
                    console.dir(e);
                    dn.show_error("" + e);
                }
            }
        };
        gapi.drive.realtime.loadAppDataDocument(e, null, dn.app_data_realtime_error);
    });
};

dn.request_screw_up_auth_counter = 0;

dn.request_screw_up_auth = function() {
    if (++dn.request_screw_up_auth_counter < 10) {
        console.log("INVALIDATING TOKEN");
        gapi.auth.setToken("this_is_no_longer_valid");
    }
    return true;
};

"use strict";

dn.clipboard_tool = function(e) {
    var t = false;
    var n = false;
    var i = -1;
    var s = 0;
    var r = function(e) {
        if (!t) return false;
        if (i <= 0) return true;
        i--;
        dn.editor.undo();
        dn.editor.insert(dn.g_clipboard.get(i));
        return true;
    };
    var o = function(e) {
        if (!t) return false;
        dn.g_atomic_exec(function() {
            if (i >= dn.g_clipboard.length - 1) return true;
            i++;
            dn.editor.undo();
            dn.editor.insert(dn.g_clipboard.get(i));
        });
        return true;
    };
    var a = function(e) {
        if (e.which == 17 || e.which == 91 || !e.ctrlKey) {
            document.removeEventListener("keyup", a);
            t = false;
            if (n) {
                n = false;
                dn.show_pane(dn.g_settings.get("pane"));
                dn.toggle_widget(dn.g_settings.get("pane_open"));
            }
            if (s) {
                clearTimeout(s);
                s = null;
            }
        }
    };
    var d = function(r) {
        if (dn.g_clipboard === undefined) return;
        var o = r.text || "";
        t = true;
        document.addEventListener("keyup", a);
        i = dn.g_clipboard.lastIndexOf(o);
        if (i == -1) {
            i = dn.g_clipboard.push(o);
            if (dn.g_clipboard.length > e.clipboard_max_length) {
                i--;
                dn.g_clipboard.remove(0);
            }
        }
        if (s) clearTimeout(s);
        s = setTimeout(function() {
            s = null;
            n = true;
            dn.toggle_widget(true);
            dn.show_pane("pane_clipboard");
        }, e.clipboard_info_delay);
    };
    var l = function(t) {
        if (dn.g_clipboard === undefined) return;
        t = t || "";
        dn.g_atomic_exec(function() {
            var n = dn.g_clipboard.lastIndexOf(t);
            if (n === -1) {
                dn.g_clipboard.push(t);
                if (dn.g_clipboard.length > e.clipboard_max_length) dn.g_clipboard.remove(0);
            } else {
                dn.g_clipboard.move(n, 0);
            }
        });
    };
    var _ = function() {
        dn.editor.on("paste", d);
        dn.editor.on("copy", l);
    };
    return {
        on_document_ready: _,
        on_left: r,
        on_right: o,
        is_active: function() {
            return n;
        }
    };
}(dn.const_);

"use strict";

dn.save_pending_requests = [];

dn.SaveTracker = function() {
    this.local = undefined;
    this.remote = undefined;
    return this;
};

dn.save_local_version_counter = 0;

dn.save_server_state = {};

dn.save_local_state = {};

dn.save = function(e, t) {
    if (!dn.status.user_wants_file) {
        dn.create_file();
        e.title = undefined;
    }
    var n = false;
    if (e.body !== undefined) {
        var i = t === undefined ? dn.editor.getSession().getUndoManager().getCurrentId() : t;
        if (dn.save_undo_id === i) {
            delete e.body;
        } else {
            n = true;
            dn.save_undo_id = NaN;
            e.undo_id = i;
            dn.check_unsaved();
            e.mimeType = e.mimeType || dn.the_file.chosen_mime_type;
            dn.status.save_body = 0;
        }
    }
    if (e.title !== undefined) {
        n = true;
        dn.status.save_title = 0;
    }
    if (e.syntax !== undefined || e.description !== undefined || e.newline !== undefined || e.tabs !== undefined) {
        n = true;
        dn.status.save_other = 0;
    }
    if (!n) return;
    dn.show_status();
    dn.save_pending_requests.push(new dn.SaveRequest(e));
};

dn.SaveRequest = function(e) {
    this._parts = e;
    var t = [];
    for (var n in this._parts) if (this._parts.hasOwnProperty(n)) {
        if (dn.save_local_state[n] && !dn.save_local_state[n]._is_settled) t.push(dn.save_local_state[n]);
        dn.save_local_state[n] = this;
    }
    for (var i = 0; i < t.length; i++) {
        var s = false;
        for (var n in dn.save_local_state) if (dn.save_local_state.hasOwnProperty(n)) if (dn.save_local_state[n] == t[i]) {
            s = true;
            break;
        }
        if (!s) t[i]._desired = false;
    }
    this._desired = true;
    this._tracker = new dn.SaveTracker();
    this._tracker.local = ++dn.save_local_version_counter;
    this._is_settled = false;
    this._error = undefined;
    var r = this;
    this._pr = until_success(function(e, t) {
        Promise.all([ dn.pr_auth, dn.pr_file_loaded ]).then(r._throw_if_not_desired.bind(r)).then(dn.request_save(r._parts)).then(r._on_completion.bind(r)).then(e, t);
    }).before_retry(dn.filter_api_errors).catch(r._on_error.bind(r)).then(r._on_finally.bind(r));
    return this;
};

dn.SaveRequest.prototype._throw_if_not_desired = function() {
    if (!this._desired) throw "not desired";
    return true;
};

dn.SaveRequest.prototype._on_error = function(e) {
    if (e !== "not desired") this._error = e;
};

dn.SaveRequest.prototype._on_completion = function(e) {
    this._tracker.remote = parseInt(e.result.version);
    for (var t in this._parts) if (this._parts.hasOwnProperty(t)) {
        if (dn.save_server_state[t] === undefined) dn.save_server_state[t] = new dn.SaveTracker();
        if (dn.save_server_state[t].remote === undefined || this._tracker.remote > dn.save_server_state[t].remote) {
            dn.save_server_state[t].remote = this._tracker.remote;
            dn.save_server_state[t].local = this._tracker.local;
        }
    }
    return true;
};

dn.SaveRequest.prototype._on_finally = function() {
    if (this._error !== undefined) {
        dn.show_error("Saving failed. " + dn.api_error_to_string(this._error));
        console.dir(this._error);
        while (dn.save_pending_requests.length) dn.save_pending_requests.pop()._desired = false;
        dn.save_server_state = {};
        dn.save_local_state = {};
        dn.status.save_body = 1;
        dn.status.save_title = 1;
        dn.status.save_other = 1;
        dn.show_status();
        return;
    }
    this._is_settled = true;
    dn.save_pending_requests.splice(dn.save_pending_requests.indexOf(this), 1);
    if (dn.save_pending_requests.length > 0) return;
    var e = {};
    var t = false;
    for (var n in dn.save_local_state) if (dn.save_local_state.hasOwnProperty(n)) if (dn.save_server_state[n].local !== dn.save_local_state[n]._tracker.local) {
        e[n] = dn.save_local_state[n]._parts[n];
        t = true;
    }
    dn.status.save_body = 1;
    dn.status.save_title = 1;
    dn.status.save_other = 1;
    var i = dn.save_local_state.body ? dn.save_local_state.body._parts.undo_id : undefined;
    if (e.body === undefined && i !== undefined) {
        dn.save_undo_id = dn.save_local_state.body._parts.undo_id;
        dn.check_unsaved();
    }
    if (t) dn.save(e, i); else dn.show_status();
};

"use strict";

dn.do_print = function() {
    var e = function(e) {
        var t = Object.create(ace.require("ace/layer/text").Text.prototype);
        var n = dn.editor.getSession().getTokens(e);
        var i = [];
        var s = 0;
        for (var r = 0; r < n.length; r++) {
            var o = n[r];
            var a = o.value.replace(/\t/g, "   ");
            if (a) t.$renderToken(i, 0, o, a);
        }
        return i.join("").replace(/&#160;/g, " ");
    };
    return function() {
        var t = dn.editor.session.doc.getAllLines();
        var n = Array(t.length);
        for (var i = 0; i < t.length; i++) n[i] = "<li><div class='printline'>" + e(i) + "</div></li>";
        var s = window.open("", "");
        s.document.writeln("<html><head><title>" + dn.the_file.title + "</title></head><style>" + ace.require("ace/theme/" + dn.g_settings.get("theme")).cssText + "\nbody{font-size:" + dn.g_settings.get("fontSize") * 14 + "px; white-space:pre-wrap;" + "font-family:'Monaco','Menlo','Ubuntu Mono','Droid Sans Mono','Consolas',monospace;}" + "\nli{color:gray;}\n.printline{color:black;}</style>" + "<body class='ace-" + dn.g_settings.get("theme").replace("_", "-") + "'><ol id='content'>" + n.join("") + "</ol></body></html>");
        s.print();
        return false;
    };
}();

"use strict";

dn.file_pane = function() {
    var e = {};
    var t = false;
    var n = function(e) {
        e.preventDefault();
        if (dn.the_file.is_read_only) return dn.show_error("Cannot save read-only file.");
        dn.save({
            body: dn.editor.getSession().getValue()
        });
    };
    var i = function(e) {
        dn.show_error("The file is read-only, so you cannot change its properties.");
        e.preventDefault();
    };
    var s = function(t) {
        if (dn.the_file.is_read_only) return i(t);
        e.title_text.style.display = "none";
        e.title_input.style.display = "";
        e.title_input.focus();
        e.title_input.select();
    };
    var r = function(t) {
        if (t.which == WHICH.ESC) {
            e.title_input.value = dn.the_file.title;
            t.stopPropagation();
            dn.focus_editor();
        } else if (t.which === WHICH.ENTER) {
            t.preventDefault();
            dn.focus_editor();
        }
    };
    var o = function(t) {
        if (dn.the_file.is_read_only) return i(t);
        e.description_text.style.display = "none";
        e.description_input.style.display = "";
        e.description_input.focus();
        e.description_input.select();
    };
    var a = function(t) {
        if (t.which == WHICH.ESC) {
            e.description_input.value = dn.the_file.description;
            t.stopPropagation();
            dn.focus_editor();
        } else if (t.which === WHICH.ENTER && !t.ctrlKey && !t.shiftKey) {
            t.preventDefault();
            dn.focus_editor();
        }
    };
    var d = function() {
        Promise.resolve(dn.pr_file_loaded).then(function() {
            dn.status.file_sharing = -1;
            dn.the_file.is_shared = 0;
            dn.show_status();
            if (e.share_dialog) {
                l();
            } else {
                gapi.load("drive-share", function() {
                    e.share_dialog = new gapi.drive.share.ShareClient(dn.client_id);
                    l();
                });
            }
        });
    };
    var l = function() {
        e.share_dialog.setItemIds([ dn.the_file.file_id ]);
        e.share_dialog.setOAuthToken(gapi.auth.getToken().access_token);
        e.share_dialog.showSettingsDialog();
    };
    var _ = dn.do_print;
    var c = function() {
        e.description_input.style.display = "none";
        e.description_text.style.display = "";
        var t = e.description_input.value;
        if (dn.the_file.description !== t) {
            dn.the_file.set({
                description: t
            });
            dn.save({
                description: t
            });
        }
        dn.focus_editor();
    };
    var u = function() {
        e.title_input.style.display = "none";
        e.title_text.style.display = "";
        var t = e.title_input.value;
        if (dn.the_file.title !== t) {
            dn.the_file.set({
                title: t
            });
            dn.save({
                title: t
            });
        }
        dn.focus_editor();
    };
    var f = function(t) {
        if (dn.the_file.is_read_only) return i(t);
        var n = "detect";
        if (t.currentTarget === e.newline_unix) n = "unix"; else if (t.currentTarget === e.newline_windows) n = "windows";
        dn.the_file.set({
            newline: n
        });
        dn.save({
            newline: n
        });
    };
    var p = function(e) {
        if (dn.the_file.is_read_only) return i(e);
        dn.the_file.set({
            syntax: "detect"
        });
        dn.save({
            syntax: "detect"
        });
    };
    var g = function(e) {
        if (dn.the_file.is_read_only) return i(e);
        var t = L.GetVal();
        dn.save({
            syntax: t
        });
        dn.the_file.set({
            syntax: t
        });
    };
    var h = function(t) {
        if (dn.the_file.is_read_only) return i(t);
        var n = {
            val: "detect"
        };
        if (t.currentTarget === e.tab_soft_inc) {
            t.stopPropagation();
            n = {
                val: "spaces",
                n: Math.min(dn.the_file.properties_chosen.tabs.n + 1, dn.const_.max_soft_tab_n)
            };
        } else if (t.currentTarget === e.tab_soft_dec) {
            t.stopPropagation();
            var s = dn.the_file.properties_chosen.tabs.n - 1;
            n = {
                val: "spaces",
                n: Math.max(dn.the_file.properties_chosen.tabs.n - 1, dn.const_.min_soft_tab_n)
            };
        } else if (t.currentTarget === e.tab_soft) {
            n = {
                val: "spaces",
                n: dn.the_file.properties_chosen.tabs.n
            };
        } else if (t.currentTarget === e.tab_hard) {
            n = {
                val: "tab",
                n: dn.the_file.properties_chosen.tabs.n
            };
        }
        dn.the_file.set({
            tabs: n
        });
        dn.save({
            tabs: JSON.stringify(n)
        });
    };
    var m = function() {
        e.title_text_inner.textContent = dn.the_file.title;
        e.title_input.value = dn.the_file.title;
    };
    var v = function() {
        text_multi(e.description_text_inner, dn.the_file.description, true);
        e.description_input.value = dn.the_file.description;
    };
    var w = function() {
        e.newline_detect.classList.remove("selected");
        e.newline_windows.classList.remove("selected");
        e.newline_unix.classList.remove("selected");
        var t = dn.the_file.properties.newline;
        if (t === "detect") e.newline_detect.classList.add("selected"); else if (t === "windows") e.newline_windows.classList.add("selected"); else e.newline_unix.classList.add("selected");
        e.newline_info.textContent = dn.the_file.properties_detected_info.newline;
    };
    var y = function() {
        L.SetInd(L.IndexOf(dn.the_file.properties_chosen.syntax), true);
        if (dn.the_file.properties.syntax === "detect") {
            e.ace_mode_detect.classList.add("selected");
            L.SetSelected(false);
        } else {
            e.ace_mode_detect.classList.remove("selected");
            L.SetSelected(true);
        }
        e.ace_mode_info.textContent = dn.the_file.properties_detected_info.syntax;
    };
    var b = function() {
        var t = dn.the_file.properties.tabs;
        e.tab_soft.classList.remove("selected");
        e.tab_hard.classList.remove("selected");
        e.tab_detect.classList.remove("selected");
        if (t.val === "tab") e.tab_hard.classList.add("selected"); else if (t.val === "spaces") e.tab_soft.classList.add("selected"); else e.tab_detect.classList.add("selected");
        e.tab_soft_text.textContent = dn.the_file.properties_chosen.tabs.n;
        e.tab_info.textContent = dn.the_file.properties_detected_info.tabs;
    };
    var x = function() {
        if (!t) return;
        dn.history_tool.end();
        e.button_history.classList.remove("selected");
        e.button_save.style.display = "";
        e.button_print.style.display = "";
        e.inner_pane_history.style.display = "none";
        e.inner_pane_main.style.display = "";
        t = false;
    };
    var E = function() {
        Promise.resolve(dn.pr_file_loaded).then(function() {
            e.button_history.classList.add("selected");
            e.button_save.style.display = "none";
            e.button_print.style.display = "none";
            e.inner_pane_history.style.display = "";
            e.inner_pane_main.style.display = "none";
            dn.history_tool.start();
            t = true;
        });
    };
    var L;
    var k = function() {
        e.title_text.addEventListener("click", s);
        e.title_input.addEventListener("blur", u);
        e.title_input.addEventListener("keydown", r);
        e.description_text.addEventListener("click", o);
        e.description_input.addEventListener("blur", c);
        e.description_input.addEventListener("keydown", a);
        e.newline_detect.addEventListener("click", f);
        e.newline_windows.addEventListener("click", f);
        e.newline_unix.addEventListener("click", f);
        e.tab_detect.addEventListener("click", h);
        e.tab_hard.addEventListener("click", h);
        e.tab_soft_inc.addEventListener("click", h);
        e.tab_soft_dec.addEventListener("click", h);
        e.tab_soft.addEventListener("click", h);
        e.ace_mode_detect.addEventListener("click", p);
        L.enabled = true;
        L.addEventListener("click", g);
        L.addEventListener("change", g);
        e.button_save.addEventListener("click", n);
        e.button_print.addEventListener("click", _);
        e.button_share.addEventListener("click", d);
        e.button_history.addEventListener("click", function() {
            if (t) x(); else E();
        });
    };
    var C = function() {
        e.title_input = document.getElementById("details_file_title_input");
        e.title_text = document.getElementById("details_file_title_text");
        e.title_text_inner = document.getElementById("details_file_title_text_inner");
        e.description_input = document.getElementById("details_file_description_input");
        e.description_text = document.getElementById("details_file_description_text");
        e.description_text_inner = document.getElementById("details_file_description_text_inner");
        e.ace_mode_choose = document.getElementById("file_ace_mode_choose");
        e.ace_mode_detect = document.getElementById("file_ace_mode_detect");
        e.ace_mode_info = document.getElementById("file_ace_mode_info");
        e.newline_detect = document.getElementById("file_newline_detect");
        e.newline_windows = document.getElementById("file_newline_windows");
        e.newline_unix = document.getElementById("file_newline_unix");
        e.newline_info = document.getElementById("file_newline_info");
        e.tab_detect = document.getElementById("file_tab_detect");
        e.tab_soft_inc = document.getElementById("file_tab_soft_inc");
        e.tab_soft_dec = document.getElementById("file_tab_soft_dec");
        e.tab_hard = document.getElementById("file_tab_hard");
        e.tab_soft = document.getElementById("file_tab_soft");
        e.tab_soft_text = document.getElementById("file_tab_soft_text");
        e.tab_info = document.getElementById("file_tab_info");
        e.button_save = document.getElementById("button_save");
        e.button_print = document.getElementById("button_print");
        e.button_share = document.getElementById("button_share");
        e.button_history = document.getElementById("button_history");
        e.inner_pane_main = document.getElementById("pane_file_main");
        e.inner_pane_history = document.getElementById("pane_file_history");
        var t = require("ace/ext/modelist").modes;
        L = new DropDown(t.map(function(e) {
            return e.caption;
        }));
        L.enabled = false;
        e.ace_mode_choose.appendChild(L.el);
        dn.history_tool.on_document_ready();
        dn.the_file.addEventListener("change", function(e) {
            switch (e.property) {
              case "syntax":
                y();
                break;

              case "newline":
                w();
                break;

              case "tabs":
                b();
                break;

              case "title":
                m();
                break;

              case "description":
                v();
                break;

              case "is_loaded":
                k();
                break;
            }
        });
    };
    return {
        on_save_shorcut: n,
        on_print_shortcut: _,
        on_document_ready: C,
        on_close_pane: x,
        do_history: function(e) {
            e.preventDefault();
            dn.g_settings.set("pane", "pane_file");
            dn.g_settings.set("pane_open", true);
            E();
        }
    };
}();

dn.patch_editor_history = function(e) {
    var t = ace.require("./range").Range;
    var n = ace.require("./lib/dom");
    var i = [];
    var s = [ 0 ];
    var r = [];
    var o = -1;
    var a = [];
    var d = [ 16777215, 16777215, 12381160, 16763594 ];
    var l = 1e3;
    e.$blockScrolling = Infinity;
    e.setHighlightActiveLine(false);
    e.setHighlightGutterLine(false);
    t.prototype.toScreenRange = function(e) {
        var n = e.documentToScreenPosition(this.start);
        var i = e.documentToScreenPosition(this.end);
        ret = new t(n.row, n.column, i.row, i.column);
        ret.doc_range = this.clone();
        return ret;
    };
    e.session.gutterRenderer = {
        getWidth: function(e, t, n) {
            return ("" + s[s.length - 1]).length * n.characterWidth;
        },
        getText: function(e, t) {
            if (t >= s.length) return "" + t;
            return s[t] === -1 ? "-" : s[t];
        }
    };
    e.session.removeAllGutterDecorations = function() {
        for (var e = 0; e < this.$decorations.length; e++) this.$decorations[e] = "";
        this._signal("changeBreakpoint", {});
    };
    e.renderer.$markerBack.drawFullLineMarker = function(e, t, n, i, s) {
        var r = this.$getTop(t.start.row, i);
        var o = i.lineHeight;
        if (t.start.row != t.end.row) o += this.$getTop(t.end.row, i) - r;
        e.push("<div class='", n, "' data-row='", t.doc_range.start.row, "' style='", "height:", o, "px;", "top:", r, "px;", "left:0;right:0;", s || "", "'></div>");
    };
    var _ = e.session.doc.insertFullLines;
    e.session.doc.insertFullLines = function(n, s) {
        if (n === -1) {
            i = new Uint8Array(s.length);
            for (var r = 0; r < s.length; r++) i[r] = 1;
            var o = this.getLength() - 1;
            this.remove(new t(0, 0, o, this.getLine(o).length));
            this.insertMergedLines({
                row: 0,
                column: 0
            }, s);
        } else {
            i = Array.prototype.slice.call(i, 0);
            if (n.length !== undefined) {
                if (s !== undefined) throw "batched insert takes one array";
                for (var a = 0; a < n.length; a++) {
                    var d = [ n[a].at, 0 ];
                    for (var r = 0; r < n[a].lines.length; r++) d.push(0);
                    Array.prototype.splice.apply(i, d);
                    _.call(this, n[a].at, n[a].lines);
                }
            } else {
                var d = [ n, 0 ];
                for (var r = 0; r < s.length; r++) d.push(0);
                Array.prototype.splice.apply(i, d);
                _.call(this, n, s);
            }
            i = new Uint8Array(i);
        }
        e.show_rows(i);
    };
    e.renderer.addEventListener("afterRender", function() {
        var t = e.renderer.getFirstVisibleRow();
        var n = e.renderer.getLastVisibleRow();
        var s = o;
        var r = s + a.length;
        var _ = Date.now();
        if (s < t) {
            for (var f = s; f < r && f < t; f++) a.shift();
        } else if (s > t) {
            for (var f = Math.min(n, s) - 1; f >= t; f--) {
                a.unshift({
                    row: f,
                    from_time: undefined,
                    from_color: undefined,
                    to_time: _,
                    to_color: d[i[f]]
                });
            }
        }
        var p = e.renderer.$markerBack.element.children;
        var g = [];
        for (var h = 0; h < p.length; h++) if (p[h].dataset.row !== undefined) g[p[h].dataset.row] = p[h];
        var m = [];
        var v = [];
        var w = [];
        for (var f = Math.max(t, s); f < Math.min(n, r); f++) {
            if (i[f] === 0) continue;
            var y = g[f];
            var b = a[f - t];
            var x = d[i[f]];
            var E;
            if (b.to_time > _) {
                var L = (_ - b.from_time) / (b.to_time - b.from_time);
                E = c(b.from_color, b.to_color, L);
            } else {
                E = b.to_color;
            }
            if (b.to_color !== x) {
                b.from_color = E;
                b.from_time = _;
                b.to_time = _ + l;
                b.to_color = x;
            }
            y.style.backgroundColor = u(E);
            if (b.to_time > _) {
                y.style.transitionProperty = "";
                y.style.transitionDuration = b.to_time - _ + "ms";
                m.push(y);
                v.push(x);
                w.push(E);
            }
        }
        if (m.length) window.getComputedStyle(m[0]).backgroundColor;
        while (m.length) {
            var y = m.pop();
            y.style.transitionProperty = "background-color";
            y.style.backgroundColor = u(v.pop());
        }
        if (r > n) {
            for (f = r - 1; f >= n && f >= s; f--) a.pop();
        } else if (r < n) {
            for (f = Math.max(r, t); f < n; f++) a.push({
                row: f,
                from_time: undefined,
                from_color: undefined,
                to_time: _,
                to_color: d[i[f]]
            });
        }
        o = t;
    });
    var c = function(e, t, n) {
        return ((e & 16711680) >> 16) * (1 - n) + ((t & 16711680) >> 16) * n << 16 | ((e & 65280) >> 8) * (1 - n) + ((t & 65280) >> 8) * n << 8 | (e & 255) * (1 - n) + (t & 255) * n;
    };
    var u = function(e) {
        return "rgb(" + ((e & 16711680) >> 16) + ", " + ((e & 65280) >> 8) + ", " + (e & 255) + ")";
    };
    e.show_rows = function(n) {
        i = new Uint8Array(n);
        var o = e.session.doc.getLength();
        if (i.length !== o) throw "bad mask length";
        e.session.unfold();
        while (r.length) e.session.removeMarker(r.pop());
        e.session.removeAllGutterDecorations();
        var a = 0;
        var d = -1;
        s = [];
        var l = -1;
        for (var _ = 0; _ < o; _++) {
            if (i[_]) {
                s.push(i[_] === 3 ? -1 : ++a);
                if (d !== -1) {
                    if (d > 0) {
                        e.session.addFold("", new t(d - 1, Infinity, _ - 1, Infinity));
                    } else {
                        e.session.addFold("", new t(0, 0, _, 0));
                        s[0] = 1;
                        l = _;
                    }
                }
                d = -1;
            } else {
                s.push(a);
                if (d === -1) d = _;
            }
        }
        if (d !== -1) e.session.addFold("", new t(d - 1, Infinity, _ - 1, Infinity));
        var c = -1;
        if (l !== -1) {
            if (i[l] >= 1) e.session.addGutterDecoration(0, "gutter_special_" + i[l]);
        }
        for (var _ = 0; _ < o; _++) {
            if (i[_] >= 1) {
                r.push(e.session.addMarker(new t(_, 0, _, Infinity), "special_" + i[_] + (c !== i[_] ? "_first" : ""), "fullLine", false));
                e.session.addGutterDecoration(_, "gutter_special_" + i[_]);
            }
            c = i[_] ? i[_] : c;
        }
        e.renderer.updateFull();
    };
    e.$resetCursorStyle = function() {
        var e = this.$cursorStyle || "ace";
        var t = this.renderer.$cursorLayer;
        if (!t) return;
        t.setSmoothBlinking(/smooth/.test(e));
        t.isBlinking = e != "wide";
        n.setCssClass(t.element, "ace_slim-cursors", /slim/.test(e));
    };
    e.$mouseHandler.setOptions({
        dragEnabled: false
    });
};

"use strict";

dn.history_tool = function() {
    var e = {};
    var t = [];
    var n = {};
    var i = [];
    var s;
    var r;
    var o = 0;
    var a = 0;
    var d = ace.require("./line_widgets").LineWidgets;
    var l = function() {
        if (s === undefined) {
            s = new Worker("js/history_tool_worker.js");
            s.onmessage = u;
        }
        dn.el.editor.style.display = "none";
        e.revisions_view.style.display = "";
        e.revisions_view.innerHTML = "";
        e.info_overflow.style.display = "";
        r = ace.edit("revisions_view");
        r.setFontSize(dn.editor.getFontSize());
        dn.patch_editor_history(r);
        r.session.setUseWrapMode(true);
        r.setReadOnly(true);
        x();
    };
    var _ = function() {
        r.destroy();
        r = undefined;
        e.revisions_view.innerHTML = "";
        var t = e.revisions_view;
        e.revisions_view = t.cloneNode(true);
        t.parentNode.replaceChild(e.revisions_view, t);
        dn.el.editor.style.display = "";
        e.revisions_view.style.display = "none";
        e.info_overflow.style.display = "none";
    };
    var c = function() {
        return r;
    };
    var u = function(e) {
        if (!r) return;
        var n = r.getSession();
        if (e.data.diffed_revision) {
            i = [];
            if (e.data.diffed_revision.idx === 0) {
                n.doc.insertFullLines(-1, e.data.diffed_revision.lines);
            } else {
                n.doc.insertFullLines(e.data.diffed_revision.sections);
                t[e.data.diffed_revision.idx].el_tick.classList.add("diffed");
            }
        }
        if (e.data.line_is_used) {
            var s = e.data.line_is_used.idx;
            i[s] = new Uint8Array(e.data.line_is_used.buffer);
            if (s === Math.max(o, a)) {
                if (o === a) f(o); else h(o, a);
            } else if (Math.max(o, a) >= e.data.line_is_used.diffed_n && s == Math.min(o, a)) {
                f(Math.min(o, a));
            }
        }
    };
    var f = function(n) {
        r.show_rows(i[n]);
        var s = "";
        if (n === 0) {
            s = "Showing the file:\n\t" + g;
        } else {
            var o = E(t[n].modifiedTime);
            s = "Showing file as it was at:\n\t" + o[1] + " on " + o[0];
        }
        text_multi(e.info, s);
    };
    var p = function(e, t) {
        var n = new Uint8Array([ 0, 2, 3, 1 ]);
        var i = new Uint8Array(e.length);
        for (var s = 0; s < i.length; s++) i[s] = n[e[s] | t[s] << 1];
        return i;
    };
    var g = "as it exists in the editor";
    var h = function(n, s) {
        r.show_rows(p(i[n], i[s]));
        var o = "";
        if (n === 0) {
            o += "Showing the file:\n\t" + g;
        } else {
            var a = E(t[n].modifiedTime);
            o += "Showing file as it was at:\n\t" + a[1] + " on " + a[0];
        }
        if (s === 0) {
            o += "\nWith changes relative to the file:\n\t" + g;
        } else {
            var d = E(t[s].modifiedTime);
            o += "\nWith changes relative to the file at:\n\t" + d[1] + " on " + d[0];
        }
        text_multi(e.info, o);
    };
    var v = function() {
        var t = document.createElement("div");
        t.classList.add("revision_tick");
        e.tick_box.appendChild(t);
        return t;
    };
    var w = function(i) {
        var r = [], o = [];
        t = t.concat(i.result.revisions.reverse());
        e.at_range.max = t.length - 1;
        e.from_range.max = t.length - 1;
        for (var a = 1; a < t.length; a++) {
            o.push(t[a].id);
            t[a].el_tick = v();
            if (!n.hasOwnProperty(t[a].id)) {
                r.push(t[a]);
            } else {
                t[a].el_tick.classList.add("downloaded");
            }
        }
        s.postMessage({
            use_order: o
        });
        t[0].el_tick.classList.add("diffed");
        b();
        L();
        return r;
    };
    var y = function(e) {
        return function(t) {
            if (t.status !== 200) throw t;
            s.postMessage({
                revision: {
                    id: e.id,
                    body: decode_body(t.body)
                }
            });
            n[e.id] = true;
            e.el_tick.classList.add("downloaded");
            b();
            return true;
        };
    };
    var b = function() {
        var i = 0;
        for (var s = 0; s < t.length; s++) if (!n.hasOwnProperty(t[s].id)) i++;
        if (i) {
            e.info.textContent = "Downloaded " + (t.length - i) + " of " + t.length + "...";
        } else {
            e.info.textContent = "Downloaded all revisions.";
        }
    };
    var x = function() {
        e.info.textContent = "Updating revision list...";
        e.tick_box.innerHTML = "";
        e.at_range.max = 1;
        e.from_range.max = 1;
        e.at_range.value = 0;
        e.from_range.value = 0;
        o = 0;
        a = 0;
        t = [ {
            id: "current",
            el_tick: v()
        } ];
        i = [];
        s.postMessage({
            reset_with_current_body: dn.editor.getSession().getValue()
        });
        n["current"] = true;
        t[0].el_tick.classList.add("downloaded");
        L();
        until_success(function(e, t) {
            Promise.all([ dn.pr_auth, dn.pr_file_loaded ]).then(dn.request_revision_list).then(w).then(e, t);
        }).before_retry(dn.filter_api_errors).catch(function(e) {
            console.log("failed to update revisions list");
            dn.show_error(dn.api_error_to_string(e));
            throw e;
        }).then(function(e) {
            var t = [];
            for (var n = 0; n < e.length; n++) {
                t.push(until_success(function(t, n, i) {
                    Promise.resolve(dn.pr_auth).then(dn.request_revision_body(e[t].id)).then(y(e[t])).then(n, i);
                }.bind(null, n)).before_retry(dn.filter_api_errors).catch(function(e) {
                    console.log("failed to download revision body");
                    dn.show_error(dn.api_error_to_string(e));
                    throw e;
                }));
            }
            return Promise.all(t).then(function(e) {
                console.log("got all bodies!!");
            }).catch(function(e) {
                console.log("failed to get all bodies");
            });
        });
    };
    var E = function(e) {
        e = new Date(Date.parse(e));
        return [ e.toLocaleDateString({}, {
            month: "short",
            day: "numeric",
            year: "numeric"
        }), e.toLocaleTimeString({}, {
            hour: "numeric",
            minute: "numeric"
        }) ];
    };
    var L = function() {
        if (!dn.pr_file_loaded.is_resolved() || !r) return;
        o = parseInt(e.at_range.value);
        a = parseInt(e.from_range.value);
        var n = t[o];
        var d = t[a];
        if (o === 0) {
            text_multi(e.caption_at, "Current\ndocument");
        } else {
            var l = E(n.modifiedTime);
            text_multi(e.caption_at, l.join("\n"));
        }
        if (a === 0) {
            text_multi(e.caption_from, "Current\ndocument");
        } else {
            var _ = E(d.modifiedTime);
            text_multi(e.caption_from, _.join("\n"));
        }
        var c = i[o] !== undefined;
        var u = i[a] !== undefined;
        if (c && u) {
            if (o === a) f(o); else h(o, a);
        } else if (!c && u) {
            f(a);
            s.postMessage({
                uses_line: [ o ]
            });
        } else if (c && !u) {
            f(o);
            s.postMessage({
                uses_line: [ a ]
            });
        } else {
            s.postMessage({
                uses_line: [ a, o ]
            });
        }
    };
    var k = function(t) {
        if (t) {
            e.remove_expand.classList.add("selected");
            e.remove_collapse.classList.remove("selected");
        } else {
            e.remove_expand.classList.remove("selected");
            e.remove_collapse.classList.add("selected");
        }
        L();
    };
    var C = function() {
        e.remove_expand = document.getElementById("revisions_remove_expand");
        e.remove_collapse = document.getElementById("revisions_remove_collapse");
        e.info = document.getElementById("revision_info");
        e.info_overflow = document.getElementById("file_info_overflow");
        e.tick_box = document.getElementById("revision_tick_box");
        e.at_range = document.getElementById("revision_at_range");
        e.from_range = document.getElementById("revision_from_range");
        e.caption_at = document.getElementById("revision_caption_at");
        e.caption_from = document.getElementById("revision_caption_from");
        e.revisions_view = document.getElementById("revisions_view");
        e.ordered_list = document.getElementById("revisions_ordered_list");
        dn.g_settings.addEventListener("VALUE_CHANGED", function(e) {
            if (e.property === "historyRemovedIsExpanded") k(e.newValue);
        });
        e.remove_expand.addEventListener("click", function() {
            dn.g_settings.set("historyRemovedIsExpanded", true);
        });
        e.remove_collapse.addEventListener("click", function() {
            dn.g_settings.set("historyRemovedIsExpanded", false);
        });
        e.at_range.addEventListener("input", L);
        e.from_range.addEventListener("input", L);
    };
    return {
        start: l,
        end: _,
        on_document_ready: C,
        get_editor: c,
        debug: function() {
            m = new Uint8Array(r.session.doc.getLength());
            for (var e = 0; e < m.length; e++) m[e] = Math.random() * 4;
            r.show_rows(m);
            console.dir(m);
        }
    };
}();

"use strict";

dn.find_pane = function(e) {
    var t = {};
    var n = false;
    var i;
    var s;
    var r = false;
    var o = [];
    var a = -1;
    var d = [];
    var l = undefined;
    var _ = "";
    var c = -1;
    var u = "";
    var f = -1;
    var p = function() {
        if (dn.g_settings.get("find_goto")) t.goto_input.focus(); else t.find_input.focus();
    };
    var g = function() {
        i = ace.require("./search").Search;
        s = ace.require("./range").Range;
        t.button_case_sensitive = document.getElementById("button_find_case_sensitive");
        t.button_whole_words = document.getElementById("button_find_whole_words");
        t.button_regex = document.getElementById("button_find_regex");
        t.find_input = document.getElementById("find_input");
        t.goto_input = document.getElementById("goto_input");
        t.replace_input = document.getElementById("find_replace_input");
        t.info = document.getElementById("find_info");
        t.search_results = document.getElementById("find_results");
        t.info_overflow = document.getElementById("find_info_overflow");
        t.button_goto = document.getElementById("button_goto");
        t.button_replace = document.getElementById("button_replace");
        t.goto_wrapper = document.getElementById("find_goto_wrapper");
        t.find_wrapper = document.getElementById("find_find_wrapper");
        t.replace_wrapper = document.getElementById("find_replace_wrapper");
        t.button_find_replace_all = document.getElementById("button_find_replace_all");
        dn.g_settings.addEventListener("VALUE_CHANGED", function(e) {
            var n = e.newValue;
            switch (e.property) {
              case "find_regex":
                if (n) t.button_regex.classList.add("selected"); else t.button_regex.classList.remove("selected");
                H();
                break;

              case "find_whole_words":
                if (n) t.button_whole_words.classList.add("selected"); else t.button_whole_words.classList.remove("selected");
                H();
                break;

              case "find_case_sensitive":
                if (n) t.button_case_sensitive.classList.add("selected"); else t.button_case_sensitive.classList.remove("selected");
                H();
                break;

              case "find_replace":
                y(n);
                break;

              case "find_goto":
                w(n);
                break;
            }
        });
        t.button_case_sensitive.addEventListener("click", function() {
            dn.g_settings.set("find_case_sensitive", !dn.g_settings.get("find_case_sensitive"));
        });
        t.button_whole_words.addEventListener("click", function() {
            dn.g_settings.set("find_whole_words", !dn.g_settings.get("find_whole_words"));
        });
        t.button_regex.addEventListener("click", function() {
            dn.g_settings.set("find_regex", !dn.g_settings.get("find_regex"));
        });
        t.goto_input.addEventListener("keydown", k);
        t.goto_input.addEventListener("keyup", L);
        t.goto_input.addEventListener("blur", x);
        t.goto_input.addEventListener("focus", b);
        t.find_input.addEventListener("keyup", N);
        t.find_input.addEventListener("keydown", O);
        t.find_input.addEventListener("blur", S);
        t.find_input.addEventListener("focus", I);
        t.replace_input.addEventListener("blur", S);
        t.replace_input.addEventListener("focus", I);
        t.replace_input.addEventListener("keydown", P);
        t.button_find_replace_all.addEventListener("click", q);
        t.button_replace.addEventListener("click", function() {
            dn.g_settings.set("find_replace", !dn.g_settings.get("find_replace"));
            dn.g_settings.set("find_goto", false);
            t.find_input.focus();
        });
        t.button_goto.addEventListener("click", function() {
            dn.g_settings.set("find_goto", !dn.g_settings.get("find_goto"));
            if (dn.g_settings.get("find_goto")) t.goto_input.focus(); else t.find_input.focus();
        });
    };
    var h = function(e) {
        var n = dn.editor.session.getTextRange(dn.editor.getSelectionRange());
        dn.g_settings.set("find_goto", false);
        dn.g_settings.set("pane", "pane_find");
        dn.g_settings.set("pane_open", true);
        if (n) {
            if (n !== _) {
                _ = n;
                c = -1;
                C();
            }
            t.find_input.value = n;
            t.find_input.select();
        }
        t.find_input.focus();
        e.preventDefault();
    };
    var m = function(e) {
        dn.g_settings.set("find_goto", true);
        dn.g_settings.set("pane", "pane_find");
        dn.g_settings.set("pane_open", true);
        t.goto_input.focus();
        e.preventDefault();
    };
    var v = function(e) {
        dn.g_settings.set("find_replace", true);
        h(e);
    };
    var w = function(e) {
        if (e) {
            t.goto_wrapper.style.display = "";
            t.find_wrapper.style.display = "none";
            t.button_goto.classList.add("selected");
            t.info.textContent = "goto line inactive";
            t.replace_wrapper.style.display = "none";
        } else {
            t.goto_wrapper.style.display = "none";
            t.find_wrapper.style.display = "";
            t.button_goto.classList.remove("selected");
            t.info.textContent = "search inactive";
            if (dn.g_settings.get("find_replace")) t.replace_wrapper.style.display = "";
        }
    };
    var y = function(e) {
        if (e) {
            t.button_replace.classList.add("selected");
            if (!dn.g_settings.get("find_goto")) t.replace_wrapper.style.display = "";
        } else {
            t.replace_wrapper.style.display = "none";
            t.button_replace.classList.remove("selected");
        }
        if (r) T(a);
    };
    var b = function() {
        n = true;
        t.info.textContent = "type to goto line";
        E();
    };
    var x = function(e) {
        n = false;
        t.info.textContent = "goto line inactive";
    };
    var E = function() {
        var e = t.goto_input.value.replace(/[^\d]/, "");
        if (e !== t.goto_input.value) t.goto_input.value = e;
        if (e === "") return;
        var n = parseInt(e);
        dn.editor.gotoLine(n);
        dn.editor.navigateLineEnd();
    };
    var L = E;
    var k = function(e) {
        if (e.which == WHICH.DOWN) {
            t.goto_input.value = parseInt(t.goto_input.value.replace(/[^\d]/, "")) + 1;
            E();
            e.preventDefault();
        } else if (e.which == WHICH.UP) {
            t.goto_input.value = parseInt(t.goto_input.value.replace(/[^\d]/, "")) - 1;
            E();
            e.preventDefault();
        } else if (e.which == WHICH.ESC) {
            dn.g_settings.set("pane_open", false);
            e.preventDefault();
            e.stopPropagation();
            dn.focus_editor();
        }
    };
    var C = function() {
        var e = _;
        u = e;
        if (e.length === 0 || !dn.g_atomic_exec) {
            c = -1;
            return;
        }
        dn.g_atomic_exec(function() {
            var t = Date.now();
            if (dn.g_find_history.length === 0) {
                dn.g_find_history.push(e);
                c = 0;
                f = t;
                return;
            }
            var n = dn.g_find_history.get(0);
            if (e.length < n.length && e.toLowerCase() === n.substr(0, e.length).toLowerCase()) {
                c = -1;
                return;
            }
            if (e.toLowerCase() == n.toLowerCase()) {
                dn.g_find_history.set(0, e);
            } else if (e.length > n.length && n.toLowerCase() === e.substr(0, n.length).toLowerCase()) {
                dn.g_find_history.set(0, e);
            } else if (t > f + dn.const_.find_history_add_delay) {
                dn.g_find_history.insert(0, e);
                if (dn.g_find_history.length > dn.const_.find_history_max_len) {
                    dn.g_find_history.remove(dn.g_find_history.length - 1);
                }
            } else {
                dn.g_find_history.set(0, e);
            }
            c = 0;
            f = t;
        });
    };
    var I = function(e) {
        if (e.currentTarget == t.find_input) {
            t.find_input.tabIndex = 101;
            t.replace_input.tabIndex = 102;
        } else {
            t.find_input.tabIndex = 102;
            t.replace_input.tabIndex = 101;
        }
        if (r) return;
        r = true;
        dn.editor.setHighlightSelectedWord(false);
        D();
    };
    var S = function(e) {
        if (e.relatedTarget == t.replace_input || e.relatedTarget == t.find_input) return;
        r = false;
        var n = dn.editor.getSession();
        for (var i = 0; i < d.length; i++) n.removeMarker(d[i]);
        if (l !== undefined) {
            n.removeMarker(l);
            l = undefined;
        }
        t.info.textContent = "search inactive";
        t.search_results.innerHTML = "";
        t.info_overflow.textContent = "";
        d = [];
        o = [];
        a = -1;
        t.find_input.setSelectionRange(t.find_input.selectionEnd, t.find_input.selectionEnd);
        dn.editor.setHighlightSelectedWord(true);
    };
    var B = function() {
        var e = t.find_input.value;
        var n = dn.g_settings.get("find_regex");
        var i = dn.g_settings.get("find_case_sensitive");
        if (n) {
            var s = undefined;
            s = new RegExp(e, i ? "g" : "gi");
        }
        return {
            needle: n ? s : e,
            wrap: true,
            caseSensitive: i,
            wholeWord: dn.g_settings.get("find_whole_words"),
            regExp: n
        };
    };
    var D = function() {
        var e = dn.editor.getSession();
        for (var n = 0; n < d.length; n++) e.removeMarker(d[n]);
        if (l !== undefined) {
            e.removeMarker(l);
            l = undefined;
        }
        d = [];
        o = [];
        a = -1;
        t.search_results.innerHTML = "";
        t.info_overflow.textContent = "";
        t.info.textContent = "";
        _ = t.find_input.value;
        var s = undefined;
        try {
            s = B();
        } catch (r) {
            t.info.textContent = escape_str(r.message);
        }
        if (s === undefined) {
            dn.editor.selection.clearSelection();
        } else if (_ == "") {
            t.info.textContent = "type to search. ";
            dn.editor.selection.clearSelection();
        } else {
            var c = new i();
            c.setOptions(s);
            o = c.findAll(e);
            if (o.length === 0) {
                t.info.textContent = "no matches found.";
                t.info_overflow.textContent = "";
                dn.editor.selection.clearSelection();
            } else {
                var u = e.getSelection().getRange();
                for (var n = 0; n < o.length; n++) if (o[n].end.row > u.start.row || o[n].end.row == u.start.row && o[n].end.column >= u.start.column) break;
                var f = n == o.length ? o.length - 1 : n;
                for (var n = 0; n < o.length; n++) d.push(e.addMarker(o[n], "find_match_marker", "find_match_marker", false));
                for (var n = 0; n < o.length; n++) o[n] = {
                    range: o[n],
                    idx: n
                };
                T(f);
            }
        }
    };
    var T = function(n) {
        a = n;
        var i = dn.editor.getSession();
        if (l !== undefined) {
            i.removeMarker(l);
            l = undefined;
        }
        var r = [];
        var d = dn.g_settings.get("find_replace");
        var _ = e.find_max_results_half * 2 + (d ? 0 : 1);
        if (o.length <= _) {
            r = o;
        } else {
            var c = e.find_max_results_half - (d ? 1 : 0);
            var u = e.find_max_results_half;
            if (a < c) {
                r = r.concat(o.slice(a - c));
                r = r.concat(o.slice(0, a));
            } else {
                r = r.concat(o.slice(a - c, a));
            }
            r.push(o[a]);
            if (a + u >= o.length) {
                r = r.concat(o.slice(a + 1));
                r = r.concat(o.slice(0, u + 1 - (o.length - a)));
            } else {
                r = r.concat(o.slice(a + 1, a + u + 1));
            }
        }
        var f = dn.g_settings.get("find_replace");
        var p = "";
        for (var g = 0; g < r.length; g++) {
            var h = r[g].range.start.row;
            var m = r[g].range.start.column;
            var v = new s(h, Math.max(0, m - e.find_max_prefix_chars), h, m);
            var w = m > e.find_max_prefix_chars;
            h = r[g].range.end.row;
            m = r[g].range.end.column;
            var y = new s(h, m, h, m + e.find_max_suffix_chars);
            p += "<div class='find_result_item" + (r[g].idx == a ? " find_result_current" : "") + "'>" + "<div class='find_result_line_num'>" + (h + 1) + "</div>" + "<div class='find_result_text'>" + "<div class='find_result_text_inner'>" + (w ? "&#8230;" : "") + escape_str(i.getTextRange(v)) + "<span class='find_result_match'>" + escape_str(i.getTextRange(r[g].range)) + "</span>" + escape_str(i.getTextRange(y)) + "</div>" + "</div>" + (f ? "<div class='button inline_button replace_single_result' title='replace'>r</div>" : "") + "</div>";
        }
        t.search_results.innerHTML = p;
        var b = t.search_results.getElementsByClassName("find_result_item");
        for (var g = 0; g < b.length; g++) if (r[g].idx !== a) b[g].addEventListener("click", A(r[g].idx));
        if (f) {
            var b = t.search_results.getElementsByClassName("replace_single_result");
            for (var g = 0; g < b.length; g++) b[g].addEventListener("click", M(r[g].idx));
        }
        if (o.length > _) t.info_overflow.textContent = "... and " + (o.length - _) + " more matches"; else t.info_overflow.textContent = "";
        l = i.addMarker(o[a].range, "find_current_match_marker", "find_current_match_marker", false);
        dn.editor.selection.setSelectionRange(o[a].range, false);
        dn.editor.renderer.scrollSelectionIntoView();
    };
    var H = function() {
        if (r || dn.g_settings.get("pane") === "pane_find" && dn.g_settings.get("pane_open") && t.find_input.value) D();
    };
    var A = function(e) {
        return function(t) {
            T(e);
        };
    };
    var M = function(e) {
        return function(t) {
            W(e);
            t.stopPropagation();
        };
    };
    var N = function(e) {
        if (e.which == WHICH.ENTER || e.which == WHICH.ESC || e.which == WHICH.UP || e.which == WHICH.DOWN) return;
        if (_ == t.find_input.value) return;
        D();
        C();
    };
    var O = function(e) {
        if (e.which == WHICH.ENTER && !e.shiftKey || !e.ctrlKey && e.which == WHICH.DOWN) {
            T(a + 1 < o.length ? a + 1 : 0);
            e.preventDefault();
            return;
        } else if (e.which == WHICH.ENTER && e.shiftKey || !e.ctrlKey && e.which == WHICH.UP) {
            T(a - 1 < 0 ? o.length - 1 : a - 1);
            e.preventDefault();
            return;
        }
        if (e.which == WHICH.ESC) {
            dn.g_settings.set("pane_open", false);
            dn.focus_editor();
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        if (e.ctrlKey && dn.g_find_history && (e.which == WHICH.DOWN || e.which == WHICH.UP)) {
            dn.g_atomic_exec(function() {
                if (e.which == WHICH.UP) c = Math.max(-1, c - 1); else c++;
                c = Math.min(c, dn.g_find_history.length - 1);
                if (c == -1) {
                    t.find_input.value = u;
                } else {
                    t.find_input.value = dn.g_find_history.get(c);
                }
                t.find_input.setSelectionRange(t.find_input.value.length, t.find_input.value.length + 10);
            });
            D();
            e.preventDefault();
        }
    };
    var P = function(e) {
        if (e.which == WHICH.ENTER) {
            if (e.ctrlKey || e.shiftKey) q(); else W(a);
            e.preventDefault();
        } else {
            O(e);
        }
    };
    var q = function(e) {
        try {
            var n = B();
        } catch (e) {
            dn.show_error(e.message);
            return;
        }
        dn.editor.replaceAll(t.replace_input.value, n);
        dn.focus_editor();
    };
    var W = function(e) {
        var n = o[e].range;
        dn.editor.$search.set(B());
        dn.editor.$tryReplace(n, t.replace_input.value);
        D();
    };
    return {
        focus_on_input: p,
        on_document_ready: g,
        on_find_shortcut: h,
        on_replace_shortcut: v,
        on_goto_shortcut: m
    };
}(dn.const_);

"use strict";

dn.esc_pressed = function(e) {
    dn.g_settings.set("pane_open", !dn.g_settings.get("pane_open"));
    if (dn.g_settings.get("pane_open") && dn.g_settings.get("pane") == "pane_find") {
        dn.find_pane.focus_on_input();
    } else {
        dn.focus_editor();
    }
    e.preventDefault();
};

dn.make_keyboard_shortcuts = function() {
    dn.editor.commands.removeCommands([ "find", "findprevious", "findnext", "replace", "jumptomatching", "sortlines", "selecttomatching", "gotoline" ]);
    key("command+s, ctrl+s,  ctrl+alt+s,  command+alt+s", dn.file_pane.on_save_shorcut);
    key("command+p, ctrl+p,  ctrl+alt+p,  command+alt+p", dn.file_pane.do_print_shorcut);
    key("command+o, ctrl+o,  ctrl+alt+o,  command+alt+o", dn.do_open);
    key("command+n, ctrl+n,  ctrl+alt+n,  command+alt+n", dn.do_new);
    key("command+l, ctrl+l,  ctrl+alt+l,  command+alt+l", dn.find_pane.on_goto_shortcut);
    key("command+f, ctrl+f,  ctrl+alt+f,  command+alt+f", dn.find_pane.on_find_shortcut);
    key("command+r, ctrl+r,  ctrl+alt+r,  command+alt+r" + ", command+g, ctrl+g,  ctrl+alt+g,  command+alt+g", dn.find_pane.on_replace_shortcut);
    key("command+h, ctrl+h,  ctrl+alt+h,  command+alt+h", dn.file_pane.do_history);
    key("esc", dn.esc_pressed);
    key.filter = function() {
        return 1;
    };
    var e = require("ace/keyboard/hash_handler").HashHandler;
    var t = new e([ {
        bindKey: {
            win: "Ctrl-Left",
            mac: "Command-Left"
        },
        descr: "Clipboard cyle back on paste",
        exec: dn.clipboard_tool.on_left
    }, {
        bindKey: {
            win: "Ctrl-Down",
            mac: "Command-Down"
        },
        descr: "Clipboard cyle back on paste",
        exec: dn.clipboard_tool.on_left
    }, {
        bindKey: {
            win: "Ctrl-Right",
            mac: "Command-Right"
        },
        descr: "Clipboard cyle forward on paste",
        exec: dn.clipboard_tool.on_right
    }, {
        bindKey: {
            win: "Ctrl-Up",
            mac: "Command-Up"
        },
        descr: "Clipboard cyle forward on paste",
        exec: dn.clipboard_tool.on_right
    } ]);
    dn.editor.keyBinding.addKeyboardHandler(t);
    dn.ctrl_key = "crtl";
    if (dn.platform == "Mac") {
        dn.ctrl_key = "cmd";
        var n = document.getElementsByClassName("ctrl_key");
        for (var i = 0; i < n.length; i++) n[i].textContent = "cmd";
    }
};

"use strict";

dn.version_str = "2016a";

dn.can_show_drag_drop_error = true;

dn.save_undo_id = 0;

dn.status = {
    file_body: 1,
    file_meta: 1,
    file_new: 1,
    file_sharing: 0,
    authentication: 0,
    popup_active: 0,
    local_settings: 0,
    realtime_settings: 0,
    save_body: 1,
    save_title: 1,
    save_other: 1,
    unsaved_changes: 0,
    user_wants_file: 0,
    warned_read_only: 0
};

dn.the_file = new dn.FileModel();

dn.change_line_history = [];

dn.last_change = null;

dn.change_line_classes = function(e, t, n) {
    var i = [ "" ];
    for (var s = t; s; s--) for (var r = 0; r < n; r++) i.push(e + s);
    return i;
}("recent_line_", 8, 5);

dn.change_line_classes_rm = function(e, t, n) {
    var i = [ "" ];
    for (var s = t; s; s--) for (var r = 0; r < n; r++) i.push(e + s);
    return i;
}("recent_line_rm", 8, 5);

dn.el = dn.el || {};

dn.show_status = function() {
    var e = "";
    if (!dn.status.user_wants_file) {
        if (dn.status.unsaved_changes) e = "unsaved file"; else e = "ex nihilo omnia.";
    } else if (dn.status.file_new === 1 && dn.status.file_meta === 1 && dn.status.file_body === 1) {
        e = "" + dn.the_file.title;
        var t = [];
        if (dn.the_file.is_read_only) t.push("read-only");
        if (dn.the_file.is_shared) t.push("shared");
        if (dn.status.file_sharing == -1) t.push("sharing status unknown");
        if (dn.status.unsaved_changes) t.push("unsaved changes");
        if (dn.status.save_body == 0) {
            t.push("saving document");
        } else {
            if (dn.status.save_title == 0) t.push("updating title");
            if (dn.status.save_other == 0) t.push("updating file properties");
        }
        if (t.length) e += "\n[" + t.join(", ") + "]";
    } else if (dn.status.file_new === 0) e = "Creating new file"; else if (dn.status.file_new === -1) e = "Failed to create new file"; else if (dn.status.file_meta === 0 && dn.status.file_body === 0) e = "Loading file:\n" + dn.the_file.file_id; else if (dn.status.file_meta === 1 && dn.status.file_body === 0) e = "Loading " + (dn.the_file.is_read_only ? "read-only " : "") + "file:\n" + dn.the_file.title; else if (dn.status.file_meta === 0 && dn.status.file_body === 1) e = "Loading metadata for file:\n" + dn.the_file.file_id; else if (dn.status.file_meta === 1) e = "Failed to download " + (dn.the_file.is_read_only ? "read-only " : "") + "file:\n" + dn.the_file.title; else if (dn.status.file_body === 1) e = "Failed to download metadata for file:\n" + dn.the_file.file_id; else e = "Failed to load file:\n" + dn.the_file.file_id;
    if (dn.status.authentication != 1) {
        if (e) e += "\n";
        if (dn.status.authorization == -1) e += "Authorization required..."; else if (dn.status.popup_active) e += "Login/authenticate with popup..."; else e += "Authenticating...";
    }
    text_multi(dn.el.widget_text, e, true);
    if (dn.status.save_body == 0 || dn.status.save_title == 0 || dn.status.save_other == 0) dn.el.widget_pending.style.display = ""; else dn.el.widget_pending.style.display = "none";
};

dn.show_error = function(e) {
    console.log(e);
    text_multi(dn.el.widget_error_text, e, true);
    dn.el.widget_error.style.display = "";
    css_animation(dn.el.the_widget, "shake", function() {
        dn.el.widget_error.style.display = "none";
    }, dn.const_.error_delay_ms);
};

dn.toggle_permission = function(e) {
    var t = dn.el.pane_permissions;
    if (e) {
        if (!dn.status.permissions_showing) {
            dn.status.permissions_showing = 1;
            t.style.display = "";
            dn.g_settings.set("pane", "pane_help");
            dn.g_settings.set("pane_open", true);
            css_animation(dn.el.the_widget, "shake", function() {}, dn.const_.error_delay_ms);
        }
    } else {
        dn.status.permissions_showing = 0;
        t.style.display = "none";
    }
};

dn.show_pane = function(e) {
    if (e === "pane_permissions") return dn.toggle_permission(true);
    if (e !== "pane_file") dn.file_pane.on_close_pane();
    var t = document.getElementById(e);
    for (var n = 0; n < dn.el.widget_content.children.length; n++) if (dn.el.widget_content.children[n] !== t && dn.el.widget_content.children[n] !== dn.el.pane_permissions) {
        dn.el.widget_content.children[n].style.display = "none";
        var i = dn.menu_icon_from_pane_id[dn.el.widget_content.children[n].id];
        if (i) i.classList.remove("icon_selected");
    }
    if (t) {
        t.style.display = "";
        var i = dn.menu_icon_from_pane_id[t.id];
        if (i) i.classList.add("icon_selected");
    } else {
        dn.g_settings.set("pane_open", false);
    }
};

dn.widget_mouse_down = function(e) {
    dn.widget_mouse_down_info = {
        off_left: -e.clientX,
        off_top: -e.clientY,
        start_time: Date.now(),
        is_dragging: e.button !== 0
    };
    e.preventDefault();
    document.addEventListener("mousemove", dn.document_mouse_move_widget);
    document.addEventListener("mouseup", dn.document_mouse_up_widget);
};

dn.document_mouse_move_widget = function(e) {
    var t = e.clientX + dn.widget_mouse_down_info.off_left;
    var n = e.clientY + dn.widget_mouse_down_info.off_top;
    if (!dn.widget_mouse_down_info.is_dragging) {
        dn.widget_mouse_down_info.is_dragging = Date.now() - dn.widget_mouse_down_info.start_time > dn.const_.drag_delay_ms || t * t + n * n > dn.const_.drag_shift_px * dn.const_.drag_shift_px;
    }
    if (dn.widget_mouse_down_info.is_dragging) translate(dn.el.the_widget, t, n);
    e.stopPropagation();
};

dn.document_mouse_up_widget = function(e) {
    document.removeEventListener("mousemove", dn.document_mouse_move_widget);
    document.removeEventListener("mouseup", dn.document_mouse_up_widget);
    if (dn.widget_mouse_down_info.is_dragging) {
        var t = dn.el.the_widget.getBoundingClientRect();
        translate(dn.el.the_widget, 0, 0);
        var n = dn.el.the_widget.offsetWidth;
        var i = dn.el.the_widget.offsetHeight;
        var s = window.innerWidth;
        var r = window.innerHeight;
        var o = [];
        if (t.left < s - (t.left + n)) {
            o[0] = "l";
            o[1] = Math.max(0, t.left / s * 100);
        } else {
            o[0] = "r";
            o[1] = Math.max(0, (s - (t.left + n)) / s * 100);
        }
        if (t.top < r - (t.top + i)) {
            o[2] = "t";
            o[3] = Math.max(0, t.top / r * 100);
        } else {
            o[2] = "b";
            o[3] = Math.max(0, (r - (t.top + i)) / r * 100);
        }
        if (dn.g_settings) dn.g_settings.set("widget_anchor", o);
    } else {
        dn.g_settings.set("pane_open", !dn.g_settings.get("pane_open"));
    }
    dn.widget_mouse_down_info = undefined;
};

dn.widget_apply_anchor = function(e) {
    e = Array.isArray(e) ? e : dn.g_settings.get("widget_anchor");
    var t = dn.el.the_widget.offsetWidth;
    var n = dn.el.the_widget.offsetHeight;
    var i = window.innerWidth;
    var s = window.innerHeight;
    if (e[0] == "l") {
        if (i * e[1] / 100 + t > i) {
            dn.el.the_widget.style.left = "inherit";
            dn.el.the_widget.style.right = "0px";
        } else {
            dn.el.the_widget.style.left = e[1] + "%";
            dn.el.the_widget.style.right = "";
        }
        dn.el.widget_menu.classList.add("flipped");
        dn.el.widget_content.classList.add("flipped");
        var r = document.getElementsByClassName("widget_menu_icon");
        for (var o = 0; o < r.length; o++) r[o].classList.add("flipped");
    } else {
        if (i * e[1] / 100 + t > i) {
            dn.el.the_widget.style.left = "0px";
            dn.el.the_widget.style.right = "";
        } else {
            dn.el.the_widget.style.left = "inherit";
            dn.el.the_widget.style.right = e[1] + "%";
        }
        dn.el.widget_menu.classList.remove("flipped");
        dn.el.widget_content.classList.remove("flipped");
        var r = document.getElementsByClassName("widget_menu_icon");
        for (var o = 0; o < r.length; o++) r[o].classList.remove("flipped");
    }
    if (e[2] == "t") {
        if (s * e[3] / 100 + n > s) {
            dn.el.the_widget.style.top = "inherit";
            dn.el.the_widget.style.bottom = "0px";
        } else {
            dn.el.the_widget.style.top = e[3] + "%";
            dn.el.the_widget.style.bottom = "";
        }
    } else {
        if (s * e[3] / 100 + n > s) {
            dn.el.the_widget.style.top = "0px";
            dn.el.the_widget.style.bottom = "";
        } else {
            dn.el.the_widget.style.top = "inherit";
            dn.el.the_widget.style.bottom = e[3] + "%";
        }
    }
};

dn.toggle_widget = function(e) {
    if (e) {
        dn.el.widget_menu.style.display = "";
        dn.el.widget_content.style.display = "";
    } else {
        dn.el.widget_menu.style.display = "none";
        dn.el.widget_content.style.display = "none";
        dn.file_pane.on_close_pane();
        dn.focus_editor();
    }
};

dn.check_unsaved = function() {
    if (dn.save_undo_id === dn.editor.getSession().getUndoManager().getCurrentId()) {
        dn.status.unsaved_changes = false;
        dn.render_document_title();
        dn.show_status();
    } else if (!dn.status.unsaved_changes) {
        dn.status.unsaved_changes = true;
        dn.render_document_title();
        dn.show_status();
    }
};

dn.g_settings = function() {
    var e = {};
    var t = {};
    var n = [];
    return {
        get: function(t) {
            return e[t];
        },
        set: function(t, i) {
            if (e[t] === i) return;
            e[t] = i;
            for (var s = 0; s < n.length; s++) n[s]({
                property: t,
                newValue: i
            });
        },
        keep: function(e) {
            t[e] = true;
        },
        get_keeps: function() {
            return t;
        },
        addEventListener: function(e, t) {
            if (e !== "VALUE_CHANGED") throw "only VALUE_CHANGED";
            n.push(t);
        },
        transfer_to_true_model: function(i) {
            for (var s in e) if (e.hasOwnProperty(s) && !t[s]) if (i.get(s) !== null && i.get(s) !== undefined && JSON.stringify(e[s]) !== JSON.stringify(i.get(s))) this.set(s, i.get(s));
            while (n.length) i.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, n.shift());
        }
    };
}();

dn.load_default_settings = function() {
    dn.status.local_settings = 0;
    try {
        console.log("Loading default/localStorage settings...");
        for (var e in dn.default_settings) if (dn.impersonal_settings_keys.indexOf(e) == -1 || !localStorage || !localStorage["g_settings_" + e]) dn.g_settings.set(e, dn.default_settings[e]); else dn.g_settings.set(e, JSON.parse(localStorage["g_settings_" + e]));
    } catch (t) {
        if (localStorage) localStorage.clear();
        console.log("Failed to load defaults/localStorage settings.  Have cleared localStorage cache.");
    }
    dn.status.local_settings = 1;
};

dn.show_app_data_document = function(e) {
    dn.g_atomic_exec = function(t) {
        var n;
        try {
            e.getModel().beginCompoundOperation();
            n = t();
        } catch (i) {
            console.log("error in atomic update:\n" + i);
        } finally {
            e.getModel().endCompoundOperation();
        }
        return n;
    };
    var t = dn.g_settings;
    dn.g_settings = e.getModel().getRoot();
    console.log("Transfering to realtime model for settings.");
    t.transfer_to_true_model(dn.g_settings);
    var n = dn.g_settings.keys();
    for (var i in dn.default_settings) if (i in t.get_keeps() || n.indexOf(i) == -1) dn.g_settings.set(i, t.get(i));
    dn.g_clipboard = dn.g_settings.get("clipboard");
    if (!dn.g_clipboard) {
        dn.g_settings.set("clipboard", e.getModel().createList());
        dn.g_clipboard = dn.g_settings.get("clipboard");
    }
    if (dn.g_clipboard.length > dn.const_.clipboard_max_length) {
        dn.g_clipboard.removeRange(0, dn.g_clipboard.length - dn.const_.clipboard_max_length);
    }
    dn.g_find_history = dn.g_settings.get("findHistory");
    if (!dn.g_find_history) {
        dn.g_settings.set("findHistory", e.getModel().createList());
        dn.g_find_history = dn.g_settings.get("findHistory");
    } else if (dn.g_find_history.length > dn.const_.find_history_max_len) {
        dn.g_find_history.removeRange(dn.const_.find_history_max_len, dn.g_find_history.length);
    }
    var s = dn.g_settings.get("lastDNVersionUsed");
    if (s != dn.version_str) {
        if (s.length > 0 && parseInt(s) !== 2016) {
            document.getElementById("tips_old_user").style.display = "";
            document.getElementById("tips_general").style.display = "none";
        }
        dn.g_settings.set("help_inner", "tips");
        dn.g_settings.set("pane", "pane_help");
        dn.g_settings.set("pane_open", "true");
        dn.g_settings.set("lastDNVersionUsed", dn.version_str);
    }
    dn.status.realtime_settings = 1;
};

dn.settings_changed = function(e) {
    var t = e.newValue;
    console.log("[user settings] " + e.property + ": " + t);
    if (dn.impersonal_settings_keys.indexOf(e.property) > -1 && localStorage) {
        localStorage["g_settings_" + e.property] = JSON.stringify(t);
    }
    try {
        switch (e.property) {
          case "widget_anchor":
            dn.widget_apply_anchor(t);
            break;

          case "theme":
            dn.editor.setTheme("ace/theme/" + t);
            break;

          case "fontSize":
            var n = dn.get_scroll_line();
            dn.editor.setFontSize(t + "em");
            dn.editor.scrollToLine(n);
            break;

          case "wordWrap":
            var i = dn.editor.getSession();
            var n = dn.get_scroll_line();
            i.setUseWrapMode(t[0]);
            i.setWrapLimitRange(t[1], t[2]);
            dn.editor.scrollToLine(n);
            break;

          case "wordWrapAt":
            var s = dn.g_settings.get("wordWrap");
            if (s[1] && s[1] != t) dn.g_settings.set("wordWrap", [ 1, t, t ]);
            dn.editor.setPrintMarginColumn(t);
            break;

          case "showGutterHistory":
            var i = dn.editor.getSession();
            if (!t) {
                var r = dn.change_line_history;
                for (var o = 0; o < r.length; o++) if (r[o]) i.removeGutterDecoration(o, r[o] < 0 ? dn.change_line_classes_rm[-r[o]] : dn.change_line_classes[r[o]]);
                dn.change_line_history = [];
            }
            break;

          case "newLineDefault":
            if (dn.the_file.loaded_body) dn.the_file.compute_newline();
            break;

          case "softTabN":
          case "tabIsHard":
            if (dn.the_file.loaded_body) dn.the_file.compute_newline();
            break;

          case "pane_open":
            if (dn.clipboard_tool.is_active()) break;
            dn.toggle_widget(t);
            if (dn.g_settings.keep) dn.g_settings.keep("pane_open");
            break;

          case "pane":
            if (dn.clipboard_tool.is_active()) break;
            dn.show_pane(t);
            if (dn.g_settings.keep) dn.g_settings.keep("pane");
            if (t !== "pane_help") dn.g_settings.set("help_inner", "main");
            break;
        }
    } catch (a) {
        console.log("Error while uptating new settings value.");
        console.dir(e);
        console.dir(a);
    }
};

dn.get_scroll_line = function() {
    return dn.editor.getSession().screenToDocumentPosition(dn.editor.renderer.getScrollTopRow(), 0).row;
};

dn.show_file_meta = function(e) {
    if (e.error) throw Error(e.error);
    dn.the_file.file_id = e.result.id;
    var t = {
        is_read_only: !e.result.capabilities.canEdit,
        is_shared: e.result.shared
    };
    if (dn.status.file_meta === 0) {
        t.title = e.result.name;
        t.description = e.result.description || "";
        t.loaded_mime_type = e.result.mimeType;
        if (e.result.properties) {
            if (e.result.properties.aceMode !== undefined) t.syntax = e.result.properties.aceMode;
            if (e.result.properties.newline !== undefined) t.newline = e.result.properties.newline;
            if (e.result.properties.tabs !== undefined) t.tabs = e.result.properties.tabs;
        }
    }
    dn.the_file.set(t);
    if (e.result.parents && e.result.parents.length) {
        dn.the_file.folder_id = e.result.parents[0];
        dn.set_drive_link_to_folder();
    }
    history.replaceState({}, dn.the_file.title, "//" + location.host + location.pathname + "?" + "state=" + JSON.stringify({
        action: "open",
        ids: [ dn.the_file.file_id ]
    }));
    dn.status.file_meta = 1;
    dn.status.file_new = 1;
    dn.show_status();
};

dn.show_file_body = function(e) {
    e.body = decode_body(e.body);
    dn.setting_session_value = true;
    dn.the_file.loaded_body = e.body;
    dn.editor.session.setValue(e.body);
    dn.setting_session_value = false;
    dn.status.file_body = 1;
    dn.show_status();
    dn.editor.setReadOnly(false);
};

dn.on_editor_change = function(e) {
    if (!e.start || !e.end || dn.setting_session_value) return;
    if (dn.the_file.is_read_only && dn.status.warned_read_only === 0) {
        dn.show_error("Warning: you cannot save changes. File loaded as read-only.");
        dn.status.warned_read_only = 1;
    }
    if (!dn.g_settings.get("showGutterHistory")) return;
    var t = dn.change_line_classes.length - 1;
    var n = dn.change_line_history;
    var i = dn.editor.getSession();
    var s = e.start.row;
    var r = e.end.row;
    if (dn.last_change && dn.last_change.start_row == s && dn.last_change.end_row == r && s == r) {
        if (dn.last_change.action === e.action) {
            return;
        } else if (e.action === "remove") {
            i.removeGutterDecoration(s, dn.change_line_classes[t]);
            i.addGutterDecoration(s, dn.change_line_classes_rm[t]);
            n[s] = -t;
            dn.last_change.action = "remove";
            return;
        } else {
            i.removeGutterDecoration(s, dn.change_line_classes_rm[t]);
            i.addGutterDecoration(s, dn.change_line_classes[t]);
            n[s] = t;
            dn.last_change.action = "insert";
            return;
        }
    } else {
        dn.last_change = {
            start_row: s,
            end_row: r,
            action: e.action
        };
    }
    for (var o = 0; o < n.length; o++) if (n[o]) i.removeGutterDecoration(o, n[o] < 0 ? dn.change_line_classes_rm[-n[o]++] : dn.change_line_classes[n[o]--]);
    if (e.action === "remove") {
        if (e.lines.length > 1) n.splice(s, e.lines.length - 1);
        n[s] = -t;
    } else {
        n[s] = t;
        if (e.lines.length > 1) {
            var a = [ s, 0 ];
            for (var o = 0; o < e.lines.length - 1; o++) a.push(t);
            n.splice.apply(n, a);
        }
    }
    for (var o = 0; o < n.length; o++) if (n[o]) i.addGutterDecoration(o, n[o] < 0 ? dn.change_line_classes_rm[-n[o]] : dn.change_line_classes[n[o]]);
};

dn.query_unload = function() {
    if (dn.status.unsaved_changes) return "If you leave the page now you will loose the unsaved " + (dn.status.user_wants_file && dn.status.file_new === 1 && dn.status.file_body === 1 ? "changes to " : "new ") + "file '" + dn.the_file.title + "'.";
};

dn.set_drive_link_to_folder = function() {
    var e = document.getElementsByClassName("link_drive");
    var t = dn.the_file.folder_id ? "https://drive.google.com/#folders/" + dn.the_file.folder_id : "https://drive.google.com";
    for (var n = 0; n < e.length; n++) e[n].href = t;
};

dn.show_user_info = function(e) {
    dn.user_info = e.result;
    dn.help_pane.on_user_name_change(e.result.name);
};

dn.render_document_title = function() {
    document.title = (dn.status.unsaved_changes ? "*" : "") + dn.the_file.title;
};

dn.set_editor_newline = function() {
    dn.editor.session.setNewLineMode(dn.the_file.properties_chosen.newline);
};

dn.set_editor_tabs = function() {
    var e = dn.the_file.properties_chosen.tabs;
    if (e.val === "hard") {
        dn.editor.session.setUseSoftTabs(false);
    } else {
        dn.editor.session.setUseSoftTabs(true);
        dn.editor.session.setTabSize(e.n);
    }
};

dn.set_editor_syntax = function() {
    var e = dn.the_file.properties_chosen.syntax;
    var t = require("ace/ext/modelist").modes;
    for (var n = 0; n < t.length; n++) if (t[n].caption === e) {
        dn.editor.getSession().setMode(t[n].mode);
        return;
    }
    dn.show_error("unrecognised syntax mode requested");
};

dn.create_file = function() {
    dn.status.user_wants_file = 1;
    dn.status.file_new = 0;
    dn.show_status();
    until_success(function(e, t) {
        Promise.resolve(dn.pr_auth).then(dn.request_new(dn.new_in_folder, dn.the_file.title)).then(dn.show_file_meta).then(e, t);
    }).before_retry(dn.filter_api_errors).then(function(e) {
        console.log("suceeded creating file");
        dn.pr_file_loaded.resolve();
    }).catch(function(e) {
        console.log("failed to create new file");
        console.dir(e);
        dn.show_error(dn.api_error_to_string(e));
        document.title = "Drive Notepad";
        dn.status.file_new = -1;
        dn.show_status();
        dn.g_settings.set("pane", "pane_help");
        dn.g_settings.set("pane_open", true);
        console.dir(e);
    });
};

dn.document_ready = function(e) {
    dn.el.the_widget = document.getElementById("the_widget");
    dn.el.widget_text = document.getElementById("widget_text");
    dn.el.widget_error_text = document.getElementById("widget_error_text");
    dn.el.widget_error = document.getElementById("widget_error");
    dn.el.widget_content = document.getElementById("widget_content");
    dn.el.widget_pending = document.getElementById("widget_pending");
    dn.el.the_widget.addEventListener("mousedown", dn.widget_mouse_down);
    translate(dn.el.the_widget, 0, 0);
    dn.el.the_widget.style.display = "";
    dn.el.widget_error.style.display = "none";
    dn.el.widget_content.addEventListener("mousedown", prevent_default_and_stop_propagation);
    var t = dn.el.widget_content.getElementsByTagName("input");
    for (var n = 0; n < t.length; n++) t[n].addEventListener("mousedown", stop_propagation);
    var t = dn.el.widget_content.getElementsByTagName("textarea");
    for (var n = 0; n < t.length; n++) t[n].addEventListener("mousedown", stop_propagation);
    dn.el.editor = document.getElementById("the_editor");
    dn.el.editor.innerHTML = "";
    dn.el.editor.addEventListener("contextmenu", function(e) {
        dn.show_error("See the list of keyboard shortcuts for copy/paste, select-all, and undo/redo.");
    });
    dn.editor = ace.edit("the_editor");
    dn.editor.setHighlightSelectedWord(true);
    dn.editor.getSession().addEventListener("change", dn.on_editor_change);
    dn.editor.addEventListener("input", dn.check_unsaved);
    dn.focus_editor = dn.editor.focus.bind(dn.editor);
    dn.focus_editor();
    dn.editor.setAnimatedScroll(true);
    ace.require("ace/ext/language_tools");
    dn.editor.setOptions({
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: false
    });
    dn.editor.$blockScrolling = Infinity;
    dn.clipboard_tool.on_document_ready();
    dn.el.widget_menu = document.getElementById("widget_menu");
    dn.el.menu_open = document.getElementById("menu_open");
    dn.el.menu_find = document.getElementById("menu_find");
    dn.el.menu_help = document.getElementById("menu_help");
    dn.el.menu_file = document.getElementById("menu_file");
    dn.el.menu_general_settings = document.getElementById("menu_general_settings");
    dn.el.widget_menu.addEventListener("mousedown", prevent_default_and_stop_propagation);
    dn.menu_icon_from_pane_id = {};
    var t = dn.el.widget_menu.getElementsByClassName("widget_menu_icon");
    for (var n = 0; n < t.length; n++) {
        t[n].title = dn.menu_id_to_caption[t[n].id];
        dn.menu_icon_from_pane_id["pane_" + t[n].id.substr(5)] = t[n];
    }
    dn.el.pane_clipboard = document.getElementById("pane_clipboard");
    dn.el.pane_permissions = document.getElementById("pane_permissions");
    document.getElementById("button_auth").addEventListener("click", dn.reauth_manual);
    dn.el.pane_file = document.getElementById("pane_file");
    dn.file_pane.on_document_ready();
    dn.el.menu_file.addEventListener("click", function() {
        dn.g_settings.set("pane", "pane_file");
    });
    dn.el.pane_general_settings = document.getElementById("pane_general_settings");
    dn.settings_pane.on_document_ready();
    dn.el.menu_general_settings.addEventListener("click", function() {
        dn.g_settings.set("pane", "pane_general_settings");
    });
    dn.el.pane_help = document.getElementById("pane_help");
    dn.help_pane.on_document_ready();
    dn.el.menu_help.addEventListener("click", function() {
        dn.g_settings.set("pane", "pane_help");
    });
    dn.el.pane_find = document.getElementById("pane_find");
    dn.find_pane.on_document_ready();
    dn.el.menu_find.addEventListener("click", function() {
        dn.g_settings.set("pane", "pane_find");
        dn.find_pane.focus_on_input();
    });
    dn.el.pane_open = document.getElementById("pane_open");
    dn.open_pane.on_document_ready();
    dn.el.menu_open.addEventListener("click", function() {
        dn.g_settings.set("pane", "pane_open");
    });
    dn.pr_file_loaded = new SpecialPromise();
    dn.g_settings.addEventListener("VALUE_CHANGED", dn.settings_changed);
    dn.make_keyboard_shortcuts();
    dn.load_default_settings();
    document.addEventListener("contextmenu", prevent_default);
    window.addEventListener("resize", dn.widget_apply_anchor);
    window.onbeforeunload = dn.query_unload;
    var i = window_location_to_params_object();
    dn.new_in_folder = undefined;
    if (i["state"]) {
        try {
            s = i["state"];
            s = s.replace(/,\s*}\s*$/, "}");
            var s = JSON.parse(s);
            if (s.action && s.action == "open" && s.ids && s.ids.length > 0) dn.the_file.file_id = s.ids[0]; else if (s.folderId) dn.new_in_folder = s.folderId;
        } catch (e) {
            dn.show_error("Bad URL. This will be treated as a new file.");
        }
    }
    dn.the_file.addEventListener("change", function(e) {
        switch (e.property) {
          case "title":
            dn.render_document_title();
            break;

          case "syntax":
            dn.set_editor_syntax();
            break;

          case "newline":
            dn.set_editor_newline();
            break;

          case "tabs":
            dn.set_editor_tabs();
            break;
        }
    });
    dn.pr_auth.on_error(dn.handle_auth_error);
    dn.pr_auth.on_success(function() {
        dn.reauth_auto_delay = 0;
        dn.toggle_permission(false);
        dn.status.popup_active = 0;
        dn.status.authentication = 1;
        dn.show_status();
    });
    offline_simple.addEventListener("online", dn.pr_auth.resolve.bind(dn.pr_auth));
    until_success(function(e, t) {
        Promise.resolve(dn.pr_auth).then(dn.request_user_info).then(dn.show_user_info).then(e, t);
    }).before_retry(dn.filter_api_errors).then(function() {
        console.log("succeeded getting user info.");
    }).catch(function(e) {
        console.log("failed to load user info");
        console.dir(e);
        dn.show_error(dn.api_error_to_string(e));
    });
    if (dn.the_file.file_id) {
        dn.status.file_meta = 0;
        dn.status.file_body = 0;
        dn.status.user_wants_file = 1;
        dn.show_status();
        dn.editor.setReadOnly(true);
        var r = until_success(function(e, t) {
            Promise.resolve(dn.pr_auth).then(dn.request_file_meta).then(dn.show_file_meta).then(e, t);
        }).before_retry(dn.filter_api_errors).catch(function(e) {
            dn.status.file_meta = -1;
            dn.show_status();
            throw e;
        });
        var o = until_success(function(e, t) {
            Promise.resolve(dn.pr_auth).then(dn.request_file_body).then(dn.show_file_body).then(e, t);
        }).before_retry(dn.filter_api_errors).catch(function(e) {
            dn.status.file_body = -1;
            dn.show_status();
            throw e;
        });
        Promise.all([ r, o ]).then(function(e) {
            console.log("succeeded loading file body and metadata.");
            dn.the_file.set({
                is_loaded: true
            });
            dn.pr_file_loaded.resolve();
            dn.show_status();
        }).catch(function(e) {
            console.log("failed to load file properly..");
            console.dir(e);
            dn.show_error(dn.api_error_to_string(e));
            document.title = "Drive Notepad";
            dn.g_settings.set("pane", "pane_help");
            dn.g_settings.set("pane_open", true);
        });
    } else {
        dn.show_status();
        dn.the_file.set({
            title: "untitled.txt",
            is_loaded: true
        });
        dn.g_settings.set("pane", "pane_file");
        dn.g_settings.set("pane_open", true);
    }
    until_success(function(e, t) {
        Promise.all([ dn.pr_auth, dn.pr_realtime_loaded ]).then(dn.request_app_data_document).then(dn.show_app_data_document).then(e, t);
    }).before_retry(dn.filter_api_errors).then(function() {
        console.log("succeeded loading settings");
    }).catch(function(e) {
        console.log("failed to load realtime settings.");
        console.dir(e);
        dn.show_error(dn.api_error_to_string(e));
    });
};

if (document.readyState != "loading" && document.getElementById("the_widget")) {
    dn.document_ready();
} else {
    document.addEventListener("DOMContentLoaded", dn.document_ready);
}
//# sourceMappingURL=src/all.build.map.json