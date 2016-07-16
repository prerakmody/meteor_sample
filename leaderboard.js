//CLIENT SIDE EXECUTION
if(Meteor.isClient){

    //PUB-SUB CODE
    Meteor.subscribe('thePlayers', function(){
 	//creates default players at the beginning of the app
	if (PlayersList.find().count() === 0){
            PlayersList.insert({"name" : "Prerak", "created" : Date.now(), "score" : 0})
            PlayersList.insert({"name" : "RamuKaka", "created" : Date.now(), "score" : 0})
        }
    });
    Meteor.subscribe('theNotifs');
 
    /***
    Note: Meteor templates have helpers and events. Used below.
    **/

    /** --------------------------LEADERBOARD-------------------------- **/
    //Code for Leaderboard on the left hand side of the page
    Template.leaderboard.helpers({
        'player': function(){
            return PlayersList.find({},{ sort: {score: -1} });
        },
	'playerCount': function(){
	    return PlayersList.find().count()
	},
	//the bottom two functions are used to know which user is being selected so you are aware who you are giving/taking points from
	'selectedClass': function(){
	    var playerId = this._id;
    	    var selectedPlayer = Session.get('selectedPlayer');
            if(playerId == selectedPlayer){
        	return "selected"
    	    }
	},
	'selectedPlayerDetails': function(){
	    return Session.get('selectedPlayerDetails')
        },
	//this is used to determine if a system-user can add players to the leaderboard
	'isAdmin': function(){
	    var user_obj = Meteor.users.findOne(Meteor.userId())
	    if (user_obj != undefined){
		if (user_obj['emails'][0]['address'] == 'admin@gmail.com')
                    return true 
	    }
	    return false
	} 
    });

    //Code for Leaderboard on the left hand side of the page
    Template.leaderboard.events({
        'click .player': function(){
	    var playerId = this._id;;
	    Session.set('selectedPlayer', playerId);
	    Session.set('selectedPlayerDetails', this.name + ':' + this.score);
	    var selectedPlayer = Session.get('selectedPlayer');
        },
	'click .increment': function(){
 	   var selectedPlayer = Session.get('selectedPlayer');
 	   PlayersList.update({ _id: selectedPlayer }, { $inc: {score: 5} });
	},
	'click .decrement': function(){
           var selectedPlayer = Session.get('selectedPlayer');
           PlayersList.update({ _id: selectedPlayer }, { $inc: {score: -5} });
        },
    });

       
    Template.deleteUser.helpers({
        'users': function(){
            data = PlayersList.find({},{ sort: {'created': -1} }).fetch();
            for (var i=0;  i<data.length; i++){
                var date_obj = new Date(data[i]['created'])
                data[i]['date'] = date_obj.getMonth() + '-' + date_obj.getDate() + ' ' + date_obj.getHours() +':'+ date_obj.getMinutes()
            }
            return data
        }
    })
    Template.deleteUser.events({
        'submit form': function(event){
             event.preventDefault(); //meteor is used to create single-page apps. This stops any reloading of the page from taking place.
             PlayersList.remove({'_id':event.target.user_id.value})
             var notif_data = NotifsList.find({'player_id':event.target.user_id.value}).fetch()
             for (var i=0; i< notif_data.length; i++){
                  NotifsList.remove({'_id': notif_data[i]['_id']})
             }
        }
    })

    Template.addUser.events({
        'submit form ': function(event){
             event.preventDefault();
             Meteor.call('createPlayer', event.target.name.value);
             //PlayersList.insert({'name':event.target.name.value, 'created':Date.now(), 'score':0})
        }
    }) 
    Meteor.methods({
        'createPlayer': function(playerName){
            check(playerName, String);
            if (Meteor.userId())
                PlayersList.insert({'name': playerName, 'created':Date.now(), 'score':0})
        }
    });

   /** ------------------------DASHBOARD NOTIFS---------------------------- **/
   Template.createNotifs.helpers({
	'player': function(){
            return PlayersList.find({},{ sort: {score: -1} });
        }
   })
   Template.createNotifs.events({
        'submit form': function(event){
            event.preventDefault();
            var thresh_score = event.target.score_thres.value
            var player_data = event.target.player_name[event.target.player_name.selectedIndex].value.split('.') //this is dropdown-menu
            var docu = { 'thresh_score':parseInt(thresh_score), 'player_id':player_data[0], 'player_name':player_data[1],'user_id':Meteor.userId(), 'timestamp': Date.now(), 'seen':0, 'triggered':0 }
            NotifsList.insert(docu)
        }
    })
   
    Template.deleteNotifs.helpers({
	'getUserNotifs': function(){
	    notifs = NotifsList.find({'user_id':Meteor.userId(), 'triggered':0},{sort:{timestamp:-1}}).fetch();
	    for (var i=0; i<notifs.length;i++){
		var date_obj = new Date(notifs[i]['timestamp'])
		notifs[i]['date'] = date_obj.getMonth() + '-' + date_obj.getDate() + ' ' + date_obj.getHours() +':'+ date_obj.getMinutes()
	    }
	    return notifs
	}
   })
   Template.deleteNotifs.events({
	'submit form': function(event){
	    event.preventDefault();
	    NotifsList.remove({'_id':event.target.notif_id.value})
        }
   })

   Template.informNotifs.helpers({
	'getUnseenNotifs': function(){
	     var notifs = NotifsList.find({'user_id':Meteor.userId(), 'seen':0}).fetch()
	     res = []
	     for (var i=0; i<notifs.length; i++){
		 //var player_query = {'_id':notifs[i]['player_id'], 'score':{'$gte':notifs[i]['thresh_score']}}
		 var player_query = {'_id':notifs[i]['player_id']}
		 var player = PlayersList.find(player_query).fetch()
		 if (player.length){
		 if (player[0]['score'] >= notifs[i]['thresh_score']){
		     res.push(notifs[i])
		     NotifsList.update({'_id':notifs[i]['_id']},{'$set':{'triggered':1}})
		 }
		 }
	     }
	     return res
	}
    })
    Template.informNotifs.events({
	'submit form': function(event){
	    event.preventDefault();
	    NotifsList.update({'_id':event.target.notif_id.value},{'$set':{'seen':1}})
	}
    }) 
 
 	
}


//SERVER SIDE EXECUTION
if(Meteor.isServer){
    Meteor.publish('thePlayers', function(){
        return PlayersList.find();
    });
    Meteor.publish('theNotifs', function(){
        return NotifsList.find();
    });
}


//INITIALISING MONGO COLL HANDLERS
PlayersList = new Mongo.Collection('players');
NotifsList = new Mongo.Collection('notifs')

