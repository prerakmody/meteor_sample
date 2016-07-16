# meteor_sample
A sample leaderboard sample from meteor.js along with a few modifications of my own

## Installation Instructions
1. Install `Meteor` on your machine : `curl https://install.meteor.com/ | sh`
2. Clone this repo: `git clone git@github.com:prerakmody/meteor_sample.git`
3. Add a user-access control package: `meteor add accounts-password`
4. Type: `meteor add check`
5. Type: `meteor remove insecure`

##Ref
http://meteortips.com/first-meteor-tutorial/

###Accessing Meteor's Mongo
Create an SSH tunnel
  $ ssh -L 3001:localhost:3001 username@domain

This redirects your requests of 127.0.0.1:3001 to the localhost:3000 of username@domain
