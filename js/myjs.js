var c = $('#items');
var p = $('#page');
var filter = $('#filter');

var randomInt = function(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

var openUrl = function(url) {
  $(location).attr('href', url);
}

var createDiv = function(x, y, width, height, id, item){
    if(item){
      var div = $('<div/>', {
          id: id,
          class: "item",
          onClick: "openUrl(\"" + item.url  + "\");",
          style: "position: absolute; " +
                  "left: " + x + "px; " +
                  "top: " + y + "px; " +
                  "width: " + width + "px; " +
                  "height: " + height + "px; " +
                  "background-image:" + 
                  //" url(\"" + item.url + "\"), " + 
                  " url(\"" + item.thumb + "\"); " + 
                  "background-size: cover; " +
                  "background-position: center;"

      });
      
      if(item.album === true){
        var album = $('<div/>', {
          class: "album"
        }).appendTo(div);
      }
      
      div.appendTo('#items');
    }
};

var maxPerRow;    
var createGrid = function(list){
  if(list.length > 0){
    //c.empty();
    var num = list.length;    
    var numRows;
    var lastRowWidth;
    var lastRowNum;
    var width;
    numRows = Math.ceil(num / maxPerRow);
    width = Math.ceil(c.width() / maxPerRow);
    if(num % maxPerRow > 0){
        lastRowWidth = Math.ceil(c.width() / (num % maxPerRow));
        lastRowNum = num % maxPerRow;
    }else{
        lastRowWidth = width;
        lastRowNum = maxPerRow;
    }
    var height = width;
    p.height((numRows * height) + 90);
    var counter = 0;
    for(var r = 0; r < numRows; r++){
        var tempWidth = width;
        var tempCounter = maxPerRow;        
        if(!(r < numRows-1)){
            tempCounter = lastRowNum;    
        }
        
        for(var j = 0; j < tempCounter; j++){            
            var id = counter;
            createDiv(j * tempWidth, r * height, tempWidth, height, id, list[id]);                      
            counter += 1;
        }
    }
  }
};

var thumbHash = {};
var list = [];
var after;
var getList = function(param){
  return $.getJSON("http://www.reddit.com/r/" + $('#filter')[0].value + ".json" + param, function(data){
    var temp = data.data.children.map(function(child){
        var url = child.data.url;
        url = url.replace('gifv', 'gif');
        var album;
        var image;
        if(url.indexOf('.jpg') < 0 && 
            url.indexOf('.jpeg') < 0 &&
            url.indexOf('.png') < 0 &&
            url.indexOf('.gif') < 0){
          if(child.data.thumbnail){
            album = true;
          }else{
            album = false;
          }
          image = false;
        }else{
          album = false;
          image = true;
        }
        var obj = { id: child.data.id, url: url, thumb: child.data.thumbnail, album: album, image: image };
        return obj;
    }).filter(function(item){
      return !thumbHash[item.thumb] && (item.album || item.image) && item.thumb !== 'self' && item.thumb !== 'nsfw' && item.thumb !== "";
    });

    temp.forEach(function(item){
      list.push(item);
      thumbHash[item.thumb] = true;
    });
    after = data.data.after;
  });
};



var run = function(){
  c.empty();
  if(filter[0].value.length > 0){
    var p = getList("").promise().then(function(){
      createGrid(list);
    });
  }
}

//$(document).keypress(function(e) {
//  if(e.which == 13) {
//    run();
//  }
//});

$('#filter').keyup(function(){
  p.removeAttr("style");
  list = [];
  thumbHash = {};
  run();
}); 

var id;

var setMaxPerRow = function(){
    if($(window).width() >= 1300){
      maxPerRow = 7;
    }else if($(window).width() >= 1100){
      maxPerRow = 6;
    }else if($(window).width() >= 900){
      maxPerRow = 5;
    }else if($(window).width() >= 700){
      maxPerRow = 4;
    }else if($(window).width() >= 500){
      maxPerRow = 3;
    }else{
      maxPerRow = 2;
    } 
}
setMaxPerRow();

$(window).resize(function() {
    setMaxPerRow();
    c.empty();
    clearTimeout(id);
    id = setTimeout(run, 500);
});

var itemCount = 0;
var promise;
$(window).scroll(function() {
  if(($(window).scrollTop() + $(window).height() == $(document).height()) && !promise && after !== null) {
    if(filter[0].value.length > 0){
      promise = getList("?count=" + itemCount + "&after=" + after).promise().then(function(){
        createGrid(list);
        itemCount += 25;
        promise = null;
      });
    } 
  }
});

//run();










