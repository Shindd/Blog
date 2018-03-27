var handler_loader = {};

var handler_info = require('./handler_info');
var utils = require('jayson/lib/utils');

handler_loader.init = function(jayson, app, api_path) {
	console.log('Called handler_loader.init.');
	return initHandlers(jayson, app, api_path);
}

function initHandlers(jayson, app, api_path) {
	var handlers = {};
	
	var infoLen = handler_info.length;
	console.log('\nHandler[%d]', infoLen);
 
	for (var i = 0; i < infoLen; i++) {
		var curItem = handler_info[i];
			
		// 모듈 파일에서 모듈 불러옴
		var curHandler = require(curItem.file);
		console.log('Read module info. from %s.', curItem.file);
		
		// 핸들러 함수 등록
		//handlers[curItem.method] = curHandler;
		handlers[curItem.method] = new jayson.Method({
			handler: curHandler,
			collect: true,
			params: Array
		});
 
		console.log('Add Method[%s] on handler.', curItem.method);
	}

	// jayson 서버 객체 생성
	var jaysonServer = jayson.server(handlers);
	
	// app의 패스로 라우팅
	console.log('\nSet RPC call from path[' + api_path + '].');
	
	app.post(api_path, function(req, res, next) {
	    console.log('\nCalled JSON-RPC from path[' + api_path + '].');
		
	    var options = {};
	    
	    // Content-Type이 application/json이 아니면, 415 unsupported media type error
		var contentType = req.headers['content-type'] || '';
		if(!RegExp('application/json', 'i').test(contentType)) {
			console.log('Not application/json type.');
			return error(415);
		};

	    if(!req.body || typeof(req.body) !== 'object') {
	    	console.log('Error : request body.');
	    	return error(400, 'Request body must be parsed');
	    }

	    console.log('Call RPC function.');
	    jaysonServer.call(req.body, function(error, success) {
              var response = error || success;

              console.log('\n RPC response:');
              console.log(response);

              utils.JSON.stringify(response, options, function(err, body) {
                if(err) return err;

                if(body) {
                    var headers = {
                            "Content-Length": Buffer.byteLength(body, 'utf-8'),
                            "Content-Type": "application/json"
                    };

                    res.writeHead(200, headers);
                    res.write(body);
                } else {
                    res.writeHead(204);
                }
                res.end();
              });
	    });

	    function error(code, headers) {
	    	res.writeHead(code, headers || {});
	    	res.end();
	    }

	});

	return handlers;
}

module.exports = handler_loader;