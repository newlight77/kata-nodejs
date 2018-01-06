const async = require ('async')

module.exports = function(app) {

  //create all models
  async.parallel({
    notes: async.apply(createNotes)
  }, function(err, results) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log('> models created sucessfully');
  });

  //create reviewers
  function createNotes(cb) {
    // var collection =   app.dataSources.arango.getCollection('Note');
   // collection.create('Note')
    app.dataSources.arango.automigrate('Note', function(err) {
      if (err) return cb(err);
      var Note = app.models.Note;
      Note.create([{
        title: 'Bel Cafe',
        content: 'Vancouver'
      }, {
        title: 'Bel Cafe Paris',
        content: 'Vancouver'
      }, {
        title: 'Bel Cafe Mongallet',
        content: 'Vancouver'
      }], cb);
    });
  }

};
