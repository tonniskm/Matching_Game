

import {Audio} from 'expo-av'

export async function playSound(sound){
    const soundObj = new Audio.Sound();
    soundObj.setOnPlaybackStatusUpdate();

    sound=="correct"?await soundObj.loadAsync(require("../assets/sounds/correct.mp3"),{shouldPlay:false},false):{}
    sound=="game_start"?await soundObj.loadAsync(require("../assets/sounds/game_start.mp3"),{shouldPlay:false},false):{}
    sound=="wrong"?await soundObj.loadAsync(require("../assets/sounds/wrong.mp3"),{shouldPlay:false},false):{}
    sound=="new_record"?await soundObj.loadAsync(require("../assets/sounds/new_record.mp3"),{shouldPlay:false},false):{}
    sound=="win"?await soundObj.loadAsync(require("../assets/sounds/win.mp3"),{shouldPlay:false},false):{}

    await soundObj.playAsync();
    
}