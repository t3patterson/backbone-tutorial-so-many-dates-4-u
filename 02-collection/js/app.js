// 02 - Configure Collection
//---------------------------------

// (0) Configuration: Get apikey from: http://sunlightfoundation.com/api/ and 
//     make sure you can get json-data in the browser

// (1) extend Backbone.Model to a `DaterModel`
 
// (2) extend Backbone.Collection to `DaterCollection`

// (3) configure DaterCollection properties/methods
//      a) model
//      b) url (to sunlight -- http://congress.api.sunlightfoundation.com/legislators?)
//           NOTE: we will want our collection to be able to fetch many legislatures or one
//      c) parse (will configure later)


// (4) ensure that you can fetch data from the callback-method in your router
//      a) fetch many legislatures
//      b) add the `bioguide_id=«bioId»` query to the url's query-string, 
//         and fetch a single legislature (by bioguide_id)


// (5) return the relevant portion of the data in the Collection's .parse methods  
//     (i.e.  rawData.results)

// (6) Log the `laCollecion` instance inside the .then callback to make sure that the .parse
//     is working properly --- you should see `models: Array[20]` as a property indicating that
//     the data has been parsed into backbone-models

var container_el = document.querySelector('#container')

var DaterModel = Backbone.Model.extend({
})

var DaterCollection = Backbone.Collection.extend({
  //(3a)
  model: DaterModel,
  
  //(3b)
  url: function(masParams){
    var apiKeyParam = "apikey=7ba96d266cc84b168fab4d878d9aa141"; 
    
    var queryParams =  apiKeyParam 
    if ( masParams ) { queryParams += '&' + masParams}

    var fullUrl = "http://congress.api.sunlightfoundation.com/legislators?" + queryParams
    this.url = fullUrl
    return fullUrl
  },

  //(3c)
  parse: function(rawData){
    //(5)
    return rawData.results
  }


})


// (1)
var AppRouter = Backbone.Router.extend({

  //(3)
  routes: {
    "profile/:id" : "showSingle",
    "*default" : "showMultiHome"  
  },

  showMultiHome: function(){
    container_el.innerHTML = "<h2>Multi Profile View To Go Here</h2>"
    var laCollecion = new DaterCollection()

    //(4a)
    laCollecion.fetch().then(function(d){
      // (6)
      console.log(laCollecion)
    })
  },

  showSingle: function(bioId){
    container_el.innerHTML = "<h2>Single profile: «" +  bioId + "» To Go Here</h2>"
      var laCollecion = new DaterCollection()
      
      //(4b)

      laCollecion.url('bioguide_id='+bioId)
      
      laCollecion.fetch().then(function(d){
        console.log(d)
      })

  },


  initialize: function(){
    Backbone.history.start()
  }
})

// (2)
var myApp = new AppRouter()

