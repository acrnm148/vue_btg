//export 해서 사용하는 역할(import)

//import해놓고 사용안하면 vue-cli에서는 오류발생!!
// import {PLAYERS, MAX_SIZE, add, obj} from './export.js'; //내보낸거 import

// console.log(PLAYERS);
// console.log(MAX_SIZE);
// console.log(add(5,7));
// console.log(obj.template);

// import {MAX_SIZE} from './export.js';
// console.log(MAX_SIZE);

// import obj from './export.js';
// console.log(obj);
// obj.log();
// console.log(obj.data().num);


import obj from './export.js';
// import { obj } from './export.js'; //이게 안되는 이유?
let {template} = obj; //destructuring 디스트럭쳐링
console.log(template);