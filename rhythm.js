// HTML DOM elements
const f = document.getElementById('future');
const t = document.getElementById('tempo');
const s = document.getElementById('sub');
const re = document.getElementById('rests');
const dot = document.getElementById('dots');
const tup = document.getElementById('tup');
const pl = document.getElementById('pl');
const mes = document.getElementById('ms');
// Random between
function rand(min, max){
    return Math.floor(Math.random()*(max-min+1))+min;
}
const allR = [];// Stores all visible rhythms
function rr(s){// Random Rhythm
    s = s || 8;// default value
    s = Math.log2(s);
    let r = [];// this is where the rhythm goes
    let c = 0;// count
    let i = 0;// iteration
    let b = 1;// so we don't have a measure full of rests
    while(c < 1){// the notes have to fit into one measure
        r[i] = 2**rand(1, s);
        while(c+1/r[i]>1){// if it doesn't fit
            r[i] = 2**rand(1, s);
        }
        c += 1/r[i];
        if(rand(0, 3) == 0 && re.checked && b <= 0){// rests
            r[i] += '/r';
            b = 2;
        }
        r[i] = r[i].toString();// fixes problems
        if(r[i].replace('/r', '') < 2**s && rand(0, 3) == 0 && dot.checked && c + 1/r[i].replace('/r', '')/2 <= 1){// dotted notes
            c += 1/r[i].replace('/r', '')/2;
            r[i] += '.';
        }
        r[i] = 'B4/' + r[i];// formatting for VexFlow
        b--;
        i++;
    }
    return r;
    //return ['B4/8', 'B4/4', 'B4/4', 'B4/16', 'B4/8', 'B4/8', 'B4/16'];
    //return ['B4/8', 'B4/8', 'B4/8', 'B4/8', 'B4/8', 'B4/8', 'B4/8', 'B4/8'];
    //return ['B4/2', 'B4/4', 'B4/16', 'B4/8', 'B4/16'];
    //return ['B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128', 'B4/128'];
}
// This function is used to format and display the rhythms
function rhythm(sub){
    // VexFlow stuff
    const { Factory, EasyScore, System } = Vex.Flow;
    const vf = new Factory({
        renderer: { elementId: 'output', width: 'automatic', height: 100 }, 
    });
    const score = vf.EasyScore();
    const system = vf.System();
    // store random rhythm in a variable
    const a = rr(sub);
    //for every beat (quarter note), if there isn't a quarter note or longer, beam the note
    let c = 0;// count
    let b = 0;// used as index for ble
    let ble = [];// array for beams
    let l = a.length;
    for(let i = 0; i < l; i++){
        c += 1/parseInt(a[i].replace('B4/', '').replace('/r', '').replace('.', '')) + parseInt( a[i].includes('.') ? 1/parseInt(a[i].replace('B4/', '').replace('/r', '').replace('.', ''))/2 : 0 );// length of the note
        if(b < i && c <= 0.25){
            // document.getElementById('o').innerText += b+'-'+i+'\n';
            ble[b] = i;
        }
        if(c >= 0.25 || c + 1/parseInt(a[i+1]?.replace('B4/', '').replace('/r', '').replace('.', '')) + parseInt( ( a[i+1]?.includes('.') ? 1/parseInt(a[i+1]?.replace('B4/', '').replace('/r', '').replace('.', ''))/2 : 0 )) > 0.25){// if the beam or next note is too big
            b = i+1;
            c = 0;
        }
    }
    // This next part is used to format the whole thing
    let ev = 'score.notes(\'\')';// eval this later
    c = 0;// count
    b = 0;// just in case
    // Generate beams and tuplets
    for(let i = 0; i < l; i++){
        if(a[i] == 'B4/4' && rand(0, 3) == 0 && tup.checked){// tuplets
            ev += `.concat(score.notes('${a.slice(c, i).join(', ')}', {stem: 'up'}))`;
            b = 2**rand(3, Math.floor(Math.log2(sub)));
            ev += `.concat(score.tuplet(score.beam(score.notes('${new Array(b*3/8).fill('B4/'+b)}', {stem: 'up'})), {notes_occupied: ${b/4}, ratioed: false}))`;
            a[i] = 't/' + b*3/8;
            c = i+1;
        }
        if(ble[i]){// beams
            if(c != i)
            ev += `.concat(score.notes('${a.slice(c, i).join(', ')}', {stem: 'up'}))`;
            ev += `.concat(score.beam(score.notes('${a.slice(i, ble[i]+1).join(', ')}', {stem: 'up'})))`;
            c = ble[i]+1;
        }
    }
    if(c < l){// stragglers
        ev += `.concat(score.notes('${a.slice(c, l).join(', ')}', {stem: 'up'}))`;
    }
    allR.push(a);// add rhythm to the array
    // now we put all the notes in the thing
    system.addStave({
        voices: [
            score.voice(
                eval(ev)
            )
        ],
    })
        .addClef('percussion')// the two bars on the left
        .addTimeSignature('4/4');// you should know what this is
    const g = vf.getStave();
    // hide every line but the third
    g.setConfigForLine(0, {visible: false});
    g.setConfigForLine(1, {visible: false});
    g.setConfigForLine(3, {visible: false});
    g.setConfigForLine(4, {visible: false});
    g.setEndBarType(0);// hide end bar
    vf.draw();// this makes it magically poof onto the screen
    const svg = document.getElementsByTagName('svg');
    if(g.getWidth() <= document.body.clientWidth){
        svg[svg.length-1].style.paddingLeft = `calc(50% - ${g.getWidth()/2}px - 32px`;// center align
    }else{
        svg[svg.length-1].style.transform = `scale(${(document.body.clientWidth-16)/g.getWidth()})`;// scale down to fit big rhythms on the screen
    }
}
// So now we have the function called when you press the "Go!" button
// declare variables
let lopp;
let met;
let metr = document.getElementById('met');
let past = f.value;
let tempo;
let subs;
let firs = 0;
const ms = new Wad({source: 'sine', env: {attack: .001, decay: .01, sustain: .2, hold: .03, release: .02}, filter: {type: 'bandpass', frequency: 300, q: .180}});// metronome sound
function go(future, tem){
    window.removeEventListener('click', newR);// no more clicking
    tempo = tem || 120;// default value
    subs = s.value;// substitutions
    clearInterval(lopp);// stop making more rhythms
    clearInterval(met);// stop metronome
    for(let i = 0; i < past; i++){
        allR.shift();// destroy array
        document.body.getElementsByTagName('svg')[0]?.remove();// destroy on-screen rhythms
    }
    past = future;// time travel
    for(let i = 0; i < future; i++){// how many we need
        rhythm(subs);
    }
    score = 0;// reset score
    if(tempo > 0){// we go or no?
        newR();
        lopp = setInterval(()=>{
            newR();
            firs = 1;
        }, 24e4/tempo);// how long before new rhythm
        metr.style.opacity = 1;// first beat
        if(mes.checked){
            ms.stop();
            ms.play({pitch: 'E5'});
        }
        met = setInterval(()=>{// metronome
            metr.style.opacity = 1;
            if(mes.checked){
                ms.stop();
                ms.play({pitch: ['A4', 'E5'][firs]});
                firs = 0;
            }
        }, 6e4/tempo);
    }else{
        window.addEventListener('click', newR);// listen for clicks
    }
}
metr.style.opacity = 0;// fixes things
setInterval(()=>{
    metr.style.opacity *= 0.9;// decay
}, 10);
/*
|| This is the most unreliable thing I've used
\/ when it comes to precise timing :(
const pop = new Audio('pop.wav');
pop.load();
pop.play();

Wad works way wbetter ;)
*/
const snare = new Wad({source: 'noise', env: {attack: .001, decay: .01, sustain: .2, hold: .03, release: .02}, filter: {type: 'bandpass', frequency: 300, q: .180}});
let animmoveup;
// Shifts arrays and plays sound
function newR(){
    allR.shift();// remove first rhythm from array
    document.body.getElementsByTagName('svg')[0].remove();// remove first rhythm from screen
    let t = 0;// time
    // offsetTime = 0;// resetting this will cause you to lose if you pressed a button right before a measure, but are we running the risk of randomly losing because of accumulation?
    // max offset of 300 with 1000000 iterations, so, no risk
    offsetTime = Math.min(offsetTime, 0);// so you can take a break
    rhythm(subs);
    if(tempo > 0){// should we play sound
        if(good){
            score++;
            good = false;
        }
        sc.innerHTML = score;
        const notc = document.getElementsByClassName('vf-stavenote');
        let k = 0
        allR[0].forEach((i)=>{
            t = Math.round(t);
            if(!i.includes('t/')){// not tuplets
                setTimeout(()=>{
                    if(!i.includes('/r'))
                    offsetTime += Date.now();
                    snare.stop();
                    if(!i.includes('/r') && pl.checked)// don't play rests
                    snare.play();
                    notc[k].style.fill = '#f99843';
                    notc[k].style.stroke = '#f99843';
                    if(k > 0){
                        notc[k-1].style.fill = 'inherit';
                        notc[k-1].style.stroke = 'inherit';
                    }
                    k++;
                }, t);
                t += 24e4*(1/parseInt(i.replace('B4/', '').replace('/r', '').replace('.', '')) + (i.includes('.') ? 1/parseInt(i.replace('B4/', '').replace('/r', '').replace('.', ''))/2 : 0))/tempo;// how long the note is
            }else{// tuplets
                for(let j = 0; j < i.replace('t/', ''); j++){// notes in tuplet
                    setTimeout(()=>{
                        offsetTime += Date.now();
                        snare.stop();
                        if(pl.checked)
                        snare.play();
                        notc[k].style.fill = '#f99843';
                        notc[k].style.stroke = '#f99843';
                        if(k > 0){
                            notc[k-1].style.fill = 'inherit';
                            notc[k-1].style.stroke = 'inherit';
                        }
                        k++;
                    }, t);
                    t += 24e4*0.25/i.replace('t/', '')/tempo;// how long the note is
                }
            }
        });
        disp.style.animation = '';
        animmoveup = setTimeout(()=>{
            document.querySelector('svg').style.opacity = '0';
            disp.style.animation = 'up 0.2s ease-in 1 forwards';
        }, 24e4/tempo-200);
    }
}
// Rickroll >:)
const suond = new Audio('https://codehs.com/uploads/faef0f5f14ca8f741d2b40bba3cabfa7');
suond.load();
suond.loop = true;
// Powerup advertisement
/*let ad;
setTimeout(()=>{
    ad = document.createElement('div');
    ad.style.width = ad.style.height = '50%';
    ad.style.position = 'fixed';
    ad.style.padding = '4px';
    ad.style.left = ad.style.top = '25%';
    ad.style.backgroundColor = '#def';
    ad.style.textAlign = 'center';
    ad.innerHTML = '<h1>Would you like a powerup?</h1><button onclick="document.getElementById(\'output\').classList.add( \'r\'); ad.remove();">Yes</button><button onclick="ad.remove(); //[...Array(2**32-1)];">No</button>';
    document.body.appendChild(ad);
}, rand(6e4, 6e5));*/
