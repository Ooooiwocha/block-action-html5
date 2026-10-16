export function singleLine(value){return String(value??'').replace(/[\r\n\u000b\u000c\u0085\u2028\u2029]/g,'');}
export function installSingleLineFields(root=document){
 for(const field of root.querySelectorAll('[data-single-line]')){
  field.addEventListener('input',()=>{const start=field.selectionStart,end=field.selectionEnd,value=field.value,clean=singleLine(value);if(clean===value)return;field.value=clean;if(start!==null&&end!==null)field.setSelectionRange(singleLine(value.slice(0,start)).length,singleLine(value.slice(0,end)).length);});
 }
}
