import { User, UserClaim, UserLogin, UserProfile } from './user';
import { Organization, OrganizationProfile } from './organization';
import { Author, Board, List } from './board';

const OrganizationUsersRelationship = { through: 'OrganizationUsers' };
Board.hasMany(List);
Board.belongsTo(Author, { as: 'Owner' });

// Author is a User or Group
User.hasOne(UserLogin);
User.hasOne(UserProfile);
User.hasMany(UserClaim);
User.hasMany(Organization, { as: 'Owner' });
User.belongsTo(Author);
User.belongsToMany(Organization, OrganizationUsersRelationship);

Organization.hasOne(OrganizationProfile);
Organization.belongsTo(Author);
Organization.belongsToMany(User, OrganizationUsersRelationship);

/**
 * Sequelize Associations
 * A hasOne B [as NAME, foreignKey FK]
 * A hasMany B [as NAME, foreginKey FK]
 * -> getter/setter in A (getB, setB or getNAME)
 * -> B schema {..., BId, B_id, FK }
 * 
 * A belongsTo B [as NAME, foreignKey FK, targetKey B_KEY_COLUMN]
 * A belongsToMany B [as NAME, foreginKey FK, targetKey B_KEY_COLUMN]
 */
