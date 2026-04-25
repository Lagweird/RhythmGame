window.onerror = function(e){alert(e);};
function rand(min, max){
    return Math.floor(Math.random()*(max-min+1))+min;
}
function rr(m, s){
    s = s || 8;
    let r = [];
    for(let i = 0; i < m; i++){
        r[i] = [];
        for(let j = 0; j < s; j++){
            r[i][j] = rand(0, 1);
        }
    }
    return r;
    //return [[0,1,1,1,1,1,1,1]];
}
const m = document.getElementById('m');
const s = document.getElementById('s');
const d = document.getElementById('disp');
const notes = [];
notes[1] = '𝅝';
notes[2] = '𝅗𝅥';
notes[4] = '𝅘𝅥';
notes[8] = '𝅘𝅥𝅮';
notes[16] = '𝅘𝅥𝅯';
notes[32] = '𝅘𝅥𝅰';
notes[64] = '𝅘𝅥𝅱';
notes[128] = '𝅘𝅥𝅲';
const rests = [];
rests[1] = '𝄻';
rests[2] = '𝄼';
rests[4] = '𝄽';
rests[8] = '𝄾';
rests[16] = '𝄿';
rests[32] = '𝅀';
rests[64] = '𝅁';
rests[128] = '𝅂';
let c;
let note;
let rhythm;
function go(){
    rhythm = rr(m.value, s.value);
    d.innerHTML = '';
    parseRhythm();
    /*rhythm.forEach((i)=>{
        d.innerHTML += i + '<br>';
    });*/
}
function parseRhythm(){
    for(let i of rhythm){
        c = 1;
        note = i[0];
        i.reduce((a, b)=>{
            if(rand(0, 3) > 0 || note == 0){
                if(a == b){
                    c++;
                }else{
                    o(note, c);
                    note = !note;
                    c = 1;
                }
            }else{
                o(note, c);
                if(a != b)
                    note = !note;
                c = 1;
            }
            return b;
        });
        o(note, c);
        d.innerHTML += '<br>';
    }
}
function o(note, count){
    if(count - 2**Math.floor(Math.log2(count)) > 1){
        setTimeout(()=>{
            d.innerHTML = '';
            parseRhythm();
        }, m.value*s.value);
        return;
    }
    //d.innerHTML += (note ? 'Note: ' : 'Rest: ') + count/s.value + '; ';
    for(let j = 0; j < count; j++){
        d.innerHTML += '&nbsp;';
    }
    let a = count;
    while(Math.log2(a) != Math.floor(Math.log2(a))){
        a--;
    }
    if(note){
        d.innerHTML += notes[1/(a/s.value)];
    }else{
        d.innerHTML += rests[1/(a/s.value)];
    }
    for(let j = 0; j < count - a; j++){
        d.innerHTML += '𝅭';
    }
    for(let j = 0; j < count; j++){
        d.innerHTML += '&nbsp;';
    }
}
