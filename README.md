# meteor_sample
A sample leaderboard sample from meteor.js along with a few modifications of my own

## Installation Instructions
1. curl https://install.meteor.com/ | sh
2. meteor create leaderboard
3. cd leaderboard
4. rm -rf !(.meteor)
5. git init
6. git remote add origin git@github.com:prerakmody/meteor_sample.git
7. git pull origin master
8. sh meteor_packages.sh
9. meteor run --port 3000

##Ref
1. http://meteortips.com/first-meteor-tutorial/
2. https://prerakmody.github.io/meteor_sample/

##Notes
###Accessing Meteor's Mongo via RoboMongo (if on an online server)
Create an SSH tunnel : `ssh -L 3001:localhost:3001 username@domain`

This redirects your requests of 127.0.0.1:3001 to the localhost:3000 of username@domain
