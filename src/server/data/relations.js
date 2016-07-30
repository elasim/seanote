import { Publishers } from './schema/publisher';
import { Users, UserClaims, UserLogins, UserProfiles } from './schema/user';
import { Groups, GroupProfiles, GroupUsers } from './schema/group';
import { Boards, BoardSorts, BoardPrivacySettings } from './schema/board';
import { Lists } from './schema/list';
import { Cards } from './schema/card';

Groups.hasOne(GroupProfiles);
GroupProfiles.belongsTo(Groups);

Groups.belongsTo(Publishers);
Publishers.hasMany(Groups);

Groups.belongsTo(Users, { as: 'Owner' });
Users.hasMany(Groups, { as: 'ManagedGroups', foreignKey: 'OwnerId'} );

Groups.belongsToMany(Users, {
	through: GroupUsers,
	foreignKey: 'GroupId'
});
Users.belongsToMany(Groups, {
	through: GroupUsers,
	foreignKey: 'UserId'
});

Users.hasOne(UserProfiles, { foreignKey: 'UserId' });
UserProfiles.belongsTo(Users, { foreignKey: 'UserId' });

Users.belongsTo(Publishers);
Publishers.hasMany(Users);

UserLogins.belongsTo(Users);
UserClaims.belongsTo(Users);

Boards.hasMany(Lists);
Lists.belongsTo(Boards);

Publishers.hasMany(Boards, { foreignKey: 'PublisherId' });
Boards.belongsTo(Publishers, { as: 'Publisher' });

Users.hasMany(Boards, { foreignKey: 'AuthorId' });
Boards.belongsTo(Users, { as: 'Author' });

Boards.hasMany(BoardPrivacySettings, {
	foreignKey: 'BoardId',
	as: 'PrivacySettings',
});
BoardPrivacySettings.belongsTo(Boards, {
	foreignKey: 'BoardId',
});
Publishers.hasMany(BoardPrivacySettings, {
	foreignKey: 'roleId',
	as: 'RelatedRules',
});
BoardPrivacySettings.belongsTo(Publishers, {
	foreignKey: 'roleId'
});

Lists.hasMany(Cards);
Cards.belongsTo(Lists);

Boards.hasMany(BoardSorts, { foreignKey: 'BoardId' });
BoardSorts.belongsTo(Boards, { foreignKey: 'BoardId' });

Users.hasMany(BoardSorts, { foreignKey: 'UserId' });
BoardSorts.belongsTo(Users, { foreignKey: 'UserId' });
