// linear.test.js

// linear.base64 test
LinearBase64Test = TestCase('linear.base64');

LinearBase64Test.prototype.testEncode = function() {
    var result, flag = false;

    try {
        result = linear.base64.encode();
    } catch (x) {
        flag = true;
    }
    assertEquals(true, flag);
    flag = false;

    try {
        result = linear.base64.encode({a: 1});
    } catch (x) {
        flag = true;
    }
    assertEquals(true, flag);
    flag = false;

    try {
        result = linear.base64.encode([0,1,2]);
    } catch (x) {
        flag = true;
    }
    assertEquals(true, flag);
    flag = false;

    var str1 = 'hel', str2 = 'hell', str3 = 'hello';
    var exp_str1 = 'aGVs', exp_str2 = 'aGVsbA==', exp_str3 = 'aGVsbG8=';

    try {
        result = linear.base64.encode(str1);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_str1, result);
    try {
        result = linear.base64.encode(str2);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_str2, result);
    try {
        result = linear.base64.encode(str3);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_str3, result);

    var tobinstr = function(a) {return String.fromCharCode.apply(null, a);};
    var binstr1 = tobinstr([0]), binstr2 = tobinstr([0,1]), binstr3 = tobinstr([0,1,2]);
    var exp_binstr1 = 'AA==', exp_binstr2 = 'AAE=', exp_binstr3 = 'AAEC';

    try {
        result = linear.base64.encode(binstr1);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_binstr1, result);
    try {
        result = linear.base64.encode(binstr2);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_binstr2, result);
    try {
        result = linear.base64.encode(binstr3);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_binstr3, result);
};

LinearBase64Test.prototype.testDecode = function() {
    var result, flag = false;

    try {
        result = linear.base64.decode();
    } catch (x) {
        flag = true;
    }
    assertEquals(true, flag);
    flag = false;

    try {
        result = linear.base64.decode({a: 1});
    } catch (x) {
        flag = true;
    }
    assertEquals(true, flag);
    flag = false;

    try {
        result = linear.base64.decode('hello-!!');
    } catch (x) {
        flag = true;
    }
    assertEquals(true, flag);
    flag = false;

    try {
        result = linear.base64.decode('aGVsbA===');
    } catch (x) {
        flag = true;
    }
    assertEquals(true, flag);
    flag = false;

    try {
        result = linear.base64.decode('=aGVsbA=');
    } catch (x) {
        flag = true;
    }
    assertEquals(true, flag);
    flag = false;

    var exp_str1 = 'hel', exp_str2 = 'hell', exp_str3 = 'hello';
    var str1 = 'aGVs', str2 = 'aGVsbA==', str3 = 'aGVsbG8=';

    try {
        result = linear.base64.decode(str1);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_str1, result);
    try {
        result = linear.base64.decode(str2);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_str2, result);
    try {
        result = linear.base64.decode(str3);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_str3, result);

    var tobinstr = function(a) {return String.fromCharCode.apply(null, a);};
    var exp_binstr1 = tobinstr([0]), exp_binstr2 = tobinstr([0,1]), exp_binstr3 = tobinstr([0,1,2]);
    var binstr1 = 'AA==', binstr2 = 'AAE=', binstr3 = 'AAEC';

    try {
        result = linear.base64.decode(binstr1);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_binstr1, result);
    try {
        result = linear.base64.decode(binstr2);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_binstr2, result);
    try {
        result = linear.base64.decode(binstr3);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_binstr3, result);
};

// linear.btoa test
LinearBtoaTest = TestCase('linear.btoa');

LinearBtoaTest.prototype.testBtoa = function() {
    var result, flag = false;

    try {
        result = linear.btoa();
    } catch (x) {
        flag = true;
    }
    assertEquals(true, flag);
    flag = false;

    try {
        result = linear.btoa({a: 1});
    } catch (x) {
        flag = true;
    }
    assertEquals(true, flag);
    flag = false;

    try {
        result = linear.btoa([0,1,2]);
    } catch (x) {
        flag = true;
    }
    assertEquals(true, flag);
    flag = false;

    var str1 = 'hel', str2 = 'hell', str3 = 'hello';
    var exp_str1 = 'aGVs', exp_str2 = 'aGVsbA==', exp_str3 = 'aGVsbG8=';

    try {
        result = linear.btoa(str1);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_str1, result);
    try {
        result = linear.btoa(str2);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_str2, result);
    try {
        result = linear.btoa(str3);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_str3, result);

    var tobinstr = function(a) {return String.fromCharCode.apply(null, a);};
    var binstr1 = tobinstr([0]), binstr2 = tobinstr([0,1]), binstr3 = tobinstr([0,1,2]);
    var exp_binstr1 = 'AA==', exp_binstr2 = 'AAE=', exp_binstr3 = 'AAEC';

    try {
        result = linear.btoa(binstr1);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_binstr1, result);
    try {
        result = linear.btoa(binstr2);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_binstr2, result);
    try {
        result = linear.btoa(binstr3);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_binstr3, result);
};

// linear.atob test
LinearAtobTest = TestCase('linear.atob');

LinearAtobTest.prototype.testAtob = function() {
    var result, flag = false;

    try {
        result = linear.atob();
    } catch (x) {
        flag = true;
    }
    assertEquals(true, flag);
    flag = false;

    try {
        result = linear.atob({a: 1});
    } catch (x) {
        flag = true;
    }
    assertEquals(true, flag);
    flag = false;

    try {
        result = linear.atob('hello-!!');
    } catch (x) {
        flag = true;
    }
    assertEquals(true, flag);
    flag = false;

    var exp_str1 = 'hel', exp_str2 = 'hell', exp_str3 = 'hello';
    var str1 = 'aGVs', str2 = 'aGVsbA==', str3 = 'aGVsbG8=';

    try {
        result = linear.atob(str1);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_str1, result);
    try {
        result = linear.atob(str2);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_str2, result);
    try {
        result = linear.atob(str3);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_str3, result);

    var tobinstr = function(a) {return String.fromCharCode.apply(null, a);};
    var exp_binstr1 = tobinstr([0]), exp_binstr2 = tobinstr([0,1]), exp_binstr3 = tobinstr([0,1,2]);
    var binstr1 = 'AA==', binstr2 = 'AAE=', binstr3 = 'AAEC';

    try {
        result = linear.atob(binstr1);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_binstr1, result);
    try {
        result = linear.atob(binstr2);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_binstr2, result);
    try {
        result = linear.atob(binstr3);
    } catch (x) {
        fail('throw ng');
    }
    assertEquals(exp_binstr3, result);
};

// linear.extend test
LinearExtendTest = TestCase('linear.extend');

LinearExtendTest.prototype.testExtend = function() {
    function foo() {
        this.val = 1;
    }
    function bar() {
        this.method = function() {};
        return linear.extend(foo, this);
    }
    function baz() {
        this.val = 2;
        return linear.extend(foo, this);
    }

    var inst;
    inst = new bar();
    assertEquals(1, inst.val);
    assertEquals('function', typeof inst.method);
    inst = new baz();
    assertEquals(2, inst.val);
};

// linear.codec test
LinearCodecTest = TestCase('linear.codec');

LinearCodecTest.prototype.testInstantiate = function() {
    var codec;

    codec = new linear.codec();
    assertEquals(undefined, codec.type);
    assertEquals('function', typeof codec.encode);
    assertEquals('function', typeof codec.decode);
    assertEquals('function', typeof codec.refresh);
    codec.refresh();
};

LinearCodecTest.prototype.testEncode = function() {
    var codec, hello = 'hello';

    codec = new linear.codec();
    assertEquals(hello, codec.encode(hello));
    codec.refresh();
};

LinearCodecTest.prototype.testDecode = function() {
    var codec, hello = 'hello';

    codec = new linear.codec();
    assertEquals(hello, codec.decode(hello));
    codec.refresh();
};

// linear.codec.plain test
LinearCodecPlainTest = TestCase('linear.codec.plain');

LinearCodecPlainTest.prototype.testInstantiate = function() {
    var codec;

    codec = new linear.codec.plain();
    assertEquals('plain', codec.type);
    assertEquals('function', typeof codec.encode);
    assertEquals('function', typeof codec.decode);
    assertEquals('function', typeof codec.refresh);
    codec.refresh();
};

LinearCodecPlainTest.prototype.testEncode = function() {
    var codec, hello = 'hello';

    codec = new linear.codec.plain();
    assertEquals(hello, codec.encode(hello));
    codec.refresh();
};

LinearCodecPlainTest.prototype.testDecode = function() {
    var codec, hello = 'hello';

    codec = new linear.codec.plain();
    assertEquals(hello, codec.decode(hello));
    codec.refresh();
};

// linear.codec.msgpack test
LinearCodecMsgpackTest = TestCase('linear.codec.msgpack');

LinearCodecMsgpackTest.prototype.testInstantiate = function() {
    var codec;

    codec = new linear.codec.msgpack();
    assertEquals('msgpack', codec.type);
    assertEquals('function', typeof codec.encode);
    assertEquals('function', typeof codec.decode);
    assertEquals('function', typeof codec.refresh);
    codec.refresh();
};

LinearCodecMsgpackTest.prototype.testEncode = function() {
    var codec, hello = 'hello', complex = [-1, 0, 1.1, 'string', {key: 'val'}, [0,1]];

    codec = new linear.codec.msgpack();
    assertEquals(msgpack.pack(hello), codec.encode(hello));
    assertEquals(msgpack.pack(complex), codec.encode(complex));
    codec.refresh();
};

LinearCodecMsgpackTest.prototype.testDecode = function() {
    var codec, hello = 'hello', encoded, partial, result;
    var complex = [-1, 0, 1.1, 'string', {key: 'val'}, [0,1]];

    codec = new linear.codec.msgpack();
    encoded = Array.prototype.slice.call(msgpack.pack(hello));

    // single
    assertEquals([hello], codec.decode(encoded));

    // double
    assertEquals([hello, hello], codec.decode(encoded.concat(encoded)));

    //partial
    partial = encoded.slice(0, -1);
    assertEquals([], codec.decode(partial));
    partial = encoded.slice(-1);
    assertEquals([hello], codec.decode(partial));

    partial = encoded.concat(encoded).slice(0, -1);
    assertEquals([hello], codec.decode(partial));
    partial = encoded.concat(encoded).slice(-1);
    assertEquals([hello], codec.decode(partial));

    // valid NUL response
    encoded = [148, 1, 0, 192, 160];
    result = codec.decode(encoded);
    assertEquals([[1, 0, null, '']], result);

    // complex
    encoded = Array.prototype.slice.call(msgpack.pack(complex));
    assertEquals([complex], codec.decode(encoded));

    codec.refresh();
};

LinearCodecMsgpackTest.prototype.testRefresh = function() {
    var codec, hello = 'hello', encoded, partial;

    codec = new linear.codec.msgpack();
    encoded = Array.prototype.slice.call(msgpack.pack(hello));

    //partial
    partial = encoded.slice(0, -1);
    assertEquals([], codec.decode(partial));
    // clear buffer
    codec.refresh();
    assertEquals([hello], codec.decode(encoded));

    codec.refresh();
};

// linear.protocol test
LinearProtocolTest = TestCase('linear.protocol');

LinearProtocolTest.prototype.testInstantiate = function() {
    var protocol;

    protocol = new linear.protocol();
    assertEquals(undefined, protocol.type);
    assertEquals(undefined, protocol.codec);
    assertEquals('function', typeof protocol.request);
    assertEquals('function', typeof protocol.response);
    assertEquals('function', typeof protocol.notify);
    assertEquals('function', typeof protocol.onmessage);
    assertEquals('function', typeof protocol.reset);
    protocol.reset();
};

LinearProtocolTest.prototype.testRequest = function() {
    var protocol, flag = false;

    protocol = new linear.protocol();
    try {
        protocol.request();
    } catch (x) {
        flag = true;
        assertEquals('method is not allowed', x.message);
    }
    assertEquals(true, flag);
    protocol.reset();
};

LinearProtocolTest.prototype.testResponse = function() {
    var protocol, flag = false;

    protocol = new linear.protocol();
    try {
        protocol.response();
    } catch (x) {
        flag = true;
        assertEquals('method is not allowed', x.message);
    }
    assertEquals(true, flag);
    protocol.reset();
};

LinearProtocolTest.prototype.testNotify = function() {
    var protocol, flag = false;

    protocol = new linear.protocol();
    try {
        protocol.notify();
    } catch (x) {
        flag = true;
        assertEquals('method is not allowed', x.message);
    }
    assertEquals(true, flag);
    protocol.reset();
};

LinearProtocolTest.prototype.testOnmessage = function() {
    var protocol, hello = 'hello';

    protocol = new linear.protocol();
    assertEquals(hello, protocol.onmessage(hello));
    protocol.reset();
};

// linear.protocol.plain test
LinearProtocolPlainTest = TestCase('linear.protocol.plain');

LinearProtocolPlainTest.prototype.testInstantiate = function() {
    var protocol;

    protocol = new linear.protocol.plain();
    assertEquals('plain', protocol.type);
    assertNotNull(protocol.codec);
    assertEquals('plain', protocol.codec.type);
    assertEquals('function', typeof protocol.request);
    assertEquals('function', typeof protocol.response);
    assertEquals('function', typeof protocol.notify);
    assertEquals('function', typeof protocol.onmessage);
    protocol.reset();
};

LinearProtocolPlainTest.prototype.testRequest = function() {
    var protocol, flag = false;

    protocol = new linear.protocol.plain();
    try {
        protocol.request();
    } catch (x) {
        flag = true;
        assertEquals('method is not allowed', x.message);
    }
    assertEquals(true, flag);
    protocol.reset();
};

LinearProtocolPlainTest.prototype.testResponse = function() {
    var protocol, flag = false;

    protocol = new linear.protocol.plain();
    try {
        protocol.response();
    } catch (x) {
        flag = true;
        assertEquals('method is not allowed', x.message);
    }
    assertEquals(true, flag);
    protocol.reset();
};

LinearProtocolPlainTest.prototype.testNotify = function() {
    var protocol, flag = false;

    protocol = new linear.protocol.plain();
    try {
        protocol.notify();
    } catch (x) {
        flag = true;
        assertEquals('method is not allowed', x.message);
    }
    assertEquals(true, flag);
    protocol.reset();
};

// linear.protocol.linear test
LinearProtocolLinearTest = TestCase('linear.protocol.linear');

LinearProtocolLinearTest.prototype.testInstantiate = function() {
    var protocol;

    protocol = new linear.protocol.linear();
    assertEquals('linear', protocol.type);
    assertNotNull(protocol.codec);
    assertEquals('msgpack', protocol.codec.type);
    assertEquals(0, protocol.msgid);
    assertEquals({}, protocol.requests);
    assertEquals('function', typeof protocol.request);
    assertEquals('function', typeof protocol.response);
    assertEquals('function', typeof protocol.notify);
    assertEquals('function', typeof protocol.onmessage);
    protocol.reset();
};

LinearProtocolLinearTest.prototype.testRequest = function() {
    var protocol, method = '', params = [];

    protocol = new linear.protocol.linear();
    assertEquals(undefined, protocol.request());
    assertEquals(undefined, protocol.request({}));
    assertEquals(undefined, protocol.request({method: method}));
    assertEquals(undefined, protocol.request({params: params}));
    protocol.msgid = 0x0ffffffff;
    assertEquals({id: 0, data: msgpack.pack([0, 0, method, params]), timeout: 30000},
                  protocol.request({method: method, params: params}));
    assertEquals({id: 1, data: msgpack.pack([0, 1, method, params]), timeout: 30000},
                  protocol.request({method: method, params: params}));
    protocol.reset();
};

LinearProtocolLinearTest.prototype.testResponse = function() {
    var protocol, e = undefined, r = undefined;

    protocol = new linear.protocol.linear();
    assertEquals(undefined, protocol.response());
    assertEquals(undefined, protocol.response({}));
    assertEquals(undefined, protocol.response({error: e}));
    assertEquals(undefined, protocol.request({result: r}));
    assertEquals(msgpack.pack([1, 0, e, r]),
                 protocol.response({id: 0, error: e, result: r}));
    e = {code: 404, message: 'Service Unavailable'};
    assertEquals(msgpack.pack([1, 1, e, undefined]),
                 protocol.response({id: 1, error: e}));
    r = 'Hello Response';
    assertEquals(msgpack.pack([1, 2, undefined, r]),
                 protocol.response({id: 2, result: r}));
    protocol.reset();
};

LinearProtocolLinearTest.prototype.testNotify = function() {
    var protocol, name = '', data = [];

    protocol = new linear.protocol.linear();
    assertEquals(undefined, protocol.notify());
    assertEquals(undefined, protocol.notify({}));
    assertEquals(undefined, protocol.notify({name: name}));
    assertEquals(undefined, protocol.notify({data: data}));
    assertEquals(msgpack.pack([2, name, data]),
                 protocol.notify({name: name, data: data}));
    protocol.reset();
};

LinearProtocolLinearTest.prototype.testOnmessage = function() {
    var protocol, hello = 'hello-!!';
    var request_array, response1_array, response2_array, notification_array, flag1 = false, flag2 = false;
    var method = 'echo', params = undefined, name = 'notify', data = undefined;

    request_array = Array.prototype.slice.call(msgpack.pack([0, 10, method, params]));
    response1_array = Array.prototype.slice.call(msgpack.pack([1, 0, null, hello]));
    response2_array = Array.prototype.slice.call(msgpack.pack([1, 1, null, hello]));
    notification_array = Array.prototype.slice.call(msgpack.pack([2, name, data]));

    protocol = new linear.protocol.linear();

    // receive invalid data
    assertEquals([], protocol.onmessage(hello));
    
    // receive response array
    // not set onresponse and with single response
    protocol.requests[0] = {};
    assertEquals([{type: 'response', data: {id: 0, error: null, result: hello}}],
                 protocol.onmessage(response1_array));
    assertEquals(undefined, protocol.requests[0]);

    // not set onresponse and with multi response
    protocol.requests[0] = {};
    protocol.requests[1] = {};
    assertEquals([{type: 'response', data: {id: 0, error: null, result: hello}},
                  {type: 'response', data: {id: 1, error: null, result: hello}}],
                 protocol.onmessage(response1_array.concat(response2_array)));
    assertEquals(undefined, protocol.requests[0]);
    assertEquals(undefined, protocol.requests[1]);

    // set onresponse and with single response
    protocol.requests[0] = {};
    protocol.requests[0].onresponse = function(resp) {
        flag1 = true;
        assertEquals({id: 0, error: null, result: hello}, resp);  
    };
    assertEquals([], protocol.onmessage(response1_array));
    assertEquals(true, flag1);
    assertEquals(undefined, protocol.requests[0]);
    flag1 = false;

    // set onresponse and with multi response
    protocol.requests[0] = {};
    protocol.requests[1] = {};
    protocol.requests[0].onresponse = function(resp) {
        flag1 = true;
        assertEquals({id: 0, error: null, result: hello}, resp);  
    };
    protocol.requests[1].onresponse = function(resp) {
        flag2 = true;
        assertEquals({id: 1, error: null, result: hello}, resp);  
    };
    assertEquals([], protocol.onmessage(response1_array.concat(response2_array)));
    assertEquals(true, flag1);
    assertEquals(true, flag2);
    assertEquals(undefined, protocol.requests[0]);
    assertEquals(undefined, protocol.requests[1]);
    flag1 = false;
    flag2 = false;

    // receive response arraybuffer
    if (typeof Uint8Array !== 'undefined') {
        var request_arraybuffer = new Uint8Array(request_array).buffer;
        var response1_arraybuffer = new Uint8Array(response1_array).buffer;
        var response2_arraybuffer = new Uint8Array(response2_array).buffer;
        var notification_arraybuffer = new Uint8Array(notification_array).buffer;
        var tmp_arraybuffer = new Uint8Array(response1_array.concat(response2_array)).buffer;

        // not set onresponse and with single response
        protocol.requests[0] = {};
        assertEquals([{type: 'response', data: {id: 0, error: null, result: hello}}],
                     protocol.onmessage(response1_arraybuffer));
        assertEquals(undefined, protocol.requests[0]);

        // not set onresponse and with multi response
        protocol.requests[0] = {};
        protocol.requests[1] = {};
        assertEquals([{type: 'response', data: {id: 0, error: null, result: hello}},
                      {type: 'response', data: {id: 1, error: null, result: hello}}],
                     protocol.onmessage(tmp_arraybuffer));
        assertEquals(undefined, protocol.requests[0]);
        assertEquals(undefined, protocol.requests[1]);

        // set onresponse and with single response
        protocol.requests[0] = {};
        protocol.requests[0].onresponse = function(resp) {
            flag1 = true;
            assertEquals({id: 0, error: null, result: hello}, resp);  
        };
        assertEquals([], protocol.onmessage(response1_arraybuffer));
        assertEquals(true, flag1);
        assertEquals(undefined, protocol.requests[0]);
        flag1 = false;

        // set onresponse and with multi response
        protocol.requests[0] = {};
        protocol.requests[1] = {};
        protocol.requests[0].onresponse = function(resp) {
            flag1 = true;
            assertEquals({id: 0, error: null, result: hello}, resp);  
        };
        protocol.requests[1].onresponse = function(resp) {
            flag2 = true;
            assertEquals({id: 1, error: null, result: hello}, resp);  
        };
        assertEquals([], protocol.onmessage(tmp_arraybuffer));
        assertEquals(true, flag1);
        assertEquals(true, flag2);
        assertEquals(undefined, protocol.requests[0]);
        assertEquals(undefined, protocol.requests[1]);
        flag1 = false;
        flag2 = false;
    }

    // receive response base64 encoded string
    // not set onresponse and with single response
    var request_string_b64 = linear.btoa(String.fromCharCode.apply(null, request_array));
    var response1_string_b64 = linear.btoa(String.fromCharCode.apply(null, response1_array));
    var response2_string_b64 = linear.btoa(String.fromCharCode.apply(null, response2_array));
    var notification_string_b64 = linear.btoa(String.fromCharCode.apply(null, notification_array));
    var tmp_string_b64 = linear.btoa(
        String.fromCharCode.apply(null, response1_array.concat(response2_array)));

    protocol.requests[0] = {};
    assertEquals([{type: 'response', data: {id: 0, error: null, result: hello}}],
                 protocol.onmessage(response1_string_b64));
    assertEquals(undefined, protocol.requests[0]);

    // not set onresponse and with multi response
    protocol.requests[0] = {};
    protocol.requests[1] = {};
    assertEquals([{type: 'response', data: {id: 0, error: null, result: hello}},
                  {type: 'response', data: {id: 1, error: null, result: hello}}],
                 protocol.onmessage(tmp_string_b64));
    assertEquals(undefined, protocol.requests[0]);
    assertEquals(undefined, protocol.requests[1]);

    // set onresponse and with single response
    protocol.requests[0] = {};
    protocol.requests[0].onresponse = function(resp) {
        flag1 = true;
        assertEquals({id: 0, error: null, result: hello}, resp);  
    };
    assertEquals([], protocol.onmessage(response1_string_b64));
    assertEquals(true, flag1);
    assertEquals(undefined, protocol.requests[0]);
    flag1 = false;

    // set onresponse and with multi response
    protocol.requests[0] = {};
    protocol.requests[1] = {};
    protocol.requests[0].onresponse = function(resp) {
        flag1 = true;
        assertEquals({id: 0, error: null, result: hello}, resp);  
    };
    protocol.requests[1].onresponse = function(resp) {
        flag2 = true;
        assertEquals({id: 1, error: null, result: hello}, resp);  
    };
    assertEquals([], protocol.onmessage(tmp_string_b64));
    assertEquals(true, flag1);
    assertEquals(true, flag2);
    assertEquals(undefined, protocol.requests[0]);
    assertEquals(undefined, protocol.requests[1]);
    flag1 = false;
    flag2 = false;

    // receive request
    assertEquals([{type: 'request', data: {id: 10, method: method, params: params}}],
                 protocol.onmessage(request_array));

     // receive request b64
    assertEquals([{type: 'request', data: {id: 10, method: method, params: params}}],
                 protocol.onmessage(request_string_b64));

    // receive request arraybuffer
    if (typeof Uint8Array !== 'undefined') {
        assertEquals([{type: 'request', data: {id: 10, method: method, params: params}}],
                     protocol.onmessage(request_arraybuffer));
    }
    
    // receive notify
    assertEquals([{type: 'notify', data: {name: name, data: data}}],
                 protocol.onmessage(notification_array));

     // receive notify b64
    assertEquals([{type: 'notify', data: {name: name, data: data}}],
                 protocol.onmessage(notification_string_b64));

    // receive notify arraybuffer
    if (typeof Uint8Array !== 'undefined') {
        assertEquals([{type: 'notify', data: {name: name, data: data}}],
                     protocol.onmessage(notification_arraybuffer));
    }

    protocol.reset();
};

// linear.transport test
LinearTransportTest = TestCase('linear.transport');

LinearTransportTest.prototype.testInstantiate = function() {
    var transport;

    transport = new linear.transport();
    assertEquals('disconnected', transport.state);
    assertEquals([], transport.sendbuffer);
    assertNotNull(transport.num2bin);
};

LinearTransportTest.prototype.testCreate = function() {
    var transport;
    var type, host, port, channel, path, url;

    // default
    host = location.hostname;
    port = location.port;
    channel = 'linear';
    url = 'ws://' + host + ':' + port + '/' + channel;
    transport = linear.transport.create();
    assertEquals('websocket', transport.type);
    assertNotNull(transport.entry);
    assertEquals(url, transport.entry.url);
    assertEquals('/' + channel, transport.entry.channel);
    assertEquals(undefined, transport.entry.options);

    // defined host
    host = '192.168.0.1';
    port = location.port;
    channel = 'linear';
    url = 'ws://' + host + ':' + port + '/' + channel;
    transport = linear.transport.create({host: host});
    assertEquals('websocket', transport.type);
    assertNotNull(transport.entry);
    assertEquals(url, transport.entry.url);
    assertEquals('/' + channel, transport.entry.channel);
    assertEquals(undefined, transport.entry.options);

    // defined port
    host = location.hostname;
    port = 80;
    channel = 'linear';
    url = 'ws://' + host + '/' + channel;
    transport = linear.transport.create({port: port});
    assertEquals('websocket', transport.type);
    assertNotNull(transport.entry);
    assertEquals(url, transport.entry.url);
    assertEquals('/' + channel, transport.entry.channel);
    assertEquals(undefined, transport.entry.options);

    host = location.hostname;
    port = 8000;
    channel = 'linear';
    url = 'ws://' + host + ':' + port + '/' + channel;
    transport = linear.transport.create({port: port});
    assertEquals('websocket', transport.type);
    assertNotNull(transport.entry);
    assertEquals(url, transport.entry.url);
    assertEquals('/' + channel, transport.entry.channel);
    assertEquals(undefined, transport.entry.options);

    // defined channel
    host = location.hostname;
    port = location.port;
    channel = 'linear2';
    url = 'ws://' + host + ':' + port + '/' + channel;
    transport = linear.transport.create({channel: channel});
    assertEquals('websocket', transport.type);
    assertNotNull(transport.entry);
    assertEquals(url, transport.entry.url);
    assertEquals('/' + channel, transport.entry.channel);
    assertEquals(undefined, transport.entry.options);

    // not defined usessl
    host = location.hostname;
    port = location.port;
    channel = 'linear';
    url = 'ws://' + host + ':' + port + '/' + channel;
    transport = linear.transport.create({usessl: false});
    assertEquals('websocket', transport.type);
    assertNotNull(transport.entry);
    assertEquals(url, transport.entry.url);
    assertEquals('/' + channel, transport.entry.channel);
    assertEquals(undefined, transport.entry.options);

    // defined usessl
    host = location.hostname;
    port = location.port;
    channel = 'linear';
    url = 'wss://' + host + ':' + port + '/' + channel;
    transport = linear.transport.create({usessl: true});
    assertEquals('websocket', transport.type);
    assertNotNull(transport.entry);
    assertEquals(url, transport.entry.url);
    assertEquals('/' + channel, transport.entry.channel);
    assertEquals(undefined, transport.entry.options);

    // type longpoll
    // default
    type = 'polling';
    host = location.hostname;
    port = location.port;
    path = 'cgi/linear.fcgi';
    channel = 'linear';
    url = 'http://' + host + ':' + port + '/' + path;
    transport = linear.transport.create({type: type});
    assertEquals(type, transport.type);
    assertNotNull(transport.entry);
    assertEquals(url, transport.entry.url);
    assertEquals('/' + channel, transport.entry.channel);
    assertEquals(undefined, transport.entry.options);

    // defined host
    type = 'polling';
    host = '192.168.0.1';
    port = location.port;
    path = 'cgi/linear.fcgi';
    channel = 'linear';
    url = 'http://' + host + ':' + port + '/' + path;
    transport = linear.transport.create({type: type, host: host});
    assertEquals(type, transport.type);
    assertNotNull(transport.entry);
    assertEquals(url, transport.entry.url);
    assertEquals('/' + channel, transport.entry.channel);
    assertEquals(undefined, transport.entry.options);

    // defined port
    type = 'polling';
    host = location.hostname;
    port = 80;
    path = 'cgi/linear.fcgi';
    channel = 'linear';
    url = 'http://' + host + '/' + path;
    transport = linear.transport.create({type: type, port: port});
    assertEquals(type, transport.type);
    assertNotNull(transport.entry);
    assertEquals(url, transport.entry.url);
    assertEquals('/' + channel, transport.entry.channel);
    assertEquals(undefined, transport.entry.options);

    type = 'polling';
    host = location.hostname;
    port = 8000;
    path = 'cgi/linear.fcgi';
    channel = 'linear';
    url = 'http://' + host + ':' + port + '/' + path;
    transport = linear.transport.create({type: type, port: port});
    assertEquals(type, transport.type);
    assertNotNull(transport.entry);
    assertEquals(url, transport.entry.url);
    assertEquals('/' + channel, transport.entry.channel);
    assertEquals(undefined, transport.entry.options);

    // defined channel
    type = 'polling';
    host = location.hostname;
    port = location.port;
    path = 'cgi/linear.fcgi';
    channel = 'linear2';
    url = 'http://' + host + ':' + port + '/' + path;
    transport = linear.transport.create({type: type, channel: channel});
    assertEquals(type, transport.type);
    assertNotNull(transport.entry);
    assertEquals(url, transport.entry.url);
    assertEquals('/' + channel, transport.entry.channel);
    assertEquals(undefined, transport.entry.options);

    // not defined usessl
    type = 'polling';
    host = location.hostname;
    port = location.port;
    path = 'cgi/linear.fcgi';
    channel = 'linear';
    url = 'http://' + host + ':' + port + '/' + path;
    transport = linear.transport.create({type: type, usessl: false});
    assertEquals(type, transport.type);
    assertNotNull(transport.entry);
    assertEquals(url, transport.entry.url);
    assertEquals('/' + channel, transport.entry.channel);
    assertEquals(undefined, transport.entry.options);

    // defined usessl
    type = 'polling';
    host = location.hostname;
    port = location.port;
    path = 'cgi/linear.fcgi';
    channel = 'linear';
    url = 'https://' + host + ':' + port + '/' + path;
    transport = linear.transport.create({type: type, usessl: true});
    assertEquals(type, transport.type);
    assertNotNull(transport.entry);
    assertEquals(url, transport.entry.url);
    assertEquals('/' + channel, transport.entry.channel);
    assertEquals(undefined, transport.entry.options);
};

// linear.transport.websocket test
LinearTransportWebsocketTest = TestCase('linear.transport.websocket');

LinearTransportWebsocketTest.prototype.testInstantiate = function() {
    var fakesocket = {}, transport;

    transport = new linear.transport.websocket(fakesocket);
    assertEquals('text', transport.type);
    assertNotNull(transport.socket);
    assertEquals('function', typeof fakesocket.onopen);
    assertEquals('function', typeof fakesocket.onclose);
    assertEquals('function', typeof fakesocket.onerror);
    assertEquals('function', typeof fakesocket.onmessage);

    fakesocket.binaryType = 'blob';
    transport = new linear.transport.websocket(fakesocket);
    assertEquals('binary', transport.type);
    assertEquals('arraybuffer', fakesocket.binaryType);
};

LinearTransportWebsocketTest.prototype.testOnopen = function() {
    var fakesocket = {}, transport, flag = false;

    fakesocket.binaryType = 'blob';
    transport = new linear.transport.websocket(fakesocket);
    transport.onopen = function(e) {
        flag = true;
        assertEquals('open', e.type);
    };
    fakesocket.onopen({type: 'open'});
    assertEquals(true, flag);
    flag = false;
};

LinearTransportWebsocketTest.prototype.testOnclose = function() {
    var fakesocket = {}, transport, flag = false;

    fakesocket.binaryType = 'blob';
    transport = new linear.transport.websocket(fakesocket);
    transport.onclose = function(e) {
        flag = true;
        assertEquals('close', e.type);
    };
    fakesocket.onclose({type: 'close'});
    assertEquals(true, flag);
    flag = false;
};

LinearTransportWebsocketTest.prototype.testOnerror = function() {
    var fakesocket = {}, transport, flag = false;

    fakesocket.binaryType = 'blob';
    transport = new linear.transport.websocket(fakesocket);
    transport.onclose = function(e) {
        flag = true;
        assertEquals('close', e.type);
    };
    fakesocket.onerror({type: 'close'});
    assertEquals(true, flag);
    flag = false;
};

LinearTransportWebsocketTest.prototype.testOnmessage = function() {
    var fakesocket = {}, transport, flag = false;

    fakesocket.binaryType = 'blob';
    transport = new linear.transport.websocket(fakesocket);
    transport.onmessage = function(data) {
        flag = true;
        assertEquals('data', data);
    };
    fakesocket.onmessage({data: 'data'});
    assertEquals(true, flag);
    flag = false;
};

LinearTransportWebsocketTest.prototype.testDisconnect = function() {
    var fakesocket = {}, transport, flag = false;

    fakesocket.binaryType = 'blob';
    fakesocket.close = function() {
        fakesocket.onclose({type: 'close'});
    };

    transport = new linear.transport.websocket(fakesocket);
    transport.onclose = function(e) {
        flag = true;
        assertEquals('close', e.type);
    };
    transport.disconnect();
    assertEquals(true, flag);
    flag = false;
};

LinearTransportWebsocketTest.prototype.testSend = function() {
    var fakesocket = {}, transport, flag = false;

    fakesocket.binaryType = 'blob';
    fakesocket.send = function(data) {
        flag = true;
        assertEquals('data', data);
    };

    transport = new linear.transport.websocket(fakesocket);
    transport.send('data');
    assertEquals(true, flag);
    flag = false;
};
