// 06 - View-To-View State
//---------------------------------
//
// (1) Our SingleDaterView instance needs to see if our app has already fetched a collection...
//     ...so we will put dater collection on router in showMultiHome 
//        with this.collection = new DaterCollection()

// (2) ...then we will create (if-else) logic to see whether that this.collection is undefined
//       if(this.daterCollection === undefined)
//           ---> same as always

// (3) ELSE (a) we will create a new instance of our view and pass this.collection at instantiation new
//          (b) and force-rendeer
//     
// (4)  (a) filter for the current model on the collection based on the bioId from the window.location.hash
//      (b) move it to a method and store index value in variable


// (5) Ah shit, but now when we refresh everything is breaking!
//     Pass a 0 as the 2nd argument to the bound .render method in the initialize 
//     that executes on-sync --- remember, on-sync will only return one item since 
//     the collection.url is configured to fetch for a unique bio-id if this.collection === undefined

//     the 0 will get passed as the `i` argument in the render method which then gets passed
//     to the _buildTemplate!


// (7) a) create the logic for the left arrow and append 
//         IF currentI === 0, THEN don't show left-arrow html 
//            which has the bioguide-id of currentI - 1 in href 
//         ELSE show left-arrow
//     b) append to the HTMLstring
///        

// (8) a) create logic for the right arrow (IF currentI + 1 === this.coll.length, THEN don't show riht-arrow ELSE show left-arrow)
//     IF currentI + 1 === this.coll.length, THEN don't show right-arrow html 
//           which has the bioguide-id of currentI + 1 in href 
//         ELSE show right-arrow

//     b) append to the HTMLstring


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
        currentI  = theIndex

    console.log(dtrModels)

    //7a) Left Arrow logic
    if (currentI === undefined || currentI === 0){ 
      var leftArrowHTML = ''
    } else {
      var prevBioId = dtrModels[currentI - 1].get('bioguide_id') 
      var leftArrowHTML = '<a class="left-arrow" href="#profile/'+prevBioId+'">&lt;</a>'
    }

    //8a) Right Arrow Logic
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
    //(6)
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
    //(2)
    this.daterCollection = new DaterCollection()
                                              
    this.containerView  = new MultiDaterView(this.daterCollection)

    this.daterCollection.fetch()
  },

  showSingle: function(bioId){
      this._clearView(this.containerView)
    
    //(1)
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

        //(4a) Filter
        // for (var i = 0 ; i <  this.daterCollection.models.length ; i++){
        //   var currentModl = this.daterCollection.models[i]
        //   if (currentModl.get('bioguide_id') === bioId ){
        //     console.log('current index of profile: ', i)
        //     return i
        //   }
        // }

        //(4b-2) execute
        console.log('current index of profile: ', this._getIndexOfProfile(bioId, this.daterCollection))
        var dtrIndex = this._getIndexOfProfile(bioId, this.daterCollection)

        //(6a)
        this.containerView.render(dtrIndex)
    }
  },

  // (4b-1) make funciton
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

