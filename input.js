// Please remain seated until the webpage has come to a complete stop
let offsetTime = 0;
let score = 0;
let good = false;
let slack = 0;
const disp = document.getElementById('output');
const o = document.getElementById('o');
const sc = document.getElementById('score');
const dif = document.getElementById('dif');
/*const micIn = new Wad({source: 'mic'});
const mic = new Wad.Poly({
    audioMeter: {
        clipLevel: .98,
        averaging: .95,
        clipLag: 750,
    },
});
mic.setVolume(0);
mic.add(micIn);
micIn.play();
mic.updatePitch();
o.innerHTML = `Volume: ${Math.round(mic.audioMeter.volume*1000)/1000} Clip: ${mic.audioMeter.checkClipping()} Pitch: ${mic.pitch} Note: ${mic.noteName}`;*/
function listen(){
    window.addEventListener('keydown', hit);
    window.addEventListener('touchstart', hit);
}
function hit(e){
    if(e?.repeat)
    return;
    offsetTime -= Date.now();
    setTimeout(()=>{
        if(Math.abs(offsetTime) <= 24e4/(tempo*[8, subs][dif.checked+0])){
            good = true;
        }else{
            good = false;
            stopL();
            o.innerHTML = offsetTime;
            sc.innerHTML += `<br>You were only ${offsetTime > 0 ? 'ahead' : 'behind'} by ${Math.abs(offsetTime)<1e12 ? Math.abs(offsetTime)+'ms' : Math.round(Math.abs(offsetTime)/1000/60/60/24/365.25) + ' years'}`;
        }
    }, 12e4/(tempo*[8, subs][dif.checked+0]));
}
function stopL(){
    clearInterval(lopp);
    clearInterval(met);
    clearTimeout(animmoveup);
    window.removeEventListener('click', newR);
    window.removeEventListener('keydown', hit);
    window.removeEventListener('touchstart', hit);
}
