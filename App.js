import React, {Component} from 'react'
import {StyleSheet,Text,View,Animated,Pressable,Alert,SafeAreaView,Dimensions} from 'react-native'
import {Cards} from './components/Cards'
import { playSound } from './components/Sounds';
import AsyncStorage from '@react-native-async-storage/async-storage';


CARDS_NUMBER = 12;
ACROSS = 3;
MARGIN = 40;
TOP_SPACE = 70;
CARD_WIDTH = 80;
CARD_HEIGHT = 120;
SHAPES = ['circle','square','rectangle','triangle','oval']
COLORS = ['red','blue','green','black','purple','magenta','cyan','orange','yellow']
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
MARGIN_X = (WINDOW_WIDTH-2*MARGIN-ACROSS*CARD_WIDTH)/(ACROSS-1)
ROWS = Math.floor(CARDS_NUMBER/ACROSS)
CARDS_NUMBER%ACROSS==0?ROWS=ROWS:ROWS=ROWS+1
MARGIN_Y = (WINDOW_HEIGHT-2*TOP_SPACE-ROWS*CARD_HEIGHT)/(ROWS-1)
export default  App = ()=>{
  let dummyInfo = []
  for (let i=0;i<CARDS_NUMBER;i++){
    dummyInfo[i] = {}
    dummyInfo[i].id = i
    dummyInfo[i].status = 'down'
    dummyInfo[i].complete = false
    dummyInfo[i].pic = {shape:'dummy',color:"dumcolor"}
  }
let [cardInfo,setCardInfo] = React.useState(dummyInfo)
let newCardInfo = cardInfo
let cardRender = []
let [flippedCards,setFlippedCards] = React.useState([]);
let [mayClick,setMayClick] = React.useState(true)
let [startTrigger,setStartTrigger] = React.useState(true)
let [streak,setStreak] = React.useState(0);
let [moves,setMoves] = React.useState(0);
let [highStreak,setHighStreak] = React.useState(0);
let [highMoves,setHighMoves] = React.useState(999);
let [gotRecord,setGotRecord] = React.useState(false);
let [prestige,setPrestige] = React.useState(0);
let winner_scale = React.useRef(new Animated.Value(0)).current
let [winnerIndex,setWinnerIndex] = React.useState(-1);
let [winnerText,setWinnerText] = React.useState('')

function getCardLocation(i){
  let row = Math.floor(i/ACROSS);
  let column = i % ACROSS;
  let x = MARGIN + (CARD_WIDTH + MARGIN_X)*column;
  let y = TOP_SPACE + (CARD_HEIGHT + MARGIN_Y)*row;
  let location = {};
  location.x = x;
  location.y = y;
  return location
}
React.useEffect(()=>{
  getData()
  Begin()
},[])

const getData = async() =>{
  try{
    const saveddata = await AsyncStorage.getItem("highscores");
    const thedata = JSON.parse(saveddata)
    if(!thedata){}else{setHighMoves(thedata.moves),setHighStreak(thedata.streak),setPrestige(thedata.prestige)}
  // setRead(thedata)
  }catch(e){
    console.log(e)
  }
}

const writeData = async(data) =>{
  try {
    await AsyncStorage.setItem("highscores", JSON.stringify(data));
  }catch(e){
    console.log(e)
  }
}
React.useEffect(()=>{
  if(highStreak>0||highMoves<999||prestige>0){
  writeData({streak:highStreak,moves:highMoves,prestige:prestige})
  }
},[highStreak,highMoves,prestige])

React.useEffect(()=>{
  if(streak>0){
  if(streak>highStreak){
    setHighStreak(streak)
    if(!gotRecord){
      playSound('new_record')
      setGotRecord(true)
    }else{playSound('correct')}
  }else{playSound('correct')}
}
},[streak])

React.useEffect(()=>{
  if (flippedCards.length<=1){
    //less than two flipped
  }else{
    //two are flipped
    setMoves(moves+1)
    if(cardInfo[flippedCards[0]].pic==cardInfo[flippedCards[1]].pic){
      //they match

      setStreak(streak+1)
      let newcardInfo = cardInfo.map(x=>x)
      for(let i=0;i<flippedCards.length;i++){
        newcardInfo[flippedCards[i]].complete = true
      }
      setFlippedCards([]);
      setCardInfo(newcardInfo);
      //check if winner
      let incomplete = newcardInfo.filter(x=>!x.complete)
      if(incomplete.length==0){
        let message = ''
        if(moves+1<=highMoves){
          setHighMoves(moves+1)
          if(moves+1<=CARDS_NUMBER/2){setPrestige(prestige+1)}
          playSound('new_record')
          message = 'New Record!'
        }else{playSound('win')}
        setWinnerIndex(999)
        setWinnerText('You Win!'+`\n`+message+`\n`+'Play Again?')
        Animated.timing(winner_scale,{
          toValue:1,
          duration:1000,
          useNativeDriver:false
        }).start()
        //Alert.alert('','You Win!'+`\n`+message,[{text:'play again.',onPress:()=>Begin()}])
        }
    }else{//no match
      playSound('wrong')
      setStreak(0)
      setMayClick(false)
      let newcardInfo = cardInfo.map(x=>x)
      for(let i=0;i<flippedCards.length;i++){
        newcardInfo[flippedCards[i]].status = 'down'
      }
      setCardInfo(newcardInfo)
    }
  }
},[flippedCards])

function Begin(){
  setGotRecord(false)
  setStartTrigger(!startTrigger)
  setMoves(0)
  setWinnerIndex(-1)
  setWinnerText('')
  Animated.timing(winner_scale,{
    toValue:0,
    duration:10,
    useNativeDriver:false
  }).start()
  let pics = GetPicOrder(GenerateUsedPics())
  for (let i=0;i<CARDS_NUMBER;i++){
    newCardInfo[i] = {}
    newCardInfo[i].id = i;
    newCardInfo[i].pic = pics[i]
    newCardInfo[i].status = 'down'
    newCardInfo[i].complete = false
  }
  setCardInfo(newCardInfo)
  playSound('game_start')
}

  function GenerateUsedPics(){
    let pic = []
    let usedshapes = []
    let usedcolors = []
    let index = []
    let useableColors = COLORS
    for(let i=0;i<CARDS_NUMBER/2;i++){
      let color = useableColors[Math.floor(Math.random()*useableColors.length)]
      let usedinds = index.filter(x=>usedcolors[x]==color)
      usedinds.length>=SHAPES.length-1?useableColors=useableColors.filter(x=>x!=color):{}
      let usedthiscombo = []
      for (let j=0;j<usedinds.length;j++){
        usedthiscombo[j] = usedshapes[usedinds[j]]
      }
        useableshapes = SHAPES.filter(x=>usedthiscombo.indexOf(x)==-1)
      let shape = useableshapes[Math.floor(Math.random()*useableshapes.length)]
      index[i] = i
      usedcolors[i] = color
      usedshapes[i] = shape
      pic[i] = {color:color,shape:shape}

  
      }
      return pic
  }
  function GetPicOrder(usedpics){
      let remainingspace = []
      let pics = []
      for (let i=0;i<CARDS_NUMBER;i++){
        remainingspace[i] = i
        pics[i] = -1
      }
      for(let i=0;i<usedpics.length;i++){
        for(let j=0;j<2;j++){
          let chosenspace = remainingspace[Math.floor(Math.random()*remainingspace.length)]
          remainingspace = remainingspace.filter(x=>x!=chosenspace)
          pics[chosenspace] = usedpics[i]
        }
      }
      return pics
  }



//render
for (let i=0;i<CARDS_NUMBER;i++){
  let location = getCardLocation(i);
  cardRender[i] = <View key={'card'+i} style={[styles.cardContainer,{left:location.x,top:location.y}]}>{
    Cards(cardInfo[i].id,cardInfo,setCardInfo,flippedCards,setFlippedCards,mayClick,setMayClick,startTrigger)}
  </View>
}

let prestigemessage = `Tries: ${moves},  High Score: ${highMoves}`
if(prestige>0){prestigemessage = `Tries: ${moves},  Times Perfect: ${prestige}`}
  return(
  <SafeAreaView style={styles.container}>
    <Text style={styles.scores}>Streak: {streak},  High Score: {highStreak}</Text>
    <Text style={styles.scores}>{prestigemessage}</Text>
    {cardRender}
    <Animated.View style={{flex:1,alignItems:'center',justifyContent:'center',zIndex:winnerIndex,transform:[{scale:winner_scale}],}}>
      <Pressable onPress={()=>{Begin()}} style={{width:'60%',height:'50%',backgroundColor:'lightgreen',alignItems:'center',justifyContent:'center',borderRadius:25,borderColor:'black',borderWidth:2}}>
        <Text style={{fontSize:25,fontWeight:'bold'}}>{winnerText}</Text>
      </Pressable>
    </Animated.View>
  </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white',
    marginTop:20

  },
  cardContainer:{
    position:'absolute',
    left:50,
    top:100,
    width:CARD_WIDTH,
    height:CARD_HEIGHT,
  },
  scores:{
    fontSize:20,
    marginLeft:20,
    zIndex:9999
  }
})