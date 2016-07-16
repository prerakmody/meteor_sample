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

//PlayersList.insert({"name" : "Prerak", "created" : Date.now(), "score" : 0})
//PlayersList.insert({"name" : "RamuKaka", "created" : Date.now(), "score" : 0})
