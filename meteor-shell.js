Log = new Meteor.Collection("log");
if (Meteor.isClient) {

  // Template.buffer.output = function () {
  //   if (Session.get('output'))
  //     return Session.get('output');
  //   else
  //     return "Meteor Shell 0.0.1\n\n"
  //           +"This is a basic terminal, it will run Linux/Unix commands on the server\n"
  //           +"and will print on the screen the output."
  //           +"\n\n"
  //           +"I did this software mainly to understand how the \"meteor deploy\"\n"
  //           +"PaaS/sandbox is done. Please don't do bad things :)"
  //           +"\n\n"
  //           +"source: http://github.com/grigio/meteor-shell\n"
  //           +"author: Luigi Maselli"
  //           +"\n\n"
  //           +"Known Bugs: some commands needs a page restart";
  // }
  Template.buffer.logs = function  () {
    return Log.find();
  }
  Template.input.events({

    'keypress input#cmd': function (evt) {
      if (evt.which === 13) { // enter key
        var cmd  = $('#cmd').val();
        console.log('exec: '+cmd );
        Meteor.call('cmd', cmd, function (err, data) {
          $('#cmd').val('');
          // Session.set('output', data );
        });
      }
    }

  });

  // Template.analytics.rendered = function () { 
  //   if (!window._gaq) {
  //     window._gaq = [];
      
  //     (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  //     (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  //     m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  //     })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  //     ga('create', 'UA-40601149-4', 'meteor.com');
  //     ga('send', 'pageview');
  //   }
// };

} // end client
var inital = "Meteor Shell 0.0.1";
if (Meteor.isServer) {
  var Future = Npm.require('fibers/future');
  Log.remove({});
  Log.insert({log : inital});
  var stderr = function (data) {
        // console.log('stderr function');
        message = 'err : '+data
        //console.log(message);
        Log.insert({log : message})
        // fut.ret(''+data);
      }
  var stdout = function (data) {
        // console.log('stdout function');
        message = 'log : '+data
        //console.log(message);
        Log.insert({log : message})
        // fut.ret(''+data);
      }
      var onBindEnvironmentError = function(error) {
            console.log('Error in bindEnvironment:', error);
        }
    
    var stderrWrapper = null;
    var stdoutWrapper = null;

    Meteor.startup(function () {
        stderrWrapper =  Meteor.bindEnvironment(stderr,onBindEnvironmentError);
        stdoutWrapper =  Meteor.bindEnvironment(stdout,onBindEnvironmentError);
    });
  Meteor.methods({

    cmd: function (command) {
        if(command == "clear"){
            Log.remove({});
            Log.insert({log : inital});
            return;
        }

      var message = "";
      var explode = command.split(' ');
      var cmd = explode[0];
      var args = explode.splice(1, explode.length);
      console.log("e:"+cmd+JSON.stringify(args));

      // var fut = new Future();

      var spawn = Npm.require('child_process').spawn;
      
      if (args.length == 0)
        ls    = spawn(cmd);
      else
        ls    = spawn(cmd , args);
      try{
      }
      catch(err){
        console.log(err);
      }
      ls.stdout.on('data', stdoutWrapper);

      ls.stderr.on('data',stderrWrapper);

      // return fut.wait();
    }
  });
  
} // end server
