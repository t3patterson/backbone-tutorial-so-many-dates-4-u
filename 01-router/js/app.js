// 01 - Configure Router
//---------------------------------

// (0) Make sure jQuery, _, and BB are wired UP!

// (1) extend Backbone.Router

// (2) create router instance with `new` keyword

// (3) set routes + route-callback functions

// (4) create route-callback functions for our 2 routes

// (5) tell the router to take over browser-history/hash-routes with Backbone.history.start()
//      in the Router's `initialize` function

var container_el = document.querySelector('#container')

// (1)
var AppRouter = Backbone.Router.extend({

  //(3)
  routes: {
    "profile/:id" : "showSingle",
    "*default" : "showMultiHome"  
  },

  //(4a)
  showMultiHome: function(){
    container_el.innerHTML = "<h2>Multi Profile View To Go Here</h2>"
  },

  //(4b)
  showSingle: function(id){
    container_el.innerHTML = "<h2> Single profile: «" +  id + "» To Go Here</h2>"
  },


  initialize: function(){
    console.log('hi, route party started')
    Backbone.history.start()
  }
})

// (2)
var myApp = new AppRouter()

