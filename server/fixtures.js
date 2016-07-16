//this creates a default admin user. This admin user can add more players to the dashboard
console.log('User Count:', Meteor.users.find().count())
if ( Meteor.users.find().count() === 0 ) {
    Accounts.createUser({
        username: 'admin',
        email: 'admin@gmail.com',
        password: 'admin',
        profile: {
            first_name: 'admin',
            last_name: 'admin',
            company: 'SocialCops',
        }
    });
}

