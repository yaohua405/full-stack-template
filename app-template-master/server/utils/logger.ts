import { RequestHandler } from "express-serve-static-core";

/** 
 * Logs requests/responses
 */
const logger = (): RequestHandler => (req, res, next) => {
  console.log(`Incoming request for ${req.path}, from ${req.ip}`);
  
  if(!!process.env.DEBUG_REQUEST__S)console.log(console.log(`req body: ${JSON.stringify(req.body, null, 2)}\nreq params: ${JSON.stringify(req.params, null, 2)}\nreq query: ${JSON.stringify(req.query, null, 2)}`))
	if(!!process.env.DEBUG_RESPONSE__S){
		var send = res.send;
		//@ts-ignore
		res.send = function(v) {
			console.log(`Answering with `, typeof v === 'string' ? v.substring(0, 100) + (v.length>100?'\n...':''): '... next-line should be it')
			//@ts-ignore
			send.apply(res, arguments)
		}
	}

  next();
};

export default logger;
