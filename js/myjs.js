var randomInt = function(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

var createDiv = function(x, y, width, height, id, item){
    
    var r = randomInt(175, 225);
    $('<div/>', {
        id: id,
        class: "item",
        style: "position: absolute; " +
                "left: " + x + "px; " +
                "top: " + y + "px; " +
                "width: " + width + "px; " +
                "height: " + height + "px; " +
                "background-image: url(\"" + 
                  (item.album === true ? item.thumb : item.url) + 
                "\");" + 
                "background-size: cover"
    }).appendTo('#items');
};

var createGrid = function(list){
  if(list.length > 0){
    var c = $('#items');
    var p = $('#page');
    c.empty();
    var maxPerRow = 3;    
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
        
        for(var c = 0; c < tempCounter; c++){            
            var id = counter;
            createDiv(c * tempWidth, r * height, tempWidth, height, id, list[id]);                      
            counter += 1;
        }
    }
  }
};

var list = [];
var getList = function(){
  console.log('getting list');
  return $.getJSON("http://www.reddit.com/r/" + $('#filter')[0].value + ".json", function(data){
    list = data.data.children.map(function(child){
      if(child.data.url && child.data.thumbnail && child.data.thumbnail !== 'self'){
      console.log(child, child.data.thumbnail);
        var url = child.data.url;
        url = url.replace('gifv', 'gif');
        var album;
        if(url.indexOf('.jpg') < 0 && 
            url.indexOf('.jpeg') < 0 &&
            url.indexOf('.png') < 0 &&
            url.indexOf('.gif') < 0){
          album = true;
        }else{
          album = false;
        }

        var obj = { url: url, thumb: child.data.thumbnail, album: album };
        return obj;
      }
    });
  });
};


$('#filter').keyup(function(e){
  if(this.value.length > 0){
    getList().done(function(){
      createGrid(list);
    });
  }
});

$(window).resize(createGrid(list));










