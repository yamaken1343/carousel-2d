# Carousel 2D
Content slider that works in two directions

## Demo
https://yamaken1343.github.io/carousel-2d/

## Features
   - Move in two directions
   - Full vanilla js
   - Lightweight
   - Easy customize
   
## Quick start
### install
download carousel2d.js and carousel2d.css and load to your html file
### Usage
Place content in html
```html
<div id="freeID" class="carousel2d">
    <div class="carousel2dRow">
        <div class="carousel2dCol"><div class="content"> 0 </div></div>
        <div class="carousel2dCol"><div class="content"> 1 </div></div>
        ...
        <div class="carousel2dCol"><div class="content"> 9 </div></div>
    </div>
    <div class="carousel2dRow">
        <div class="carousel2dCol"><div class="content"> 10 </div></div>
        <div class="carousel2dCol"><div class="content"> 11 </div></div>
...
</div>
```

write css
```css
:root {
    --carousel2dControllerSize: 20px;
    --carousel2dControllerWidth: 3px;
    --carousel2dControllerColor: #0500ff;
}

#freeID {
    width: 500px;
    height: 400px;
    ...
}
.content {
    width: 100%;
    height: 100%;
    ...
}
```

and write javascript
```javascript
let freeId = new Carousel2d('freeID', false, {
    contentHeightNum: 10,  //   
    contentWidthNum: 10,  //
    contentWidth: '100px',  // .carousel2dCol width
    contentHeight: `100px`,  // .carousel2dCol Height
    targetX: 5,  // init move content 
    targetY: 5,
    useView: true, 
    useController: true

});
``` 