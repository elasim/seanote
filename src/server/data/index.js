import sequelize from './sequelize';
import * as PublisherSchema from './schema/publisher';
import * as UserSchema from './schema/user';
import * as GroupSchema from './schema/group';
import * as BoardSchema from './schema/board';
import * as ListSchema from './schema/list';
import * as CardSchema from './schema/card';

import './relations.js';

module.exports = {
	...PublisherSchema,
	...UserSchema,
	...GroupSchema,
	...BoardSchema,
	...ListSchema,
	...CardSchema,
};

sequelize.sync({
	force: 0
});
