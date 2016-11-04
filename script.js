//wait for do to be ready
$(document).ready(function() {
  // Get the template
  var template = Handlebars.getTemplate('product-template');
  // Retrieve the placeHolder where the content will be displayed
  var content = $("#content");
  // Fetch all JSON data from server
  $.get("data.json", function (data, status, xhr) {
    $.each(data.sales, function (index, element) {
      // Generate the HTML for each data item
      var html = template(element);
      // Render the content into the page
      content.append(html);
    });
  });

  //since the items are dynamically populated after the dom is initiated you have to rebind the mouseover and mouseout event handlers again
  //Fade in and fade out the description hover
  $(document).on('mouseover', '.product-container', function () {
      $(this).find('.description-text').css({visibility:"visible", opacity: 0.0}).stop().animate({opacity: 1.0},400);
    }).on('mouseout', '.product-container', function () {
      $(this).find('.description-text').stop().animate({opacity: 0.0}, 500)
  });


  $(document).on('click', 'span.closer', function(e) {
    e.preventDefault();
    e.stopPropagation();
    //when you click close get the id of the product to delete and pass it to the modal
    var id = $(this).parents( ".product-container" ).data('id');
    $('#myModal').data('id', id).modal('show');
  });

  $('#btnYes').click(function() {
    // handle deletion here
    var id = $('#myModal').data('id');
    $('[data-id='+id+']').hide("slow", function() { //fade
            $(this).remove(); //then remove from the DOM
    });
    $('#myModal').modal('hide'); //close the modal
  });

});  //END document.ready


// Make a Handebars function that will allow you to pass in the name of the template from an external file.
// This also makes it so you can call the same function to load different templates on the same page like partials.
Handlebars.getTemplate = function(name) {
  if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
    $.ajax({
      url : name + '.html',
      success : function(data) {
        if (Handlebars.templates === undefined) {
          Handlebars.templates = {};
        }
        Handlebars.templates[name] = Handlebars.compile(data);
      },
      async : false
    });
  }
  return Handlebars.templates[name];
};





/*
Everything you guys had was nice but all unnecessary.
There was an ajax call to the template each time it was placed on the page.
So if you had 200+ products on the page that was 200+ ajax calls of the same template file. OMG!!
The template should be cached and not parsed everytime a product is displayed.
I've implemented handlebars library just for the sole purpose of solving this issue.
Template is cached and pre compiled.
*/

// Moving the meat of tha script to the top so that its easier to debug with the functions at the bottom, logic at the top.
//var page=new domobj();
//page.getproducts('data.json');
//Extended the setTimeout times so that the content populates
//setTimeout("console.log('building html');page.updateproducthtml();",200);
//setTimeout("page.updatedom()",1000)


/*
function domobj(){
  var self        =this;
  self.products   = [];

  self.getproducts = function(url){
    $.getJSON(url, function(response){
        for(i=0; i<response.sales.length ; i++){
          self.products.push( new productobj(response.sales[i], i)  );
        }
    });
  }
    
  self.updateproducthtml = function(){
    for( i=0; i< self.products.length ; i++){
      self.products[i].updatehtml();
    }
  }
  
  self.updatedom = function(){
    var i=0
    thishtml='';
    for( i=0; i< self.products.length ; i++){
      if (i % 3 == 0 ){  thishtml += "<div class='row'>"; console.log("START") }
      thishtml += self.products[i].htmlview;
      if ((i % 3 == 2) || i == (self.products.length-1) ){thishtml += "</div>";console.log("FINISH")}
    }
    $("#content").append(thishtml)
  }
  
}

function productobj(product, i){
  var self          = this;
  self.photo        = product.photos.medium_half
  self.title        = product.name
  self.tagline      = product.tagline
  self.url          = product.url
  self.descript     = product.description
  self.htmlview     = ""
  self.index        = i
  self.custom_class = "col"+ ((i % 3) +1)
  
  self.updatehtml= function(){
    $.get('product-template.html', function(template){
      self.htmlview = template.replace('{image}', self.photo).replace('{title}', self.title).replace('{tagline}', self.tagline).replace('{url}', self.url).replace('{custom_class}', self.custom_class).replace('{description}', self.descript);
    });
  }
}

*/