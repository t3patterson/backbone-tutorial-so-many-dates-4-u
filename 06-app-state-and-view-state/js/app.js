// 06 - View-To-View State
//---------------------------------

// (1) put dater collection on router

// (2) create logic if user refreshes the page (this.daterCollectoin === undefined) 

// (3) create logic if user comes from multiview page (i.e. our app knows about a previous collection)

// (4) given our app knows about previous collection, filter for index of bioId from router

// (5) create a method on router to filter for index ... makes code clean

// (6) configure .render and ._buildTemplate to expect an index as a parameter

// (7) Ah shit, but now when we refresh everything is breaking!
//     Pass a 0 as the 2nd argument to the bound .render method in the initialize 
//     that executes on-sync --- remember, on-sync will only return one item since 
//     the collection.url is configured to fetch for a unique bio-id

//     the 0 will get passed as the `i` argument in the render method which then gets passed
//     to the _buildTemplate...


// (8) create the logic for the arrows
//     a) left arrow logic
//     b) right arrow logic
//     c) append arrows to htmlStr

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

  _buildTemplate: function(theCollection, theIndex){
    var dtrModels = theCollection.models,
       //(6b)
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

var AppRouter = Backbone.Router.extend({

  routes: {
    "profile/:id" : "showSingle",
    "*default" : "showMultiHome"  
  },


  showMultiHome: function(){
    this._clearView(this.containerView)
    //(1a)
    this.daterCollection = new DaterCollection()
                                              //(1b)
    this.containerView  = new MultiDaterView(this.daterCollection)

    //(1c)
    this.daterCollection.fetch()
  },

  showSingle: function(bioId){
      this._clearView(this.containerView)
    
    //(2)
    if (this.daterCollection === undefined){
        this.daterCollection = new DaterCollection()
        this.containerView = new SingleDaterView(this.daterCollection)
        this.daterCollection.url('bioguide_id='+bioId)
        this.daterCollection.fetch()
    } else { 
        //(3a)
        this.containerView = new SingleDaterView(this.daterCollection)
        //(3b)
        // this.containerView.render()  // BUT, IT GOES TO DARIN EVERYTME :(

        //(4) Filter
        // for (var i = 0 ; i <  this.daterCollection.models.length ; i++){
        //   var currentModl = this.daterCollection.models[i]
        //   if (currentModl.get('bioguide_id') === bioId ){
        //     console.log('current index of profile: ', i)
        //     return i
        //   }
        // }

        //(5b) execute
        console.log('current index of profile: ', this._getIndexOfProfile(bioId, this.daterCollection))
        var dtrIndex = this._getIndexOfProfile(bioId, this.daterCollection)

        //(6a)
        this.containerView.render(dtrIndex)
    }
  },

  // (5a) make funciton
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
    Backbone.history.start()
  }
})

var myApp = new AppRouter()

