const KEY='block-action-html5-draft-v1';
export function readDraft(storage){try{const d=JSON.parse(storage.getItem(KEY));if(d?.version!==1||!Array.isArray(d.cells)||d.cells.length!==840||!d.cells.every(n=>Number.isInteger(n)&&n>=-1&&n<=103))return null;return d;}catch{return null;}}
export function writeDraft(storage,draft){try{storage.setItem(KEY,JSON.stringify({version:1,...draft}));return true;}catch{return false;}}
export function discardDraft(storage){try{storage.removeItem(KEY);}catch{}}
