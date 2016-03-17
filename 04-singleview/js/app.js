// 04 - Configure The SingleView
//---------------------------------

// (0) Before we build our view, let's revisit first how we are able to use our collection to
//     fetch a single record.
//        a) we need to build the url properly
//        b) we will examine to see how the collection is getting parse


// (1) Extend Backbone.View to `SingleDaterView`

// (2) Create the major and minor properties/methods:
//     a) el             -- selects DOM element on page
//     b) render         -- selects element and executes the render method
//     c) _buildTemplate -- will generate the html-string for our view
//     d) initialize     -- connects the collection to the view and instructs the view to execute
//                            its render method on data-sync 

// (3) Create instance of the view and pass it the collection instance as an argument 
//     a) Create SingleDaterView instance on the router

// (4) Ensure that we can render a simple view ('#profile/S001198')

// (5) Ensure that we can render the complex view



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
    this.el.innerHTML = "<h2>So So Many</h2>"
  
    //(5)
    // for (var i = 0; i < this.coll.models.length; i++){
    //   this.el.innerHTML += "<p>-" + this.coll.models[i].get('first_name') + "</p>" 
    // }

    //(6)
    this.el.innerHTML += this._buildTemplate(this.coll)

  }
})

var SingleDaterView = Backbone.View.extend({
// (2a)  
  el: "#container",

// (2c)  
  _buildTemplate: function(theCollection){
    var dtrModels = theCollection.models,
        currentI  = 0

    //(4)
    // var htmlStr = '<h4>' + dtrModels[currentI].get('last_name') + '</h4>'

    //(5)
    var htmlStr = '<div class="single-profile">'
        htmlStr+=  '<div class="main">'
        htmlStr+=    '<img src="http://flathash.com/ '+ dtrModels[currentI].get('bioguide_id')+'" />'
        htmlStr+=    '<h4> &hearts; ' + dtrModels[currentI].get('district') +   '</h4>'
        htmlStr+=    '<button class="add-to-favs" data-bio="'+ dtrModels[currentI].get('bioguide_id') +'">+</button>'
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

    return htmlStr
  },

// (2d)  
  initialize: function(c){
    this.coll = c
    this.coll.on('sync', this.render.bind(this) )
  },

// (2b)
  render: function(){
    this.el.innerHTML += this._buildTemplate(this.coll)
  }
})

var AppRouter = Backbone.Router.extend({

  routes: {
    "profile/:id" : "showSingle",
    "*default" : "showMultiHome"  
  },

  showMultiHome: function(){
    var laCollecion = new DaterCollection()
    var multiViewInstance = new MultiDaterView(laCollecion)
    laCollecion.fetch()
  },

  showSingle: function(bioId){
      var collectionOfOne = new DaterCollection()
      var singleView = new SingleDaterView(collectionOfOne)

      // (0a)
      collectionOfOne.url('bioguide_id='+bioId)

      //(0b) 
      collectionOfOne.fetch()//.then(function(){ console.log(collectionOfOne)} )

  },


  initialize: function(){
    Backbone.history.start()
  }
})

// (2)
var myApp = new AppRouter()

