var container_el = document.querySelector('#container')

var ProfileModel = Backbone.Model.extend({
})

var ProfileCollection = Backbone.Collection.extend({
  model: ProfileModel,

  url: function(masParams){
    var apiKeyParam = "apikey=7ba96d266cc84b168fab4d878d9aa141"; 
    
    var queryParams =  apiKeyParam 
    if ( masParams ) { queryParams += '&' + masParams}

    var fullUrl = "http://congress.api.sunlightfoundation.com/legislators?" + queryParams

    this.url = fullUrl
    return fullUrl  
  },

  parse: function(d){
    return d.results
  }
})

var ProfileSingleView = Backbone.View.extend({
  el: '#container',


  events: {
    "click button" : "_addMe",
  },

  _addMe: function(e){
    console.log('event sent')
    console.log(e.target.dataset['bio'])
    var payload = this.coll.where({ bioguide_id: e.target.dataset['bio'] })
    Backbone.Events.trigger( "newFav", payload[0])
  },

  _buildTemplate: function(aCollection, dex){
    var htmlStr = document.querySelector('#single-view_templ').innerHTML
    var compiled = _.template(htmlStr)({bbModList: aCollection.models, initialI: dex })
    return compiled
  },

  initialize: function(c, i){
    console.log(c)
    this.coll = c
    // send default index at 0...unless sth else is specifed
    this._currentIndex = 0
    this.coll.on('sync', this.render.bind(this, this._currentIndex))
    this.on('')
  },

  render: function(i){
    if (i) {this._currentIndex = i}
    this.el.innerHTML = this._buildTemplate(this.coll, this._currentIndex)
    return this
  }
})

var ProfileMultiView = Backbone.View.extend({
  el: '#container',
  
  coll: null,

  events: {
    "click .profile-card" : "handleProfileSelect"
  },

  handleProfileSelect: function(e){
    window.location.hash = "profile/"+e.currentTarget.id
  },

  initialize: function(collectionPls){
    this.coll = collectionPls
    console.log(this.coll)
    this.coll.on("sync", this.render.bind(this) )
  },

  _buildTemplate: function(aCollection){
    var htmlStr = ''
    var collModels = aCollection.models
    for (var i = 0; i < collModels.length ; i++){
      var m = collModels[i]
      htmlStr += '<div class="profile-card" id='+m.get('bioguide_id')+'>' 
      htmlStr +=   '<img src="http://flathash.com/'+ m.get('bioguide_id') +'">'
      htmlStr +=   "<h5>"+ m.get('first_name') + '</br>'
      htmlStr +=   '<small>' + m.get('state_name')+ '</small>'
      htmlStr +=   '</h5>'
      htmlStr += '</div>'
    }
    return htmlStr
  },

  render: function(){
    console.log('rendering:multi')
    this.el.innerHTML = this._buildTemplate(this.coll)
    return this
  }
})

var NavView = Backbone.View.extend({
  el: 'nav',

  events: {
    'keypress input' : 'handleStateSearch',
  },

  handleStateSearch: function(evt){
    console.log(evt)
    if (evt.keyCode === 13 ) {
      var searchQ = evt.target.value 
      if( searchQ.length > 2 ) {
        alert("too long!! please give state short-name only");
        return
      }

      evt.target.value = ''
      window.location.hash = "state/" + searchQ

    }
  },

  _buildTemplate: function(){
    var htmlStr = ''
    htmlStr += '<input type="text" placeholder="Search by state! (ex: FL)">'
    return htmlStr
  },

  render: function(){
    this.el.innerHTML = this._buildTemplate()
    return this
  }
})

var FavsView = Backbone.View.extend({
  el: "#current-favs",
  _favsModels : [],
  _buildTemplate : function(models){
    var htmlTemplate = document.querySelector('#favs-view_templ').innerHTML
    return _.template(htmlTemplate)({favsList: models})
  },

  initialize: function(){
    Backbone.Events.on("newFav", function(payload){
      // if favsModels doesn't have user, push to favs-list, else pop an alert:
      if ( !this._favsModels.find(function(m){return m.get('bioguide_id') === payload.get('bioguide_id')}) ){
        this._favsModels.push(payload)
        this.render()
      } else {
        alert('  already on your favs, silly!')
      }
    }.bind(this))
  },

  render: function(){
    console.log(this._favsModels)
    this.el.innerHTML = this._buildTemplate(this._favsModels)
    return this
  }

})


var AppRouter = Backbone.Router.extend({
  routes: {
    "profile/:id" : "showSingle",
    "state/:st" : "showProfilesByState",
    "*default" : "showProfiles"  
  },

  showProfiles: function(){
    this.datersCollection = new ProfileCollection();
    this.manyDatersView = new ProfileMultiView(this.datersCollection)
    this.datersCollection.fetch()
  },

  showSingle: function(bioId){

    // collection doesn't exist or only has one value on it...
    if ( !this.datersCollection /*|| this.datersCollection.models.length === 1*/){
      
      //...then we want to create a new profile-collection and fetch the bio-id from the route
      this.datersCollection = new ProfileCollection()
      this.datersCollection.url("bioguide_id="+bioId)
      this.datersCollection.fetch()
      this.singleDaterView = new ProfileSingleView(this.datersCollection)

    } else {
      var i = this.datersCollection.findIndex({bioguide_id: bioId})

      // it is a good idea to put the view-instance on the router so that we overwrite
      //   the view-instance each time the page re-renders (thus not leaving zombie views)
      if ( this.singleDaterView ) {
          this.singleDaterView.undelegateEvents();
          this.singleDaterView = null
      }

      this.singleDaterView = new ProfileSingleView(this.datersCollection )
      this.singleDaterView.render(i)
    }
    
  },

  showProfilesByState: function(stateName){
    this.datersCollection = new ProfileCollection()
    var manyDatersView = new ProfileMultiView(this.datersCollection)
    this.datersCollection.url( 'state='+stateName.toUpperCase() )
    this.datersCollection.fetch()
  },

  initialize: function(){
    this.navBar = new NavView();
    this.favsViewInstance = new FavsView();
    
    this.navBar.render()
    this.favsViewInstance.render()
    Backbone.history.start()
  }
})

var myApp = new AppRouter()

