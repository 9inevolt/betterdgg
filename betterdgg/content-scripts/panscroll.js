/*
Copyright (c) 2010, Loren Segal
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. All advertising materials mentioning features or use of this software
   must display the following acknowledgement:
   This product includes software developed by Loren Segal.
4. Neither the name of Loren Segal nor the names of its contributors may
   be used to endorse or promote products derived from this software without
   specific prior written permission.

THIS SOFTWARE IS PROVIDED BY LOREN SEGAL ''AS IS'' AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL LOREN SEGAL BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var middleMouseDown = false;
var autoreleasePanScroll = false;
var startPosition = null;
var scrollDx = 0;
var scrollDy = 0;
var maxDx = 150;
var maxDy = 150;

var panScrollDiv = document.createElement('div');
var panScrollElement = null;

function startScroll(event) {
  var scrollHoriz = false;
  var scrollVert = false;
  var style = "position: absolute; width: 28px; height: 28px; z-index: 999999;";

  var src = event.srcElement;
  while (src) { if (src.tagName == "A" && src.href) return; src = src.parentNode; }

  src = event.srcElement;
  while (src) {
    if (src == document) src = document.body;
    var overflow = window.getComputedStyle(src, '').getPropertyValue('overflow');
    if (src == document.body || src == document.getElementsByTagName('html')[0]) {
      src = document.body;
      if (src.scrollWidth > window.innerWidth) scrollHoriz = true;
      if (src.scrollHeight > window.innerHeight) scrollVert = true;
    }
    else if (overflow == "scroll" || overflow == "auto") {
      if (src.scrollWidth > src.offsetWidth) scrollHoriz = true;
      if (src.scrollHeight > src.offsetHeight) scrollVert = true;
    }
    if (scrollHoriz || scrollVert) break;
    if (src == document.body) break;
    src = src.offsetParent;
  }
  if (!src) return;
  panScrollElement = src;

  if (scrollHoriz || scrollVert) {
    event.preventDefault();
    autoreleasePanScroll = false;
    middleMouseDown = true;
    startPosition = {x:event.clientX,y:event.clientY};
    scrollDx = 0;
    scrollDy = 0;
    document.body.appendChild(panScrollDiv);
    panScrollDiv.setAttribute('style', style);
    var mousePos = {x:event.pageX, y:event.pageY};
    if (panScrollElement == document.body) {
      var compStyle = window.getComputedStyle(document.body, '');
      if (compStyle.getPropertyValue('position') == 'relative') {
        mousePos.x -= parseInt(compStyle.getPropertyValue('margin-left'));
        mousePos.y -= parseInt(compStyle.getPropertyValue('margin-top'));
      }
    }
    panScrollDiv.style.left = (mousePos.x - (panScrollDiv.offsetWidth / 2.0)) + 'px';
    panScrollDiv.style.top = (mousePos.y - (panScrollDiv.offsetHeight / 2.0)) + 'px';
    panScroll();
  }
}

function panScroll() {
  if (middleMouseDown) {
    var left = panScrollElement.scrollLeft;
    var top = panScrollElement.scrollTop;
    panScrollElement.scrollLeft += scrollDx;
    panScrollElement.scrollTop += scrollDy;
    if (panScrollElement == document.body) {
      if (left != panScrollElement.scrollLeft)
        panScrollDiv.style.left = (panScrollDiv.offsetLeft + (panScrollElement.scrollLeft - left)) + 'px';
      if (top != panScrollElement.scrollTop)
        panScrollDiv.style.top = (panScrollDiv.offsetTop + (panScrollElement.scrollTop - top)) + 'px';
    }
    var x = ((Math.abs(scrollDx) + Math.abs(scrollDy)) / 80);
    var timeout = Math.floor(-14.5 * Math.pow(x, 0.5) + 15);
    if (timeout < 5) timeout = 5;
    setTimeout(panScroll, timeout);
  }
}

function endPanScroll(event) {
  middleMouseDown = false;
  document.body.removeChild(panScrollDiv);
  event.preventDefault();
}

function scrollScale(value) {
  return Math.ceil(0.02 * Math.pow(Math.abs(value), 1.4));
}

function panScrollMouseDown(event) {
  if (middleMouseDown) {
    endPanScroll(event);
  }
  else if (event.button & 1) {
    startScroll(event);
  }
}

function panScrollMouseUp(event) {
  if (event.button & 1 && middleMouseDown) {
    endPanScroll(event);
  }
}

function panScrollMouseMove(event) {
  if (middleMouseDown) {
    scrollDx = scrollScale(event.clientX - startPosition.x);
    scrollDy = scrollScale(event.clientY - startPosition.y);
    if (Math.abs(event.clientX - startPosition.x) < panScrollDiv.offsetWidth / 2.0) scrollDx = 0;
    if (Math.abs(event.clientY - startPosition.y) < panScrollDiv.offsetHeight / 2.0) scrollDy = 0;
    if (scrollDx > maxDx) scrollDx = maxDx;
    if (scrollDy > maxDy) scrollDy = maxDy;
    if (event.clientX < startPosition.x) scrollDx *= -1;
    if (event.clientY < startPosition.y) scrollDy *= -1;
    event.preventDefault();
  }
}

window.addEventListener('mousedown', panScrollMouseDown, true);
window.addEventListener('mouseup', panScrollMouseUp, true);
window.addEventListener('mousemove', panScrollMouseMove, true);

panScrollDiv.addEventListener('mousedown', function(event) {
  middleMouseDown = false;
  document.body.removeChild(panScrollDiv);
  event.stopPropagation();
});
panScrollDiv.addEventListener('mouseup', function(event) {
  if (!autoreleasePanScroll) event.stopPropagation();
});
panScrollDiv.addEventListener('mouseout', function(event) {
  autoreleasePanScroll = true;
});
