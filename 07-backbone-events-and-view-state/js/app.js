// 07b - View-To-View State w/ Backbone Events
//===================================================

//--------------------------------------------
// PART 1 -- BUILD THE FAVS VIEW
//--------------------------------------------

// (1) Create html - div#favsview:

// (2) Build FavsView Constructor: 
//      - el ('#favs-list'), 
//      - render, 
//      - _buildTemplate, intiialize 

// (3) Put static html into the FavsView _buildTemplate
//   htmlStr =  ''
//   htmlStr += '<div class="fav">'
//   htmlStr +=   '<img src="http://flathash.com/bh" alt="img">'
//   htmlStr +=   '<h6>BH</h6>'
//   htmlStr += '</div>'

//   htmlStr += '<div class="fav">'
//   htmlStr += '  <img src="http://flathash.com/cp" alt="img">'
//   htmlStr += '  <h6>CP</h6>'
//   htmlStr += '</div>'
//   return htmlStr


// (4) Create instance of FavsView in the router's `initialize` method 
//     and force-render

//--------------------------------------------
// PART 2 -- RENDER VIEW THROUGH EVENT-LISTENER + BACKBONE.EVENTS
//--------------------------------------------

// (5) Create plus1-button event-listener + callback 
//      (a) create events object for click on button + callback name (addMeToFavs)
//      (b) create function , _addMeToFavs
//      (c) make sure its all wired up

// (6) Backbone.Events.trigger('newFav')

// (7) In FavsView.initialize, create the Backbone.Events.on('newFav') listener
//     and console.log("event heard!") 

// (8) Make the cb trigger the view's .render() method. Don't forget to bind!

//--------------------------------------------
// PART 3 -- BUILD THE EVENT-LOGIC
//--------------------------------------------
 // 
// (9) Put a data-bio_id attribute on the single view <button>

// (10) Send it to the  
//      // a) pick it up in the view (e.currentTarget.dataset['bio_id'] ) 
//         b) in the eventListener send it as the 2nd argument on the .trigger('newFav', xxxx )
//         c) catch it in the .on('newFav'  callback function
//        
//
// (11) But what we need is to send the actual model to the favsView...
//      ... so we are going to filter for it on the collection: 
//        var payload = `this.coll.where({bioguide_id: evt.currentTarget.dataset['bio_id'] })`

// (12) Send payload[0] as the 2nd argument in the `.trigger('newFav')` and console.log 
//       it in the `.on('newFav'...)`
// 
// (13) Create a property on the FavsView called `_favsModels` and push the model to the list
// 
// (14) Configure `_buildTemplate` to accept an array of models and render the html structure   
//      

// (15) BONUS -- test to see if the clicked dater's bioguide is on the _favsModels array 
//               and if so, pop an alert instead of pushing to the _favsModels


var DaterModel = Backbone.Model.extend({
})

var DaterCollection = Backbone.Collection.extend({
  model: DaterModel,
  
  url: function(masParams){
    var apiKeyParam = "apikey=7ba96d266cc84b168fab4d878d9aa141"; 
    
    var queryParams =  apiKeyParam 
    if ( masParams ) { queryParams += '&' + masParams}

    var fullUrl = "http://congress.api.sunlightfoundation.com/legislators?" + queryParams
    this.url = fullUrl
    return fullUrl
  },

  parse: function(rawData){
    return rawData.results
  }
})

var MultiDaterView = Backbone.View.extend({
  
  el: "#container",

  events: {
    "click .profile-card": "_navToSingle"
  },

  _navToSingle: function(evt){
    window.location.hash = "profile/" + evt.currentTarget.id
  },


  _buildTemplate: function(theCollection){
    var htmlStr = ''
    for (i = 0; i < theCollection.models.length; i++){
      var m = theCollection.models[i]
      htmlStr += '<div class="profile-card" id='+m.get('bioguide_id')+'>' 
      htmlStr +=   '<img src="http://flathash.com/'+ m.get('bioguide_id') +'">'
      htmlStr +=   "<h5>"+ m.get('first_name') + '</br>'
      htmlStr +=   '<small>' + m.get('state_name')+ '</small>'
      htmlStr +=   '</h5>'
      htmlStr += '</div>'
    }

    return htmlStr
  },


  initialize: function(c){
    this.coll = c
    this.coll.on('sync', this.render.bind(this) )
  },


  render: function(){
  
    this.el.innerHTML = "<h2>So, so many...</h2>"
    this.el.innerHTML += this._buildTemplate(this.coll)

  }
})

var SingleDaterView = Backbone.View.extend({
  el: "#container",

  //(5a)
  events: {
    "click button" : "_addMeToFavs",
  },

  //(5b)
  _addMeToFavs: function(e){
    console.log('event sent')
    // (10)
    //payload = e.target.dataset['bio_id']
    console.log(e.target.dataset['bio_id'])

    // (11)
    var payload = this.coll.where({ bioguide_id: e.target.dataset['bio_id'] })
    
    //(6)
    // Backbone.Events.trigger( "newFav")

    //(12)
    Backbone.Events.trigger( "newFav", payload[0])
  },



  _buildTemplate: function(theCollection, theIndex){
    var dtrModels = theCollection.models,
        currentI  = theIndex

    console.log(dtrModels)

    if (currentI === undefined || currentI === 0){ 
      var leftArrowHTML = ''
    } else {
      var prevBioId = dtrModels[currentI - 1].get('bioguide_id') 
      var leftArrowHTML = '<a class="left-arrow" href="#profile/'+prevBioId+'">&lt;</a>'
    }

    if (currentI === undefined || currentI + 1 === dtrModels.length){ 
          var rightArrowHTML = ''
        } else {
          var nextBioId = dtrModels[currentI + 1].get('bioguide_id')
          var rightArrowHTML = '<a class="right-arrow" href="#profile/'+ nextBioId + '"> &gt;</a>'
        }

    var htmlStr = '<div class="single-profile">'
        htmlStr+=  '<div class="main">'
        htmlStr+=    '<img src="http://flathash.com/'+ dtrModels[currentI].get('bioguide_id')+'" />'
        htmlStr+=    '<h4> &hearts; ' + dtrModels[currentI].get('district') +   '</h4>'
                                              //(9)
        htmlStr+=    '<button class="add-to-favs" data-bio_id="'+ dtrModels[currentI].get('bioguide_id') +'">+</button>'
        htmlStr+=  '</div>'
        htmlStr+=   '<div class="details">'
        htmlStr+=    '<h3> '+ dtrModels[currentI].get('first_name') +  ' </h3>'
        htmlStr+=    '<h6>D.O.B:</h6>'
        htmlStr+=    '<p> ' + dtrModels[currentI].get('birthday') + '</p>'
        htmlStr+=    '<h6>Address:</h6>'
        htmlStr+=    '<p> '  + dtrModels[currentI].get('office') +   '</p>'
        htmlStr+=    '<h6>Originally From:</h6>'
        htmlStr+=    '<p> '  + dtrModels[currentI].get('state_name') +   '</p>'
        htmlStr+=    '<h6>Member Since:</h6>'
        htmlStr+=    '<p> '  + dtrModels[currentI].get('term_start') +   '</p>'
        htmlStr+=    '<h6>Get in Touch:</h6>'
        htmlStr+=    '<p>'   + dtrModels[currentI].get('oc_email') +   '<br/>|'  + dtrModels[currentI].get('phone') +    '|</p>'
        htmlStr+=    '<h6>[R]elaxed or [D]emanding:</h6>'
        htmlStr+=    '<p>'  + dtrModels[currentI].get('party') +   '</p>'
        htmlStr+=   '</div>'
        htmlStr+= '</div>'

    return leftArrowHTML + rightArrowHTML + htmlStr
  },

  initialize: function(c){
    this.coll = c
    this.coll.on('sync', this.render.bind(this, 0) )
  },

  render: function(i){
    console.log(this.coll)
    this.el.innerHTML += this._buildTemplate(this.coll, i)
  }
})


// (2)
var FavsView = Backbone.View.extend({
  el: "#current-favs",

  //(13a)
  _favsModels : [],
  
  _buildTemplate : function(favsListModels){
    //(3)
    // htmlStr =  ''
    // htmlStr += '<div class="fav">'
    // htmlStr +=   '<img src="http://flathash.com/bh" alt="img">'
    // htmlStr +=   '<h6>BH</h6>'
    // htmlStr += '</div>'

    // htmlStr += '<div class="fav">'
    // htmlStr += '  <img src="http://flathash.com/cp" alt="img">'
    // htmlStr += '  <h6>CP</h6>'
    // htmlStr += '</div>'
    // return htmlStr


    // (14)
    var htmlStr = ''
    for (var i = 0; i < favsListModels.length ; i++){ 
      var first_name = favsListModels[i].get('first_name')  
      var bioId = favsListModels[i].get('bioguide_id')  
    
      htmlStr += '<div class="fav">'
      htmlStr +=   '<img src="http://flathash.com/'+ bioId + '" alt="img">'
      htmlStr +=   '<h6>'+first_name+'</h6>'
      htmlStr += '</div>'
    } 
    
    return htmlStr
  },

  initialize: function(){
    Backbone.Events.on("newFav", function(payload){
      console.log('event HEARD!')

      //(13b)
      this._favsModels.push(payload)
      
      //(7) 
      this.render()

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
    "*default" : "showMultiHome"  
  },


  showMultiHome: function(){
    this._clearView(this.containerView)
    this.daterCollection = new DaterCollection()
    this.containerView  = new MultiDaterView(this.daterCollection)

    this.daterCollection.fetch()
  },

  showSingle: function(bioId){
      this._clearView(this.containerView)
    
    if (this.daterCollection === undefined){
        this.daterCollection = new DaterCollection()
        this.containerView = new SingleDaterView(this.daterCollection)
        this.daterCollection.url('bioguide_id='+bioId)
        this.daterCollection.fetch()
    } else { 

        this.containerView = new SingleDaterView(this.daterCollection)
        console.log('current index of profile: ', this._getIndexOfProfile(bioId, this.daterCollection))
        var dtrIndex = this._getIndexOfProfile(bioId, this.daterCollection)

        this.containerView.render(dtrIndex)
    }
  },

  _getIndexOfProfile(idInRoute, daterColl){
    for (var i = 0 ; i <  daterColl.models.length ; i++){
      var modl = this.daterCollection.models[i]
      if (modl.get('bioguide_id') === idInRoute ){
        return i
      }
    }
  },

  _clearView: function(v){
    if (v){ 
      v.el.innerHTML = '',
      v.undelegateEvents();
      v.off()
    }
  },


  initialize: function(){
    //(4)
    this.favsView = new FavsView()
    // this.favsView.render() 
    Backbone.history.start()
  }
})

var myApp = new AppRouter()

