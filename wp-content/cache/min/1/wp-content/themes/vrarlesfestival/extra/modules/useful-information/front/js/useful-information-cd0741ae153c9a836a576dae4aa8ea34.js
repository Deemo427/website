$(window).on("extra:preloader:complete",function(){var $wrapper=$('.useful-information'),$title=$wrapper.find('.background-title-inner'),width=0,timeline;$title.wrapInner('<span class="clone"></span>');for(var i=0;i<2;i++){$title.find('.clone').first().clone().appendTo($title)}
$title.find('.letter').filter(function(index,item){return $(item).html()===' '}).addClass('space');function updateTextTimeline(){width=$title.width();if(timeline){timeline.progress(0).kill()}
timeline=new TimelineMax({repeat:-1});timeline.set($title,{x:-width/3,immediateRender:!0}).to($title,30,{x:'-='+((width/3)),ease:Linear.easeNone})}
var $switcher=$("#useful-information-switcher"),$contentWrapper=$wrapper.find(".useful-information-inner"),$content=$wrapper.find(".useful-information-content"),contentHeight=0,wrapperHeight=0,isOpen=!1;$switcher.on("change",function(){if($switcher.is(":checked")&&!isOpen){isOpen=!0;open()}else if(!$switcher.is(":checked")&&isOpen){isOpen=!1;close()}}).trigger("change");function open(){TweenMax.to($contentWrapper,1.3,{height:contentHeight,clearProps:'height',ease:Strong.easeInOut});TweenMax.to(timeline,1,{timeScale:0});$title.find('.clone').each(function(){TweenMax.staggerTo($(this).find('.letter'),0.6,{cycle:{yPercent:function(index){var value=Math.random()*20+10;return((index%2)?-value:value)}}},0.05)})}
function close(){TweenMax.to($contentWrapper,1,{height:wrapperHeight,ease:Strong.easeInOut});TweenMax.to(timeline,1,{timeScale:1});$title.find('.clone').each(function(){TweenMax.staggerTo($(this).find('.letter'),0.6,{yPercent:0},0.05)})}
$wrapper.find('.extra-form .text-field').each(function(){var $field=$(this),$input=$field.find('.field-input, .wpcf7-form-control');$input.on("focus",function(){$field.addClass("field-focused")}).on("blur change",function(){$field.toggleClass("field-focused",$input.val()!=='')}).trigger("blur")});$wrapper.find('.extra-form .message-field').each(function(){var $field=$(this),$originalTextArea=$(this).find('.wpcf7-textarea'),$label=$field.find('.label'),labelText=$label.text(),$labelLetters,labelTimeline=new TimelineMax({repeat:-1,yoyo:!0}),$input=$('<span class="message-fake-input"></span>').attr('contenteditable','true').prependTo($originalTextArea.parent()),isShown=!1;$originalTextArea.on("focus",function(){$input.get(0).focus()});$input.on("keyup",function(){if($input.html()===''){$field.removeClass("field-focused");$input.blur();isShown=!1}else if(isShown){$field.addClass("field-focused")}
$originalTextArea.html($input.text())}).on("focus",function(){if(!isShown){isShown=!0;$field.addClass("field-focused")}});$label.html('');labelText.split('').forEach(function(element,index){$('<span>').addClass("letter").text(element).appendTo($label)});$label.append('<span class="pipe"></span>');$labelLetters=$label.find('.letter');$labelLetters.get().reverse().forEach(function(item,index){var time='+=0.07';if(index===0){time='+=2'}else if(index===$labelLetters.length-1){time='+=0.3'}
labelTimeline.set(item,{display:'none'},time)});$wrapper.on("wpcf7mailsent",function(){$input.html('');$field.removeClass("field-focused");$input.blur();isShown=!1;$wrapper.find('.wpcf7-form-control').blur()})});function resizeHandler(event,wWidth,wHeight){updateTextTimeline();wrapperHeight=400;contentHeight=$content.outerHeight();if(isOpen){open()}else{close()}}
$(window).on('extra:resize',resizeHandler).trigger('resize');$(document).on("click","#footer-menu .menu-item.volunteer",function(event){event.preventDefault();$switcher[0].checked=!0;$switcher.trigger("change");TweenMax.delayedCall(1,function(){var string=$('html').attr('lang')==='fr-FR'?"J'aimerais être bénévole.":"I would like to be involved.",$target=$wrapper.find('.message-fake-input');$target.text('');$target.focus().blur();var timeline=new TimelineMax();timeline.add(function(){},'+=2');string.split('').forEach(function(letter,index){timeline.add(function(){$target.text($target.text()+letter)},'+=0.05')});timeline.add(function(){$target.trigger("keyup").focus();placeCaretAtEnd($target[0])})})})});function placeCaretAtEnd(el){el.focus();if(typeof window.getSelection!="undefined"&&typeof document.createRange!="undefined"){var range=document.createRange();range.selectNodeContents(el);range.collapse(!1);var sel=window.getSelection();sel.removeAllRanges();sel.addRange(range)}else if(typeof document.body.createTextRange!="undefined"){var textRange=document.body.createTextRange();textRange.moveToElementText(el);textRange.collapse(!1);textRange.select()}}