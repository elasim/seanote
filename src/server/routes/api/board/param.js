
function BoardRouterParameterHandle(req, res, next, value) {
	next();
}

export default function configureParams(router) {
	router.param('board', BoardRouterParameterHandle);
	// router.param('list', BoardRouterParameterHandle);
	// router.param('card', BoardRouterParameterHandle);
}
