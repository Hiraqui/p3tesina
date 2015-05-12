if (window["$CN$"] == null) {
    $CN$ = function () {
        this.sp = new Array();
        this.sm = new Array();
        this.optionals = new Array();
        this.dcl = null;
        this.name = null;
        this.path = null;
        this.status = 0;
        this.random = 0.13412;
        this.oled = null;
        this.toString = function () {
            if (this.name != null) {
                return this.name;
            } else if (this.path != null) {
                return this.path;
            } else {
                return"$CN$";
            }
        };
    };
    $CL$ = function () {
    };
    $CL$.loaders = [];
    $CL$.requireLoaderByBase = function (base) {
        for (var i = 0; i < $CL$.loaders.length; i++) {
            if ($CL$.loaders[i].base == base) {
                return $CL$.loaders[i];
            }
        }
        var loader = new $CL$();
        loader.base = base;
        $CL$.loaders[$CL$.loaders.length] = loader;
        return loader;
    };
    $CL$.tr = new $CN$();
    $CL$.ls = new Object();
    $CL$.ilt = 0;
    $CL$.maxLoadingThreads = 6;
    $CL$.userAgent = navigator.userAgent.toLowerCase();
    $CL$.isOpera = ($CL$.userAgent.indexOf("opera") != -1);
    $CL$.isIE = ($CL$.userAgent.indexOf("msie") != -1) && !$CL$.isOpera;
    $CL$.isGecko = ($CL$.userAgent.indexOf("gecko") != -1);
    $CL$.isChrome = ($CL$.userAgent.indexOf("chrome") != -1);
    if ($CL$.isOpera) {
        $CL$.maxLoadingThreads = 1;
        var index = $CL$.userAgent.indexOf("opera/");
        if (index != -1) {
            var verNumber = 9.0;
            try {
                verNumber = parseFloat($CL$.userAgent.subString(index + 6));
            } catch (e) {
            }
            if (verNumber >= 9.6) {
                $CL$.maxLoadingThreads = 6;
            }
        }
    }
    if (window["Clazz"] != null && Clazz.isClassDefined) {
        $CL$.isClassDefined = Clazz.isClassDefined;
    } else {
        $CL$.dC = new Object();
        $CL$.isClassDefined = function (clazzName) {
            return $CL$.dC[clazzName] == true;
        };
    }
    if (window["Clazz"] != null && Clazz.binaryFolders != null) {
        $CL$.binaryFolders = Clazz.binaryFolders;
    } else {
        $CL$.binaryFolders = ["bin/", "", "j2slib/"];
    }
    $CL$.addBinaryFolder = Clazz.addBinaryFolder;
    $CL$.removeBinaryFolder = Clazz.removeBinaryFolder;
    $CL$.setPrimaryFolder = Clazz.setPrimaryFolder;
    $CL$.async = true;
    $CL$.xhr = false;
    $CL$.ltl = -1;
    $CL$.setLoadingMode = function (mode, timeLag) {
        if (mode == null) {
            if ($CL$.async && timeLag >= 0) {
                $CL$.ltl = timeLag;
            } else {
                $CL$.ltl = -1;
            }
            return;
        }
        if (typeof mode == "string") {
            mode = mode.toLowerCase();
            if (mode.length == 0 || mode.indexOf("script") != -1) {
                $CL$.xhr = false;
                $CL$.async = true;
            } else {
                $CL$.xhr = true;
                if (mode.indexOf("async") != -1) {
                    $CL$.async = true;
                } else {
                    $CL$.async = false;
                }
            }
        }
        if ($CL$.async && timeLag >= 0) {
            $CL$.ltl = timeLag;
        } else {
            $CL$.ltl = -1;
        }
    };
    $CL$.unwrapArray = function (arr) {
        if (arr == null || arr.length == 0) {
            return arr;
        }
        var last = null;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == null) {
                continue;
            }
            if (arr[i].charAt(0) == '$') {
                if (arr[i].charAt(1) == '.') {
                    if (last == null) {
                        continue;
                    }
                    var idx = last.lastIndexOf(".");
                    if (idx != -1) {
                        var prefix = last.substring(0, idx);
                        arr[i] = prefix + arr[i].substring(1);
                    }
                } else {
                    arr[i] = "org.eclipse.s" + arr[i].substring(1);
                }
            }
            last = arr[i];
        }
        return arr;
    };
    $CL$.cq = new Array();
    $CL$.cm = new Object();
    $CL$.packageClasspath = function (pkg, base, index) {
        var map = $CL$.cm;
        var isPkgDeclared = index == true && map["@" + pkg] != null;
        if (index && map["@java"] == null && pkg.indexOf("java") != 0) {
            $CL$.acp("java");
        }
        if (pkg instanceof Array) {
            $CL$.unwrapArray(pkg);
            for (var i = 0; i < pkg.length; i++) {
                $CL$.packageClasspath(pkg[i], base, index);
            }
            return;
        }
        if (pkg == "java" || pkg == "java.*") {
            var key = "@net.sf.j2s.ajax";
            if (map[key] == null) {
                map[key] = base;
            }
            key = "@net.sf.j2s";
            if (map[key] == null) {
                map[key] = base;
            }
        } else if (pkg == "swt") {
            pkg = "org.eclipse.swt";
        } else if (pkg == "ajax") {
            pkg = "net.sf.j2s.ajax";
        } else if (pkg == "j2s") {
            pkg = "net.sf.j2s";
        }
        if (pkg.lastIndexOf(".*") == pkg.length - 2) {
            pkg = pkg.substring(0, pkg.length - 2);
        }
        map["@" + pkg] = base;
        if (index == true && window[pkg + ".registered"] != true && !isPkgDeclared) {
            $CL$.pkgRefCount++;
            $CL$.loadClass(pkg + ".package", function () {
                $CL$.pkgRefCount--;
                if ($CL$.pkgRefCount == 0) {
                    $CL$.runtimeLoaded();
                }
            }, true);
        }
    };
    $CL$.pkgRefCount = 0;
    $CL$.jarClasspath = function (jar, zs) {
        if (zs instanceof Array) {
            $CL$.unwrapArray(zs);
            for (var i = 0; i < zs.length; i++) {
                $CL$.cm["#" + zs[i]] = jar;
            }
            $CL$.cm["$" + jar] = zs;
        } else {
            $CL$.cm["#" + zs] = jar;
            $CL$.cm["$" + jar] = [zs];
        }
    };
    $CL$.registerPackages = function (prefix, pkgs) {
        $CL$.checkInteractive();
        var base = $CL$.getClasspathFor(prefix + ".*", true);
        for (var i = 0; i < pkgs.length; i++) {
            if (window["Clazz"] != null) {
                Clazz.declarePackage(prefix + "." + pkgs[i]);
            }
            $CL$.packageClasspath(prefix + "." + pkgs[i], base);
        }
    };
    $CL$.multipleSites = function (path) {
        var deltas = window["j2s.update.delta"];
        if (deltas != null && deltas instanceof Array && deltas.length >= 3) {
            var lastOldVersion = null;
            var lastNewVersion = null;
            for (var i = 0; i < deltas.length / 3; i++) {
                var oldVersion = deltas[i + i + i];
                if (oldVersion != "$") {
                    lastOldVersion = oldVersion;
                }
                var newVersion = deltas[i + i + i + 1];
                if (newVersion != "$") {
                    lastNewVersion = newVersion;
                }
                var relativePath = deltas[i + i + i + 2];
                var key = lastOldVersion + "/" + relativePath;
                var idx = path.indexOf(key);
                if (idx != -1 && idx == path.length - key.length) {
                    path = path.substring(0, idx) + lastNewVersion + "/" + relativePath;
                    break;
                }
            }
        }
        var length = path.length;
        if ($CL$.maxLoadingThreads > 1 && ((length > 15 && path.substring(0, 15) == "http://archive.") || (length > 9 && path.substring(0, 9) == "http://a."))) {
            var index = path.lastIndexOf("/");
            if (index < length - 3) {
                var arr = ['a', 'e', 'i', 'o', 'u', 'y'];
                var c1 = path.charCodeAt(index + 1);
                var c2 = path.charCodeAt(index + 2);
                var idx = (length - index) * 3 + c1 * 5 + c2 * 7;
                return path.substring(0, 7) + arr[idx % 6] + path.substring(8);
            }
        }
        return path;
    };
    $CL$.getClasspathFor = function (clazz, forRoot, ext) {
        var path = $CL$.cm["#" + clazz];
        var base = null;
        if (path != null) {
            if (!forRoot && ext == null) {
                return $CL$.multipleSites(path);
            } else {
                var idx = path.lastIndexOf(clazz.replace(/\./g, "/"));
                if (idx != -1) {
                    base = path.substring(0, idx);
                } else {
                    idx = clazz.lastIndexOf(".");
                    if (idx != -1) {
                        idx = path.lastIndexOf(clazz.substring(0, idx).replace(/\./g, "/"));
                        if (idx != -1) {
                            base = path.substring(0, idx);
                        }
                    }
                }
            }
        } else {
            var idx = clazz.lastIndexOf(".");
            while (idx != -1) {
                var pkg = clazz.substring(0, idx);
                base = $CL$.cm["@" + pkg];
                if (base != null) {
                    break;
                }
                idx = clazz.lastIndexOf(".", idx - 2);
            }
        }
        base = $CL$.aB(base);
        if (forRoot) {
            return $CL$.multipleSites(base);
        }
        if (clazz.lastIndexOf(".*") == clazz.length - 2) {
            return $CL$.multipleSites(base + clazz.substring(0, idx + 1).replace(/\./g, "/"));
        }
        if (ext == null) {
            ext = ".js";
        } else if (ext.charAt(0) != '.') {
            ext = "." + ext;
        }
        var jsPath = base + clazz.replace(/\./g, "/") + ext;
        return $CL$.multipleSites(jsPath);
    };
    $CL$.aB = function (base) {
        if (base == null) {
            var bins = "binaryFolders";
            if (window["Clazz"] != null && Clazz[bins] != null && Clazz[bins].length != 0) {
                base = Clazz[bins][0];
            } else if ($CL$[bins] != null && $CL$[bins].length != 0) {
                base = $CL$[bins][0];
            } else {
                base = "bin";
            }
        }
        if (base.lastIndexOf("/") != base.length - 1) {
            base += "/";
        }
        return base;
    };
    $CL$.exmap = new Object();
    $CL$.ignore = function () {
        var zs = null;
        if (arguments.length == 1) {
            if (arguments[0]instanceof Array) {
                zs = arguments[0];
            }
        }
        if (zs == null) {
            zs = new Array();
            for (var i = 0; i < arguments.length; i++) {
                zs[zs.length] = arguments[i];
            }
        }
        $CL$.unwrapArray(zs);
        for (var i = 0; i < zs.length; i++) {
            $CL$.exmap["@" + zs[i]] = true;
        }
    };
    $CL$.isEx = function (clazz) {
        return $CL$.exmap["@" + clazz] == true;
    };
    $CL$.scriptLoading = function (file) {
    };
    $CL$.scriptLoaded = function (file) {
    };
    $CL$.scriptInited = function (file) {
    };
    $CL$.scriptCompleted = function (file) {
    };
    $CL$.classUnloaded = function (clazz) {
    };
    $CL$.classReloaded = function (clazz) {
    };
    $CL$.globalLoaded = function () {
    };
    $CL$.keepOnLoading = true;
    $CL$.p2node = new Object();
    $CL$.xhrOnload = function (tt, file) {
        if (tt.status >= 400 || tt.responseText == null || tt.responseText.length == 0) {
            var fs = $CL$.fss;
            if (fs[file] == null) {
                fs[file] = 1;
                $CL$.ls[file] = false;
                $CL$.xrpt(file);
                return;
            } else {
                alert(Clazz.alert("[Java2Script] Error in loading " + file + "!")); }
            $CL$.next(file);
        } else {
            try {
                eval(tt.responseText);
            } catch (e) {
                Clazz.alert("[Java2Script] Script error: " + e.message);
                throw e;
            }
            $CL$.scriptLoaded(file);
            $CL$.next(file);
        }
    };
    $CL$.rsc = function () {
    };
    $CL$.fss = new Object();
    $CL$.fhs = new Object();
    $CL$.takeAnotherTry = true;
    $CL$.gRF = function (node) {
        return function () {
            if (node.readyState != "interactive") {
                try {
                    if (node.parentNode != null) {
                        node.parentNode.removeChild(node);
                    }
                } catch (e) {
                }
                node = null;
            }
        };
    };
    $CL$.RsN = function (n) {
        if (window["j2s.script.debugging"]) {
            return;
        }
        window.setTimeout($CL$.gRF(n), 1);
    };
    $CL$.gXOd = function (tt, file) {
        return function () {
            $CL$.xhrOnload(tt, file);
            tt = null;
            file = null;
        };
    };
    $CL$.gXcb = function (tt, file) {
        return function () {
            if (tt.readyState == 4) {
                if ($CL$.ilt > 0) {
                    $CL$.ilt--;
                }
                var lazyFun = $CL$.gXOd(tt, file);
                if (iX) {
                    tt.onreadystatechange = $CL$.rsc;
                    window.setTimeout(lazyFun, $CL$.ltl < 0 ? 0 : $CL$.ltl);
                } else {
                    tt.onreadystatechange = null;
                    if ($CL$.ltl >= 0) {
                        window.setTimeout(lazyFun, $CL$.ltl);
                    } else {
                        $CL$.xhrOnload(tt, file);
                    }
                }
                tt = null;
                file = null;
            }
        };
    };
    $CL$.lNBP = function (path) {
        if ($CL$.ltl >= 0) {
            window.setTimeout(function () {
                $CL$.next(path);
            }, $CL$.ltl);
        } else {
            $CL$.next(path);
        }
    };
    $CL$.iTLA = function (path, local) {
        var fun = function () {
            if (!$CL$.takeAnotherTry) {
                return;
            }
            $CL$.fss[path] = 0;
            $CL$.ls[path] = false;
            if ($CL$.ilt > 0) {
                $CL$.ilt--;
            }
            $CL$.xrpt(path);
        };
        var waitingTime = (local ? 500 : 15000);
        return window.setTimeout(fun, waitingTime);
    };
    $CL$.wFLT = function (script) {
        return window.setTimeout(function () {
            script.onerror();
            script.timeoutHandle = null;
            script = null;
        }, 500);
    };
    $CL$.gWSC = function (path, forError) {
        return function () {
            if ($CL$.isGecko && this.timeoutHandle != null) {
                window.clearTimeout(this.timeoutHandle);
                this.timeoutHandle = null;
            }
            if ($CL$.ilt > 0) {
                $CL$.ilt--;
            }
            this.onload = null;
            this.onerror = null;
            if (!forError && $CL$.isOpera && !$CL$.ilss[this.src]) {
                $CL$.checkInteractive();
            }
            if (forError || (!$CL$.ilss[this.src] && $CL$.isOpera)) {
                var fss = $CL$.fss;
                if (fss[path] == null && $CL$.takeAnotherTry) {
                    fss[path] = 1;
                    if (!forError) {
                        $CL$.ilss[this.src] = false;
                    }
                    $CL$.ls[path] = false;
                    $CL$.xrpt(path);
                    $CL$.RsN(this);
                    return;
                } else {
                    Clazz.alert("[Java2Script] Error in loading " + path + "!");
                }
                if (forError) {
                    $CL$.scriptLoaded(path);
                }
            } else {
                $CL$.scriptLoaded(path);
            }
            $CL$.lNBP(path);
            $CL$.RsN(this);
        };
    };
    $CL$.gISC = function (path) {
        return function () {
            var fhs = $CL$.fhs;
            var fss = $CL$.fss;
            var state = "" + this.readyState;
            var local = state == "loading" && (this.src.indexOf("file:") == 0 || (window.location.protocol == "file:" && this.src.indexOf("http") != 0));
            if (state != "loaded" && state != "complete") {
                if (fss[path] == null) {
                    fhs[path] = $CL$.iTLA(path, local);
                    return;
                }
                if (fss[path] == 1) {
                    return;
                }
            }
            if (fhs[path] != null) {
                window.clearTimeout(fhs[path]);
                fhs[path] = null;
            }
            if ((local || state == "loaded") && !$CL$.ilss[this.src]) {
                if (!local && (fss[path] == null || fss[path] == 0) && $CL$.takeAnotherTry) {
                    if ($CL$.ilt > 0) {
                        $CL$.ilt--;
                    }
                    fss[path] = 1;
                    $CL$.ls[path] = false;
                    $CL$.xrpt(path);
                    $CL$.RsN(this);
                    return;
                } else {
                    Clazz.alert("[Java2Script] Error in loading " + path + "!");
                }
            }
            if ($CL$.ilt > 0) {
                $CL$.ilt--;
            }
            $CL$.scriptLoaded(path);
            this.onreadystatechange = null;
            $CL$.lNBP(path);
            $CL$.RsN(this);
        };
    };
    $CL$.xrpt = function (file) {
        var iol = (arguments[1] == true);
        if ($CL$.ls[file] && !iol) {
            $CL$.next(file);
            return;
        }
        $CL$.ls[file] = true;
        var cq = $CL$.cq;
        for (var i = 0; i < cq.length; i++) {
            if (cq[i] == file) {
                for (var j = i; j < cq.length - 1; j++) {
                    cq[i] = cq[i + 1];
                }
                cq.length--;
                break;
            }
        }
        if ($CL$.xhr) {
            $CL$.scriptLoading(file);
            var tt = null;
            var iX = false;
            if (window.XMLHttpRequest) {
                tt = new XMLHttpRequest();
            } else {
                iX = true;
                try {
                    tt = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    tt = new ActiveXObject("Microsoft.XMLHTTP");
                }
            }
            if (tt == null) {
                Clazz.alert("[Java2Script] XMLHttpRequest not supported!");
                return;
            }
            tt.open("GET", file, $CL$.async);
            if ($CL$.async) {
                tt.onreadystatechange = $CL$.gXcb(tt, file);
                $CL$.ilt++;
                try {
                    tt.send(null);
                } catch (e) {
                    Clazz.alert("[Java2Script] Loading file error: " + e.message);
                    $CL$.xhrOnload(tt, file);
                }
            } else {
                try {
                    tt.send(null);
                } catch (e) {
                    Clazz.alert("[Java2Script] Loading file error: " + e.message);
                }
                $CL$.xhrOnload(tt, file);
            }
            return;
        }
        var script = document.createElement("SCRIPT");
        script.type = "text/javascript";
        if ($CL$.isChrome && $CL$.reloadingClasses[file]) {
            script.src = file + "?" + Math.floor(100000 * Math.random());
        } else {
            script.src = file;
        }
        var head = document.getElementsByTagName("HEAD")[0];
        if (iol) {
            head.appendChild(script);
            return;
        }
        script.defer = true;
        if (typeof (script.onreadystatechange) == "undefined" || !$CL$.isIE) {
            if ($CL$.isGecko && (file.indexOf("file:") == 0 || (window.location.protocol == "file:" && file.indexOf("http") != 0))) {
                script.timeoutHandle = $CL$.wFLT(script);
            }
            script.onload = $CL$.gWSC(file, false);
            script.onerror = $CL$.gWSC(file, true);
            if ($CL$.isOpera) {
                $CL$.needOnloadCheck = true;
            }
        } else {
            $CL$.needOnloadCheck = true;
            script.onreadystatechange = $CL$.gISC(file);
        }
        $CL$.ilt++;
        head.appendChild(script);
        $CL$.scriptLoading(file);
    };
    $CL$.isResourceExisted = function (id, path, base) {
        if (id != null && document.getElementById(id) != null) {
            return true;
        }
        if (path != null) {
            var key = path;
            if (base != null) {
                if (path.indexOf(base) == 0) {
                    key = path.substring(base.length);
                }
            }
            if (path.lastIndexOf(".css") == path.length - 4) {
                var resLinks = document.getElementsByTagName("LINK");
                for (var i = 0; i < resLinks.length; i++) {
                    var cssPath = resLinks[i].href;
                    var idx = cssPath.lastIndexOf(key);
                    if (idx != -1 && idx == cssPath.length - key.length) {
                        return true;
                    }
                }
                if (window["css." + id] == true) {
                    return true;
                }
            } else if (path.lastIndexOf(".js") == path.length - 4) {
                var resScripts = document.getElementsByTagName("SCRIPT");
                for (var i = 0; i < resScripts.length; i++) {
                    var jsPath = resScripts[i].src;
                    var idx = jsPath.lastIndexOf(key);
                    if (idx != -1 && idx == jsPath.length - key.length) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    $CL$.q4T = [];
    $CL$.l4T = true;
    $CL$.lec = true;
    $CL$.bJP = false;
    $CL$.next = function (file) {
        if ($CL$.l4T && $CL$.pkgRefCount != 0 && file.lastIndexOf("package.js") != file.length - 10 && !$CL$.isOpera) {
            var qbs = $CL$.q4T;
            qbs[qbs.length] = file;
            return;
        }
        var node = $CL$.p2node["@" + file];
        if (node == null) {
            return;
        }
        var zs = $CL$.cm["$" + file];
        if (zs != null) {
            for (var i = 0; i < zs.length; i++) {
                var nm = zs[i];
                if (nm != node.name) {
                    var n = $CL$.fC(nm);
                    if (n != null) {
                        if (n.status < 2) {
                            n.status = 2;
                            $CL$.uN(n);
                        }
                    } else {
                        n = new $CN$();
                        n.name = nm;
                        var pp = $CL$.cm["#" + nm];
                        if (pp == null) {
                            System.out.println(nm);
                            error("Java2Script implementation error! Please report this bug!");
                        }
                        n.path = pp;
                        $CL$.mpp(n.path, nm, n);
                        n.status = 2;
                        $CL$.addCCN($CL$.tr, n, -1);
                        $CL$.uN(n);
                    }
                }
            }
        }
        if (node instanceof Array) {
            for (var i = 0; i < node.length; i++) {
                if (node[i].status < 2) {
                    node[i].status = 2;
                    $CL$.uN(node[i]);
                }
            }
        } else {
            if (node.status < 2) {
                var stillLoading = false;
                var ss = document.getElementsByTagName("SCRIPT");
                for (var i = 0; i < ss.length; i++) {
                    if ($CL$.isIE) {
                        if (ss[i].onreadystatechange != null && ss[i].onreadystatechange.path == node.path && ss[i].readyState == "interactive") {
                            stillLoading = true;
                            break;
                        }
                    } else {
                        if (ss[i].onload != null && ss[i].onload.path == node.path) {
                            stillLoading = true;
                            break;
                        }
                    }
                }
                if (!stillLoading) {
                    node.status = 2;
                    $CL$.uN(node);
                }
            }
        }
        if (!$CL$.keepOnLoading) {
            return;
        }
        var loadFurther = false;
        var n = $CL$.fNM($CL$.tr, 1);
        if (n != null) {
            $CL$.lCN(n);
            while ($CL$.ilt < $CL$.maxLoadingThreads) {
                var nn = $CL$.fNM($CL$.tr, 1);
                if (nn == null)
                    break;
                $CL$.lCN(nn);
            }
        } else {
            var cq = $CL$.cq;
            if (cq.length != 0) {
                n = cq[0];
                for (var i = 0; i < cq.length - 1; i++) {
                    cq[i] = cq[i + 1];
                }
                cq.length--;
                if (!$CL$.ls[n.path] || cq.length != 0 || !$CL$.lec || (n.sm != null && n.sm.length != 0) || (n.optionals != null && n.optionals.length != 0)) {
                    $CL$.addCCN($CL$.tr, n, 1);
                    $CL$.xrpt(n.path);
                } else {
                    if ($CL$.lec) {
                        $CL$.lec = false;
                    }
                }
            } else {
                n = $CL$.fNO(1);
                if (n != null) {
                    $CL$.lCN(n);
                    while ($CL$.ilt < $CL$.maxLoadingThreads) {
                        var nn = $CL$.fNO(1);
                        if (nn == null)
                            break;
                        $CL$.lCN(nn);
                    }
                } else {
                    loadFurther = true;
                }
            }
        }
        if (loadFurther && $CL$.ilt == 0) {
            while ((n = $CL$.fNM($CL$.tr, 2)) != null) {
                $CL$.uN(n);
            }
            var lastNode = null;
            while ((n = $CL$.fNO(2)) != null) {
                if (lastNode === n) {
                    n.status = 5;
                }
                $CL$.uN(n);
                lastNode = n;
            }
            while (true) {
                $CL$.tracks = new Array();
                if (!$CL$.checkOptionalCycle($CL$.tr)) {
                    break;
                }
            }
            lastNode = null;
            while ((n = $CL$.fNM($CL$.tr, 4)) != null) {
                if (lastNode === n)
                    break;
                $CL$.uN(n);
                lastNode = n;
            }
            lastNode = null;
            while ((n = $CL$.fNO(4)) != null) {
                if (lastNode === n)
                    break;
                $CL$.uN(n);
                lastNode = n;
            }
            var dList = [];
            while ((n = $CL$.fNM($CL$.tr, 4)) != null) {
                dList[dList.length] = n;
                n.status = 5;
            }
            while ((n = $CL$.fNO(4)) != null) {
                dList[dList.length] = n;
                n.status = 5;
            }
            for (var i = 0; i < dList.length; i++) {
                $CL$.dCN(dList[i]);
            }
            for (var i = 0; i < dList.length; i++) {
                var optLoaded = dList[i].oled;
                if (optLoaded != null) {
                    dList[i].oled = null;
                    optLoaded();
                }
            }
            $CL$.globalLoaded();
        }
    };
    $CL$.tracks = new Array();
    $CL$.checkOptionalCycle = function (node) {
        var ts = $CL$.tracks;
        var length = ts.length;
        var cycleFound = -1;
        for (var i = 0; i < ts.length; i++) {
            if (ts[i] === node && ts[i].status >= 4) {
                cycleFound = i;
                break;
            }
        }
        ts[ts.length] = node;
        if (cycleFound != -1) {
            for (var i = cycleFound; i < ts.length; i++) {
                ts[i].status = 5;
                $CL$.dCN(ts[i]);
                for (var k = 0; k < ts[i].sp.length; k++) {
                    $CL$.uN(ts[i].sp[k]);
                }
                ts[i].sp = new Array();
                var optLoaded = ts[i].oled;
                if (optLoaded != null) {
                    ts[i].oled = null;
                    optLoaded();
                }
            }
            ts.length = 0;
            return true;
        }
        for (var i = 0; i < node.sm.length; i++) {
            if (node.sm[i].status == 4) {
                if ($CL$.checkOptionalCycle(node.sm[i])) {
                    return true;
                }
            }
        }
        for (var i = 0; i < node.optionals.length; i++) {
            if (node.optionals[i].status == 4) {
                if ($CL$.checkOptionalCycle(node.optionals[i])) {
                    return true;
                }
            }
        }
        ts.length = length;
        return false;
    };
    $CL$.uN = function (node) {
        if (node.name == null || node.status >= 5) {
            $CL$.dCN(node);
            return;
        }
        var mOK = false;
        if (node.sm == null || node.sm.length == 0 || node.dcl == null) {
            mOK = true;
        } else {
            mOK = true;
            var mustLength = node.sm.length;
            for (var i = mustLength - 1; i >= 0; i--) {
                var n = node.sm[i];
                if (n.status < 4) {
                    if ($CL$.isClassDefined(n.name)) {
                        var nns = new Array();
                        n.status = 5;
                        $CL$.dCN(n);
                        if (n.dcl != null && n.dcl.clazzList != null) {
                            var list = n.dcl.clazzList;
                            for (var j = 0; j < list.length; j++) {
                                var nn = $CL$.fC(list[j]);
                                if (nn.status != 5 && nn !== n) {
                                    nn.status = n.status;
                                    nn.dcl = null;
                                    $CL$.dCN(nn);
                                    if (nn.oled != null) {
                                        nns[nns.length] = nn;
                                    }
                                }
                            }
                            n.dcl = null;
                        }
                        if (n.oled != null) {
                            nns[nns.length] = n;
                        }
                        for (var j = 0; j < nns.length; j++) {
                            var optLoaded = nns[j].oled;
                            if (optLoaded != null) {
                                nns[j].oled = null;
                                optLoaded();
                            }
                        }
                    } else {
                        if (n.status == 2) {
                            $CL$.uN(n);
                        }
                        if (n.status < 4) {
                            mOK = false;
                        }
                    }
                    if (node.sm.length != mustLength) {
                        mustLength = node.sm.length;
                        i = mustLength;
                        mOK = true;
                    }
                }
            }
        }
        if (mOK) {
            if (node.status < 4) {
                var decl = node.dcl;
                if (decl != null) {
                    if (decl.executed == false) {
                        decl();
                        decl.executed = true;
                    } else {
                        decl();
                    }
                }
                node.status = 4;
                if ($CL$.dC != null) {
                    $CL$.dC[node.name] = true;
                }
                $CL$.scriptInited(node.path);
                if (node.dcl != null && node.dcl.clazzList != null) {
                    var list = node.dcl.clazzList;
                    for (var j = 0; j < list.length; j++) {
                        var nn = $CL$.fC(list[j]);
                        if (nn.status != 4 && nn !== node) {
                            nn.status = 4;
                            if ($CL$.dC != null) {
                                $CL$.dC[nn.name] = true;
                            }
                            $CL$.scriptInited(nn.path);
                        }
                    }
                }
            }
            var level = 4;
            var oOK = false;
            if (((node.optionals == null || node.optionals.length == 0) && (node.sm == null || node.sm.length == 0)) || (node.status > 1 && node.dcl == null)) {
                oOK = true;
            } else {
                oOK = true;
                for (var i = 0; i < node.sm.length; i++) {
                    var n = node.sm[i];
                    if (n.status < 5) {
                        oOK = false;
                        break;
                    }
                }
                if (oOK) {
                    for (var i = 0; i < node.optionals.length; i++) {
                        var n = node.optionals[i];
                        if (n.status < 5) {
                            oOK = false;
                            break;
                        }
                    }
                }
            }
            if (oOK) {
                level = 5;
                node.status = level;
                $CL$.scriptCompleted(node.path);
                var optLoaded = node.oled;
                if (optLoaded != null) {
                    node.oled = null;
                    optLoaded();
                    if (!$CL$.keepOnLoading) {
                        return false;
                    }
                }
                $CL$.dCN(node);
                if (node.dcl != null && node.dcl.clazzList != null) {
                    var list = node.dcl.clazzList;
                    for (var j = 0; j < list.length; j++) {
                        var nn = $CL$.fC(list[j]);
                        if (nn.status != level && nn !== node) {
                            nn.status = level;
                            nn.dcl = null;
                            $CL$.scriptCompleted(nn.path);
                            var optLoaded = nn.oled;
                            if (optLoaded != null) {
                                nn.oled = null;
                                optLoaded();
                                if (!$CL$.keepOnLoading) {
                                    return false;
                                }
                            }
                            $CL$.dCN(node);
                        }
                    }
                }
            }
            $CL$.uP(node, level);
        }
    };
    $CL$.uP = function (node, level) {
        if (node.sp == null || node.sp.length == 0) {
            return;
        }
        for (var i = 0; i < node.sp.length; i++) {
            var p = node.sp[i];
            if (p.status >= level) {
                continue;
            }
            $CL$.uN(p);
        }
        if (level == 5) {
            node.sp = new Array();
        }
    };
    $CL$.fNM = function (node, status) {
        if (node != null) {
            if (node.sm != null && node.sm.length != 0) {
                for (var i = 0; i < node.sm.length; i++) {
                    var n = node.sm[i];
                    if (n.status == status && (status != 1 || $CL$.ls[n.path] != true) && (status == 4 || !$CL$.isClassDefined(n.name))) {
                        return n;
                    } else {
                        var nn = $CL$.fNM(n, status);
                        if (nn != null) {
                            return nn;
                        }
                    }
                }
            }
            if (node.status == status && (status != 1 || $CL$.ls[node.path] != true) && (status == 4 || !$CL$.isClassDefined(node.name))) {
                return node;
            }
        }
        return null;
    };
    $CL$.Rms = {};
    $CL$.Rms["r" + 0.13412] = 0.13412;
    $CL$.fNO = function (status) {
        var rnd = 0;
        while (true) {
            rnd = Math.random();
            var s = "r" + rnd;
            if ($CL$.Rms[s] != rnd) {
                $CL$.Rms[s] = rnd;
                break;
            }
        }
        $CL$.tr.random = rnd;
        var node = $CL$.tr;
        return $CL$.fNNO(node, status);
    };
    $CL$.fNNO = function (node, status) {
        var rnd = $CL$.tr.random;
        if (node.sm != null && node.sm.length != 0) {
            var n = $CL$.searchClassArray(node.sm, rnd, status);
            if (n != null && (status != 1 || $CL$.ls[n.path] != true) && (status == 4 || !$CL$.isClassDefined(n.name))) {
                return n;
            }
        }
        if (node.optionals != null && node.optionals.length != 0) {
            var n = $CL$.searchClassArray(node.optionals, rnd, status);
            if (n != null && (status != 1 || $CL$.ls[n.path] != true) && (status == 4 || !$CL$.isClassDefined(n.name))) {
                return n;
            }
        }
        if (node.status == status && (status != 1 || $CL$.ls[node.path] != true) && (status == 4 || !$CL$.isClassDefined(node.name))) {
            return node;
        }
        return null;
    };
    $CL$.searchClassArray = function (arr, rnd, status) {
        for (var i = 0; i < arr.length; i++) {
            var n = arr[i];
            if (n.status == status && (status != 1 || $CL$.ls[n.path] != true) && (status == 4 || !$CL$.isClassDefined(n.name))) {
                return n;
            } else {
                if (n.random == rnd) {
                    continue;
                }
                n.random = rnd;
                var nn = $CL$.fNNO(n, status);
                if (nn != null) {
                    return nn;
                }
            }
        }
        return null;
    };
    $CL$.ilss = new Object();
    $CL$.itst = null;
    $CL$.needOnloadCheck = false;
    $CL$.checkInteractive = function () {
        if (!$CL$.needOnloadCheck) {
            return;
        }
        var is = $CL$.itst;
        if (is != null && is.readyState == "interactive") {
            return;
        }
        $CL$.itst = null;
        var ss = document.getElementsByTagName("SCRIPT");
        for (var i = 0; i < ss.length; i++) {
            if (ss[i].readyState == "interactive" && ss[i].onreadystatechange != null) {
                $CL$.itst = ss[i];
                $CL$.ilss[ss[i].src] = true;
            } else if ($CL$.isOpera) {
                if (ss[i].readyState == "loaded" && ss[i].src != null && ss[i].src.length != 0) {
                    $CL$.ilss[ss[i].src] = true;
                }
            }
        }
    };
    $CL$.load = function (sm, clazz, optionals, dcl) {
        $CL$.checkInteractive();
        if (clazz instanceof Array) {
            $CL$.unwrapArray(clazz);
            for (var i = 0; i < clazz.length; i++) {
                $CL$.load(sm, clazz[i], optionals, dcl, clazz);
            }
            return;
        }
        if (clazz.charAt(0) == '$') {
            clazz = "org.eclipse.s" + clazz.substring(1);
        }
        var node = $CL$.p2node["#" + clazz];
        if (node == null) {
            var n = $CL$.fC(clazz);
            if (n != null) {
                node = n;
            } else {
                node = new $CN$();
            }
            node.name = clazz;
            var pp = $CL$.cm["#" + clazz];
            if (pp == null) {
                System.out.println("???" + clazz);
                error("Java2Script implementation error! Please report this bug!");
            }
            node.path = pp;
            $CL$.mpp(node.path, clazz, node);
            node.status = 1;
            $CL$.addCCN($CL$.tr, node, -1);
        }
        var okToInit = true;
        if (sm != null && sm.length != 0) {
            $CL$.unwrapArray(sm);
            for (var i = 0; i < sm.length; i++) {
                var name = sm[i];
                if (name == null || name.length == 0) {
                    continue;
                }
                if ($CL$.isClassDefined(name) || $CL$.isEx(name)) {
                    continue;
                }
                okToInit = false;
                var n = $CL$.fC(name);
                if (n == null) {
                    n = new $CN$();
                    n.name = sm[i];
                    n.status = 1;
                }
                $CL$.addCCN(node, n, 1);
            }
        }
        if (arguments.length == 5 && dcl != null) {
            dcl.status = node.status;
            dcl.clazzList = arguments[4];
        }
        node.dcl = dcl;
        if (dcl != null) {
            node.status = 2;
        }
        var isOptionalsOK = true;
        if (optionals != null && optionals.length != 0) {
            $CL$.unwrapArray(optionals);
            for (var i = 0; i < optionals.length; i++) {
                var name = optionals[i];
                if (name == null || name.length == 0) {
                    continue;
                }
                if ($CL$.isClassDefined(name) || $CL$.isEx(name)) {
                    continue;
                }
                isOptionalsOK = false;
                var n = $CL$.fC(name);
                if (n == null) {
                    n = new $CN$();
                    n.name = optionals[i];
                    n.status = 1;
                }
                $CL$.addCCN(node, n, -1);
            }
        }
    };
    if (window["Clazz"] != null) {
        Clazz.load = $CL$.load;
        if (window["$_L"] != null) {
            $_L = Clazz.load;
        }
    }
    $CL$.fC = function (clazzName) {
        var rnd = 0;
        while (true) {
            rnd = Math.random();
            var s = "r" + rnd;
            if ($CL$.Rms[s] != rnd) {
                $CL$.Rms[s] = rnd;
                break;
            }
        }
        $CL$.tr.random = rnd;
        return $CL$.fCU(clazzName, $CL$.tr);
    };
    $CL$.fCU = function (clazzName, node) {
        var rnd = $CL$.tr.random;
        if (node.name == clazzName) {
            return node;
        }
        for (var i = 0; i < node.sm.length; i++) {
            var n = node.sm[i];
            if (n.name == clazzName) {
                return n;
            }
            if (n.random == rnd) {
                continue;
            }
            n.random = rnd;
            var nn = $CL$.fCU(clazzName, n);
            if (nn != null) {
                return nn;
            }
        }
        for (var i = 0; i < node.optionals.length; i++) {
            var n = node.optionals[i];
            if (n.name == clazzName) {
                return n;
            }
            if (n.random == rnd) {
                continue;
            }
            n.random = rnd;
            var nn = $CL$.fCU(clazzName, n);
            if (nn != null) {
                return nn;
            }
        }
        return null;
    };
    $CL$.mpp = function (path, name, node) {
        var map = $CL$.p2node;
        var keyPath = "@" + path;
        var v = map[keyPath];
        if (v != null) {
            if (v instanceof Array) {
                var existed = false;
                for (var i = 0; i < v.length; i++) {
                    if (v[i].name == name) {
                        existed = true;
                        break;
                    }
                }
                if (!existed) {
                    v[v.length] = node;
                }
            } else {
                var arr = new Array();
                arr[0] = v;
                arr[1] = node;
                map[keyPath] = arr;
            }
        } else {
            map[keyPath] = node;
        }
        map["#" + name] = node;
    };
    $CL$.lCN = function (node) {
        var name = node.name;
        if (!$CL$.isClassDefined(name) && !$CL$.isEx(name)) {
            var path = $CL$.getClasspathFor(name);
            node.path = path;
            $CL$.mpp(path, name, node);
            if (!$CL$.ls[path]) {
                $CL$.xrpt(path);
                return true;
            }
        }
        return false;
    };
    $CL$.runtimeKeyClass = "java.lang.String";
    $CL$.queueBe4KeyClazz = new Array();
    $CL$.getJLB = function () {
        var o = window["j2s.lib"];
        if (o != null) {
            if (o.base == null) {
                o.base = "http://archive.java2script.org/";
            }
            return o.base + (o.alias ? o.alias : (o.version ? o.version : "1.0.0")) + "/";
        }
        var ss = document.getElementsByTagName("SCRIPT");
        for (var i = 0; i < ss.length; i++) {
            var src = ss[i].src;
            var idx = src.indexOf("j2slib.z.js");
            if (idx != -1) {
                return src.substring(0, idx);
            }
            idx = src.indexOf("j2slibcore.z.js");
            if (idx != -1) {
                return src.substring(0, idx);
            }
            var base = $CL$.cm["@java"];
            if (base != null) {
                return base;
            }
            idx = src.indexOf("java/lang/ClassLoader.js");
            if (idx != -1) {
                return src.substring(0, idx);
            }
        }
        return null;
    };
    $CL$.JLB = null;
    $CL$.fgLB = function () {
        if ($CL$.JLB == null) {
            $CL$.JLB = $CL$.getJLB();
        }
        return $CL$.JLB;
    };
    $CL$.acp = function (pkg) {
        var r = window[pkg + ".registered"];
        if (r != false && r != true && $CL$.cm["@" + pkg] == null) {
            window[pkg + ".registered"] = false;
            var base = $CL$.fgLB();
            if (base == null) {
                base = "http://archive.java2script.org/1.0.0/";
            }
            $CL$.packageClasspath(pkg, base, true);
        }
    };
    $CL$.loadClass = function (name, oled, forced, async) {
        if (typeof oled == "boolean") {
            return Clazz.evalType(name);
        }
        $CL$.acp("java");
        var swtPkg = "org.eclipse.swt";
        if (name.indexOf(swtPkg) == 0 || name.indexOf("$wt") == 0) {
            $CL$.acp(swtPkg);
        }
        if (name.indexOf("junit") == 0) {
            $CL$.acp("junit");
        }
        $CL$.keepOnLoading = true;
        if (!forced && (($CL$.pkgRefCount != 0 && name.lastIndexOf(".package") != name.length - 8) || (!$CL$.isClassDefined($CL$.runtimeKeyClass) && name.indexOf("java.") != 0))) {
            var qbs = $CL$.queueBe4KeyClazz;
            qbs[qbs.length] = [name, oled];
            return;
        }
        if (!$CL$.isClassDefined(name) && !$CL$.isEx(name)) {
            var path = $CL$.getClasspathFor(name);
            var existed = $CL$.ls[path];
            var qq = $CL$.cq;
            if (!existed) {
                for (var i = qq.length - 1; i >= 0; i--) {
                    if (qq[i].path == path || qq[i].name == name) {
                        existed = true;
                    }
                }
            }
            if (!existed) {
                var n = null;
                if (Clazz.unloadedClasses[name] != null) {
                    n = $CL$.fC(name);
                }
                if (n == null) {
                    n = new $CN$();
                }
                n.name = name;
                n.path = path;
                $CL$.mpp(path, name, n);
                n.oled = oled;
                n.status = 1;
                var nQ = false;
                for (var i = qq.length - 1; i >= 0; i--) {
                    if (qq[i].status != 5) {
                        nQ = true;
                        break;
                    }
                }
                if (path.lastIndexOf("package.js") == path.length - 10) {
                    var inserted = false;
                    for (var i = qq.length - 1; i >= 0; i--) {
                        var name = qq[i].name;
                        if (name.lastIndexOf("package.js") == name.length - 10) {
                            qq[i + 1] = n;
                            inserted = true;
                            break;
                        }
                        qq[i + 1] = qq[i];
                    }
                    if (!inserted) {
                        qq[0] = n;
                    }
                } else if (nQ) {
                    qq[qq.length] = n;
                }
                if (!nQ) {
                    var bkECL = false;
                    if (oled != null) {
                        bkECL = $CL$.lec;
                        $CL$.lec = true;
                    }
                    $CL$.addCCN($CL$.tr, n, 1);
                    $CL$.xrpt(n.path);
                    if (oled != null) {
                        $CL$.lec = bkECL;
                    }
                }
            } else if (oled != null) {
                var n = $CL$.fC(name);
                if (n != null) {
                    if (n.oled == null) {
                        n.oled = oled;
                    } else if (oled != n.oled) {
                        n.oled = (function (oF, nF) {
                            return function () {
                                oF();
                                nF();
                            };
                        })(n.oled, oled);
                    }
                }
            }
        } else if (oled != null && $CL$.isClassDefined(name)) {
            var nn = $CL$.fC(name);
            if (nn == null || nn.status >= 5) {
                if (async) {
                    window.setTimeout(oled, 25);
                } else {
                    oled();
                }
            }
        }
    };
    $w$ = $CL$.loadJ2SApp = function (clazz, args, loaded) {
        if (clazz == null) {
            return;
        }
        var clazzStr = clazz;
        if (clazz.charAt(0) == '$') {
            clazzStr = "org.eclipse.s" + clazz.substring(1);
        }
        var idx = -1;
        if ((idx = clazzStr.indexOf("@")) != -1) {
            var path = clazzStr.substring(idx + 1);
            $CL$.setPrimaryFolder(path);
            clazzStr = clazzStr.substring(0, idx);
            idx = clazzStr.lastIndexOf(".");
            if (idx != -1) {
                var pkgName = clazzStr.substring(0, idx);
                $CL$.packageClasspath(pkgName, path);
            }
        }
        var agmts = args;
        if (agmts == null || !(agmts instanceof Array)) {
            agmts = [];
        }
        var afterLoaded = loaded;
        if (afterLoaded == null) {
            afterLoaded = (function (clazzName, argv) {
                return function () {
                    Clazz.evalType(clazzName).main(argv);
                };
            })(clazzStr, agmts);
        } else {
            afterLoaded = loaded(clazzStr, agmts);
        }
        $CL$.loadClass(clazzStr, afterLoaded);
    };
    $u$ = $CL$.loadJUnit = function (clazz, args) {
        var afterLoaded = function (clazzName, argv) {
            return function () {
                $CL$.loadClass("junit.textui.TestRunner", function () {
                    junit.textui.TestRunner.run(Clazz.evalType(clazzName));
                });
            };
        };
        $CL$.loadJ2SApp(clazz, args, afterLoaded);
    };
    $CL$.runtimeLoaded = function () {
        if ($CL$.pkgRefCount != 0 || !$CL$.isClassDefined($CL$.runtimeKeyClass)) {
            return;
        }
        var qbs = $CL$.queueBe4KeyClazz;
        for (var i = 0; i < qbs.length; i++) {
            $CL$.loadClass(qbs[i][0], qbs[i][1]);
        }
        $CL$.queueBe4KeyClazz = [];
    };
    $CL$.loadZJar = function (zjarPath, keyClazz) {
        var keyClass = keyClazz;
        var isArr = (keyClazz instanceof Array);
        if (isArr) {
            keyClass = keyClazz[keyClazz.length - 1];
        }
        $CL$.jarClasspath(zjarPath, isArr ? keyClazz : [keyClazz]);
        if (keyClazz == $CL$.runtimeKeyClass) {
            $CL$.loadClass(keyClass, $CL$.runtimeLoaded, true);
        } else {
            $CL$.loadClass(keyClass, null, true);
        }
    };
    $CL$.addCCN = function (parent, child, type) {
        var existed = false;
        var arr = null;
        if (type == 1) {
            arr = parent.sm;
        } else {
            arr = parent.optionals;
        }
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].name == child.name) {
                existed = true;
                break;
            }
        }
        if (!existed) {
            arr[arr.length] = child;
            var swtPkg = "org.eclipse.swt";
            if (child.name.indexOf(swtPkg) == 0 || child.name.indexOf("$wt") == 0) {
                window["swt.lazy.loading.callback"] = $CL$.swtLazyLoading;
                $CL$.acp(swtPkg);
            }
            if ($CL$.lec && child.name.indexOf("java") != 0 && child.name.indexOf("net.sf.j2s.ajax") != 0) {
                if ($CL$.bJP) {
                    $CL$.lec = false;
                }
                $CL$.bJP = true;
            }
        }
        existed = false;
        for (var i = 0; i < child.sp.length; i++) {
            if (child.sp[i].name == parent.name) {
                existed = true;
                break;
            }
        }
        if (!existed && parent.name != null && parent != $CL$.tr && parent != child) {
            child.sp[child.sp.length] = parent;
        }
    };
    $CL$.swtLazyLoading = function () {
        $CL$.l4T = false;
        var qbs = $CL$.q4T;
        for (var i = 0; i < qbs.length; i++) {
            $CL$.next(qbs[i]);
        }
        $CL$.q4T = [];
    };
    $CL$.removeFromArray = function (node, arr) {
        if (arr == null || node == null) {
            return false;
        }
        var j = 0;
        for (var i = 0; i < arr.length; i++) {
            if (!(arr[i] === node)) {
                if (j < i) {
                    arr[j] = arr[i];
                }
                j++;
            }
        }
        arr.length = j;
        return false;
    };
    $CL$.dCN = function (node) {
        var sp = node.sp;
        if (sp != null) {
            for (var k = 0; k < sp.length; k++) {
                if (!$CL$.removeFromArray(node, sp[k].sm)) {
                    $CL$.removeFromArray(node, sp[k].optionals);
                }
            }
        }
    };
    $CL$.unloadClassExt = function (Nq) {
        if ($CL$.dC != null) {
            $CL$.dC[Nq] = false;
        }
        if ($CL$.cm["#" + Nq] != null) {
            var pp = $CL$.cm["#" + Nq];
            $CL$.cm["#" + Nq] = null;
            var arr = $CL$.cm["$" + pp];
            var removed = false;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == Nq) {
                    for (var j = i; j < arr.length - 1; j++) {
                        arr[j] = arr[j + 1];
                    }
                    arr.length--;
                    removed = true;
                    break;
                }
            }
            if (removed) {
                $CL$.cm["$" + pp] = arr;
            }
        }
        var n = $CL$.fC(Nq);
        if (n != null) {
            n.status = 1;
            $CL$.ls[n.path] = false;
        }
        var path = $CL$.getClasspathFor(Nq);
        $CL$.ls[path] = false;
        if ($CL$.ilss[path]) {
            $CL$.ilss[path] = false;
        }
        $CL$.classUnloaded(Nq);
    };
    $CL$.assureInnerClass = function (clzz, fun) {
        var clzzName = clzz.__CLASS_NAME__;
        if (Clazz.unloadedClasses[clzzName]) {
            if (clzzName.indexOf("$") != -1)
                return;
            var list = new Array();
            var key = clzzName + "$";
            for (var s in Clazz.unloadedClasses) {
                if (Clazz.unloadedClasses[s] != null && s.indexOf(key) == 0) {
                    list[list.length] = s;
                }
            }
            if (list.length == 0)
                return;
            var funStr = "" + fun;
            var idx1 = funStr.indexOf(key);
            if (idx1 == -1)
                return;
            var idx2 = funStr.indexOf("\"", idx1 + key.length);
            if (idx2 == -1)
                return;
            var anonyClazz = funStr.substring(idx1, idx2);
            if (Clazz.unloadedClasses[anonyClazz] == null)
                return;
            var idx3 = funStr.indexOf("{", idx2);
            if (idx3 == -1)
                return;
            idx3++;
            var idx4 = funStr.indexOf("(" + anonyClazz + ",", idx3 + 3);
            if (idx4 == -1)
                return;
            var idx5 = funStr.lastIndexOf("}", idx4 - 1);
            if (idx5 == -1)
                return;
            var innerClazzStr = funStr.substring(idx3, idx5);
            eval(innerClazzStr);
            Clazz.unloadedClasses[anonyClazz] = null;
        }
    };
    $CL$.ltUd = new Date().getTime();
    $CL$.ltSI = 0;
    if ($CL$.isChrome) {
        $CL$.reloadingClasses = new Object();
    }
    $CL$.updateHotspot = function () {
        if (Clazz.assureInnerClass == null) {
            Clazz.assureInnerClass = $CL$.assureInnerClass;
        }
        var args = arguments[0];
        if (arguments.length != 1 || arguments[0] == null) {
            args = arguments;
        }
        var length = (args.length - 1) / 3;
        var lastID = 0;
        var lUd = 0;
        var tUs = new Array();
        for (var i = 0; i < length; i++) {
            var time = args[i * 3];
            var id = args[i * 3 + 1];
            var clazz = args[i * 3 + 2];
            if ((time > $CL$.ltUd) || (time == $CL$.ltUd && id > $CL$.ltSI)) {
                tUs[tUs.length] = clazz;
                lastID = id;
                lUd = time;
            }
        }
        if (tUs.length > 0) {
            $CL$.ltUd = lUd;
            $CL$.ltSI = lastID;
            var nUC = new Array();
            for (var i = 0; i < tUs.length; i++) {
                nUC[i] = Clazz.unloadClass(tUs[i]);
            }
            for (var i = 0; i < tUs.length; i++) {
                if (nUC[i]) {
                    var clzz = tUs[i];
                    if ($CL$.isChrome) {
                        $CL$.reloadingClasses[$CL$.getClasspathFor(clzz)] = true;
                    }
                    $CL$.loadClass(clzz, (function (clazz) {
                        return function () {
                            Clazz.unloadedClasses[clazz] = null;
                            $CL$.classReloaded(clazz);
                            if ($CL$.isChrome) {
                                $CL$.reloadingClasses[$CL$.getClasspathFor(clazz)] = false;
                            }
                        };
                    })(clzz));
                }
            }
        }
        $CL$.ltJF = false;
    };
    $CL$.rtSN = function (node) {
        window.setTimeout(function () {
            if (node.readyState != "interactive") {
                try {
                    if (node.parentNode != null) {
                        node.parentNode.removeChild(node);
                    }
                } catch (e) {
                }
            }
            node = null;
        }, 1);
        if ($CL$.htMrTimeout != null) {
            window.clearTimeout($CL$.htMrTimeout);
            $CL$.htMrTimeout = null;
        }
    };
    $CL$.ltSL = true;
    $CL$.hJSt = null;
    $CL$.ltJF = false;
    $CL$.gHWC = function () {
        return function () {
            try {
                $CL$.ltSL = true;
                $CL$.rtSN(this);
            } catch (e) {
            }
            ;
            this.onload = null;
            this.onerror = null;
        };
    };
    $CL$.gHIC = function () {
        return function () {
            var state = "" + this.readyState;
            if (state == "loaded" || state == "complete") {
                try {
                    $CL$.ltSL = true;
                    $CL$.rtSN(this);
                } catch (e) {
                }
                ;
                this.onreadystatechange = null;
            }
        };
    };
    $CL$.loadHotspotScript = function (hotspotURL, iframeID) {
        var script = document.createElement("SCRIPT");
        script.type = "text/javascript";
        script.defer = true;
        script.src = hotspotURL;
        if (typeof (script.onreadystatechange) == "undefined" || !$CL$.isIE) {
            script.onload = script.onerror = $CL$.gHWC();
        } else {
            script.onreadystatechange = $CL$.gHIC();
        }
        var head = document.getElementsByTagName("HEAD")[0];
        head.appendChild(script);
    };
    $CL$.hLTo = function () {
        $CL$.ltSL = true;
        $CL$.ltJF = false;
    };
    $CL$.htMr = function () {
        if ($CL$.ltSL && !$CL$.ltJF) {
            var port = window["j2s.hotspot.port"];
            if (port == null) {
                port = 1725;
            }
            var hotspotURL = "http://127.0.0.1:" + port;
            if ($CL$.ltSI == 0) {
                hotspotURL += "/hotspot.js?" + Math.random();
            } else {
                hotspotURL += "/" + $CL$.ltSI + ".js?" + Math.random();
            }
            $CL$.ltJF = true;
            $CL$.ltSL = false;
            $CL$.loadHotspotScript(hotspotURL);
            if ($CL$.hJSt != null) {
                window.clearTimeout($CL$.hJSt);
                $CL$.hJSt = null;
            }
            $CL$.hJSt = window.setTimeout($CL$.hLTo, 2000);
        }
        window.setTimeout($CL$.htMr, 2500);
    };
    window.setTimeout(function () {
        var ss = document.getElementsByTagName("SCRIPT");
        for (var i = 0; i < ss.length; i++) {
            var src = ss[i].src;
            if (src.indexOf("chrome:") != 0 && (src.indexOf("j2slib.z.js") != -1 || src.indexOf("j2slibcore.z.js") != -1)) {
                $CL$.getJLB();
                $CL$.RsN(ss[i]);
                break;
            }
        }
        if (window["j2s.script.debugging"] == true && window["j2s.disable.hotspot"] != true) {
            window.setTimeout($CL$.htMr, 10000);
        }
    }, 324);
    ClassLoader = $CL$;
}
ClazzLoader = $CL$;