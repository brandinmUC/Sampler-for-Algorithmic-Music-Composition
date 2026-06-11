/* Sources
https://chatgpt.com/share/67d14da3-a188-8000-baa1-f8117dc7e8da
*/

class Player {  
    constructor (sound, speccolor, label, note) {
        this.sound = sound;
        this.note = note;
        this.volume = 22;
        this.bits = new Tone.BitCrusher().set({bits: 16});
        this.chorus = new Tone.Chorus();
        this.reverb = new Tone.Reverb().set({wet: 1});
        this.player = new Tone.Sampler({
            urls: {[this.note]: this.sound}, release: 1,
        });
        this.label = label
        if (this.label <= 2) {
            this.playerDiv = nn.create('div')
                            .set({id: `playerDiv${this.label}`})
                            .addTo('body');
        } else {
            this.playerDiv = nn.create('div')
                            .set({id: `playerDiv3`})
                            .addTo('body');
        }
        this.rlabel =  nn.create('label')
                        .set({class: `reverbtext`})
                        .content('Reverb: 0')
                        .addTo(this.playerDiv);
        this.vlabel = nn.create('label')
                        .set({class: `volumetext`})
                        .content('Volume: 22')
                        .addTo(this.playerDiv);
        this.blabel = nn.create('label')
                        .set({class: `bitstext`})
                        .content('Bits: 16')
                        .addTo(this.playerDiv);
        this.chlabel = nn.create('label')
                        .set({class:`chorustext`})
                        .content('Chorus: 0')
                        .addTo(this.playerDiv); 
        this.clabel = nn.create('label')
                        .set({class: `channel`})
                        .content(`Channel ${this.label}: ` + this.sound)
                        .addTo(this.playerDiv); 
        if (this.label <= 2) {
            this.spec = createSpectrum({range: [0, 8000], color: speccolor});
            this.wave = createWaveform({range: [0, 8000], width: "100%", color: speccolor});
        } else {
            this.spec = createSpectrum({range: [0, 8000], color: speccolor});
        }
        
        this.loop = new Tone.Loop((time) => {
            if (!this.player.loaded) {
                console.error("Sampler not loaded yet!");
                return;
            }
            this.player.triggerAttackRelease(attackNote(noteIndex), 1, Tone.now(), 1);
        }, 1);
    }


    connect() {
        this.player.connect(this.reverb);
        this.reverb.connect(this.bits);
        this.reverb.connect(this.chorus);
        this.bits.toDestination();
        this.chorus.toDestination();
        this.bits.connect(this.spec);
        this.chorus.connect(this.spec);
        this.bits.connect(this.wave);
        this.chorus.connect(this.wave);
    }


    createUI() {
        if (this.label <= 2) {
            nn.create('input') //reverb
                .set({
                    type: 'range',
                    min: 0, // minimum value for this slider
                    max: 1, // maximum value for this range
                    value: 0, // default value
                    step: 0.1, // smallest change we can make when we slide it
                    class: `reverb reverb${this.label}`
                })
                .addTo(this.playerDiv)
                .on('input', this.changeReverb.bind(this));
                

            nn.create('input') //Volume
                .set({
                    type: 'range',
                    min: -22, // minimum value for this slider
                    max: 22, // maximum value for this range
                    value: 0, // default value
                    step: 1, // smallest change we can make when we slide it
                    class: `volume volume${this.label}`
                })
                .addTo(this.playerDiv)
                .on('input', this.changeVolume.bind(this));
                

            nn.create('input') //Bits
                .set({
                    type: 'range',
                    min: 1, // minimum value for this slider
                    max: 16, // maximum value for this range
                    value: 16, // default value
                    step: 1, // smallest change we can make when we slide it
                    class: `bits bits${this.label}`
                })
                .addTo(this.playerDiv)
                .on('input', this.changeBits.bind(this));
            
                
            nn.create('input') //Chorus
                .set({
                    type: 'range',
                    min: 0, // minimum value for this slider
                    max: 1, // maximum value for this range
                    value: 0, // default value
                    step: 0.1, // smallest change we can make when we slide it
                    class: `chorus chorus${this.label}`
                })
                .addTo(this.playerDiv)
                .on('input', this.changeChorus.bind(this));


            // visualizations
            nn.create('input')
                .set({
                    type: 'checkbox',
                    class: `toggle toggle${this.label}`,
                })
                .content('Play sound')
                .addTo(this.playerDiv)
                .on('change', this.togglePlayer.bind(this));  

                
            // Read file input - from example
            nn.create('input')
                .set({
                    type: 'file', accept: 'audio/*', 
                    class: `choosefile` 
                })
                .addTo(this.playerDiv)
                .on('change', (event) => {
                    const file = event.target.files[0]
                    if (file) this.loadFileToBuffer(file);
                });
            

            // Inputs
            nn.create('button')    // what we want to make
                .set({
                    class: `button`
                })
                .content(`Reset Channel ${this.label}`)    // what we want it to say
                .addTo(this.playerDiv)      // where we want to put it
                .on('click', this.resetSettings.bind(this));
        } else {
            nn.create('input') //reverb
                .set({
                    type: 'range',
                    min: 0, // minimum value for this slider
                    max: 1, // maximum value for this range
                    value: 0, // default value
                    step: 0.1, // smallest change we can make when we slide it
                    class: `reverb reverb3`
                })
                .addTo(this.playerDiv)
                .on('input', this.changeReverb.bind(this));
                

            nn.create('input') //Volume
                .set({
                    type: 'range',
                    min: -22, // minimum value for this slider
                    max: 22, // maximum value for this range
                    value: 0, // default value
                    step: 1, // smallest change we can make when we slide it
                    class: `volume volume3`
                })
                .addTo(this.playerDiv)
                .on('input', this.changeVolume.bind(this));
                

            nn.create('input') //Bits
                .set({
                    type: 'range',
                    min: 1, // minimum value for this slider
                    max: 16, // maximum value for this range
                    value: 16, // default value
                    step: 1, // smallest change we can make when we slide it
                    class: `bits bits3`
                })
                .addTo(this.playerDiv)
                .on('input', this.changeBits.bind(this));
            
                
            nn.create('input') //Chorus
                .set({
                    type: 'range',
                    min: 0, // minimum value for this slider
                    max: 1, // maximum value for this range
                    value: 0, // default value
                    step: 0.1, // smallest change we can make when we slide it
                    class: `chorus chorus3`
                })
                .addTo(this.playerDiv)
                .on('input', this.changeChorus.bind(this));


            // visualizations
            nn.create('input')
                .set({
                    type: 'checkbox',
                    class: `toggle`
                })
                .content('Play sound')
                .addTo(this.playerDiv)
                .on('change', this.togglePlayer.bind(this));  

                
            // Read file input - from example
            nn.create('input')
                .set({
                    type: 'file', 
                    accept: 'audio/*', 
                    class: `choosefile` 
                })
                .addTo(this.playerDiv)
                .on('change', (event) => {
                const file = event.target.files[0]
                if (file) this.loadFileToBuffer(file);
                });
            

            // Inputs
            nn.create('button')    // what we want to make
                .set({
                    class: `button`
                })
                .content(`Reset Channel ${this.label}`)    // what we want it to say
                .addTo(this.playerDiv)      // where we want to put it
                .on('click', this.resetSettings.bind(this));
        }
    }

    
    changeReverb(e) {
        const reverb = Number(e.target.value);
        console.log(`reverb${this.label}:`, reverb);
        this.rlabel.content("Reverb: " + reverb);
        this.reverb.set({
        wet: e.target.value
        });
    }


    changeVolume(e) {
        const vol = Number(e.target.value);
        console.log(`VOL${this.label}: ` + vol);
        this.vlabel.content("Volume: " + (vol + 22));
        this.player.volume.value = vol;
    }


    changeBits(e) {
        const val = Number(e.target.value);
        console.log(`BITS${this.label}`, val);
        this.blabel.content("Bits: " + val);
        this.bits.set({bits: val});
    }


    changeChorus(e) {
        const val = Number(e.target.value);
        this.chorus.set({     
        frequency: 4, 
        delayTime: 16, 
        type: 'triangle', 
        depth: 1, 
        feedback: 0.1, 
        spread: 120,
        wet: e.target.value});
        console.log(`CHORUS${this.label}: ` + val);
        this.chlabel.content("Chorus (wet): " + val);
    }
        

    togglePlayer(e) {
        if (Tone.Transport.state !== 'started') {
            Tone.Transport.start();
        }
        if (e.target.checked) {
            this.loop.start();
        } else {
            this.loop.stop();
        }
    }

    
    resetSettings(e) {
        if (this.label <= 2) {
            const reverb_doc = document.getElementsByClassName(`reverb${this.label}`)[0];
            const bits_doc = document.getElementsByClassName(`bits${this.label}`)[0];
            const volume_doc = document.getElementsByClassName(`volume${this.label}`)[0];
            const chorus_doc = document.getElementsByClassName(`chorus${this.label}`)[0];
        } else {
            const reverb_doc = document.getElementsByClassName(`reverb3`)[0];
            const bits_doc = document.getElementsByClassName(`bits3`)[0];
            const volume_doc = document.getElementsByClassName(`volume3`)[0];
            const chorus_doc = document.getElementsByClassName(`chorus3`)[0];
        }
        reverb_doc.value = 0;
        volume_doc.value = this.player.volume.value = 0;
        chorus_doc.value = 0;
        bits_doc.value = 16; 
        this.bits.set({bits: 16});
        this.chorus.set({wet: 0});
        this.rlabel.content("Reverb: " + 0);
        this.vlabel.content("Volume: " + 22);
        this.blabel.content("Bits: " + 16);
        this.chlabel.content("Chorus: " + 0);
    }


    // file selection
    loadFileToBuffer (file) {
        const reader = new window.FileReader();
        reader.onload = async (e) => {

            const fileData = e.target.result;
            const buffer = await Tone.context.decodeAudioData(fileData);
            
            this.player.add(this.note, buffer);
            this.clabel.content(`Channel ${this.label}: ` + file.name);          
        };
        reader.readAsArrayBuffer(file);
    } 
}


// document.body.style.background = "black"
// screaming: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Scream-c.wav" 

//Default Sounds
const sound1 = "sounds/ZappBeats_808.wav";
const sound2 = "sounds/Hunting_horn_tone.mp3";
let mic, recorder, audioChunks = [], sampler;
mic = new Tone.UserMedia();



const player1 = new Player(sound1, "red", 1, 'C2');
player1.connect();
player1.createUI();
// 


const player2 = new Player(sound2, "green", 2, 'F#5');
player2.connect();
player2.createUI();
// 


const waves = document.querySelectorAll("svg");
const wave1 = waves[1];
const wave2 = waves[3];

wave1.id = "cover";
wave2.id = "cover";
wave1.classList.add("wave");
wave1.classList.add("wave1");
wave2.classList.add("wave");
wave2.classList.add("wave2");





// collection of chords
const chords = [
    ['E3', 'G#3', 'B3', 'D3'],
    ['A3', 'C3', 'E3', 'A4']
]


let lastSecond = -1 // this is to "gate" the conditional below
let recording = 0
let chordIndex = 0 // which chord in the collection
let noteIndex = 0 // which note in the chord (try each person setting a different noteIndex to start with)


// we'll use our system clock (new Date) to stay in sync
function syncClock () {
    window.requestAnimationFrame(syncClock)
    const d = new Date()
    const s = d.getSeconds() 
    // every 4 seconds switch chord
    if (s % 4 === 0 && s !== lastSecond) {
        chordIndex++
        lastSecond = s // this ensures it only updates once per second
        console.log(chordIndex)
    } 
}
    
function attackNote (noteIndex) {
    const ci = chordIndex % chords.length
    const note = chords[ci][noteIndex]
    playedNote = note
    return playedNote
}
    
function changeNoteIdx(e) {
    if (e.key === '1') {
        noteIndex = 0;
    } else if (e.key === '2') {
        noteIndex = 1;
    } else if (e.key === '3') {
        noteIndex = 2;
    } else if (e.key === '4') {
        noteIndex = 3;
    }
    noteidx.content("Note Index: " + noteIndex);
}


async function startMicRecording() {
    await Tone.start(); // Ensure Tone.js is active
    await mic.open();
    console.log("Microphone open:", mic);

    // Set up MediaRecorder to capture mic input
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(mediaStream);

    recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            audioChunks.push(event.data);
        }
    };

    recorder.onstop = async () => {
        console.log("Recording stopped.");
        await loadRecordingIntoSampler();
    };

    audioChunks = []; // Reset audio chunks
    recorder.start();
    console.log("Recording started...");
}
    
// Function to stop recording and save file
function stopMicRecording() {
    recorder.stop();
    mic.close(); // Stop microphone input
    console.log("Recording stopped.");
    recording++
}

    
async function loadRecordingIntoSampler() {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const fileReader = new FileReader();

    fileReader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        const audioBuffer = await Tone.context.decodeAudioData(arrayBuffer);
        
        // Load recorded audio into sampler at 'C3' (or any note you want)
        const player3 = new Player(audioBuffer, "orange", 3 + recording, 'C3');
        player3.connect();
        player3.createUI();
        console.log("Loaded recording into sampler!");

        const audioUrl = URL.createObjectURL(audioBlob);

        // Create a download link
        const downloadLink = document.createElement("a");
        downloadLink.href = audioUrl;
        downloadLink.download = "recording.wav";
        downloadLink.innerText = `Download Recording ${3 + recording}`;
        document.body.appendChild(downloadLink);
        
    };

    fileReader.readAsArrayBuffer(audioBlob);
}
    

noteidx = nn.create('label')
            .set({
                class: `noteidx`
            })
            .content('Note Index: ' + noteIndex)
            .addTo('body');

nn.on('keydown', changeNoteIdx)

function createRecordingButtons() {
    nn.create('button')
    .set({
        id: "record",
        class: "button"
    })
    .content('Record')
    .addTo('body')
    .on('click', startMicRecording);

    nn.create('button')
        .set({
            id: "stop",
            class: "button"
        })
        .content('Stop')
        .addTo('body')
        .on('click', stopMicRecording);

    nn.create('button')
        .set({
            id: "sync",
            class: "button"
        })
        .content('Sync Clock')
        .addTo('body')
        .on('click', syncClock);
}

function removeCover() {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.getElementById("cover").style.display = "none";
    document.querySelector(".wave1").style.display = "none";
    document.querySelector(".wave2").style.display = "none";
    createRecordingButtons();
}

async function lockScreen() {
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = "0";
    document.body.style.width = "100%";
    document.querySelector('.wave1').addEventListener('click', async () => {
        const t1 = document.querySelector('.toggle1');
        t1.checked = !t1.checked;
        await Tone.Transport.start();
        console.log('audio ready');
        if (player1.loop.state != "started") {
            player1.loop.start();
            console.log(`player1 started.`)
        } else {
            player1.loop.stop();
            console.log(`player1 stopped.`);
        }
    });
    document.querySelector('.wave2').addEventListener('click',  async () => {
        const t2 = document.querySelector('.toggle2');
        t2.checked = !t2.checked;
        await Tone.Transport.start();
        console.log('audio ready');
        if (player2.loop.state != "started") {
            player2.loop.start();
            console.log(`player2 started.`);
        } else {
            player2.loop.stop();
            console.log(`player2 stopped.`);
        }
    });
}
