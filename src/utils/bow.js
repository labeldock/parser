'use strict';
export default (function (global, load) {
  let factory = load();
  if(this){
    this.bow = factory();
  } else {
    let inst = factory();
    return inst
  }
}(this, (function () { 
  let Bow  = function(){};
  let BowFactory = function(){
    let BOX = function(payload){return new Bow(payload)};
    
    function applyBoxFns(BowFns){ for(var name in BowFns) BOX[name]=BowFns[name]; }
    
    applyBoxFns({
      isObject:IS_OBJECT,
      isArray:IS_ARRAY,
      isFunction:IS_FUNCTION,
      isNumberLike:IS_NUMBER_LIKE,
      isNode:IS_NODE,
      isEmpty:IS_EMPTY,
      toArray:TO_ARRAY,
      asArray:AS_ARRAY,
      instance:INSTANCE,
      alloc:ALLOC,
      hasValue:HAS_VALUE,
      get:GET,
      getKeyBy:GET_KEY_BY,
      findIndexes:FIND_INDEXES,
      stringCast:STRING_CAST,
      //
      unique:UNIQUE,
      removeValue:REMOVE_VALUE,
      clearOf:CLEAR_OF,
      insertOf:INSERT_OF,
      moveOf:MOVE_OF,
      concatOf:CONCAT_OF,
      filterOf:FILTER_OF,
      sortOf:SORT_OF,
      rebase:REBASE,
      //
      range:RANGE,
      diffStructure:DIFF_STRUCTURE,
      //
      toggle:TOGGLE,
      trun:TRUN,
      apart:APART,
      //
      rand64:RAND64,
      tokenize:TOKENIZE
    });
    
    return BOX;
  };
  
  //PINPONGPOOL NATIVE
  let IS_OBJECT      = (object)=> (object !== null && typeof object === "object") ? true : false
  let IS_ARRAY       = (data)=>data instanceof Array
  let IS_FUNCTION    = (f)=>typeof f === "function"
  let IS_NUMBER      = (n)=>typeof n === "number" && !isNaN(n)
  let IS_NUMBER_LIKE = (t)=>(typeof t === "number") ? true : ((typeof t === "string") ? (parseFloat(t)+"") == (t+"") : false )
  let IS_NODE        = (a)=>IS_OBJECT(a) && typeof a.nodeType === "number"
  let IS_EMPTY  = function(){
    if (typeof o === "undefined") return true;
    if (typeof o === "string")return o.trim().length < 1 ? true : false;
    if (typeof o === "object"){
      if(o == null) return true;
      if(o instanceof RegExp) return false;      
      if(IS_ARRAY(o)) {
        return !o.length;
      } else {
        for (var prop in o) return false; return true;
      }
    }
    if (typeof o === "number")return false;
    if (typeof o === "function")return false;
    if (typeof o === "boolean")return false;
    return true;
  }
  let IS_PATTERN = (s)=> (typeof s === "string") || (s instanceof RegExp)
  
  let TO_ARRAY = function(data,option){
    if(typeof data === "undefined" || data === null || data === NaN ) return [];
    if(IS_ARRAY(data)) return Array.prototype.slice.call(data);
    if(typeof data === "object" && typeof data.toArray === "function") return data.toArray();
    if(typeof data === "string", typeof option === "string") return data.split(option);
    return [data];
  }
  
  let AS_ARRAY = (data,option)=>IS_ARRAY(data) ? data : TO_ARRAY(data,option)
  
  let INSTANCE = function(func,proto){
    var ins,DummyInstance=function(param){ if(typeof param === "object") for(var k in param) this[k] = param[k]; };
    if(typeof func == "object"){
      if(typeof proto === "object") DummyInstance.prototype = proto;
      ins = new DummyInstance(func);
    }
    if(typeof func == "function"){
      if(typeof proto === "object") func.prototype = proto;
      ins = (new func());
    }
    return ins;
  }
  
  /*
  bow.alloc(function(callee){
      var a = 0;
      return function(){
          return a++;
      }
  });

  a(); // 0
  a(); // 1
  a(); // 2
  
  a.reset();

  a(); // 0
  a(); // 1
  a(); // 2
  */
  let ALLOC = function(init){
    var fn=init(),rn=function(){return fn.apply(this,Array.prototype.slice.call(arguments));};
    return rn.reset=function(){fn=init(rn,rn);},rn.$originalFunction=fn,rn;
  }
  
  let UNIQUE = function(array){
    var value = [],result = [], array = TO_ARRAY(array);
    for(var i=0,l=array.length;i<l;i++){
      var unique = true;
      for(var i2=0,l2=result.length;i2<l2;i2++){
        if(array[i] == result[i2]){
          unique = false; break;
        }
      }
      if(unique==true) result.push(array[i]);
    }
    return result;
  }
  
  let HAS_VALUE = (function(){
    var defaultObjectValueFunc = function(object,value){
      return object === value;
    };
      
    var functionKeyObjectValueProc = function(functionKey){
      return function(object,value){
        return Boolean(functionKey(object,value));
      };
    };
      
    var selectKeyObjectValueProc = function(leftSelect,rightSelect){
      var useLeftSelector  = (typeof leftSelect === "string" || typeof leftSelect === "number")
      var useRightSelector = leftSelect === rightSelect ? useLeftSelector : (typeof rightSelect === "string" || typeof rightSelect === "number");
          
      return function(object,value){
        if(useLeftSelector  && !object.hasOwnProperty(leftSelect)) return false;
        if(useRightSelector && !value.hasOwnProperty(rightSelect)) return false;
              
        return (useLeftSelector ? GET(object,leftSelect) : object) === (useRightSelector ? GET(value,rightSelect) : value);
      };
    };
      
    return function(obj,value,key,getKey){
      if(typeof key === "boolean"){
        if(typeof getKey !== "boolean"){
          getKey = key;
        }
        key = void 0;
      }
          
      if(obj === value){
        return true;
      } else if(IS_OBJECT(obj)){
        if(value === (void 0) && key === (void 0)) return !IS_EMPTY(obj);
              
        var proc;
              
        if(key){
          if(typeof key === "function") {
            proc = functionKeyObjectValueProc(key);
          } else if(IS_ARRAY(key) && key.length > 1){
            proc = selectKeyObjectValueProc(key[0],key[1]);
          } else if(typeof key === "string" || typeof key === "number"){
            proc = selectKeyObjectValueProc(key,key);
          }
        } else {
          proc = defaultObjectValueFunc;
        }
              
        if(IS_ARRAY(obj)){
          for(var i=0,l=obj.length;i<l;i++) if(proc(obj[i],value)) return getKey ? i : true;
        } else {
          for(var objKey in obj) if(obj.hasOwnProperty(objKey) && proc(obj[objKey],value)) return getKey ? objKey : true; 
        }
      }
          
      return getKey ? void 0 : false;
    }
  }());
  
  let GET = function(target,path){
    if(typeof target === "object"){
      switch(typeof path){
        case "number": path += "";
        case "string": return path.indexOf("[") == 0 ? eval("target"+path) : eval("target."+path);
        case "function": return path.call(this,target);
      }
    } else if(typeof target === "function"){
      return target.apply(this,Array.prototype.slice.call(arguments,1));
    }
    return target;
  }
  
  let GET_KEY_BY = function(object,value){
    if(IS_FUNCTION(value)){
      if(IS_ARRAY(object)) for(var i=0,l=object.length;i<l;i++) if(value(object[i],i)===true) return i;
      if(IS_OBJECT(object)) for(var key in object) if(value(object[key],key)===true) return key;
    } else {
      if(IS_ARRAY(object)) for(var i=0,l=object.length;i<l;i++) if(object[i]===value) return i;
      if(IS_OBJECT(object)) for(var key in object) if(object[key]===value) return key;
    }
  }
  
  
  let STRING_CAST = (function(){
    return function(text,defaultOrder,finder,at){
      if(typeof text === "string" || typeof text === "number"){
        let idxs  = []
        let hist  = []
        let count = 0
        let pin   = (!at || !IS_NUMBER(at) || at < 0)?0:at
        let strlen= text.length
        let order = defaultOrder
        let next
        
        if(typeof finder !== "function"){ 
          finder = void 0
        }
        
        do {
          let start = void 0;
          let size  = void 0;
          
          console.log(`%cdo order ${count} - ${order}`,"background-color:red;")
          if(typeof order === "string"){
            let findedIndex = text.indexOf(order,pin)
            if(findedIndex !== -1){
              start = findedIndex
              size  = order.length
            }
          } else if (order instanceof RegExp) {
            let cs = text.substring(pin || 0);
            let ma = cs.match(order);
            if(ma){
              start = cs.indexOf(ma) + (ma.length - 1)
              size  = ma.length
            } 
          }
          
          count++;
          
          if(typeof start !== "undefined"){
            let string = text.substring(start,start + size);
            let struct = {string,start,size,end:start + size}
            
            //before pin
            if(pin < start){
              let noneCastStruct = {
                string:text.substring(pin,start),
                start:pin,
                size:start-pin,
                end:start
              }
              finder && finder(false,noneCastStruct,hist,count)
            }
            
            //now pin
            pin = start + size;

            //order
            let nextOrder = finder && finder(true,struct,hist,count);
            if(IS_PATTERN(nextOrder)){
              order = nextOrder
            } else {
              order = defaultOrder
            }
            
            //idx
            idxs.push(start)
            hist.push({string,start,size})
            
            //to be countinue
            if(pin >= strlen){
              next = false
            } else {
              next = true;
            }
          } else {
            let struct = {
                string:text.substring(pin,strlen),
                start:pin,
                size:start-pin,
                end:strlen
            }
            finder && finder(false,struct,hist,count);
            next = false;
          }
          
        } while((count > 1000) ? false : next)
        return idxs;
      }
    }
  }())
  
  /*
    bow.findIndexes("hello world","l") [2,3,9]
    bow.findIndexes("hello world",/l/) [2,3,9]
    bow.findIndexes("hello world",/\s/) [5]
  */
  let FIND_INDEXES = (function(){
    var __find_string = (c,s,p)=>c.indexOf(s,p)
    var __find_regexp = (c,s,p)=>{
      let i = c.substring(p || 0).search(s);
      return (i >= 0) ? (i + (p || 0)) : i;
    }
    return function(c,s,at){
        if(typeof c === "string" || typeof c === "number"){
          var idxs=[], mvc=c+"", s=IS_PATTERN(s)?s:s+"", at=(!at || !IS_NUMBER(at) || at < 0)?0:at, __find=((s instanceof RegExp)?__find_regexp:__find_string), next;
          do {
            let i = __find(c,s,at);
            if(i > -1){
              at = (s.length || 1) + i;
              idxs.push(i); 
              next = true;
            } else {
              next = false;
            }
          } while(next)
          return idxs;
        }
      }
  }());
  
  let EACH_PROC = function(arr,proc){
      if(arr.length > 1){
          for(var i=0,l=arr.length-1;i<l;proc(arr[i],i,false), i++);
          proc(arr[arr.length-1],arr.length-1,true);
      } else if(arr.length == 1) {
          proc(arr[0],0,true);
      }
      return arr;
  }
  
  let STATIC_FOR_EACH_PROC = function(obj,proc){
      if(typeof obj === "object") for(var i=0,a=obj instanceof Array,al=a?obj.length:NaN,keys=Object.keys(obj),l=keys.length;i<l;proc(obj[keys[i]],keys[i],i,l,al),i++);
      return obj;
  }
  
  let EACH     = (value,proc)=>EACH_PROC(AS_ARRAY(value),proc)
  let FOR_EACH = (value,proc)=>STATIC_FOR_EACH_PROC(value,proc)
  let REDUCE   = function(value,proc,meta){
    value = AS_ARRAY(value);
    return EACH_PROC(value,function(v,i,l){ meta = proc(meta,v,i,l); }),meta;
  }
  
  
  //PINPONGPOOL TRANSFORM
  let REMOVE_VALUE = function(obj,value){
    var detect = true;
    var array  = IS_ARRAY(obj);

    while(detect) {
      var key = GET_KEY_BY(obj,value);
      if(typeof key === "undefined"){
        detect = false;
      } else {
        if(array){
          obj.splice(key,1);
        } else {
          delete obj[key];
        }
      }
    }
    return obj;
  }
  
  let CLEAR_OF = function(data,fillFn,sp){
    if(data instanceof Array){
      sp = Array.prototype.splice.call(data,0,data.length);
    } else if(typeof data == "object") {
      sp = {};
      for(var key in data){ sp[key] = data[key]; delete data[key]; } 
    }
    return (fillFn && fillFn(data,sp)), data;
  }
  
  let INSERT_OF = function(data,v,a){
    IS_ARRAY(data) && data.splice(typeof a === "number"?a:0,0,v)
    return data;
  }
  
  let MOVE_OF = function(data,oldIndex,newIndex){
    if(oldIndex !== newIndex && IS_ARRAY(data) && typeof oldIndex === "number" && typeof newIndex === "number" && oldIndex >= 0 && oldIndex < data.length){
      Array.prototype.splice.call(data,newIndex > data.length ? data.length : newIndex,0,Array.prototype.splice.call(data,oldIndex,1)[0]);
    }
    return data;
  }
  
  let CONCAT_OF = function(data,appends){
    var data = AS_ARRAY(data);
    return EACH(appends,function(value){ data.push(value); }), data;
  }
  
  
  let FILTER_OF = function(data,func,exitFn){
    var data    = AS_ARRAY(data);
    var exitCnt = 0;

    for(var i=0,ri=0,keys=Object.keys(data),l=keys.length;i<l;i++,ri++){
      var key   = keys[i];
      var value = data[key];
      var result = func(value,key);
      if(result == false) {
        var exit = Array.prototype.splice.call(data,i,1);
        i--;
        l--;
        typeof exitFn === "function" && exitFn(value,ri,exitCnt++);
      }
    }
    
    return data;
  }
  
  let SORT_OF = function(data,filter){
    if(data.length == 0){
      return data;
    }
    
    switch(filter){
    case 'desc':
      filter = function(a,b){ return a>b; }
      break;
    case undefined:
    case 'asc':
    default:
      if(typeof filter !== "function"){
        filter = function(a,b){ return a<b; }
      }
      break;
    }

    var result = [data[0]];

    for(var i=1,l=data.length;i<l;i++){
      for(var ri=0,rl=result.length;ri<rl;ri++){
        if(filter(data[i],result[ri]) === true){
          INSERT_OF(result,data[i],ri);
          break;
        }
        if((ri + 1) === result.length){
          result.push(data[i]);
        }
      }
    }

    CLEAR_OF(data);

    for(var i=0,l=result.length;i<l;data.push(result[i]),i++);
    
    return data;
  }
  
  let REBASE = function(obj,ref){
    var result = {};
    for(var key in obj){
      if(key === ".*"){
        var refValue = obj[key];
        for(var i=0,d=Object.keys(ref),l=d.length;i<l;i++){
          var refKey = d[i];
          if(typeof refValue === "function"){
            result[refKey] = obj[key];
          } else {
            if((typeof refValue !== "object" && typeof refValue !== "object") || IS_NODE(refValue)){
              result[refKey] = refValue;
            } else {
              result[refKey] = Object.assign(result[refKey],refValue);
            }
          }
        }
      } else if(key.indexOf(",") > -1){
        EACH(key.split(","),function(deepKey){
          deepKey = deepKey.trim();
          if(typeof obj[key] === "function"){
            result[deepKey] = obj[key];
          } else {
            if((!result.hasOwnProperty(deepKey) && typeof obj[key] !== "object") || IS_NODE(obj[key])){
              result[deepKey] = obj[key];
            } else {
              result[deepKey] = Object.assign( result[deepKey] || (IS_ARRAY(obj[key]) ? [] : {}), obj[key], obj[deepKey] );
            }

          }
        });
      } else {
        if(typeof obj[key] === "function"){
          result[key] = obj[key];
        } else {
          if((typeof result[key] !== "object" && typeof obj[key] !== "object") || IS_NODE(obj[key])){
            result[key] = obj[key]
          } else {
            result[key] = Object.assign(result[key],obj[key]);
          }
        }
      }
    }
    return result;
  }
  
  //PINPONGPOOL FORMAT
  let RANGE = function(value,step,sizeBase){
    var r=[],start,end,reverse;
    
    if(typeof value === "number"){
      end   = value;
      start = 0;
    } else if(typeof value === "object"){
      start = value[0];
      end   = value[1];
        
      if(!step && typeof value[2] === "number"){
        step = value[2];
      }
        
      if(typeof sizeBase !== "boolean"){
        sizeBase=false;
      }
    }
    
    if(typeof start !== "number" || typeof end !== "number"){
      if(typeof start !== "number" && typeof end !== "number") return r;
      if(typeof start === "number") return r.push(start),r;
      if(typeof end   === "number") return r.push(end)  ,r;
    }
    
    if(start > end){
      reverse = end;
      end     = start;
      start   = reverse;
      reverse = true;
    }
    
    end=parseFloat(end),end=isNaN(end)?0:end;
    start=parseFloat(start),start=isNaN(start)?0:start;
    step=parseFloat(step),step=isNaN(step)||step==0?1:step;
    if(step <= 0){ return console.warn("range::not support minus step"),r;};
    if(sizeBase==false){ for(var i=start,l=end;i<=l;i=i+step) r.push(i); } else { for(var i=start,l=end;i<l;i=i+step) r.push(i); }
    return reverse ? r.reverse() : r;
  }
  
  //TODO: Union HAS_VALUE
  let NESTED_HAS_PROC = function(obj,key){
    var keys = key.split(".");
    if(!keys.length) return false;

    var pointer = obj;
    for(var ki in keys){
      var k = keys[ki];

      if(!pointer.hasOwnProperty(k)){
        return false;
      } else {
        pointer = pointer[k];
      }
    }
    return true;
  }
  
  let APART = function(text,split,block,blockEnd){
    if(typeof text !== "string") return [text];
    
    let result = text.split(split===true?/\s+/:split||/\s+/);
    
    if(IS_PATTERN(block)){
      if(!IS_PATTERN(blockEnd)){
        blockEnd = block;
      }
      
      let aparts = []
      let buffer = { dept:0, parts:[] }
      
      for(let d=result,i=0,l=d.length;i<l;i++){
        let part = d[i]
        let greb = {
          start:FIND_INDEXES(part,block), 
          end  :FIND_INDEXES(part,blockEnd) 
        }
        
        console.log("part, greb", part, greb);
        
        for(let d=greb.start,i=0,l=d.length;i<l;++i){
          let startIndex = d[i]
        }
      }
      
      return aparts;
    } else {
      return result;
    }
  }
  
  let DIFF_STRUCTURE = function(before,after){
    var afterKeys = Object.keys(after);
    var beforeKeys;
    var canDiff = false;
    if(IS_OBJECT(before)){
      if(IS_ARRAY(before)){
        beforeKeys = before;
      } else {
        beforeKeys = Object.keys(before);
        canDiff    = true;
      }
    } else {
      beforeKeys = [];
    }

    var analysis = {
      after:after,
      before:before,
      keys:REDUCE(UNIQUE(afterKeys.concat(beforeKeys)),function(redu,key){ redu[key] = undefined;  return redu; },{}),
      match:[],
      missing:[],
      surplus:[],
      diff:[],
      pass:false
    };
    
    //match, missing
    for(var ki in beforeKeys){
      if(!beforeKeys.hasOwnProperty(ki)) continue;
        
      var key = beforeKeys[ki];
        
      if(NESTED_HAS_PROC(after,key)){
        analysis.match.push(key);
        analysis.keys[key] = "match";

        if(canDiff && !angular.equals(GET(after,key),GET(before,key))) {
          analysis.diff.push(key);
          analysis.keys[key] = "diff";
        }
      } else {
        analysis.surplus.push(key);
        analysis.keys[key] = "surplus";
      }
    }

    //surplus
    EACH(afterKeys,function(key){
      if(!HAS_VALUE(analysis.match,key)){
        analysis.missing.push(key);
        analysis.keys[key] = "missing";
      }
    });

    //absolute
    analysis.pass = !analysis.missing.length && !analysis.surplus.length;

    return analysis;
  }
  
  //PINPONGPOOL INTERFACE
  let TOGGLE = function(ta,cv,set){
    var index = -1;
    for(let d=AS_ARRAY(ta),l=d.length,i=0;i<l;i++){
      if(d[i] == cv) { index = i+1; break; }
    }
    if(arguments.length > 2) for(var i=0,l=ta.length;i<l;i++) if( ta[i] == set ) return ta[i];
    index = ta.length == index ? 0 : index;
    return ta[index];
  }
  
  let TRUN = function(i,p,ts){
    if(i < 0) { var abs = Math.abs(i/ts); i = p-(abs>p?abs%p:abs); }; 
    ts=ts?ts:1;i=Math.floor(i/ts);
    return (p > i)?i:i%p;
  }
  
  //PINPONGPOOL GENERATOR
  let RAND64 = (function(){
    var rand64Token = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    return function(length,codeAt,codeLength){
      length     = (isNaN(length)) ? 1 : parseInt(length);
      codeAt     = (isNaN(codeAt)) ? 0 : parseInt(codeAt);
      codeLength = (isNaN(codeLength)) ? 62 - codeAt : parseInt(codeLength);
      var result = "";
      for(var i=0,l=length;i<l;i++) result = result + rand64Token.charAt( codeAt + parseInt(Math.random() * codeLength) );
      return result;
    }
  }())
  
  let TOKENIZE = function(seed,digits){
    return Math.floor((Math.abs(Math.sin(Number((seed + "").replace(/./g,function(s,i){ return s.charCodeAt(0); }))) * 16777215)) % 16777215).toString(digits||16) 
  }
  
  return BowFactory;
})));
