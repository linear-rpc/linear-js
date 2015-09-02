// linear.async.test.js

var TEST_PORT = 4226;

// linear.client.websocket test
LinearClientWebsocketTest = AsyncTestCase('linear.client.websocket');

LinearClientWebsocketTest.prototype.testAll = function(q) {
    var client;
    var target = [{type: 'websocket', port: TEST_PORT}];

    if (!window.WebSocket) {
        jstestdriver.console.log('target browser doesn\'t have WebSocket');
        return;
    }
    client = new linear.client({transports: target});
    assertNotNull(client);
    q.call('client.connect test',
            function(pool) {
                var id;
                var onxxx = pool.add(
                    function(e) {
                        assertEquals('connected', e.type);
                    });
                client.onconnect = onxxx;
                client.ondisconnect = onxxx;
                client.connect();
            });
    q.call('client.onresponse test',
            function(pool) {
                var id_add, id_sub, id_mul, id_div, id_str, a = 10, b = -10, str = 'Hello linear-js';
                var onresponse = pool.add(
                    function(response) {
                        assertEquals('number', typeof response.id);
                        if (response.id === id_add) {
                            assertEquals(a + b, response.result);
                            assertNull(response.error);
                        }
                        if (response.id === id_sub) {
                            assertEquals(a - b, response.result);
                            assertNull(response.error);
                        }
                        if (response.id === id_mul) {
                            assertEquals(a * b, response.result);
                            assertNull(response.error);
                        }
                        if (response.id === id_div) {
                            assertEquals(a / b, response.result);
                            assertNull(response.error);
                        }
                        if (response.id === id_str) {
                            assertEquals(str, response.result);
                            assertNull(response.error);
                        }
                    }, 5);
                client.onresponse = onresponse;
                id_add = client.request({method: 'add', params: [a, b]});
                id_sub = client.request({method: 'sub', params: [a, b]});
                id_mul = client.request({method: 'mul', params: [a, b]});
                id_div = client.request({method: 'div', params: [a, b]});
                id_str = client.request({method: 'string', params: str});
            });
    q.call('client.onresponse(binary) test',
            function(pool) {
                var id_str_bin, id_i8a, id_i16a, id_ab, id_bin1, id_bin2;
                var str = '{key: "value"}';
                var i8a = new Int8Array([0, 1, 2, 3, 0, -1, -2, -3]);
                var i16a = new Int16Array([0, 1, 2, 3, 0, -32767, -2, -3]);
                var onresponse = pool.add(
                    function(response) {
                        assertEquals('number', typeof response.id);
                        if (response.id === id_str_bin) {
                            assertEquals(str, response.result);
                            assertNull(response.error);
                        }
                        if (response.id === id_i8a) {
                            assertEquals(i8a, new Int8Array(linear.tobinary(response.result)));
                            assertNull(response.error);
                        }
                        if (response.id === id_i16a || response.id === id_ab ||
                            response.id === id_bin1 || response.id === id_bin2) {
                            assertEquals(i16a, new Int16Array(linear.tobinary(response.result)));
                            assertNull(response.error);
                        }
                    }, 6);
                client.onresponse = onresponse;
                id_str_bin = client.request({method: 'string-binary', params: str});
                id_i8a = client.request({method: 'typed-array', params: i8a});
                id_i16a = client.request({method: 'typed-array', params: i16a});
                id_ab = client.request({method: 'typed-array', params: i16a.buffer});
                id_bin1 = client.request({method: 'typed-array', params: linear.tobinary(i16a)});
                id_bin2 = client.request({method: 'typed-array', params: linear.tobinary(i16a.buffer)});
            });
    q.call('floating point values test',
            function(pool) {
                var id_a, id_b, id_c, id_d, id_e;
                var a = -1.1, b = -1.0, c = 0.0, d = 1.0, e = 1.1;
                var onresponse_a = pool.add(
                    function(response) {
                        assertEquals(id_a, response.id);
                        assertEquals(a, response.result);
                        assertNull(response.error);
                    });
                var onresponse_b = pool.add(
                    function(response) {
                        assertEquals(id_b, response.id);
                        assertEquals(b, response.result);
                        assertNull(response.error);
                    });
                var onresponse_c = pool.add(
                    function(response) {
                        assertEquals(id_c, response.id);
                        assertEquals(c, response.result);
                        assertNull(response.error);
                    });
                var onresponse_d = pool.add(
                    function(response) {
                        assertEquals(id_d, response.id);
                        assertEquals(d, response.result);
                        assertNull(response.error);
                    });
                var onresponse_e = pool.add(
                    function(response) {
                        assertEquals(id_e, response.id);
                        assertEquals(e, response.result);
                        assertNull(response.error);
                    });
                id_a = client.request({method: 'double',
				       params: [linear.tofloat(a)],
                                       onresponse: onresponse_a});
                id_b = client.request({method: 'double',
				       params: [linear.tofloat(b)],
                                       onresponse: onresponse_b});
                id_c = client.request({method: 'double',
				       params: [linear.tofloat(c)],
                                       onresponse: onresponse_c});
                id_d = client.request({method: 'double',
				       params: [linear.tofloat(d)],
                                       onresponse: onresponse_d});
                id_e = client.request({method: 'double',
				       params: [linear.tofloat(e)],
                                       onresponse: onresponse_e});
            });
    q.call('client.onnotify test',
            function(pool) {
                var str = '{key: "value"}';
                var onnotify = pool.add(
                    function(notify) {
                        if (notify.name === 'dobroadcast') {
                            assertEquals(str, notify.data);
                        }
                    }, 1);
                client.onnotify = onnotify;
                client.notify({name: 'dobroadcast', data: str});
            });
    q.call('client.onnotify(binary) test',
            function(pool) {
                var str = '{key: "value"}';
                var i16a = new Int16Array([0, 1, 2, 3, 0, -32767, -2, -3]);
                var onnotify = pool.add(
                    function(notify) {
                        if (notify.name === 'string-binary') {
                            assertEquals(str, notify.data);
                        } else if (notify.name === 'typed-array') {
                            assertEquals(i16a, new Int16Array(linear.tobinary(notify.data)));
                        }
                    }, 5);
                client.onnotify = onnotify;
                client.notify({name: 'string-binary', data: str});
                client.notify({name: 'typed-array', data: i16a});
                client.notify({name: 'typed-array', data: i16a.buffer});
                client.notify({name: 'typed-array', data: linear.tobinary(i16a)});
                client.notify({name: 'typed-array', data: linear.tobinary(i16a.buffer)});
            });
    q.call('client.onrequest success test',
            function(pool) {
                var onrequest = pool.add(
                    function(request) {
                        if (request.method === 'success') {
                            client.response({id: request.id, result: request.params});
                        }
                    });
                var onnotify = pool.add(
                    function(notify) {
                        assertEquals('request-test', notify.name);
                        assertEquals(true, notify.data);
                    });
                client.onrequest = onrequest;
                client.onnotify = onnotify;
                client.notify({name: 'request-success', data: null});
            });
    q.call('client.onrequest fail test',
            function(pool) {
                var onrequest = pool.add(
                    function(request) {
                        if (request.method === 'fail') {
                            client.response({id: request.id, error: request.params});
                        }
                    });
                var onnotify = pool.add(
                    function(notify) {
                        assertEquals('request-test', notify.name);
                        assertEquals(true, notify.data);
                    });
                client.onrequest = onrequest;
                client.onnotify = onnotify;
                client.notify({name: 'request-fail', data: null});
            });
    q.call('client.disconnect test',
            function(pool) {
                var id;
                var onxxx = pool.add(
                    function(e) {
                        assertEquals('disconnected', e.type);
                    });
                client.onconnect = onxxx;
                client.ondisconnect = onxxx;
                client.disconnect();
            });
};

// linear.client.websocket.issue test
LinearClientWebsocketIssue1192Test =
    AsyncTestCase('linear.client.websocket.issue1192');

LinearClientWebsocketIssue1192Test.prototype.testAll = function(q) {
    var client;
    var target = [{type: 'websocket', port: TEST_PORT}];

    if (!window.WebSocket) {
        jstestdriver.console.log('target browser doesn\'t have WebSocket');
        return;
    }
    client = new linear.client({transports: target});
    assertNotNull(client);
    q.call('client.connect test',
            function(pool) {
                var id;
                var onxxx = pool.add(
                    function(e) {
                        assertEquals('connected', e.type);
                    });
                client.onconnect = onxxx;
                client.ondisconnect = onxxx;
                client.connect();
            });

    q.call('client.onresponse long message test',
            function(pool) {
                var id, len = 150001;
                var onresponse = pool.add(
                    function(response) {
                        assertEquals(id, response.id);
			if (response.error &&
			    response.error === 'message too long') {
			    jstestdriver.console.log('target browser can\'t handle long message');
			} else {
                            assertEquals(len, response.result.length);
                            assertNull(null, response.error);
			}
                    });
                client.onresponse = onresponse;
                id = client.request({method: 'long message', params: [len]});
            });
    q.call('client.onresponse long message test',
            function(pool) {
                var id, len = 200001;
                var onresponse = pool.add(
                    function(response) {
                        assertEquals(id, response.id);
			if (response.error &&
			    response.error === 'message too long') {
			    jstestdriver.console.log('target browser can\'t handle long message');
			} else {
                            assertEquals(len, response.result.length);
                            assertNull(null, response.error);
			}
                    });
                client.onresponse = undefined;
                id = client.request({method: 'long message', params: [len],
                                     onresponse: onresponse});
            });
    q.call('client.notify long message test',
            function(pool) {
                var len = 150001;
                var onnotify = pool.add(
                    function(notify) {
			if (notify.name === 'long message broadcast') {
			    assertEquals('long message broadcast',
					 notify.name);
			    assertEquals(len, notify.data.length);
			}
                    }, 1);
                client.onnotify = onnotify;
                client.notify({name: 'long message', data: [len]});
            });

    q.call('client.disconnect test',
            function(pool) {
                var id;
                var onxxx = pool.add(
                    function(e) {
                        assertEquals('disconnected', e.type);
                    });
                client.onconnect = onxxx;
                client.ondisconnect = onxxx;
                client.disconnect();
            });
};

// linear.client.polling test
LinearClientPollingTest = AsyncTestCase('linear.client.polling');

LinearClientPollingTest.prototype.testAll = function(q) {
    var client;
    var target = [{type: 'polling', port: TEST_PORT}];

    client = new linear.client({transports: target});
    assertNotNull(client);
    q.call('client.connect test',
            function(pool) {
                var id;
                var onxxx = pool.add(
                    function(e) {
                        assertEquals('connected', e.type);
                    });
                client.onconnect = onxxx;
                client.ondisconnect = onxxx;
                client.connect();
            });
    q.call('client.onresponse test',
            function(pool) {
                var id_add, id_sub, id_mul, id_div, id_str, a = 10, b = -10, str = 'Hello linear-js';
                var onresponse = pool.add(
                    function(response) {
                        assertEquals('number', typeof response.id);
                        if (response.id === id_add) {
                            assertEquals(a + b, response.result);
                            assertNull(response.error);
                        }
                        if (response.id === id_sub) {
                            assertEquals(a - b, response.result);
                            assertNull(response.error);
                        }
                        if (response.id === id_mul) {
                            assertEquals(a * b, response.result);
                            assertNull(response.error);
                        }
                        if (response.id === id_div) {
                            assertEquals(a / b, response.result);
                            assertNull(response.error);
                        }
                        if (response.id === id_str) {
                            assertEquals(str, response.result);
                            assertNull(response.error);
                        }
                    }, 5);
                client.onresponse = onresponse;
                id_add = client.request({method: 'add', params: [a, b]});
                id_sub = client.request({method: 'sub', params: [a, b]});
                id_mul = client.request({method: 'mul', params: [a, b]});
                id_div = client.request({method: 'div', params: [a, b]});
                id_str = client.request({method: 'string', params: str});
            });
    q.call('client.onresponse(binary) test',
            function(pool) {
                var id_str_bin, id_i8a, id_i16a, id_ab, id_bin1, id_bin2;
                var str = '{key: "value"}';
                var i8a = new Int8Array([0, 1, 2, 3, 0, -1, -2, -3]);
                var i16a = new Int16Array([0, 1, 2, 3, 0, -32767, -2, -3]);
                var onresponse = pool.add(
                    function(response) {
                        assertEquals('number', typeof response.id);
                        if (response.id === id_str_bin) {
                            assertEquals(str, response.result);
                            assertNull(response.error);
                        }
                        if (response.id === id_i8a) {
                            assertEquals(i8a, new Int8Array(linear.tobinary(response.result)));
                            assertNull(response.error);
                        }
                        if (response.id === id_i16a || response.id === id_ab ||
                            response.id === id_bin1 || response.id === id_bin2) {
                            assertEquals(i16a, new Int16Array(linear.tobinary(response.result)));
                            assertNull(response.error);
                        }
                    }, 6);
                client.onresponse = onresponse;
                id_str_bin = client.request({method: 'string-binary', params: str});
                id_i8a = client.request({method: 'typed-array', params: i8a});
                id_i16a = client.request({method: 'typed-array', params: i16a});
                id_ab = client.request({method: 'typed-array', params: i16a.buffer});
                id_bin1 = client.request({method: 'typed-array', params: linear.tobinary(i16a)});
                id_bin2 = client.request({method: 'typed-array', params: linear.tobinary(i16a.buffer)});
            });
    q.call('floating point values test',
            function(pool) {
                var id_a, id_b, id_c, id_d, id_e;
                var a = -1.1, b = -1.0, c = 0.0, d = 1.0, e = 1.1;
                var onresponse_a = pool.add(
                    function(response) {
                        assertEquals(id_a, response.id);
                        assertEquals(a, response.result);
                        assertNull(response.error);
                    });
                var onresponse_b = pool.add(
                    function(response) {
                        assertEquals(id_b, response.id);
                        assertEquals(b, response.result);
                        assertNull(response.error);
                    });
                var onresponse_c = pool.add(
                    function(response) {
                        assertEquals(id_c, response.id);
                        assertEquals(c, response.result);
                        assertNull(response.error);
                    });
                var onresponse_d = pool.add(
                    function(response) {
                        assertEquals(id_d, response.id);
                        assertEquals(d, response.result);
                        assertNull(response.error);
                    });
                var onresponse_e = pool.add(
                    function(response) {
                        assertEquals(id_e, response.id);
                        assertEquals(e, response.result);
                        assertNull(response.error);
                    });
                id_a = client.request({method: 'double',
				       params: [linear.tofloat(a)],
                                       onresponse: onresponse_a});
                id_b = client.request({method: 'double',
				       params: [linear.tofloat(b)],
                                       onresponse: onresponse_b});
                id_c = client.request({method: 'double',
				       params: [linear.tofloat(c)],
                                       onresponse: onresponse_c});
                id_d = client.request({method: 'double',
				       params: [linear.tofloat(d)],
                                       onresponse: onresponse_d});
                id_e = client.request({method: 'double',
				       params: [linear.tofloat(e)],
                                       onresponse: onresponse_e});
            });
    q.call('client.onnotify test',
            function(pool) {
                var str = '{key: "value"}';
                var onnotify = pool.add(
                    function(notify) {
                        if (notify.name === 'dobroadcast') {
                            assertEquals(str, notify.data);
                        }
                    }, 1);
                client.onnotify = onnotify;
                client.notify({name: 'dobroadcast', data: str});
            });
    q.call('client.onnotify(binary) test',
            function(pool) {
                var str = '{key: "value"}';
                var i16a = new Int16Array([0, 1, 2, 3, 0, -32767, -2, -3]);
                var onnotify = pool.add(
                    function(notify) {
                        if (notify.name === 'string-binary') {
                            assertEquals(str, notify.data);
                        } else if (notify.name === 'typed-array') {
                            assertEquals(i16a, new Int16Array(linear.tobinary(notify.data)));
                        }
                    }, 5);
                client.onnotify = onnotify;
                client.notify({name: 'string-binary', data: str});
                client.notify({name: 'typed-array', data: i16a});
                client.notify({name: 'typed-array', data: i16a.buffer});
                client.notify({name: 'typed-array', data: linear.tobinary(i16a)});
                client.notify({name: 'typed-array', data: linear.tobinary(i16a.buffer)});
            });
    q.call('client.onrequest success test',
            function(pool) {
                var onrequest = pool.add(
                    function(request) {
                        if (request.method === 'success') {
                            client.response({id: request.id, result: request.params});
                        }
                    });
                var onnotify = pool.add(
                    function(notify) {
                        assertEquals('request-test', notify.name);
                        assertEquals(true, notify.data);
                    });
                client.onrequest = onrequest;
                client.onnotify = onnotify;
                client.notify({name: 'request-success', data: null});
            });
    q.call('client.onrequest fail test',
            function(pool) {
                var onrequest = pool.add(
                    function(request) {
                        if (request.method === 'fail') {
                            client.response({id: request.id, error: request.params});
                        }
                    });
                var onnotify = pool.add(
                    function(notify) {
                        assertEquals('request-test', notify.name);
                        assertEquals(true, notify.data);
                    });
                client.onrequest = onrequest;
                client.onnotify = onnotify;
                client.notify({name: 'request-fail', data: null});
            });
    q.call('client.disconnect test',
            function(pool) {
                var id;
                var onxxx = pool.add(
                    function(e) {
                        assertEquals('disconnected', e.type);
                    });
                client.onconnect = onxxx;
                client.ondisconnect = onxxx;
                client.disconnect();
            });
};

// linear.client.polling.issue test
LinearClientPollingIssue1192Test =
    AsyncTestCase('linear.client.polling.issue1192');

LinearClientPollingIssue1192Test.prototype.testAll = function(q) {
    var client;
    var target = [{type: 'polling', port: TEST_PORT}];

    client = new linear.client({transports: target});
    assertNotNull(client);
    q.call('client.connect test',
            function(pool) {
                var id;
                var onxxx = pool.add(
                    function(e) {
                        assertEquals('connected', e.type);
                    });
                client.onconnect = onxxx;
                client.ondisconnect = onxxx;
                client.connect();
            });

    q.call('client.onresponse long message test',
            function(pool) {
                var id, len = 150001;
                var onresponse = pool.add(
                    function(response) {
                        assertEquals(id, response.id);
			if (response.error &&
			    response.error === 'message too long') {
			    jstestdriver.console.log('target browser can\'t handle long message');
			} else {
                            assertEquals(len, response.result.length);
                            assertNull(null, response.error);
			}
                    });
                client.onresponse = onresponse;
                id = client.request({method: 'long message', params: [len]});
            });
    q.call('client.onresponse long message test',
            function(pool) {
                var id, len = 200001;
                var onresponse = pool.add(
                    function(response) {
                        assertEquals(id, response.id);
			if (response.error &&
			    response.error === 'message too long') {
			    jstestdriver.console.log('target browser can\'t handle long message');
			} else {
                            assertEquals(len, response.result.length);
                            assertNull(null, response.error);
			}
                    });
                client.onresponse = undefined;
                id = client.request({method: 'long message', params: [len],
                                     onresponse: onresponse});
            });
    q.call('client.notify long message test',
            function(pool) {
                var len = 150001;
                var onnotify = pool.add(
                    function(notify) {
			if (notify.name === 'long message broadcast') {
			    assertEquals('long message broadcast',
					 notify.name);
			    assertEquals(len, notify.data.length);
			}
                    }, 1);
                client.onnotify = onnotify;
                client.notify({name: 'long message', data: [len]});
            });
    q.call('client.disconnect test',
            function(pool) {
                var id;
                var onxxx = pool.add(
                    function(e) {
                        assertEquals('disconnected', e.type);
                    });
                client.onconnect = onxxx;
                client.ondisconnect = onxxx;
                client.disconnect();
            });
};
