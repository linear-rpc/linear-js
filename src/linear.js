/**
 * @exports globalScope.linear as linear
 * @license
 * The MIT License (MIT)
 *
 * Copyright 2015 Sony Corporation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
this.linear || (function (globalScope) {

'use strict';

/**
 * top level namespace for linear framework.
 * <p>All classes and methods are hide into this namespace
 * @namespace
 */
globalScope.linear = function() {};

/**
 * linear version
 */
globalScope.linear.version = '2.5.5';

/**
 * linear signature (=== git commit id)
 */
globalScope.linear.sign = '01dbeac02fd7bcbf6842af9f8d596f16d263ade6';

/**
 * a floating point value wrapper that inherits Number object.
 * <p>Floating point number such as (1.0: Float) is treated (1: Int) on JavaScript<br>
 * So if you need to send 1.0 as floating point number to servers,
 * create a floating point value by using this wrapper function
 * @static
 * @param {Number} n floating point value
 * @return {Number Object} wrapper object of floating point value
 */
globalScope.linear.tofloat = function(n) {
    return new msgpack.tofloat(n);
};

/**
 * a binary value wrapper.
 * @static
 * @param {String/ByteString/ArrayBuffer/TypedArray} mix data that you want to send as binary
 * @return {ArrayBuffer Object} wrapper object for binary data
 * @example
 * (function() {
 *   var reqid, i8a = linear.tobinary(new Int8Array([-1, 0, 1]));
 *   var client = new linear.client();
 *   client.onresponse = function(response) {
 *     console.log(response.id);
 *     if (response.error) {
 *       console.log(response.error);
 *       return;
 *     }
 *     var i8array = new Int8Array(linear.tobinary(response.result);
 *     console.log(i8array); // i8a == i8array in the case of using echo server
 *   };
 *   reqid = client.request({method: 'echo', params: i8a});
 * })();
 */
globalScope.linear.tobinary = function(mix) {
    var otype = Object.prototype.toString.call(mix);
    if (otype === '[object String]') {
        for (var r = new Uint8Array(mix.length), l = 0; l < mix.length; l++) {
            r[l] = mix.charCodeAt(l);
        }
        return r.buffer;
    } else if (otype === '[object ArrayBuffer]') {
        return mix;

    // IE ~9
    // Object.prototype.toString.call(undefined) === '[object Object]'
    // Object.prototype.toString.call(null) === '[object Object]'
    } else if (mix && otype !== '[object Object]' &&
        'buffer' in mix &&
        Object.prototype.toString.call(mix.buffer) === '[object ArrayBuffer]') {
        return mix.buffer;
    }
    throw 'can not convert into binary';
};
    
/**
 * a simple base64 util.
 * <p>changed slightly the following code:<br>
 * <a href='http://blog.livedoor.jp/dankogai/archives/51067688.html' target='_blank'>
 * http://blog.livedoor.jp/dankogai/archives/51067688.html
 * </a>
 * @namespace
 * @private
 */
globalScope.linear.base64 = (function() {
    /**
     * @ignore
     */
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    /**
     * @ignore
     */
    var tabs = (function(bin) {
                    var t = {};
                    for (var i = 0, l = bin.length; i < l; ++i) {
                        t[bin.charAt(i)] = i;
                    }
                    return t;
                })(chars);
    return {
        /**
         * convert binary string into base64 string.
         * @param {String} binstr binary string
         * @return {String} base64 encoded string
         * @throws INVALID_CHARACTER_ERR if binstr cannot convert
         */
        encode: function(binstr) {
            var b64, padlen = 0;

            function tobase64(m) {
                var n = (m.charCodeAt(0) << 16) | (m.charCodeAt(1) <<  8) | (m.charCodeAt(2));
                return chars.charAt(n >>> 18) + chars.charAt((n >>> 12) & 63) +
                    chars.charAt((n >>> 6) & 63) + chars.charAt(n & 63);
            }
            if (typeof binstr !== 'string') {
                throw 'INVALID_CHARACTER_ERR';
            }
            while (binstr.length % 3) {
                binstr += '\0';
                padlen++;
            };
            b64 = binstr.replace(/[\x00-\xFF]{3}/g, tobase64);
            if (!padlen) {
                return b64;
            }
            b64 = b64.substr(0, b64.length - padlen);
            while (padlen--) {
                b64 += '=';
            }
            return b64;
        },
        /**
         * convert base64 string into binary string.
         * @param {String} b64str base64 encoded string
         * @return {String} binary string
         * @throws INVALID_CHARACTER_ERR if b64str cannot convert
         */
        decode: function(b64str) {
            var binstr, padlen = 0;

            function frombase64(m) {
                var n = (tabs[m.charAt(0)] << 18) | (tabs[m.charAt(1)] << 12) |
                    (tabs[m.charAt(2)] << 6) | (tabs[m.charAt(3)]);
                return String.fromCharCode(n >> 16) +
                    String.fromCharCode((n >> 8) & 0xff) +
                    String.fromCharCode(n & 0xff);
            }
            if (typeof b64str !== 'string' || b64str.length % 4 ||
                b64str.match(/[^A-Za-z0-9\+\/=]/) !== null ||
                (b64str.indexOf('=') !== -1 && b64str.indexOf('=') < b64str.length - 2)) {
                throw 'INVALID_CHARACTER_ERR';
            }
            b64str = b64str.replace(/[^A-Za-z0-9\+\/]/g, '');
            while (b64str.length % 4) {
                b64str += 'A';
                padlen++;
            }
            // padlen must be [0, 1, 2]
            if (padlen > 2) {
                throw 'INVALID_CHARACTER_ERR';
            }
            binstr = b64str.replace(/[A-Za-z0-9\+\/]{4}/g, frombase64);
            if (padlen >= 1) {
                binstr = binstr.substring(0, binstr.length - [0,1,2][padlen]);
            }
            return binstr;
        }
    };
})();

/**
 * a simple base64 encoder.
 * @param {ByteString} data ByteString
 * @return {String} base64 encoded string
 * @throws INVALID_CHARACTER_ERR if data cannot convert
 * @private
 */
globalScope.linear.btoa = function(data) {
    var encode = globalScope.btoa || globalScope.linear.base64.encode;
    if (typeof data !== 'string') {
        throw 'INVALID_CHARACTER_ERR';
    }
    return encode(data);
};

/**
 * a simple base64 decoder.
 * @param {String} data base64 encoded string
 * @return {ByteString} base64 decoded ByteString
 * @throws INVALID_CHARACTER_ERR if data cannot convert
 * @private
 */
globalScope.linear.atob = function(data) {
    var decode = globalScope.atob || globalScope.linear.base64.decode;
    if (typeof data !== 'string') {
        throw 'INVALID_CHARACTER_ERR';
    }
    return decode(data);
};

/**
 * a simple class composer.
 * @param {hash} superclass a object definition of base class
 * @param {hash} subclass a object definition of sub class
 * @return {hash} a subclass object inheriting superclass
 * @private
 */
globalScope.linear.extend = function(superclass, subclass) {
    var parent = new superclass();

    if (!subclass) {
        return parent;
    }
    for (var prop in subclass) {
        if (parent[prop] !== subclass[prop]) {
            parent[prop] = subclass[prop];
        }
    }
    return parent;
};

/**
 * a base class of linear.codec.
 * @class
 * @private
 */
globalScope.linear.codec = function() {
    /**
     * codec type indicator
     * @constant
     */
    this.type = undefined;
};

/**
 * encode data.
 * @param {object} data rawdata
 * @return {object} encoded data
 */
globalScope.linear.codec.prototype.encode = function(data) {
    return data;
};

/**
 * decode data.
 * @param {object} data encoded data
 * @return {object} rawdata
 */
globalScope.linear.codec.prototype.decode = function(data) {
    return data;
};

/**
 * refresh codec.
 */
globalScope.linear.codec.prototype.refresh = function() {
    // do nothing
};

/**
 * plain codec.
 * <p>inherit linear.codec
 * @augments linear.codec
 * @see linear.codec
 * @class
 * @private
 */
globalScope.linear.codec.plain = function() {
    /**
     * 'plain'
     * @constant
     */
    this.type = 'plain';
    return globalScope.linear.extend(globalScope.linear.codec, this);
};

/**
 * msgpack codec.
 * <p>inherit linear.codec
 * @augments linear.codec
 * @see linear.codec
 * @class
 * @private
 */
globalScope.linear.codec.msgpack = function(options) {
    /**
     * 'msgpack'
     * @constant
     */
    this.type = 'msgpack';
    this.unpacker = new msgpack.unpacker();
    return globalScope.linear.extend(globalScope.linear.codec, this);
};

/**
 * @ignore
 */
globalScope.linear.codec.msgpack.prototype.encode = function(data) {
    return msgpack.pack(data);
};

/**
 * @ignore
 */
globalScope.linear.codec.msgpack.prototype.decode = function(data) {
    var obj, results = [];

    this.unpacker.feed(data);
    while ((obj = this.unpacker.unpack()) !== undefined) {
        results.push(obj);
    }
    return results;
};

/**
 * @ignore
 */
globalScope.linear.codec.msgpack.prototype.refresh = function() {
    this.unpacker.refresh();
};

/**
 * a base class of linear.protocol.
 * @class
 * @private
 */
globalScope.linear.protocol = function() {
    /**
     * protocol type indicator
     * @default undefined
     */
    this.type = undefined;
    this.codec = undefined;
};

/**
 * create request.
 * <p>restricted not to send at base class
 * @param {hash} hash rawdata for creating request
 * @throws method is not allowed
 */
globalScope.linear.protocol.prototype.request = function(hash) {
    throw new Error('method is not allowed');
};

/**
 * create response.
 * <p>restricted not to send at base class 
 * @param {hash} hash rawdata for creating response
 * @throws method is not allowed
 */
globalScope.linear.protocol.prototype.response = function(hash) {
    throw new Error('method is not allowed');
};

/**
 * create notify.
 * <p>restricted not to send at base class 
 * @param {hash} hash rawdata for creating notify
 * @throws method is not allowed
 */
globalScope.linear.protocol.prototype.notify = function(hash) {
    throw new Error('method is not allowed');
};

/**
 * onmessage handler.
 * <p>called this function when receive messages from transport
 * @param {object} data rawdata from transport
 * @return {object} data processed by codec
 */
globalScope.linear.protocol.prototype.onmessage = function(data) {
    return data;
};

/**
 * reset protocol.
 */
globalScope.linear.protocol.prototype.reset = function() {
    // do nothing
};

/**
 * plain protocol with no codec.
 * <p>inherit linear.protocol
 * @augments linear.protocol
 * @see linear.protocol
 * @class
 * @private
 */
globalScope.linear.protocol.plain = function() {
    /**
     * 'plain'
     * @constant
     */
    this.type = 'plain';
    this.codec = new linear.codec.plain();
    return globalScope.linear.extend(globalScope.linear.protocol, this);
};

/**
 * onmessage handler.
 * <p>called this function when receive messages from transport
 * @param {object} data rawdata from transport
 * @return {Array} notification data for linear client
 * @see linear.client#event:onnotify
 */
globalScope.linear.protocol.plain.prototype.onmessage = function(data) {
    var results = [];

    if (data) {
        results.push({type: 'notify', data: {name: undefined, data: data}});
    }
    return results;
};

/**
 * linear protocol with msgpack codec.
 * <p>inherit linear.protocol
 * @augments linear.protocol
 * @see linear.protocol
 * @class
 * @private
 */
globalScope.linear.protocol.linear = function() {
    /**
     * 'linear'
     * @constant
     */
    this.type = 'linear';
    this.msgid = 0;
    this.codec = new globalScope.linear.codec.msgpack();
    this.requests = {};
    return globalScope.linear.extend(globalScope.linear.protocol, this);
};

/**
 * create request object.
 * @param {hash} hash linear protocol object
 * @param {String} hash.method method name
 * @param {Object} hash.params function parameters
 * @param {Function} [hash.onresponse] set specific callback when receive response
 * @param {Number} [hash.timeout] set timeout(ms)
 * @return {hash} linear request object or undefined if invalid args
 * <p><span class='light fixedFont'>{Number}</span>
 * <b>hash.id</b> id of request
 * <p><span class='light fixedFont'>{Array}</span>
 * <b>hash.data</b> request object
 */
globalScope.linear.protocol.linear.prototype.request = function(hash) {
    var that = this, request = {};
    var frame, data;

    // IE ~9
    // Object.prototype.toString.call(undefined) === '[object Object]'
    // Object.prototype.toString.call(null) === '[object Object]'
    if (!hash ||
        Object.prototype.toString.call(hash) !== '[object Object]' ||
        !('method' in hash) ||
        !('params' in hash)) {
        return undefined;
    }
    do {
        that.msgid = (that.msgid >= 0x0ffffffff) ? 0 : that.msgid + 1;
    } while (that.requests[that.msgid]);
    frame = [0, that.msgid, hash.method, hash.params];
    data = that.codec.encode(frame);
    request.id = that.msgid;
    request.onresponse = hash.onresponse;
    // default timeout === 30 sec
    request.timeout = setTimeout(function() {
                                     that.ontimeout(request.id);
                                 }, (hash.timeout > 0) ? hash.timeout : 30000);
    that.requests[request.id] = request;
    return {id: request.id, data: data, timeout: (hash.timeout > 0) ? hash.timeout : 30000};
};

/**
 * create response object.
 * @param {hash} hash linear protocol object
 * @param {Number} hash.id id of request you received
 * @param {Object} hash.error error reason etc.
 * @param {Object} hash.result result object
 * @return {Array} linear response object
 */
globalScope.linear.protocol.linear.prototype.response = function(hash) {
    var frame;

    // IE ~9
    // Object.prototype.toString.call(undefined) === '[object Object]'
    // Object.prototype.toString.call(null) === '[object Object]'
    if (!hash ||
        Object.prototype.toString.call(hash) !== '[object Object]' ||
        !('id' in hash)) {
        return undefined;
    }
    frame = [1, hash.id, hash.error, hash.result];
    return this.codec.encode(frame);
};


/**
 * create notify object.
 * @param {hash} hash linear protocol object
 * @param {String} hash.name event name
 * @param {Object} hash.data event data
 * @return {Array} linear notify object
 */
globalScope.linear.protocol.linear.prototype.notify = function(hash) {
    var frame;

    // IE ~9
    // Object.prototype.toString.call(undefined) === '[object Object]'
    // Object.prototype.toString.call(null) === '[object Object]'
    if (!hash ||
        Object.prototype.toString.call(hash) !== '[object Object]' ||
        !('name' in hash) ||
        !('data' in hash)) {
        return undefined;
    }
    frame = [2, hash.name, hash.data];
    return this.codec.encode(frame);
};

/**
 * timeout handler for request.
 * @param {Number} id message id of request
 */
globalScope.linear.protocol.linear.prototype.ontimeout = function(id) {
    if (this.requests[id]) {
        if (typeof this.requests[id].onresponse === 'function') {
            this.requests[id].onresponse.call(this,
                                              {id: id, error: 'timeout', result: null});
        }
        delete this.requests[id];
    }
};

/**
 * onmessage handler.
 * <p>called this function when receive messages from transport
 * @param {object} data rawdata from transport
 * @return {Array} response or notification data for linear client
 * @see linear.client#event:onresponse
 * @see linear.client#event:onnotify
 */
globalScope.linear.protocol.linear.prototype.onmessage = function(data) {
    var objecttype = Object.prototype.toString.call(data);
    var array, chunk, messages, results = [];
    var id, method, params;
    var u8array;

    if (objecttype === '[object String]') {
        try {
            chunk = globalScope.linear.atob(data);
        } catch (x) {
            !!console && console.log('invalid data');
            return results;
        }
    } else if (objecttype === '[object ArrayBuffer]') {
        chunk = [];
        u8array = new Uint8Array(data);
        for (var i = 0, l = u8array.length; i < l; i++) {
            chunk[i] = u8array[i];
        }
    } else if (objecttype === '[object Array]' || objecttype === '[object Number]') {
        chunk = data;
    } else {
        !!console && console.log('invalid data');
        return results;
    }
    messages = this.codec.decode(chunk);
    for (var i = 0, l = messages.length; i < l; ++i) {
        switch(messages[i][0]) {
        case 0: // request
            results.push({type: 'request',
                          data: {id: messages[i][1], method: messages[i][2], params: messages[i][3]}});
            break;
        case 1: // response
            id = messages[i][1];
            if (this.requests[id]) {
                clearTimeout(this.requests.timer);
                if (typeof this.requests[id].onresponse === 'function') {
                    this.requests[id].onresponse.call(this,
                                                      {id: id, error: messages[i][2], result: messages[i][3]});
                } else {
                    results.push({type: 'response',
                                  data: {id: id, error: messages[i][2], result: messages[i][3]}});
                }
                delete this.requests[id];
            }
            break;
        case 2: // notify
            method = messages[i][1];
            params = messages[i][2];
            results.push({type: 'notify',
                          data: {name: method, data: params}});
            break;
        default:
            !!console && console.log('invalid data');
            break;
        }
    }
    return results;
};

/**
 * reset linear protocol.
 * <p>refresh codec when disconnect from a server
 */
globalScope.linear.protocol.linear.prototype.reset = function() {
    this.codec.refresh();
};

/**
 * a transport for linear.client.
 * @class
 * @private
 */
globalScope.linear.transport = function() {
    this.state = 'disconnected';
    this.sendbuffer = [];
    this.num2bin = [];
    for (var i = 0; i < 0x100; ++i) {
        this.num2bin[i] = String.fromCharCode(i); // 0 -> "\00"
    }
};

/**
 * a helper api for constructing linear transport.
 * @static
 * @param {hash} [hash] parameters
 * @param {String} [hash.type] type of transport<br>
 * 'websocket' and 'polling' are available
 * @param {String} [hash.channel] channel of transport
 * @param {String} [hash.host] hostname of transport
 * @param {Number} [hash.port] portnumber of transport
 * @param {String} [hash.path] path for polling transport
 * @param {boolean} [hash.usessl] use wss, https scheme or not
 * @return {hash} transport object for linear
 * <p><span class='light fixedFont'>{String}</span>
 * <b>hash.type</b> type of transport
 * <p><span class='light fixedFont'>{String}</span>
 * <b>hash.entry.url</b> url of transport
 */
globalScope.linear.transport.create = function(hash) {
    var type, url, host, port, channel, path, options, usessl;
    var transport = {};

    for (var key in hash) {
        if (key.toLowerCase() === 'type') {
            type = hash[key];
        }
        if (key.toLowerCase() === 'channel') {
            channel = hash[key];
        }
        if (key.toLowerCase() === 'host') {
            host = hash[key];
        }
        if (key.toLowerCase() === 'port') {
            port = hash[key];
        }
        if (key.toLowerCase() === 'path') {
            path = hash[key];
        }
        if (key.toLowerCase() === 'usessl') {
            usessl = !!hash[key];
        }
        if (key.toLowerCase() === 'options') {
            options = hash[key];
        }
    }
    if (typeof usessl === 'undefined') {
        usessl = !!(location.protocol.match(/https/));
    }
    type = type || 'websocket';
    host = host || location.hostname;
    port = parseInt(port || location.port, 10) || (usessl ? 443 : 80);
    channel = channel || 'linear';
    channel = (!!channel.match(/^\//) ? channel : "/" + channel);            
    if (type === 'websocket') {
        if (usessl) {
            url = 'wss://' + host + ((port === 443) ? '' : ':' + port) + channel;
        } else {
            url = 'ws://' + host + ((port === 80) ? '' : ':' + port) + channel;
        }
    } else if (type === 'polling') {
        path = path || 'cgi/linear.fcgi';
        path = (!!path.match(/^\//) ? path : "/" + path);            
        if (usessl) {
            url = 'https://' + host + ((port === 443) ? '' : ':' + port) + path;
        } else {
            url = 'http://' + host + ((port === 80) ? '' : ':' + port) + path;
        }
    } else {
        !!console && console.log('transport: ' +
                                 transport.type + ' is not implemented.');
        return undefined;
    }
    transport.type = type;
    transport.entry = {};
    transport.entry.url = url;
    transport.entry.channel = channel;
    transport.entry.options = options;
    return transport;
};

/**
 * connect to target.
 * <p>fallback polling transport automatically when unable to use websocket transport
 * if polling transport is available
 */
globalScope.linear.transport.prototype.connect = function(hash) {
    var that = this, timeout;

    function onopen(e) {
        if (e && e.currentTarget !== that.try_sock) {
            e.currentTarget.onclose = e.currentTarget.onerror = null;
            e.currentTarget.close();
            return;
        }
        that.type = 'websocket';
        that.raw = new globalScope.linear.transport.websocket(that.try_sock);
        that.raw.onopen = function(e) {
            that._onopen(e);
        };
        that.raw.onclose = that.raw.onerror = function(e) {
            that._onclose(e);
        };
        that.raw.onmessage = function(data) {
            that._onmessage(data);
        };
        // call once
        that._onopen();
    }

    function onclose(e) {
        that.try_sock = undefined;
        if (!that.entry.polling) {
            // call once
            that._onclose();
            return;
        }
        that.type = 'polling';
        that.raw = new globalScope.linear.transport.polling(that.entry.polling.url,
                                                            that.entry.polling.channel,
                                                            that.entry.polling.options,
                                                            function() {
                                                                that._onopen();
                                                            },
                                                            function() {
                                                                that._onclose();
                                                            });
        that.raw.onopen = function(e) {
            that._onopen(e);
        };
        that.raw.onclose = that.raw.onerror = function(e) {
            that._onclose(e);
        };
        that.raw.onmessage = function(data) {
            that._onmessage(data);
        };
    }

    if (that.state === 'connecting' || that.state === 'connected') {
        return;
    }
    that.state = 'connecting';
    if (hash && hash.timeout) {
        timeout = hash.timeout;  
    } else {
        timeout = 30000;
    }
    if (that.entry.websocket) {
        try {
            that.try_sock = new WebSocket(that.entry.websocket.url);
        } catch (e) {
            if (!that.entry.polling) {
                // call once
                that._onclose();
                return;
            }
            that.type = 'polling';
            that.raw = new globalScope.linear.transport.polling(that.entry.polling.url,
                                                                that.entry.polling.channel,
                                                                that.entry.polling.options,
                                                                function() {
                                                                    that._onopen();
                                                                },
                                                                function() {
                                                                    that._onclose();
                                                                });
            that.raw.onopen = function(e) {
                that._onopen(e);
            };
            that.raw.onclose = that.raw.onerror = function(e) {
                that._onclose(e);
            };
            that.raw.onmessage = function(data) {
                that._onmessage(data);
            };
            return;
        }
        that.try_sock.onopen = onopen;
        that.try_sock.onclose = onclose;
        setTimeout(function() {
                       if (that.state === 'connecting') {
                           that.try_sock.onopen = that.try_sock.onclose = that.try_sock.onerror = null;
                           that.try_sock.close();
                           onclose();
                       }
                   }, timeout);
        return;
    } else if (that.entry.polling) {
        that.type = 'polling';
        that.raw = new globalScope.linear.transport.polling(that.entry.polling.url,
                                                            that.entry.polling.channel,
                                                            that.entry.polling.options,
                                                            function() {
                                                                that._onopen();
                                                            },
                                                            function() {
                                                                that._onclose();
                                                            });
        that.raw.onopen = function(e) {
            that._onopen(e);
        };
        that.raw.onclose = that.raw.onerror = function(e) {
            that._onclose(e);
        };
        that.raw.onmessage = function(data) {
            that._onmessage(data);
        };
        setTimeout(function() {
                       if (that.state === 'connecting') {
                           that._onclose();
                       }
                   }, timeout);
        return;
    }
    // call once
    that._onclose();
};

/**
 * handler for received open event.
 * @param {Event} e open event
 */
globalScope.linear.transport.prototype._onopen = function(e) {
    if (this.state !== 'connecting') {
        return;
    }
    this.state = 'connected';
    for (var i = 0, l = this.sendbuffer.length; i < l; ++i) {
        this.send(this.sendbuffer[i]);
    }
    this.sendbuffer = [];
    if (typeof this.onopen === 'function') {
        this.onopen(e);
    }
};

/**
 * handler for received close event.
 * @param {Event} e close event
 */
globalScope.linear.transport.prototype._onclose = function(e) {
    if (this.state === 'disconnected') {
        return;
    }
    this.state = 'disconnected';
    if (typeof this.onclose === 'function') {
        this.onclose(e);
    }
};

/**
 * handler for received message event.
 * @param {object} data received data from raw transport
 */
globalScope.linear.transport.prototype._onmessage = function(data) {
    if (this.state !== 'connected') {
        return;
    }
    if (typeof this.onmessage === 'function') {
        this.onmessage(data);
    }
};

/**
 * disconnect from target.
 */
globalScope.linear.transport.prototype.disconnect = function() {
    if (this.state === 'disconnected') {
        return;
    }
    this.state = 'disconnecting';
    this.sendbuffer = [];
    if (typeof this.raw.disconnect === 'function') {
        this.raw.disconnect();
    }
};

/**
 * send data to target.
 * @param {object} data data created by linear.protocol
 */
globalScope.linear.transport.prototype.send = function(data) {
    var rawdata, datatype = Object.prototype.toString.call(data);

    if (this.state === 'disconnecting' || this.state === 'disconnected') {
        return;
    }
    if (this.state === 'connecting') {
        this.sendbuffer[this.sendbuffer.length] = data;
        return;
    }    
    if (datatype === '[object String]') {
        rawdata = data;
    } else if (datatype === '[object Array]' || datatype === '[object ArrayBuffer]' ||
               datatype === '[object Uint8Array]') {
        if (this.raw.type === 'text') {
            rawdata = [];
            for (var i = 0, l = data.length; i < l; ++i) {
                rawdata[i] = this.num2bin[data[i]];
            }
            rawdata = globalScope.linear.btoa(rawdata.join(''));
        } else if (this.raw.type === 'binary'){
            rawdata = new Uint8Array(data).buffer;
        }
    } else {
        return;
    }
    this.raw.send(rawdata);
};

/**
 * websocket transport.
 * @class
 * @param socket WebSocket object
 * @private
 */ 
globalScope.linear.transport.websocket = function(socket) {
    var that = this;

    that.socket = socket;
    if ('binaryType' in that.socket) {
        that.socket.binaryType = 'arraybuffer';
        that.type = 'binary';
    } else {
        that.type = 'text';
    }
    that.socket.onopen = function (e) {
        if (typeof that.onopen === 'function') {
            that.onopen(e);
        }
    };
    that.socket.onclose = that.socket.onerror = function(e) {
        if (typeof that.onclose === 'function') {
            that.onclose(e);
        }
        that.socket = undefined;
    };
    that.socket.onmessage = function(e) {
        if (typeof that.onmessage === 'function') {
            that.onmessage(e.data);
        }
    };
};

/**
 * disconnect websocket connection.
 */
globalScope.linear.transport.websocket.prototype.disconnect = function() {
    this.socket.close();
};

/**
 * send data by using websocket connection.
 * <p><strong style='color: red;'>change arraybuffer into arraybufferview in near future</strong>
 * @param {string, blob, arraybuffer} data data packet
 * @see
 * <a href='http://www.w3.org/TR/2012/WD-websockets-20120524/#dom-websocket-send'
 *  target='_blank'>
 * http://www.w3.org/TR/2012/WD-websockets-20120524/#dom-websocket-send
 * </a>
 */
globalScope.linear.transport.websocket.prototype.send = function(data) {
    this.socket.send(data);
};

/**
 * jsonp handler.
 * a copy of http://d.hatena.ne.jp/NeoCat/20110206/1296934235
 * @namespace
 * @see
 * <a href='http://d.hatena.ne.jp/NeoCat/20110206/1296934235' target='_blank'>
 * http://d.hatena.ne.jp/NeoCat/20110206/1296934235
 * </a>
 * @private
 */
globalScope.linear.jsonp = {
    /**
     * execute jsonp.
     * @static
     * @param {String} url url of script
     * @param {Function} [onsuccess] success callback
     * @param {Function} [onerror] error callback
     */
    load: function(url, onsuccess, onerror) {
        var ifr = document.createElement("iframe");
        ifr.style.display = "none";
        document.body.appendChild(ifr);
        var d = ifr.contentWindow.document;
        var confirmed = false;
        ifr[ifr.readyState ? "onreadystatechange" : "onload"] = function() {
            if ((this.readyState && this.readyState != 'complete') || confirmed) {
                return;
            }
            confirmed = true;
            if (d.x) {
                if (typeof onsuccess === 'function') {
                    onsuccess.apply(this, d.x);
                }
            } else if (typeof onerror === 'function') {
                onerror();
            }
            setTimeout(function() {
                           try {
                               ifr.parentNode.removeChild(ifr);
                           } catch(e) {}
                       }, 0);
        };
        var url2 = url + (url.indexOf('?') < 0 ? '?' : '&') + 'f=cb&' + (new Date()).getTime();
        d.write('<scr'+'ipt>function cb(){document.x=arguments}</scr'+'ipt>' +
                '<scr'+'ipt src="'+url2+'"></scr'+'ipt>');
        d.close();
        return ifr;
    },
    /**
     * abort jsonp.
     * @static
     * @param {Object} ifr iframe including scripts
     */
    abort: function(ifr) {
        if (ifr && ifr.parentNode) {
            ifr.parentNode.removeChild(ifr);
        }
    }
};

/**
 * jsonp-polling transport.
 * @class
 * @param {String} url target url for polling
 * @param {String} channel channel name
 * @param {hash} [options] options for polling transport
 * @param {Number} [options.interval] polling interval time(ms)
 * default: 250ms
 * @param {Number} [options.gc] garbage collection time(ms)
 * remove iframe element timeout.default: 3000ms
 * @param {Function} [onconnect] callback function when connect
 * @param {Function} [ondisconnect] callback function when disconnect
 * @private
 */ 
globalScope.linear.transport.polling = function(url, channel, options,
                                                onconnect, ondisconnect) {
    this.type = 'text';
    this.url = url;
    this.channel = channel;
    this.options = options || {};
    this.seq = 0;
    this.sid = undefined;
    var that = this;
    var qs = '?c=connect&ch=' + this.channel;

    function onopen(hash) {
        that.sid = hash.sid;
        // cancel to connect
        if (that.state !== 'connecting') {
            qs = '?c=disconnect&sid=' + that.sid;
            globalScope.linear.jsonp.load(that.url + qs);
            return;
        }
        that.dopoll();
        if (typeof onconnect === 'function') {
            onconnect();
        }
    }
    that.state = 'connecting';
    globalScope.linear.jsonp.load(this.url + qs, onopen, ondisconnect);
};

/**
 * stop polling.
 */
globalScope.linear.transport.polling.prototype.disconnect = function() {
    var qs = '?c=disconnect&sid=' + this.sid;

    if (this.state === 'disconnecting') {
        return;
    }
    this.state = 'disconnecting';
    this.intervaltimer && clearTimeout(this.intervaltimer);
    this.intervaltimer = 0;
    this.seq = 0;
    if (this.sid !== undefined) {
        globalScope.linear.jsonp.load(this.url + qs);
    }
    this.sid = undefined;
    if (typeof this.onclose === 'function') {
        this.onclose();
    }
};

/**
 * send data by using form in iframe.
 * @param {String} data data packet
 * @see
 * <a href='http://d.hatena.ne.jp/NeoCat/20080921/1221940658' target='_blank'>
 * http://d.hatena.ne.jp/NeoCat/20080921/1221940658
 * </a>28261
 */
globalScope.linear.transport.polling.prototype.send = function(data) {
    var frm, inp, ifr, confirmed = false, gc = this.options.gc || 3000;

    function onload(_frm, _ifr) {
        if (!_ifr.confirmed) {
            _ifr.confirmed = true;
            _frm.submit();
            setTimeout(function() { onload(_frm, _ifr); }, gc); // GC
        } else {
            try {
                _frm.parentNode.removeChild(_frm);
                _ifr.parentNode.removeChild(_ifr);
            } catch (x) {}
        }
    }
    if (this.sid === undefined || this.state === 'disconnecting') {
        return;
    }
    frm = document.createElement('form');
    frm.style.display = 'none';
    frm.action = this.url;
    frm.method = 'POST';
    frm.target = 'ifr' + this.seq;
    document.body.appendChild(frm);

    inp = document.createElement('input');
    inp.type = 'text';
    inp.name = 'sid';
    inp.value = this.sid;
    frm.appendChild(inp);
    inp = document.createElement('input');
    inp.type = 'text';
    inp.name = 'data';
    inp.value = data;
    frm.appendChild(inp);

    ifr = document.createElement('iframe');
    ifr.style.display = 'none';
    ifr.name = 'ifr' + (this.seq++);
    ifr.src = 'about:blank';
    ifr.onload = function() {
        onload(frm, ifr);
    };

    if (document.all) { /* for old IE */
        ifr.onreadystatechange = function() {
            if (this.readyState === 'complete') {
                ifr.contentWindow.name = ifr.name;
                onload(frm, ifr);
            }
        };
    }
    document.body.appendChild(ifr);
};

/**
 * get event data by using jsonp.
 */
globalScope.linear.transport.polling.prototype.dopoll = function() {
    var that = this, interval;
    var qs = '?c=poll&sid=' + this.sid;

    function onmessage(data) {
        if (data && typeof that.onmessage === 'function') {
            that.onmessage(data);
        }
        that.intervaltimer = setTimeout(function() {
                                            that.dopoll();
                                        }, interval);
    }
    function onerror() {
        that.disconnect();
    }

    if (this.sid === undefined || this.state === 'disconnecting') {
        return;
    }
    if (!that.options) {
        interval = 250;
    } else {
        interval = that.options.interval || 250;
    }
    globalScope.linear.jsonp.load(this.url + qs, onmessage, onerror);
};

/**
 * a linear client.<br>
 * you can configure transports by specifying some parameters(all optional)
 * @constructor
 * @param {hash} [hash]
 * @param {String || Array} [hash.transports] transports<br>
 * use ['websocket', polling'] by default
 * @param {String} [hash.transports[].type] transport type
 * @param {String} [hash.transports[].channel] channel name<br>
 * use 'linear' by default
 * @param {String} [hash.transports[].host] hostname of target<br>
 * use location.hostname by default
 * @param {Number} [hash.transports[].port] port number of target<br>
 * use location.port etc. by default(depends on location.protocol)
 * @param {String} [hash.transports[].path] cgi path that is used by polling transport<br>
 * use 'cgi/linear.fcgi' by default.
 * @param {boolean} [hash.transports[].usessl] use ssl or not for transport<br>
 * use wss scheme for websocket and https scheme for polling when this parameter is set true<br>
 * use false by default
 * @example
 * (function() {
 *   var client;
 * 
 *   // all default
 *   client = new linear.client();
 *   // above is same as this
 *   client = new linear.client({transports: [
 *                               {type: 'websocket',
 *                                channel: 'linear',
 *                                host: location.hostname,
 *                                port: location.port,
 *                                usessl: false},
 *                               {type: 'polling',
 *                                channel: 'linear',
 *                                host: location.hostname,
 *                                port: location.port,
 *                                path: 'cgi/linear.fcgi',
 *                                usessl: false}
 *                             ]});
 * 
 *   // use only websocket transport
 *   client = new linear.client({transports: 'websocket'});
 *  
 *   // specify target channel
 *   var channel = 'echo';
 *   var websocket_transport = {type: 'websocket', channel: channel};
 *   var polling_transport = {type: 'polling', channel: channel};
 * 
 *   client = new linear.client({transports: [websocket_transport, polling_transport]});
 * 
 *   // rename or relocate linear.fcgi at server side
 *   channel = 'calc';
 *   websocket_transport = {type: 'websocket', channel: channel};
 *   polling_transport = {type: 'polling', channel: channel, path: '/fcgi/rename.cgi'};
 * 
 *   client = new linear.client({transports: [websocket_transport, polling_transport]});
 * 
 * })();
 */
globalScope.linear.client = function(hash) {
    var that = this, protocol, transports, transport;
    var objecttype;

    // return undefined when called static
    if (typeof that === 'function') {
        return undefined;
    }
    for (var key in hash) {
        if (key.toLowerCase() === 'protocol') {
            protocol = hash[key];
        }
        if (key.toLowerCase() === 'transports') {
            transports = hash[key];
        }
    }
    protocol = protocol ? protocol : 'linear';
    /**
     * client protocol handler.
     * @see linear.protocol
     * @fieldOf linear.client
     * @private
     * @exports that.protocol as protocol
     */
    try {
        that.protocol = new globalScope.linear.protocol[protocol]();
    } catch (x) {
        !!console && console.log('protocol: ' + protocol + ' is not implemented.');
        that.protocol = new globalScope.linear.protocol.linear();
    }
    /**
     * client transport handler.
     * @see linear.transport
     * @fieldOf linear.client
     * @private
     * @exports that.transport as transport
     */
    that.transport = new globalScope.linear.transport();
    that.transport.onopen = function(e) {
        that._onopen(e);
    };
    that.transport.onclose = function(e) {
        that._onclose(e);
    };
    that.transport.onmessage = function(data) {
        that._onmessage(data);
    };
    that.transport.entry = {};
    objecttype = Object.prototype.toString.call(transports);
    if (objecttype === '[object String]') {
        transport = globalScope.linear.transport.create({type: transports});
        if (transport) {
            that.transport.entry[transport.type] = transport.entry;
        }
    } else if (objecttype === '[object Array]') {
        for (var i = 0, l = transports.length; i < l; i++) {
            if (typeof transports[i] === 'string') {
                transport = globalScope.linear.transport.create({type: transports[i]});
            } else {
                transport = globalScope.linear.transport.create(transports[i]);
            }
            if (transport) {
                that.transport.entry[transport.type] = transport.entry;
                transport = undefined;
            }
        }
    } else if (transports !== undefined && objecttype === '[object Object]') {
        transport = globalScope.linear.transport.create(transports);
        if (transport) {
            that.transport.entry[transport.type] = transport.entry;
        }
    } else {
        transport = globalScope.linear.transport.create({type: 'websocket'});
        that.transport.entry[transport.type] = transport.entry;
        transport = globalScope.linear.transport.create({type: 'polling'});
        that.transport.entry[transport.type] = transport.entry;
    }
    return that;
};

/**
 * get connection status of client
 * @methodOf linear.client.prototype
 * @return {String} status of client<br>
 * connecting, connected, disconnecting, disconnected
 */
globalScope.linear.client.prototype.state = function() {
    return this.transport.state;
};

/**
 * connect to target.
 * <p>called onconnect when connected, called ondisconnect otherwise
 * @methodOf linear.client.prototype
 * @param {hash} hash connect parameters
 * @param {Number} hash.timeout
 * connect timeout(ms). 30 sec as default( === TCP connect timeout)
 * @see #event:onconnect
 * @see #event:ondisconnect
 * @example
 * (function() {
 *   var client = new linear.client();
 *
 *   client.onconnect = client.ondisconnect = function(e) {
 *     console.log(e.type);
 *   };
 *   client.connect(); // connect timeout === 30sec
 *   // else 
 *   client.connect({timeout: 3000}); // connect timeout === 3 sec
 * })();
 */
globalScope.linear.client.prototype.connect = function(hash) {
    if (typeof this.transport.connect === 'function') {
        this.transport.connect(hash);
    }
};

/**
 * setter for onconnect handler.
 * <p>I feel no need to impl this api
 * @param {Function} f callback function for onconnect
 * @see #event:onconnect
 * @private
 */
globalScope.linear.client.prototype.onconnect = function(f) {
    if (typeof f === 'function') {
        this.onconnect = f;
    }
};

/**
 * disconnect from target.
 * @methodOf linear.client.prototype
 * @see #event:ondisconnect
 */
globalScope.linear.client.prototype.disconnect = function() {
    if (typeof this.transport.disconnect === 'function') {
        this.transport.disconnect();
    }
};

/**
 * setter for ondisconnect handler.
 * <p>I feel no need to impl this api
 * @param {Function} f callback function for ondisconnect
 * @see #event:ondisconnect
 * @private
 */
globalScope.linear.client.prototype.ondisconnect = function(f) {
    if (typeof f === 'function') {
        this.ondisconnect = f;
    }
};

/**
 * send request to target async.
 * called onresponse when receive response or error
 * @methodOf linear.client.prototype
 * @param {hash} hash request parameters
 * @param {String} hash.method target method
 * @param {Object} hash.params parameters of target method
 * @param {Number} [hash.timeout] set timeout(ms)
 * @param {Function} [hash.onresponse] response handler
 * @return {Number} request id when succeed, -1 when fail to send request
 * @see #event:onresponse
 * @see linear.tobinary
 * @see linear.tofloat
 * @example
 * (function() {
 *   var reqid, bar = ['a', 1, linear.tobinary(new Int8Array([-1, 0, 1])), linear.tofloat(1.0), {key: 'val'}];
 *   var client = new linear.client();
 * 
 *   // there are two ways to set onresponse handler
 *
 *   // 1.direct assign
 *   client.onresponse = function(response) {
 *     console.log(response.id);
 *     // display result if an error does not exists
 *     console.log(response.error || response.result);
 *   };
 *   reqid = client.request({method: 'foo', params: bar});
 * 
 *   // 2.got response at specified function
 *   reqid = client.request({method: 'foo', params: bar,
 *                           onresponse: function(response) {
 *                                         console.log(response.id);
 *                                         console.log(response.error || response.result);
 *                                       }
 *                         });
 * 
 *   // check whether succeed to request
 *   if (reqid < 0) {
 *     console.log('fail request');
 *   } else {
 *     console.log('success request. id = ' + reqid);
 *   }
 * })();
 */
globalScope.linear.client.prototype.request = function(hash) {
    var request;

    if (typeof this.protocol.request === 'function') {
        if (this.transport.state === 'disconnected' ||
            this.transport.state === 'disconnecting') {
            return -1;
        }
        try {
            request = this.protocol.request(hash);
        } catch (x) {
            return -1;
        }
        if (!request) {
            return -1;
        }
        this.transport.send(request.data);
    } else {
        return -1;
    }
    return request.id;
};

/**
 * setter for onresponse handler.
 * <p>I feel no need to impl this api
 * @param {Function} f callback function for onresponse
 * @see linear.client#request
 * @private
 */
globalScope.linear.client.prototype.onresponse = function(f) {
    if (typeof f === 'function') {
        this.onresponse = f;
    }
};

/**
 * send response to target.
 * @methodOf linear.client.prototype
 * @param {hash} hash response parameters
 * @param {Number} hash.id id of request you received
 * @param {Object} hash.result result of request
 * @param {Object} hash.error error reason etc. when failing to execute request
 * @return {Boolean} success or fail to send response
 * @see #event:onrequest
 * @see linear.tobinary
 * @see linear.tofloat
 * @example
 * (function() {
 *   var client = new linear.client();
 *
 *   client.onrequest = function(request) {
 *     if (request.method == "echo") {
 *       client.response({id: request.id, result: request.params});
 *     } else {
 *       client.response({id: request.id, error: {code: 503, message: 'Service Unavailable'});
 *     }
 *   };
 * })();
 */
globalScope.linear.client.prototype.response = function(hash) {
    var response;

    if (typeof this.protocol.response === 'function') {
        if (this.transport.state === 'disconnected' ||
            this.transport.state === 'disconnecting') {
            return false;
        }
        try {
            response = this.protocol.response(hash);
        } catch (x) {
            return false;
        }
        if (!response) {
            return false;
        }
        this.transport.send(response);
    } else {
        return false;
    }
    return true;
};

/**
 * send notification to target.
 * returns no response. effects only server side
 * @methodOf linear.client.prototype
 * @param {hash} hash notification parameters
 * @param {String} hash.name event name
 * @param {Object} hash.data event data
 * @return {Boolean} success or fail to send notify
 * @see #event:onnotify
 * @see linear.tobinary
 * @see linear.tofloat
 * @example
 * (function() {
 *   var events = ['a', 1, linear.tobinary(new Int8Array([-1, 0, 1])), linear.tofloat(1.0), {key: 'val'}];
 *   var client = new linear.client();
 * 
 *   if (client.notify({name: 'sendonly', data: events})) {
 *     clonsole.log('success notify');
 *   } else {
 *     console.log('fail notify');
 *   }
 * })();
 */
globalScope.linear.client.prototype.notify = function(hash) {
    var notify;

    if (typeof this.protocol.notify === 'function') {
        if (this.transport.state === 'disconnected' ||
            this.transport.state === 'disconnecting') {
            return false;
        }
        try {
            notify = this.protocol.notify(hash);
        } catch (x) {
            return false;
        }
        if (!notify) {
            return false;
        }
        this.transport.send(notify);
    } else {
        return false;
    }
    return true;
};

/**
 * setter for onnotify handler.
 * <p>I feel no need to impl this api
 * @param {Function} f callback function for onnotify
 * @see #event:onnotify
 * @private
 */
globalScope.linear.client.prototype.onnotify = function(f) {
    if (typeof f === 'function') {
        this.onnotify = f;
    }
};

/**
 * event handler for receiving open event.
 */
globalScope.linear.client.prototype._onopen = function(e) {
    var event;

    if (this.hasOwnProperty('onconnect') &&
        typeof this.onconnect === 'function') {
        if (!document) {
            event = {type: 'connected'};
        } else if ('createEvent' in document) {
            event = document.createEvent('Event');
            event.initEvent('connected', true, true);
        } else if ('createEventObject' in document) {
            event = document.createEventObject();
            event.type = 'connected';
        } else {
            event = {type: 'connected'};
        }
        this.onconnect(event);
    }
};

/**
 * event handler for receiving close event.
 */
globalScope.linear.client.prototype._onclose = function(e) {
    var event;

    this.protocol.reset();
    if (this.hasOwnProperty('ondisconnect') &&
        typeof this.ondisconnect === 'function') {
        if (!document) {
            event = {type: 'disconnected'};
        } else if ('createEvent' in document) {
            event = document.createEvent('Event');
            event.initEvent('disconnected', true, true);
        } else if ('createEventObject' in document) {
            event = document.createEventObject();
            event.type = 'disconnected';
        } else {
            event = {type: 'disconnected'};
        }
        this.ondisconnect(event);
    }
};

/**
 * event handler for receiving message event.
 * @param {object} data received data from transport
 */
globalScope.linear.client.prototype._onmessage = function(data) {
    var results = this.protocol.onmessage(data);

    for (var i = 0, l = results.length; i < l; i++) {
        if (results[i].type === 'request') {
            if (this.hasOwnProperty('onrequest') &&
                typeof this.onrequest === 'function') {
                this.onrequest.call(this, results[i].data);
            }
        } else if (results[i].type === 'response') {
            if (this.hasOwnProperty('onresponse') &&
                typeof this.onresponse === 'function') {
                this.onresponse.call(this, results[i].data);
            }
        } else if (results[i].type === 'notify') {
            if (this.hasOwnProperty('onnotify') &&
                typeof this.onnotify === 'function') {
                this.onnotify.call(this, results[i].data);
            }
        }
    }
};

/**
 * fire when connected to target.
 * @name linear.client#onconnect
 * @event
 * @param {Event} e event object
 * @param {String} e.type 'connected'
 * @see linear.client#connect
 * @example
 * client.onconnect = function(e) {
 *   console.log(e.type); // display 'connected'
 * };
 */

/**
 * fire when disconnected from target.
 * @name linear.client#ondisconnect
 * @event
 * @param {Event} e event object
 * @param {String} e.type 'disconnected'
 * @see linear.client#connect
 * @see linear.client#disconnect
 * @example
 * client.ondisconnect = function(e) {
 *   console.log(e.type); // display 'disconnected'
 * };
 */

/**
 * fire when received request.
 * @name linear.client#onrequest
 * @event
 * @param {hash} request
 * @param {Number} request.id id of request
 * @param {String} request.method request method
 * @param {Object} request.params request parameters
 * @see linear.client#response
 * @example
 * (function() {
 *   client.onrequest = function(request) {
 *     console.log(request.id);     // display request id
 *     console.log(request.method); // display request method
 *     console.log(request.params); // display request parameters
 *   };
 * })();
 */

/**
 * fire when received response.
 * @name linear.client#onresponse
 * @event
 * @param {hash} response
 * @param {Number} response.id id of request you sended
 * @param {Object} response.error null if receive data
 * @param {Object} response.result null if receive error
 * @see linear.client#request
 * @example
 * (function() {
 *   client.onresponse = function(response) {
 *     console.log(response.id);       // display id of request you sended
 *     if (response.error) {
 *       console.log(response.error);  // display error reason etc.(depends on server spec.)
 *     } else {
 *       console.log(response.result); // display result
 *     }
 *   };
 * })();
 */

/**
 * fire when received notification.
 * @name linear.client#onnotify
 * @event
 * @param {hash} notification
 * @param {String} notification.name notification name
 * @param {Object} notification.data notification data
 * @example
 * (function() {
 *   client.onnotify = function(notification) {
 *     console.log(notification.name); // display event name
 *     console.log(notification.data); // display event data
 *   };
 * })();
 */

})(this);
