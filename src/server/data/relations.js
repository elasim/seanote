import { Publishers } from './schema/publisher';
import { Users, UserClaims, UserLogins, UserProfiles } from './schema/user';
import { Groups, GroupProfiles, GroupUsers } from './schema/group';
import { Boards, BoardSorts, BoardPrivacySettings } from './schema/board';
import { Lists } from './schema/list';
import { Cards } from './schema/card';

Groups.hasOne(GroupProfiles);
Groups.belongsTo(Publishers);
Groups.belongsTo(Users, { as: 'Owner '});
Groups.belongsToMany(Users, {
	through: GroupUsers,
	foreignKey: 'GroupId'
});

Users.hasOne(UserProfiles, { foreignKey: 'UserId' });
Users.belongsTo(Publishers);
Users.belongsToMany(Groups, {
	through: GroupUsers,
	foreignKey: 'UserId'
});

UserLogins.belongsTo(Users);
UserClaims.belongsTo(Users);

Boards.hasMany(Lists);
Boards.belongsTo(Publishers, { as: 'Publisher' });
Boards.belongsTo(Users, { as: 'Author' });
Boards.hasMany(BoardPrivacySettings, {
	foreignKey: 'BoardId',
	as: 'PrivacySetting'
});
Publishers.hasMany(BoardPrivacySettings, {
	foreignKey: 'roleId',
	as: 'RelatedRule',
});

Lists.hasMany(Cards);

// BoardSorts.belongsToMany(Boards, {
// 	through: BoardSorts,
// });
// BoardSorts.belongsToMany(Users, {
// 	through: BoardSorts,
// });
BoardSorts.belongsTo(Boards, { foreignKey: 'BoardId' });
BoardSorts.belongsTo(Users, { foreignKey: 'UserId' });
