/** @license !{id:msgpack.codec.js,ver:1.05,license:"MIT",author:"uupaa.js@gmail.com"} */

// === msgpack ===
// MessagePack -> http://msgpack.sourceforge.net/

this.msgpack || (function(globalScope) {

globalScope.msgpack = {
    tofloat:    msgpackfloat,   // float number wrapper
    unpacker:   msgpackunpacker,// stream deserializer
    pack:       msgpackpack,    // msgpack.pack(data:Mix,
                                //              toString:Boolean = false):ByteArray/ByteString/false
                                //  [1][mix to String]    msgpack.pack({}, true) -> "..."
                                //  [2][mix to ByteArray] msgpack.pack({})       -> [...]
    unpack:     msgpackunpack   // msgpack.unpack(data:BinaryString/ByteArray):Mix
                                //  [1][String to mix]    msgpack.unpack("...") -> {}
                                //  [2][ByteArray to mix] msgpack.unpack([...]) -> {}
};

var _bin2num       = {}, // BinaryStringToNumber   { "\00": 0, ... "\ff": 255 }
    _num2bin       = {}, // NumberToBinaryString   { 0: "\00", ... 255: "\ff" }
    _buf           = [], // decode buffer
    _idx           = 0,  // decode buffer[index]
    _error         = 0,  // msgpack.pack() error code. 1 = CYCLIC_REFERENCE_ERROR
    _isArray       = Array.isArray || (function(mix) {
                       return Object.prototype.toString.call(mix) === "[object Array]";
                     }),
    _isFloat       = (function(mix) {
                       return mix instanceof msgpackfloat;
                     }),
    _isArrayBuffer = (function(mix) {
                       return (Object.prototype.toString.call(mix) === '[object ArrayBuffer]');
                     }),
    _isTypedArray  = (function(mix) {
                       // IE ~9
                       // Object.prototype.toString.call(undefined) === '[object Object]'
                       // Object.prototype.toString.call(null) === '[object Object]'
                       return (mix &&
                               Object.prototype.toString.call(mix) !== '[object Object]' &&
                               'buffer' in mix &&
                               Object.prototype.toString.call(mix.buffer) === '[object ArrayBuffer]');
                     }),
    _toString      = String.fromCharCode, // CharCode/ByteArray to String
    _MAX_DEPTH     = 512;

// http://blog.livedoor.jp/dankogai/archives/50662064.html
// http://labs.cybozu.co.jp/blog/kazuho/archives/2006/10/javascript_string.php
function msgpackfloat(n) {
    this._n = n;
}
msgpackfloat.prototype = new Number();
msgpackfloat.prototype.valueOf = function() {
    return this._n;
};
msgpackfloat.prototype.toString = function() {
    return this._n.toString();
};

// msgpack.unpacker
function msgpackunpacker() {
    var that = {
        _chunk: [], // chunk buffer
        _cidx: 0    // chunk buffer[index] for stream
    };

    that.feed = function(data) { // @param BinaryString/ByteArray:
        var ary = typeof data === "string" ? toByteArray(data) : data;
        that._chunk = that._chunk.concat(ary);
    };
    that.unpack = function() { // @return Mix/undefined:
                               //         undefined is error return
        var r = msgpackunpack(that._chunk);
        if (r !== undefined) {
            that._cidx = _idx + 1;
            that._chunk = that._chunk.slice(that._cidx);
            return r;
        }
        return;
    };
    that.refresh = function() {
        that._chunk = [];
        that._cidx = 0;
    };
    return that;
}

// msgpack.pack
function msgpackpack(data,       // @param Mix:
                     toString) { // @param Boolean(= false):
                                 // @return ByteArray/BinaryString/false:
                                 //     false is error return
    //  [1][mix to String]    msgpack.pack({}, true) -> "..."
    //  [2][mix to ByteArray] msgpack.pack({})       -> [...]

    _error = 0;

    var byteArray = encode([], data, 0);

    return _error ? false
                  : toString ? byteArrayToByteString(byteArray)
                             : byteArray;
}

// msgpack.unpack
function msgpackunpack(data) { // @param BinaryString/ByteArray:
                               // @return Mix/undefined:
                               //       undefined is error return
    //  [1][String to mix]    msgpack.unpack("...") -> {}
    //  [2][ByteArray to mix] msgpack.unpack([...]) -> {}

    _buf = typeof data === "string" ? toByteArray(data) : data;
    _idx = -1;
    return decode(); // mix or undefined
}

// inner - encoder
function encode(rv,      // @param ByteArray: result
                mix,     // @param Mix: source data
                depth) { // @param Number: depth
    var size, i, iz, c, pos, ui8a,  // for UTF8.encode, Array.encode, Hash.encode, {ArrayBuffer, TypedArray}.encode
        high, low, sign, exp, frac; // for IEEE754

    if (mix == null) { // null or undefined -> 0xc0 ( null )
        rv.push(0xc0);
    } else if (mix === false) { // false -> 0xc2 ( false )
        rv.push(0xc2);
    } else if (mix === true) {  // true  -> 0xc3 ( true  )
        rv.push(0xc3);
    } else {
        switch (typeof mix) {
        case "number":
            if (mix !== mix) { // isNaN
                rv.push(0xcb, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff); // quiet NaN
            } else if (mix === Infinity) {
                rv.push(0xcb, 0x7f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00); // positive infinity
            } else if (Math.floor(mix) === mix) { // int or uint
                if (mix < 0) {
                    // int
                    if (mix >= -32) { // negative fixnum
                        rv.push(0xe0 + mix + 32);
                    } else if (mix > -0x80) {
                        rv.push(0xd0, mix + 0x100);
                    } else if (mix > -0x8000) {
                        mix += 0x10000;
                        rv.push(0xd1, mix >> 8, mix & 0xff);
                    } else if (mix > -0x80000000) {
                        mix += 0x100000000;
                        rv.push(0xd2, mix >>> 24, (mix >> 16) & 0xff,
                                                  (mix >>  8) & 0xff, mix & 0xff);
                    } else {
                        high = Math.floor(mix / 0x100000000);
                        low  = mix & 0xffffffff;
                        rv.push(0xd3, (high >> 24) & 0xff, (high >> 16) & 0xff,
                                      (high >>  8) & 0xff,         high & 0xff,
                                      (low  >> 24) & 0xff, (low  >> 16) & 0xff,
                                      (low  >>  8) & 0xff,          low & 0xff);
                    }
                } else {
                    // uint
                    if (mix < 0x80) {
                        rv.push(mix); // positive fixnum
                    } else if (mix < 0x100) { // uint 8
                        rv.push(0xcc, mix);
                    } else if (mix < 0x10000) { // uint 16
                        rv.push(0xcd, mix >> 8, mix & 0xff);
                    } else if (mix < 0x100000000) { // uint 32
                        rv.push(0xce, mix >>> 24, (mix >> 16) & 0xff,
                                                  (mix >>  8) & 0xff, mix & 0xff);
                    } else {
                        high = Math.floor(mix / 0x100000000);
                        low  = mix & 0xffffffff;
                        rv.push(0xcf, (high >> 24) & 0xff, (high >> 16) & 0xff,
                                      (high >>  8) & 0xff,         high & 0xff,
                                      (low  >> 24) & 0xff, (low  >> 16) & 0xff,
                                      (low  >>  8) & 0xff,          low & 0xff);
                    }
                }
            } else { // double
                // THX!! @edvakf
                // http://javascript.g.hatena.ne.jp/edvakf/20101128/1291000731
                sign = mix < 0;
                sign && (mix *= -1);

                // add offset 1023 to ensure positive
                // 0.6931471805599453 = Math.LN2;
                exp  = ((Math.log(mix) / 0.6931471805599453) + 1023) | 0;

                // shift 52 - (exp - 1023) bits to make integer part exactly 53 bits,
                // then throw away trash less than decimal point
                frac = mix * Math.pow(2, 52 + 1023 - exp);

                //  S+-Exp(11)--++-----------------Fraction(52bits)-----------------------+
                //  ||          ||                                                        |
                //  v+----------++--------------------------------------------------------+
                //  00000000|00000000|00000000|00000000|00000000|00000000|00000000|00000000
                //  6      5    55  4        4        3        2        1        8        0
                //  3      6    21  8        0        2        4        6
                //
                //  +----------high(32bits)-----------+ +----------low(32bits)------------+
                //  |                                 | |                                 |
                //  +---------------------------------+ +---------------------------------+
                //  3      2    21  1        8        0
                //  1      4    09  6
                low  = frac & 0xffffffff;
                sign && (exp |= 0x800);
                high = ((frac / 0x100000000) & 0xfffff) | (exp << 20);

                rv.push(0xcb, (high >> 24) & 0xff, (high >> 16) & 0xff,
                              (high >>  8) & 0xff,  high        & 0xff,
                              (low  >> 24) & 0xff, (low  >> 16) & 0xff,
                              (low  >>  8) & 0xff,  low         & 0xff);
            }
            break;
        case "string":
            // http://d.hatena.ne.jp/uupaa/20101128
            iz = mix.length;
            pos = rv.length; // keep rewrite position

            rv.push(0); // placeholder

            // utf8.encode
            for (i = 0; i < iz; ++i) {
                c = mix.charCodeAt(i);
                if (c < 0x80) { // ASCII(0x00 ~ 0x7f)
                    rv.push(c & 0x7f);
                } else if (c < 0x0800) {
                    rv.push(((c >>>  6) & 0x1f) | 0xc0, (c & 0x3f) | 0x80);
                } else if (c < 0xd800 || c > 0xdfff) {
                    rv.push(((c >>> 12) & 0x0f) | 0xe0,
                            ((c >>>  6) & 0x3f) | 0x80, (c & 0x3f) | 0x80);
                } else {
                    c = (((c - 0xd800) << 10) | (mix.charCodeAt(++i) - 0xdc00)) + 0x10000;
                    rv.push(((c >>> 18) | 0xf0), ((c >>> 12) & 0x3f) | 0x80,
                            ((c >>>  6) & 0x3f) | 0x80, (c & 0x3f) | 0x80);
                }
            }
            size = rv.length - pos - 1;

            if (size < 32) {
                rv[pos] = 0xa0 + size; // rewrite
            } else if (size < 0x10000) { // 16
                rv.splice(pos, 1, 0xda, size >> 8, size & 0xff);
            } else if (size < 0x100000000) { // 32
                rv.splice(pos, 1, 0xdb,
                          size >>> 24, (size >> 16) & 0xff,
                                       (size >>  8) & 0xff, size & 0xff);
            }
            break;
        default: // array or hash
            if (++depth >= _MAX_DEPTH) {
                _error = 1; // CYCLIC_REFERENCE_ERROR
                return rv = []; // clear
            }
            if (_isArray(mix)) {
                size = mix.length;
                if (size < 16) {
                    rv.push(0x90 + size);
                } else if (size < 0x10000) { // 16
                    rv.push(0xdc, size >> 8, size & 0xff);
                } else if (size < 0x100000000) { // 32
                    rv.push(0xdd, size >>> 24, (size >> 16) & 0xff,
                                               (size >>  8) & 0xff, size & 0xff);
                }
                for (i = 0; i < size; ++i) {
                    encode(rv, mix[i], depth);
                }
            } else if (_isFloat(mix)) { // force float
                c = mix.valueOf();
                // THX!! @edvakf
                // http://javascript.g.hatena.ne.jp/edvakf/20101128/1291000731
                sign = c < 0;
                sign && (c *= -1);

                // add offset 1023 to ensure positive
                // 0.6931471805599453 = Math.LN2;
                exp  = ((Math.log(c) / 0.6931471805599453) + 1023) | 0;

                // shift 52 - (exp - 1023) bits to make integer part exactly 53 bits,
                // then throw away trash less than decimal point
                frac = c * Math.pow(2, 52 + 1023 - exp);

                //  S+-Exp(11)--++-----------------Fraction(52bits)-----------------------+
                //  ||          ||                                                        |
                //  v+----------++--------------------------------------------------------+
                //  00000000|00000000|00000000|00000000|00000000|00000000|00000000|00000000
                //  6      5    55  4        4        3        2        1        8        0
                //  3      6    21  8        0        2        4        6
                //
                //  +----------high(32bits)-----------+ +----------low(32bits)------------+
                //  |                                 | |                                 |
                //  +---------------------------------+ +---------------------------------+
                //  3      2    21  1        8        0
                //  1      4    09  6
                low  = frac & 0xffffffff;
                sign && (exp |= 0x800);
                high = ((frac / 0x100000000) & 0xfffff) | (exp << 20);

                rv.push(0xcb, (high >> 24) & 0xff, (high >> 16) & 0xff,
                              (high >>  8) & 0xff,  high        & 0xff,
                              (low  >> 24) & 0xff, (low  >> 16) & 0xff,
                              (low  >>  8) & 0xff,  low         & 0xff);
            } else if (_isArrayBuffer(mix) || _isTypedArray(mix)) { // ArrayBuffer or TypedArray
                if (_isArrayBuffer(mix)) {
                    ui8a = new Uint8Array(mix);
                } else {
                    ui8a = new Uint8Array(mix.buffer);
                }
                size = ui8a.byteLength;
                if (size < 0x100) { // 8
                    rv.push(0xc4, size & 0xff);
                } else if (size < 0x10000) { // 16
                    rv.push(0xc4, size >> 8, size & 0xff);
                } else if (size < 0x100000000) { // 32
                    rv.push(0xc6, size >>> 24, (size >> 16) & 0xff, (size >>  8) & 0xff, size & 0xff);
                }
                for (i = 0; i < size; i++) {
                    rv.push(ui8a[i]);
                }
                delete ui8a; // make sure
            } else { // hash
                // http://d.hatena.ne.jp/uupaa/20101129
                pos = rv.length; // keep rewrite position
                rv.push(0); // placeholder
                size = 0;
                for (i in mix) {
                    ++size;
                    encode(rv, i,      depth);
                    encode(rv, mix[i], depth);
                }
                if (size < 16) {
                    rv[pos] = 0x80 + size; // rewrite
                } else if (size < 0x10000) { // 16
                    rv.splice(pos, 1, 0xde, size >> 8, size & 0xff);
                } else if (size < 0x100000000) { // 32
                    rv.splice(pos, 1, 0xdf,
                              size >>> 24, (size >> 16) & 0xff,
                                           (size >>  8) & 0xff, size & 0xff);
                }
            }
        }
    }
    return rv;
}

// inner - decoder
function decode() { // @return Mix:
    var size, i, iz, c, num = 0,
        sign, exp, frac, ary, hash,
        buf = _buf, type = buf[++_idx], buflen = buf.length, tmpr;

    if (type >= 0xe0) {             // Negative FixNum (111x xxxx) (-32 ~ -1)
        return type - 0x100;
    }
    if (type < 0xc0) {
        if (type < 0x80) {          // Positive FixNum (0xxx xxxx) (0 ~ 127)
            return type;
        }
        if (type < 0x90) {          // FixMap (1000 xxxx)
            num  = type - 0x80;
            type = 0x80;
        } else if (type < 0xa0) {   // FixArray (1001 xxxx)
            num  = type - 0x90;
            type = 0x90;
        } else { // if (type < 0xc0) {   // FixRaw (101x xxxx) => FixStr
            num  = type - 0xa0;
            type = 0xa0;
        }
    }
    switch (type) {
    case 0xc0:  return null;
    case 0xc2:  return false;
    case 0xc3:  return true;
    case 0xca:  // float
                if (buflen < _idx + 4 + 1) {
                    return;
                }
                num = buf[++_idx] * 0x1000000 + (buf[++_idx] << 16) +
                                                (buf[++_idx] <<  8) + buf[++_idx];
                sign =  num & 0x80000000;    //  1bit
                exp  = (num >> 23) & 0xff;   //  8bits
                frac =  num & 0x7fffff;      // 23bits
                if (!num || num === 0x80000000) { // 0.0 or -0.0
                    return 0;
                }
                if (exp === 0xff) { // NaN or Infinity
                    return frac ? NaN : Infinity;
                }
                return (sign ? -1 : 1) *
                            (frac | 0x800000) * Math.pow(2, exp - 127 - 23); // 127: bias
    case 0xcb:  // double
                if (buflen < _idx + 8 + 1) {
                    return;
                }
                num = buf[++_idx] * 0x1000000 + (buf[++_idx] << 16) +
                                                (buf[++_idx] <<  8) + buf[++_idx];
                sign =  num & 0x80000000;    //  1bit
                exp  = (num >> 20) & 0x7ff;  // 11bits
                frac =  num & 0xfffff;       // 52bits - 32bits (high word)
                if (!num || num === 0x80000000) { // 0.0 or -0.0
                    _idx += 4;
                    return 0;
                }
                if (exp === 0x7ff) { // NaN or Infinity
                    _idx += 4;
                    return frac ? NaN : Infinity;
                }
                num = buf[++_idx] * 0x1000000 + (buf[++_idx] << 16) +
                                                (buf[++_idx] <<  8) + buf[++_idx];
                return (sign ? -1 : 1) *
                            ((frac | 0x100000) * Math.pow(2, exp - 1023 - 20) // 1023: bias
                             + num * Math.pow(2, exp - 1023 - 52));
    // 0xcf: uint64, 0xce: uint32, 0xcd: uint16
    case 0xcf:
                if (buflen < _idx + 8 + 1) {
                    return;
                }
                num =  buf[++_idx] * 0x1000000 + (buf[++_idx] << 16) +
                                                 (buf[++_idx] <<  8) + buf[++_idx];
                return num * 0x100000000 +
                       buf[++_idx] * 0x1000000 + (buf[++_idx] << 16) +
                                                 (buf[++_idx] <<  8) + buf[++_idx];
    case 0xce:
                if (buflen < _idx + 4 + 1) {
                    return;
                }
                num += buf[++_idx] * 0x1000000 + (buf[++_idx] << 16);
    case 0xcd:
                if (buflen < _idx + 2 + 1) {
                    return;
                }
                num += buf[++_idx] << 8;
    case 0xcc:
                if (buflen < _idx + 1 + 1) {
                    return;
                }
                return num + buf[++_idx];
    // 0xd3: int64, 0xd2: int32, 0xd1: int16, 0xd0: int8
    case 0xd3:
                if (buflen < _idx + 8 + 1) {
                    return;
                }
                num = buf[++_idx];
                if (num & 0x80) { // sign -> avoid overflow
                    return ((num         ^ 0xff) * 0x100000000000000 +
                            (buf[++_idx] ^ 0xff) *   0x1000000000000 +
                            (buf[++_idx] ^ 0xff) *     0x10000000000 +
                            (buf[++_idx] ^ 0xff) *       0x100000000 +
                            (buf[++_idx] ^ 0xff) *         0x1000000 +
                            (buf[++_idx] ^ 0xff) *           0x10000 +
                            (buf[++_idx] ^ 0xff) *             0x100 +
                            (buf[++_idx] ^ 0xff) + 1) * -1;
                }
                return num         * 0x100000000000000 +
                       buf[++_idx] *   0x1000000000000 +
                       buf[++_idx] *     0x10000000000 +
                       buf[++_idx] *       0x100000000 +
                       buf[++_idx] *         0x1000000 +
                       buf[++_idx] *           0x10000 +
                       buf[++_idx] *             0x100 +
                       buf[++_idx];
    case 0xd2:
                if (buflen < _idx + 4 + 1) {
                    return;
                }
                num  =  buf[++_idx] * 0x1000000 + (buf[++_idx] << 16) +
                       (buf[++_idx] << 8) + buf[++_idx];
                return num < 0x80000000 ? num : num - 0x100000000; // 0x80000000 * 2
    case 0xd1:
                if (buflen < _idx + 2 + 1) {
                    return;
                }
                num  = (buf[++_idx] << 8) + buf[++_idx];
                return num < 0x8000 ? num : num - 0x10000; // 0x8000 * 2
    case 0xd0:
                if (buflen < _idx + 1 + 1) {
                    return;
                }
                num  =  buf[++_idx];
                return num < 0x80 ? num : num - 0x100; // 0x80 * 2
    // 0xdb: str32
    case 0xdb:
                if (buflen < _idx + 4 + 1) {
                    return;
                }
                num +=  buf[++_idx] * 0x1000000 + (buf[++_idx] << 16);
    // 0xda: str16
    case 0xda:
                if (buflen < _idx + 2 + 1) {
                    return;
                }
                num += (buf[++_idx] << 8);
    // 0xd9: str8
    case 0xd9:
                if (buflen < _idx + 1) {
                    return;
                }
                num += buf[++_idx];
    // 0xa0: fixraw ( fixstr )
    case 0xa0:  // utf8.decode
                if (buflen < _idx + num + 1) {
                    return;
                }
                for (ary = [], i = _idx, iz = i + num; i < iz; ) {
                    c = buf[++i]; // lead byte
                    if (c >= 0xf0) {
                        // binary code point - 0x10000
                        tmpr = ((c        & 0x03) << 18 | (buf[++i] & 0x3f) << 12 |
                                (buf[++i] & 0x3f) <<  6 | (buf[++i] & 0x3f)) - 0x10000;
                        ary.push(0xd800 + (tmpr >> 10));
                        ary.push(0xdc00 + (tmpr & 0x3ff));
                    } else {
                        ary.push(c < 0x80 ? c : // ASCII(0x00 ~ 0x7f)
                                 c < 0xe0 ? ((c & 0x1f) <<  6 | (buf[++i] & 0x3f)) :
                                            ((c & 0x0f) << 12 | (buf[++i] & 0x3f) << 6
                                                              | (buf[++i] & 0x3f)));
                    }
                }
                _idx = i;
                return ary.length < 10240 ? _toString.apply(null, ary)
                                          : byteArrayToByteString(ary);
    // 0xc6: bin32
    case 0xc6:
                if (buflen < _idx + 4 + 1) {
                    return;
                }
                num +=  buf[++_idx] * 0x1000000 + (buf[++_idx] << 16);
    // 0xc5: bin16
    case 0xc5:
                if (buflen < _idx + 2 + 1) {
                    return;
                }
                num += (buf[++_idx] << 8);
    // 0xc4: bin8
    case 0xc4:
                if (buflen < _idx + 1) {
                    return;
                }
                num += buf[++_idx];
                if (buflen < _idx + num + 1) {
                    return;
                }
                for (ary = [], i = _idx, iz = i + num; i < iz; ) {
                    c = buf[++i]; // lead byte
                    ary.push(c);
                }
                _idx = i;
                return ary.length < 10240 ? _toString.apply(null, ary)
                                          : byteArrayToByteString(ary);
    // 0xdf: map32, 0xde: map16, 0x80: map
    case 0xdf:
                if (buflen < _idx + 4 + 1) {
                    return;
                }
                num +=  buf[++_idx] * 0x1000000 + (buf[++_idx] << 16);
    case 0xde:
                if (buflen < _idx + 2 + 1) {
                    return;
                }
                num += (buf[++_idx] << 8)       +  buf[++_idx];
    case 0x80:  hash = {};
                while (num--) {
                    if (buflen < _idx + 1 + 1) {
                        return;
                    }
                    // https://github.com/gochat-us/msgpack.js/commit/5201e722122cc57635380aa30f743710599dce8d
                    // make key/value pair
                    tmpr = decode();
                    if (tmpr === undefined) {
                        return;
                    }
                    var tmpkey = tmpr;
                    tmpr = decode();
                    if (tmpr === undefined) {
                        return;
                    }
                    hash[tmpkey] = tmpr;
                }
                return hash;
    // 0xdd: array32, 0xdc: array16, 0x90: array
    case 0xdd:
                if (buflen < _idx + 4 + 1) {
                    return;
                }
                num +=  buf[++_idx] * 0x1000000 + (buf[++_idx] << 16);
    case 0xdc:
                if (buflen < _idx + 2 + 1) {
                    return;
                }
                num += (buf[++_idx] << 8)       +  buf[++_idx];
    case 0x90:  ary = [];
                while (num--) {
                    tmpr = decode();
                    if (tmpr === undefined) {
                        return;
                    }
                    ary.push(tmpr);
                }
                return ary;
    }
    return;
}

// inner - byteArray To ByteString
function byteArrayToByteString(byteArray) { // @param ByteArray
                                            // @return String
    // http://d.hatena.ne.jp/uupaa/20101128
    try {
        var byteString = _toString.apply(this, byteArray); // toString
        if (byteArray.length != byteString.length) {
            throw 'toString failed';
        }
        return byteString;
    } catch(err) {
        ; // avoid "Maximum call stack size exceeded"
    }
    var rv = [], i = 0, iz = byteArray.length, num2bin = _num2bin;

    for (; i < iz; ++i) {
        rv[i] = num2bin[byteArray[i]];
    }
    return rv.join("");
}

// inner - BinaryString To ByteArray
function toByteArray(data) { // @param BinaryString: "\00\01"
                             // @return ByteArray: [0x00, 0x01]
    var rv = [], bin2num = _bin2num, remain,
        ary = data.split(""),
        i = -1, iz;

    iz = ary.length;
    remain = iz % 8;

    while (remain--) {
        ++i;
        rv[i] = bin2num[ary[i]];
    }
    remain = iz >> 3;
    while (remain--) {
        rv.push(bin2num[ary[++i]], bin2num[ary[++i]],
                bin2num[ary[++i]], bin2num[ary[++i]],
                bin2num[ary[++i]], bin2num[ary[++i]],
                bin2num[ary[++i]], bin2num[ary[++i]]);
    }
    return rv;
}

// --- init ---
(function() {
    var i = 0, v;

    for (; i < 0x100; ++i) {
        v = _toString(i);
        _bin2num[v] = i; // "\00" -> 0x00
        _num2bin[i] = v; //     0 -> "\00"
    }
    // http://twitter.com/edvakf/statuses/15576483807
    for (i = 0x80; i < 0x100; ++i) { // [Webkit][Gecko]
        _bin2num[_toString(0xf700 + i)] = i; // "\f780" -> 0x80
    }
})();

})(this);
