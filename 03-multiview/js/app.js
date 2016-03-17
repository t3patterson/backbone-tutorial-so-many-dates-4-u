// 03 - Configure The MultiView
//---------------------------------

// (0) Configuration: Get apikey from: http://sunlightfoundation.com/api/ and 
//     make sure you can get json-data in the browser

// (1) Extend Backbone.View to `MultiDaterView`

// (2) Create the major properties/methods:
//     a) el
//     b) initialize
//     c) render

// (3) Render MutliDaterView to Page
//     a) Create instance on the router 
//     b) Test to make sure it shows up on page

// (4) Connect the MultiDaterView to the collection
//     a) Configure the MultiView's 'initialize' method to accept a collection
//        and store that collection as a property on the view
//     
//     b) On the view's collection, create an .on('sync', ... ) that will execute 
//        the view's render-method when a data-synchronziation event occurs (i.e. after a fetch)
//
//     c) In the Router, pass the collection to the view as an argument


// (5) Sanity Check - collection.models to the DOM
//     Build a for-loop to iterate over the collection's models and render very simple HTML 
//     dynamically in the view's render method

// (6) Cleanup - Create a method to build the HTML string
//     We will create on the `_buildTemplate` that will be responsible
//     for dynamically generating the HTML string from the models on the collection


var container_el = document.querySelector('#container')

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
  //(2a)
  el: "#container",

  //(6)
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

  //(2b)
  initialize: function(c){
    // (4a)
    this.coll = c

    // (4b)
    this.coll.on('sync', this.render.bind(this) )
  },

  //(2c)
  render: function(){
    //(3b)
    this.el.innerHTML = "<h2>So, so many...</h2>"
  
    //(5)
    // for (var i = 0; i < this.coll.models.length; i++){
    //   this.el.innerHTML += "<p>-" + this.coll.models[i].get('first_name') + "</p>" 
    // }

    //(6)
    this.el.innerHTML += this._buildTemplate(this.coll)

  }
})

var AppRouter = Backbone.Router.extend({

  routes: {
    "profile/:id" : "showSingle",
    "*default" : "showMultiHome"  
  },

  showMultiHome: function(){
    var laColeccion = new DaterCollection()

    //(3a)                                      //4)
    var multiViewInstance = new MultiDaterView(laColeccion)
    //(3b)
    multiViewInstance.render()

    laColeccion.fetch()

  },

  showSingle: function(bioId){
    container_el.innerHTML = "<h2> Single profile: «" +  bioId + "» To Go Here</h2>"
      var laColeccion = new DaterCollection()
      

      laColeccion.url('bioguide_id='+bioId)
      
      laColeccion.fetch().then(function(d){
        console.log(d)
      })

  },


  initialize: function(){
    Backbone.history.start()
  }
})

// (2)
var myApp = new AppRouter()

