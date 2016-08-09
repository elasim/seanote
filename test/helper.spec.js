import 'babel-polyfill';
import cssHook from 'css-modules-require-hook';
import sass from 'node-sass';
import {jsdom} from 'jsdom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import chai from 'chai';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
chai.should();

if (global.tapEventPluginInjected) {
	injectTapEventPlugin();
	global.tapEventPluginInjected = true;
}

cssHook({
	extensions: ['.scss'],
	preprocessCss: css => sass.renderSync({ data: css }).css
});

const exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;

Object.keys(document.defaultView).forEach((property) => {
	if (typeof global[property] === 'undefined') {
		exposedProperties.push(property);
		global[property] = document.defaultView[property];
	}
});

global.navigator = {
	userAgent: 'node.js',
};
