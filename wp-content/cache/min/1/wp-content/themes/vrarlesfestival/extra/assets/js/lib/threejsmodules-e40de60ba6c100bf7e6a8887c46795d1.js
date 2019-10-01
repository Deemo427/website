THREE.CopyShader={uniforms:{"tDiffuse":{value:null},"opacity":{value:1.0}},vertexShader:["varying vec2 vUv;","void main() {","vUv = uv;","gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );","}"].join("\n"),fragmentShader:["uniform float opacity;","uniform sampler2D tDiffuse;","varying vec2 vUv;","void main() {","vec4 texel = texture2D( tDiffuse, vUv );","gl_FragColor = opacity * texel;","}"].join("\n")};THREE.EffectComposer=function(renderer,renderTarget){this.renderer=renderer;if(renderTarget===undefined){var parameters={minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat,stencilBuffer:!1};var size=renderer.getSize();renderTarget=new THREE.WebGLRenderTarget(size.width,size.height,parameters);renderTarget.texture.name="EffectComposer.rt1"}
this.renderTarget1=renderTarget;this.renderTarget2=renderTarget.clone();this.renderTarget2.texture.name="EffectComposer.rt2";this.writeBuffer=this.renderTarget1;this.readBuffer=this.renderTarget2;this.passes=[];if(THREE.CopyShader===undefined)
console.error("THREE.EffectComposer relies on THREE.CopyShader");this.copyPass=new THREE.ShaderPass(THREE.CopyShader)};Object.assign(THREE.EffectComposer.prototype,{swapBuffers:function(){var tmp=this.readBuffer;this.readBuffer=this.writeBuffer;this.writeBuffer=tmp},addPass:function(pass){this.passes.push(pass);var size=this.renderer.getSize();pass.setSize(size.width,size.height)},insertPass:function(pass,index){this.passes.splice(index,0,pass)},render:function(delta){var maskActive=!1;var pass,i,il=this.passes.length;for(i=0;i<il;i ++){pass=this.passes[i];if(pass.enabled===!1)continue;pass.render(this.renderer,this.writeBuffer,this.readBuffer,delta,maskActive);if(pass.needsSwap){if(maskActive){var context=this.renderer.context;context.stencilFunc(context.NOTEQUAL,1,0xffffffff);this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,delta);context.stencilFunc(context.EQUAL,1,0xffffffff)}
this.swapBuffers()}
if(THREE.MaskPass!==undefined){if(pass instanceof THREE.MaskPass){maskActive=!0}else if(pass instanceof THREE.ClearMaskPass){maskActive=!1}}}},reset:function(renderTarget){if(renderTarget===undefined){var size=this.renderer.getSize();renderTarget=this.renderTarget1.clone();renderTarget.setSize(size.width,size.height)}
this.renderTarget1.dispose();this.renderTarget2.dispose();this.renderTarget1=renderTarget;this.renderTarget2=renderTarget.clone();this.writeBuffer=this.renderTarget1;this.readBuffer=this.renderTarget2},setSize:function(width,height){this.renderTarget1.setSize(width,height);this.renderTarget2.setSize(width,height);for(var i=0;i<this.passes.length;i ++){this.passes[i].setSize(width,height)}}});THREE.Pass=function(){this.enabled=!0;this.needsSwap=!0;this.clear=!1;this.renderToScreen=!1};Object.assign(THREE.Pass.prototype,{setSize:function(width,height){},render:function(renderer,writeBuffer,readBuffer,delta,maskActive){console.error("THREE.Pass: .render() must be implemented in derived pass.")}});THREE.HorizontalBlurShader={uniforms:{"tDiffuse":{value:null},"h":{value:1.0/512.0}},vertexShader:["varying vec2 vUv;","void main() {","vUv = uv;","gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );","}"].join("\n"),fragmentShader:["uniform sampler2D tDiffuse;","uniform float h;","varying vec2 vUv;","void main() {","vec4 sum = vec4( 0.0 );","sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;","sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;","sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;","sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;","sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;","sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;","sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;","sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;","sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;","gl_FragColor = sum;","}"].join("\n")};THREE.MaskPass=function(scene,camera){THREE.Pass.call(this);this.scene=scene;this.camera=camera;this.clear=!0;this.needsSwap=!1;this.inverse=!1};THREE.MaskPass.prototype=Object.assign(Object.create(THREE.Pass.prototype),{constructor:THREE.MaskPass,render:function(renderer,writeBuffer,readBuffer,delta,maskActive){var context=renderer.context;var state=renderer.state;state.buffers.color.setMask(!1);state.buffers.depth.setMask(!1);state.buffers.color.setLocked(!0);state.buffers.depth.setLocked(!0);var writeValue,clearValue;if(this.inverse){writeValue=0;clearValue=1}else{writeValue=1;clearValue=0}
state.buffers.stencil.setTest(!0);state.buffers.stencil.setOp(context.REPLACE,context.REPLACE,context.REPLACE);state.buffers.stencil.setFunc(context.ALWAYS,writeValue,0xffffffff);state.buffers.stencil.setClear(clearValue);renderer.render(this.scene,this.camera,readBuffer,this.clear);renderer.render(this.scene,this.camera,writeBuffer,this.clear);state.buffers.color.setLocked(!1);state.buffers.depth.setLocked(!1);state.buffers.stencil.setFunc(context.EQUAL,1,0xffffffff);state.buffers.stencil.setOp(context.KEEP,context.KEEP,context.KEEP)}});THREE.ClearMaskPass=function(){THREE.Pass.call(this);this.needsSwap=!1};THREE.ClearMaskPass.prototype=Object.create(THREE.Pass.prototype);Object.assign(THREE.ClearMaskPass.prototype,{render:function(renderer,writeBuffer,readBuffer,delta,maskActive){renderer.state.buffers.stencil.setTest(!1)}});THREE.OBJLoader=function(manager){this.manager=(manager!==undefined)?manager:THREE.DefaultLoadingManager;this.materials=null;this.regexp={vertex_pattern:/^v\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,normal_pattern:/^vn\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,uv_pattern:/^vt\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,face_vertex:/^f\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)(?:\s+(-?\d+))?/,face_vertex_uv:/^f\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+))?/,face_vertex_uv_normal:/^f\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+)\/(-?\d+))?/,face_vertex_normal:/^f\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)(?:\s+(-?\d+)\/\/(-?\d+))?/,object_pattern:/^[og]\s*(.+)?/,smoothing_pattern:/^s\s+(\d+|on|off)/,material_library_pattern:/^mtllib /,material_use_pattern:/^usemtl /}};THREE.OBJLoader.prototype={constructor:THREE.OBJLoader,load:function(url,onLoad,onProgress,onError){var scope=this;var loader=new THREE.FileLoader(scope.manager);loader.setPath(this.path);loader.load(url,function(text){onLoad(scope.parse(text))},onProgress,onError)},setPath:function(value){this.path=value},setMaterials:function(materials){this.materials=materials},_createParserState:function(){var state={objects:[],object:{},vertices:[],normals:[],uvs:[],materialLibraries:[],startObject:function(name,fromDeclaration){if(this.object&&this.object.fromDeclaration===!1){this.object.name=name;this.object.fromDeclaration=(fromDeclaration!==!1);return}
var previousMaterial=(this.object&&typeof this.object.currentMaterial==='function'?this.object.currentMaterial():undefined);if(this.object&&typeof this.object._finalize==='function'){this.object._finalize(!0)}
this.object={name:name||'',fromDeclaration:(fromDeclaration!==!1),geometry:{vertices:[],normals:[],uvs:[]},materials:[],smooth:!0,startMaterial:function(name,libraries){var previous=this._finalize(!1);if(previous&&(previous.inherited||previous.groupCount<=0)){this.materials.splice(previous.index,1)}
var material={index:this.materials.length,name:name||'',mtllib:(Array.isArray(libraries)&&libraries.length>0?libraries[libraries.length-1]:''),smooth:(previous!==undefined?previous.smooth:this.smooth),groupStart:(previous!==undefined?previous.groupEnd:0),groupEnd:-1,groupCount:-1,inherited:!1,clone:function(index){var cloned={index:(typeof index==='number'?index:this.index),name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};cloned.clone=this.clone.bind(cloned);return cloned}};this.materials.push(material);return material},currentMaterial:function(){if(this.materials.length>0){return this.materials[this.materials.length-1]}
return undefined},_finalize:function(end){var lastMultiMaterial=this.currentMaterial();if(lastMultiMaterial&&lastMultiMaterial.groupEnd===-1){lastMultiMaterial.groupEnd=this.geometry.vertices.length/3;lastMultiMaterial.groupCount=lastMultiMaterial.groupEnd-lastMultiMaterial.groupStart;lastMultiMaterial.inherited=!1}
if(end&&this.materials.length>1){for(var mi=this.materials.length-1;mi>=0;mi--){if(this.materials[mi].groupCount<=0){this.materials.splice(mi,1)}}}
if(end&&this.materials.length===0){this.materials.push({name:'',smooth:this.smooth})}
return lastMultiMaterial}};if(previousMaterial&&previousMaterial.name&&typeof previousMaterial.clone==="function"){var declared=previousMaterial.clone(0);declared.inherited=!0;this.object.materials.push(declared)}
this.objects.push(this.object)},finalize:function(){if(this.object&&typeof this.object._finalize==='function'){this.object._finalize(!0)}},parseVertexIndex:function(value,len){var index=parseInt(value,10);return(index>=0?index-1:index+len/3)*3},parseNormalIndex:function(value,len){var index=parseInt(value,10);return(index>=0?index-1:index+len/3)*3},parseUVIndex:function(value,len){var index=parseInt(value,10);return(index>=0?index-1:index+len/2)*2},addVertex:function(a,b,c){var src=this.vertices;var dst=this.object.geometry.vertices;dst.push(src[a+0]);dst.push(src[a+1]);dst.push(src[a+2]);dst.push(src[b+0]);dst.push(src[b+1]);dst.push(src[b+2]);dst.push(src[c+0]);dst.push(src[c+1]);dst.push(src[c+2])},addVertexLine:function(a){var src=this.vertices;var dst=this.object.geometry.vertices;dst.push(src[a+0]);dst.push(src[a+1]);dst.push(src[a+2])},addNormal:function(a,b,c){var src=this.normals;var dst=this.object.geometry.normals;dst.push(src[a+0]);dst.push(src[a+1]);dst.push(src[a+2]);dst.push(src[b+0]);dst.push(src[b+1]);dst.push(src[b+2]);dst.push(src[c+0]);dst.push(src[c+1]);dst.push(src[c+2])},addUV:function(a,b,c){var src=this.uvs;var dst=this.object.geometry.uvs;dst.push(src[a+0]);dst.push(src[a+1]);dst.push(src[b+0]);dst.push(src[b+1]);dst.push(src[c+0]);dst.push(src[c+1])},addUVLine:function(a){var src=this.uvs;var dst=this.object.geometry.uvs;dst.push(src[a+0]);dst.push(src[a+1])},addFace:function(a,b,c,d,ua,ub,uc,ud,na,nb,nc,nd){var vLen=this.vertices.length;var ia=this.parseVertexIndex(a,vLen);var ib=this.parseVertexIndex(b,vLen);var ic=this.parseVertexIndex(c,vLen);var id;if(d===undefined){this.addVertex(ia,ib,ic)}else{id=this.parseVertexIndex(d,vLen);this.addVertex(ia,ib,id);this.addVertex(ib,ic,id)}
if(ua!==undefined){var uvLen=this.uvs.length;ia=this.parseUVIndex(ua,uvLen);ib=this.parseUVIndex(ub,uvLen);ic=this.parseUVIndex(uc,uvLen);if(d===undefined){this.addUV(ia,ib,ic)}else{id=this.parseUVIndex(ud,uvLen);this.addUV(ia,ib,id);this.addUV(ib,ic,id)}}
if(na!==undefined){var nLen=this.normals.length;ia=this.parseNormalIndex(na,nLen);ib=na===nb?ia:this.parseNormalIndex(nb,nLen);ic=na===nc?ia:this.parseNormalIndex(nc,nLen);if(d===undefined){this.addNormal(ia,ib,ic)}else{id=this.parseNormalIndex(nd,nLen);this.addNormal(ia,ib,id);this.addNormal(ib,ic,id)}}},addLineGeometry:function(vertices,uvs){this.object.geometry.type='Line';var vLen=this.vertices.length;var uvLen=this.uvs.length;for(var vi=0,l=vertices.length;vi<l;vi ++){this.addVertexLine(this.parseVertexIndex(vertices[vi],vLen))}
for(var uvi=0,l=uvs.length;uvi<l;uvi ++){this.addUVLine(this.parseUVIndex(uvs[uvi],uvLen))}}};state.startObject('',!1);return state},parse:function(text){var state=this._createParserState();if(text.indexOf('\r\n')!==-1){text=text.replace(/\r\n/g,'\n')}
if(text.indexOf('\\\n')!==-1){text=text.replace(/\\\n/g,'')}
var lines=text.split('\n');var line='',lineFirstChar='',lineSecondChar='';var lineLength=0;var result=[];var trimLeft=(typeof ''.trimLeft==='function');for(var i=0,l=lines.length;i<l;i ++){line=lines[i];line=trimLeft?line.trimLeft():line.trim();lineLength=line.length;if(lineLength===0)continue;lineFirstChar=line.charAt(0);if(lineFirstChar==='#')continue;if(lineFirstChar==='v'){lineSecondChar=line.charAt(1);if(lineSecondChar===' '&&(result=this.regexp.vertex_pattern.exec(line))!==null){state.vertices.push(parseFloat(result[1]),parseFloat(result[2]),parseFloat(result[3]))}else if(lineSecondChar==='n'&&(result=this.regexp.normal_pattern.exec(line))!==null){state.normals.push(parseFloat(result[1]),parseFloat(result[2]),parseFloat(result[3]))}else if(lineSecondChar==='t'&&(result=this.regexp.uv_pattern.exec(line))!==null){state.uvs.push(parseFloat(result[1]),parseFloat(result[2]))}else{throw new Error("Unexpected vertex/normal/uv line: '"+line+"'")}}else if(lineFirstChar==="f"){if((result=this.regexp.face_vertex_uv_normal.exec(line))!==null){state.addFace(result[1],result[4],result[7],result[10],result[2],result[5],result[8],result[11],result[3],result[6],result[9],result[12])}else if((result=this.regexp.face_vertex_uv.exec(line))!==null){state.addFace(result[1],result[3],result[5],result[7],result[2],result[4],result[6],result[8])}else if((result=this.regexp.face_vertex_normal.exec(line))!==null){state.addFace(result[1],result[3],result[5],result[7],undefined,undefined,undefined,undefined,result[2],result[4],result[6],result[8])}else if((result=this.regexp.face_vertex.exec(line))!==null){state.addFace(result[1],result[2],result[3],result[4])}else{throw new Error("Unexpected face line: '"+line+"'")}}else if(lineFirstChar==="l"){var lineParts=line.substring(1).trim().split(" ");var lineVertices=[],lineUVs=[];if(line.indexOf("/")===-1){lineVertices=lineParts}else{for(var li=0,llen=lineParts.length;li<llen;li ++){var parts=lineParts[li].split("/");if(parts[0]!=="")lineVertices.push(parts[0]);if(parts[1]!=="")lineUVs.push(parts[1])}}
state.addLineGeometry(lineVertices,lineUVs)}else if((result=this.regexp.object_pattern.exec(line))!==null){var name=(" "+result[0].substr(1).trim()).substr(1);state.startObject(name)}else if(this.regexp.material_use_pattern.test(line)){state.object.startMaterial(line.substring(7).trim(),state.materialLibraries)}else if(this.regexp.material_library_pattern.test(line)){state.materialLibraries.push(line.substring(7).trim())}else if((result=this.regexp.smoothing_pattern.exec(line))!==null){var value=result[1].trim().toLowerCase();state.object.smooth=(value==='1'||value==='on');var material=state.object.currentMaterial();if(material){material.smooth=state.object.smooth}}else{if(line==='\0')continue;throw new Error("Unexpected line: '"+line+"'")}}
state.finalize();var container=new THREE.Group();container.materialLibraries=[].concat(state.materialLibraries);for(var i=0,l=state.objects.length;i<l;i ++){var object=state.objects[i];var geometry=object.geometry;var materials=object.materials;var isLine=(geometry.type==='Line');if(geometry.vertices.length===0)continue;var buffergeometry=new THREE.BufferGeometry();buffergeometry.addAttribute('position',new THREE.BufferAttribute(new Float32Array(geometry.vertices),3));if(geometry.normals.length>0){buffergeometry.addAttribute('normal',new THREE.BufferAttribute(new Float32Array(geometry.normals),3))}else{buffergeometry.computeVertexNormals()}
if(geometry.uvs.length>0){buffergeometry.addAttribute('uv',new THREE.BufferAttribute(new Float32Array(geometry.uvs),2))}
var createdMaterials=[];for(var mi=0,miLen=materials.length;mi<miLen;mi++){var sourceMaterial=materials[mi];var material=undefined;if(this.materials!==null){material=this.materials.create(sourceMaterial.name);if(isLine&&material&&!(material instanceof THREE.LineBasicMaterial)){var materialLine=new THREE.LineBasicMaterial();materialLine.copy(material);material=materialLine}}
if(!material){material=(!isLine?new THREE.MeshPhongMaterial():new THREE.LineBasicMaterial());material.name=sourceMaterial.name}
material.shading=sourceMaterial.smooth?THREE.SmoothShading:THREE.FlatShading;createdMaterials.push(material)}
var mesh;if(createdMaterials.length>1){for(var mi=0,miLen=materials.length;mi<miLen;mi++){var sourceMaterial=materials[mi];buffergeometry.addGroup(sourceMaterial.groupStart,sourceMaterial.groupCount,mi)}
mesh=(!isLine?new THREE.Mesh(buffergeometry,createdMaterials):new THREE.LineSegments(buffergeometry,createdMaterials))}else{mesh=(!isLine?new THREE.Mesh(buffergeometry,createdMaterials[0]):new THREE.LineSegments(buffergeometry,createdMaterials[0]))}
mesh.name=object.name;container.add(mesh)}
return container}};THREE.OrbitControls=function(object,domElement){this.object=object;this.domElement=(domElement!==undefined)?domElement:document;this.enabled=!0;this.target=new THREE.Vector3();this.minDistance=0;this.maxDistance=Infinity;this.minZoom=0;this.maxZoom=Infinity;this.minPolarAngle=0;this.maxPolarAngle=Math.PI;this.minAzimuthAngle=-Infinity;this.maxAzimuthAngle=Infinity;this.enableDamping=!1;this.dampingFactor=0.25;this.enableZoom=!0;this.zoomSpeed=1.0;this.enableRotate=!0;this.rotateSpeed=1.0;this.enablePan=!0;this.keyPanSpeed=7.0;this.autoRotate=!1;this.autoRotateSpeed=2.0;this.enableKeys=!0;this.keys={LEFT:37,UP:38,RIGHT:39,BOTTOM:40};this.mouseButtons={ORBIT:THREE.MOUSE.LEFT,ZOOM:THREE.MOUSE.MIDDLE,PAN:THREE.MOUSE.RIGHT};this.target0=this.target.clone();this.position0=this.object.position.clone();this.zoom0=this.object.zoom;this.getPolarAngle=function(){return spherical.phi};this.getAzimuthalAngle=function(){return spherical.theta};this.saveState=function(){scope.target0.copy(scope.target);scope.position0.copy(scope.object.position);scope.zoom0=scope.object.zoom};this.reset=function(){scope.target.copy(scope.target0);scope.object.position.copy(scope.position0);scope.object.zoom=scope.zoom0;scope.object.updateProjectionMatrix();scope.dispatchEvent(changeEvent);scope.update();state=STATE.NONE};this.update=function(){var offset=new THREE.Vector3();var quat=new THREE.Quaternion().setFromUnitVectors(object.up,new THREE.Vector3(0,1,0));var quatInverse=quat.clone().inverse();var lastPosition=new THREE.Vector3();var lastQuaternion=new THREE.Quaternion();return function update(){var position=scope.object.position;offset.copy(position).sub(scope.target);offset.applyQuaternion(quat);spherical.setFromVector3(offset);if(scope.autoRotate&&state===STATE.NONE){rotateLeft(getAutoRotationAngle())}
spherical.theta+=sphericalDelta.theta;spherical.phi+=sphericalDelta.phi;spherical.theta=Math.max(scope.minAzimuthAngle,Math.min(scope.maxAzimuthAngle,spherical.theta));spherical.phi=Math.max(scope.minPolarAngle,Math.min(scope.maxPolarAngle,spherical.phi));spherical.makeSafe();spherical.radius*=scale;spherical.radius=Math.max(scope.minDistance,Math.min(scope.maxDistance,spherical.radius));scope.target.add(panOffset);offset.setFromSpherical(spherical);offset.applyQuaternion(quatInverse);position.copy(scope.target).add(offset);scope.object.lookAt(scope.target);if(scope.enableDamping===!0){sphericalDelta.theta*=(1-scope.dampingFactor);sphericalDelta.phi*=(1-scope.dampingFactor)}else{sphericalDelta.set(0,0,0)}
scale=1;panOffset.set(0,0,0);if(zoomChanged||lastPosition.distanceToSquared(scope.object.position)>EPS||8*(1-lastQuaternion.dot(scope.object.quaternion))>EPS){scope.dispatchEvent(changeEvent);lastPosition.copy(scope.object.position);lastQuaternion.copy(scope.object.quaternion);zoomChanged=!1;return!0}
return!1}}();this.dispose=function(){scope.domElement.removeEventListener('contextmenu',onContextMenu,!1);scope.domElement.removeEventListener('mousedown',onMouseDown,!1);scope.domElement.removeEventListener('wheel',onMouseWheel,!1);scope.domElement.removeEventListener('touchstart',onTouchStart,!1);scope.domElement.removeEventListener('touchend',onTouchEnd,!1);scope.domElement.removeEventListener('touchmove',onTouchMove,!1);document.removeEventListener('mousemove',onMouseMove,!1);document.removeEventListener('mouseup',onMouseUp,!1);window.removeEventListener('keydown',onKeyDown,!1)};var scope=this;var changeEvent={type:'change'};var startEvent={type:'start'};var endEvent={type:'end'};var STATE={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_DOLLY:4,TOUCH_PAN:5};var state=STATE.NONE;var EPS=0.000001;var spherical=new THREE.Spherical();var sphericalDelta=new THREE.Spherical();var scale=1;var panOffset=new THREE.Vector3();var zoomChanged=!1;var rotateStart=new THREE.Vector2();var rotateEnd=new THREE.Vector2();var rotateDelta=new THREE.Vector2();var panStart=new THREE.Vector2();var panEnd=new THREE.Vector2();var panDelta=new THREE.Vector2();var dollyStart=new THREE.Vector2();var dollyEnd=new THREE.Vector2();var dollyDelta=new THREE.Vector2();function getAutoRotationAngle(){return 2*Math.PI/60/60*scope.autoRotateSpeed}
function getZoomScale(){return Math.pow(0.95,scope.zoomSpeed)}
function rotateLeft(angle){sphericalDelta.theta-=angle}
function rotateUp(angle){sphericalDelta.phi-=angle}
var panLeft=function(){var v=new THREE.Vector3();return function panLeft(distance,objectMatrix){v.setFromMatrixColumn(objectMatrix,0);v.multiplyScalar(-distance);panOffset.add(v)}}();var panUp=function(){var v=new THREE.Vector3();return function panUp(distance,objectMatrix){v.setFromMatrixColumn(objectMatrix,1);v.multiplyScalar(distance);panOffset.add(v)}}();var pan=function(){var offset=new THREE.Vector3();return function pan(deltaX,deltaY){var element=scope.domElement===document?scope.domElement.body:scope.domElement;if(scope.object instanceof THREE.PerspectiveCamera){var position=scope.object.position;offset.copy(position).sub(scope.target);var targetDistance=offset.length();targetDistance*=Math.tan((scope.object.fov/2)*Math.PI/180.0);panLeft(2*deltaX*targetDistance/element.clientHeight,scope.object.matrix);panUp(2*deltaY*targetDistance/element.clientHeight,scope.object.matrix)}else if(scope.object instanceof THREE.OrthographicCamera){panLeft(deltaX*(scope.object.right-scope.object.left)/scope.object.zoom/element.clientWidth,scope.object.matrix);panUp(deltaY*(scope.object.top-scope.object.bottom)/scope.object.zoom/element.clientHeight,scope.object.matrix)}else{console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');scope.enablePan=!1}}}();function dollyIn(dollyScale){if(scope.object instanceof THREE.PerspectiveCamera){scale/=dollyScale}else if(scope.object instanceof THREE.OrthographicCamera){scope.object.zoom=Math.max(scope.minZoom,Math.min(scope.maxZoom,scope.object.zoom*dollyScale));scope.object.updateProjectionMatrix();zoomChanged=!0}else{console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');scope.enableZoom=!1}}
function dollyOut(dollyScale){if(scope.object instanceof THREE.PerspectiveCamera){scale*=dollyScale}else if(scope.object instanceof THREE.OrthographicCamera){scope.object.zoom=Math.max(scope.minZoom,Math.min(scope.maxZoom,scope.object.zoom/dollyScale));scope.object.updateProjectionMatrix();zoomChanged=!0}else{console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');scope.enableZoom=!1}}
function handleMouseDownRotate(event){rotateStart.set(event.clientX,event.clientY)}
function handleMouseDownDolly(event){dollyStart.set(event.clientX,event.clientY)}
function handleMouseDownPan(event){panStart.set(event.clientX,event.clientY)}
function handleMouseMoveRotate(event){rotateEnd.set(event.clientX,event.clientY);rotateDelta.subVectors(rotateEnd,rotateStart);var element=scope.domElement===document?scope.domElement.body:scope.domElement;rotateLeft(2*Math.PI*rotateDelta.x/element.clientWidth*scope.rotateSpeed);rotateUp(2*Math.PI*rotateDelta.y/element.clientHeight*scope.rotateSpeed);rotateStart.copy(rotateEnd);scope.update()}
function handleMouseMoveDolly(event){dollyEnd.set(event.clientX,event.clientY);dollyDelta.subVectors(dollyEnd,dollyStart);if(dollyDelta.y>0){dollyIn(getZoomScale())}else if(dollyDelta.y<0){dollyOut(getZoomScale())}
dollyStart.copy(dollyEnd);scope.update()}
function handleMouseMovePan(event){panEnd.set(event.clientX,event.clientY);panDelta.subVectors(panEnd,panStart);pan(panDelta.x,panDelta.y);panStart.copy(panEnd);scope.update()}
function handleMouseUp(event){}
function handleMouseWheel(event){if(event.deltaY<0){dollyOut(getZoomScale())}else if(event.deltaY>0){dollyIn(getZoomScale())}
scope.update()}
function handleKeyDown(event){switch(event.keyCode){case scope.keys.UP:pan(0,scope.keyPanSpeed);scope.update();break;case scope.keys.BOTTOM:pan(0,-scope.keyPanSpeed);scope.update();break;case scope.keys.LEFT:pan(scope.keyPanSpeed,0);scope.update();break;case scope.keys.RIGHT:pan(-scope.keyPanSpeed,0);scope.update();break}}
function handleTouchStartRotate(event){rotateStart.set(event.touches[0].pageX,event.touches[0].pageY)}
function handleTouchStartDolly(event){var dx=event.touches[0].pageX-event.touches[1].pageX;var dy=event.touches[0].pageY-event.touches[1].pageY;var distance=Math.sqrt(dx*dx+dy*dy);dollyStart.set(0,distance)}
function handleTouchStartPan(event){panStart.set(event.touches[0].pageX,event.touches[0].pageY)}
function handleTouchMoveRotate(event){rotateEnd.set(event.touches[0].pageX,event.touches[0].pageY);rotateDelta.subVectors(rotateEnd,rotateStart);var element=scope.domElement===document?scope.domElement.body:scope.domElement;rotateLeft(2*Math.PI*rotateDelta.x/element.clientWidth*scope.rotateSpeed);rotateUp(2*Math.PI*rotateDelta.y/element.clientHeight*scope.rotateSpeed);rotateStart.copy(rotateEnd);scope.update()}
function handleTouchMoveDolly(event){var dx=event.touches[0].pageX-event.touches[1].pageX;var dy=event.touches[0].pageY-event.touches[1].pageY;var distance=Math.sqrt(dx*dx+dy*dy);dollyEnd.set(0,distance);dollyDelta.subVectors(dollyEnd,dollyStart);if(dollyDelta.y>0){dollyOut(getZoomScale())}else if(dollyDelta.y<0){dollyIn(getZoomScale())}
dollyStart.copy(dollyEnd);scope.update()}
function handleTouchMovePan(event){panEnd.set(event.touches[0].pageX,event.touches[0].pageY);panDelta.subVectors(panEnd,panStart);pan(panDelta.x,panDelta.y);panStart.copy(panEnd);scope.update()}
function handleTouchEnd(event){}
function onMouseDown(event){if(scope.enabled===!1)return;event.preventDefault();switch(event.button){case scope.mouseButtons.ORBIT:if(scope.enableRotate===!1)return;handleMouseDownRotate(event);state=STATE.ROTATE;break;case scope.mouseButtons.ZOOM:if(scope.enableZoom===!1)return;handleMouseDownDolly(event);state=STATE.DOLLY;break;case scope.mouseButtons.PAN:if(scope.enablePan===!1)return;handleMouseDownPan(event);state=STATE.PAN;break}
if(state!==STATE.NONE){document.addEventListener('mousemove',onMouseMove,!1);document.addEventListener('mouseup',onMouseUp,!1);scope.dispatchEvent(startEvent)}}
function onMouseMove(event){if(scope.enabled===!1)return;event.preventDefault();switch(state){case STATE.ROTATE:if(scope.enableRotate===!1)return;handleMouseMoveRotate(event);break;case STATE.DOLLY:if(scope.enableZoom===!1)return;handleMouseMoveDolly(event);break;case STATE.PAN:if(scope.enablePan===!1)return;handleMouseMovePan(event);break}}
function onMouseUp(event){if(scope.enabled===!1)return;handleMouseUp(event);document.removeEventListener('mousemove',onMouseMove,!1);document.removeEventListener('mouseup',onMouseUp,!1);scope.dispatchEvent(endEvent);state=STATE.NONE}
function onMouseWheel(event){if(scope.enabled===!1||scope.enableZoom===!1||(state!==STATE.NONE&&state!==STATE.ROTATE))return;event.preventDefault();event.stopPropagation();handleMouseWheel(event);scope.dispatchEvent(startEvent);scope.dispatchEvent(endEvent)}
function onKeyDown(event){if(scope.enabled===!1||scope.enableKeys===!1||scope.enablePan===!1)return;handleKeyDown(event)}
function onTouchStart(event){if(scope.enabled===!1)return;switch(event.touches.length){case 1:if(scope.enableRotate===!1)return;handleTouchStartRotate(event);state=STATE.TOUCH_ROTATE;break;case 2:if(scope.enableZoom===!1)return;handleTouchStartDolly(event);state=STATE.TOUCH_DOLLY;break;case 3:if(scope.enablePan===!1)return;handleTouchStartPan(event);state=STATE.TOUCH_PAN;break;default:state=STATE.NONE}
if(state!==STATE.NONE){scope.dispatchEvent(startEvent)}}
function onTouchMove(event){if(scope.enabled===!1)return;event.preventDefault();event.stopPropagation();switch(event.touches.length){case 1:if(scope.enableRotate===!1)return;if(state!==STATE.TOUCH_ROTATE)return;handleTouchMoveRotate(event);break;case 2:if(scope.enableZoom===!1)return;if(state!==STATE.TOUCH_DOLLY)return;handleTouchMoveDolly(event);break;case 3:if(scope.enablePan===!1)return;if(state!==STATE.TOUCH_PAN)return;handleTouchMovePan(event);break;default:state=STATE.NONE}}
function onTouchEnd(event){if(scope.enabled===!1)return;handleTouchEnd(event);scope.dispatchEvent(endEvent);state=STATE.NONE}
function onContextMenu(event){event.preventDefault()}
scope.domElement.addEventListener('contextmenu',onContextMenu,!1);scope.domElement.addEventListener('mousedown',onMouseDown,!1);scope.domElement.addEventListener('wheel',onMouseWheel,!1);scope.domElement.addEventListener('touchstart',onTouchStart,!1);scope.domElement.addEventListener('touchend',onTouchEnd,!1);scope.domElement.addEventListener('touchmove',onTouchMove,!1);window.addEventListener('keydown',onKeyDown,!1);this.update()};THREE.OrbitControls.prototype=Object.create(THREE.EventDispatcher.prototype);THREE.OrbitControls.prototype.constructor=THREE.OrbitControls;Object.defineProperties(THREE.OrbitControls.prototype,{center:{get:function(){console.warn('THREE.OrbitControls: .center has been renamed to .target');return this.target}},noZoom:{get:function(){console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');return!this.enableZoom},set:function(value){console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');this.enableZoom=!value}},noRotate:{get:function(){console.warn('THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.');return!this.enableRotate},set:function(value){console.warn('THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.');this.enableRotate=!value}},noPan:{get:function(){console.warn('THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.');return!this.enablePan},set:function(value){console.warn('THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.');this.enablePan=!value}},noKeys:{get:function(){console.warn('THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.');return!this.enableKeys},set:function(value){console.warn('THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.');this.enableKeys=!value}},staticMoving:{get:function(){console.warn('THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.');return!this.enableDamping},set:function(value){console.warn('THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.');this.enableDamping=!value}},dynamicDampingFactor:{get:function(){console.warn('THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.');return this.dampingFactor},set:function(value){console.warn('THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.');this.dampingFactor=value}}});THREE.RenderPass=function(scene,camera,overrideMaterial,clearColor,clearAlpha){THREE.Pass.call(this);this.scene=scene;this.camera=camera;this.overrideMaterial=overrideMaterial;this.clearColor=clearColor;this.clearAlpha=(clearAlpha!==undefined)?clearAlpha:0;this.clear=!0;this.clearDepth=!1;this.needsSwap=!1};THREE.RenderPass.prototype=Object.assign(Object.create(THREE.Pass.prototype),{constructor:THREE.RenderPass,render:function(renderer,writeBuffer,readBuffer,delta,maskActive){var oldAutoClear=renderer.autoClear;renderer.autoClear=!1;this.scene.overrideMaterial=this.overrideMaterial;var oldClearColor,oldClearAlpha;if(this.clearColor){oldClearColor=renderer.getClearColor().getHex();oldClearAlpha=renderer.getClearAlpha();renderer.setClearColor(this.clearColor,this.clearAlpha)}
if(this.clearDepth){renderer.clearDepth()}
renderer.render(this.scene,this.camera,this.renderToScreen?null:readBuffer,this.clear);if(this.clearColor){renderer.setClearColor(oldClearColor,oldClearAlpha)}
this.scene.overrideMaterial=null;renderer.autoClear=oldAutoClear}});THREE.ShaderPass=function(shader,textureID){THREE.Pass.call(this);this.textureID=(textureID!==undefined)?textureID:"tDiffuse";if(shader instanceof THREE.ShaderMaterial){this.uniforms=shader.uniforms;this.material=shader}else if(shader){this.uniforms=THREE.UniformsUtils.clone(shader.uniforms);this.material=new THREE.ShaderMaterial({defines:shader.defines||{},uniforms:this.uniforms,vertexShader:shader.vertexShader,fragmentShader:shader.fragmentShader})}
this.camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);this.scene=new THREE.Scene();this.quad=new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2),null);this.quad.frustumCulled=!1;this.scene.add(this.quad)};THREE.ShaderPass.prototype=Object.assign(Object.create(THREE.Pass.prototype),{constructor:THREE.ShaderPass,render:function(renderer,writeBuffer,readBuffer,delta,maskActive){if(this.uniforms[this.textureID]){this.uniforms[this.textureID].value=readBuffer.texture}
this.quad.material=this.material;if(this.renderToScreen){renderer.render(this.scene,this.camera)}else{renderer.render(this.scene,this.camera,writeBuffer,this.clear)}}});THREE.VerticalBlurShader={uniforms:{"tDiffuse":{value:null},"v":{value:1.0/512.0}},vertexShader:["varying vec2 vUv;","void main() {","vUv = uv;","gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );","}"].join("\n"),fragmentShader:["uniform sampler2D tDiffuse;","uniform float v;","varying vec2 vUv;","void main() {","vec4 sum = vec4( 0.0 );","sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;","sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;","sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;","sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;","sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;","sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;","sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;","sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;","sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;","gl_FragColor = sum;","}"].join("\n")}