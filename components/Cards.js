
import React  from 'react'
import {StyleSheet,Text,View,Animated,Pressable,ImageBackground} from 'react-native'




  const SHAPE_SIZE = 50;

export function Cards (id,info,setInfo,flippedCards,setFlippedCards,mayClick,setMayClick,startTrigger){


  let animatedValue = React.useRef(new Animated.Value(0)).current
  let waitdummy = React.useRef(new Animated.Value(0)).current

     frontInterpolate = animatedValue.interpolate({
      inputRange:[0,180],
      outputRange:['0deg','-180deg']
    })
    backInterpolate = animatedValue.interpolate({
      inputRange:[0,180],
      outputRange:['180deg','0deg']
    })

  React.useEffect(()=>{
    if(flippedCards.indexOf(id)>-1&&info[id].status=='down'){
      unFlip()
    }
  },[info[id].status])
  
  React.useEffect(()=>{
    FastunFlip()
  },[startTrigger])

 function Flip(){
   if(flippedCards.indexOf(id)<0&&!info[id].complete&&mayClick){
    Animated.spring(animatedValue,{
      toValue:180,
      friction:8,
      tension:10,
      useNativeDriver:false
    }).start()
    let newinfo = info.map(x=>x)
    newinfo[id].status = 'up'
    setInfo(newinfo)
    let newflipped = flippedCards.map(x=>x)
    setFlippedCards([...newflipped,id])
    }
  }

  function unFlip(){
      Animated.timing(waitdummy,{
        toValue:0,
        duration:1500,
        useNativeDriver:false
      }).start(()=>{
        Animated.timing(animatedValue,{
          toValue:0,
          duration:500,
          useNativeDriver:false
        }).start(()=>{setMayClick(true)})
      })
    let newinfo = info.map(x=>x)
    newinfo[id].status = 'down'
    setInfo(newinfo)
    let newflipped = flippedCards.map(x=>x)
    newflipped = newflipped.filter(x=>x!=id)
    setFlippedCards(newflipped)
  }
  function FastunFlip(){
    Animated.timing(animatedValue,{
      toValue:0,
      duration:10,
      useNativeDriver:false
    }).start()
  }
  

  const frontanimstyle = {
    transform:[
      {rotateY:frontInterpolate}
    ]
  }
    const backanimstyle = {
    transform:[
      {rotateY:backInterpolate}
    ]
  }
  let cardcolor = {}
  info[id].pic.shape=='triangle'?cardcolor={backgroundColor:'transparent',borderBottomColor:info[id].pic.color}:cardcolor={backgroundColor:info[id].pic.color}

    return(
      <View style={styles.container}>
      <View style={{flex:1,width:'100%'}}>
          <Pressable onPress={()=>Flip()} style={{position:'absolute',width:'100%',height:'100%',zIndex:99}}></Pressable>
        <Animated.View style={[styles.flipCard,frontanimstyle]}>
          <ImageBackground source={require('../assets/cardback.png')} style={{flex:1,height:'100%',width:'100%',borderColor:'black',borderWidth:1}}>
          {/* <Text style={{color:'yellow',fontSize:20}}>{info[id].pic.shape}</Text>
         <Text style={{color:'yellow',fontSize:20}}>{info[id].pic.color}</Text> */}
          </ImageBackground>
        </Animated.View>
        <Animated.View style={[backanimstyle,styles.flipCard,styles.flipcardBack]}>
          <View style={[picStyles[info[id].pic.shape],{flex:1},cardcolor]}>
          </View>
        </Animated.View>
        </View>
      </View>
    )

  }


const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',

  },
  flipCard:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'blue',
    backfaceVisibility:'hidden',
    width:'100%',
    height:'100%',
    borderRadius:12
  },
  flipcardBack:{
    backgroundColor:'white',
    position:'absolute',
    top:0,
    backfaceVisibility:'hidden',
    width:'100%',
    height:'100%',
    borderColor:'black',
    borderWidth:2

  }
})

const picStyles = StyleSheet.create({
  circle: {
    position: 'absolute',
    width: SHAPE_SIZE,
    height: SHAPE_SIZE,
    borderRadius: SHAPE_SIZE / 2,
    backgroundColor: 'red',
  },
  square: {
    position: 'absolute',
    width: SHAPE_SIZE,
    height: SHAPE_SIZE,
    backgroundColor: 'green',
  },
  triangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',

    borderRightWidth: SHAPE_SIZE / 2,
    borderBottomWidth: SHAPE_SIZE,
    borderLeftWidth: SHAPE_SIZE / 2,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'blue',
    borderLeftColor: 'transparent',
  },
  oval: {
    position: 'absolute',
    width: SHAPE_SIZE,
    height: SHAPE_SIZE,
    borderRadius: SHAPE_SIZE / 2,
    backgroundColor: 'red',
    transform:[{scaleY:1.5}]
  },
    rectangle: {
    position: 'absolute',
    width: SHAPE_SIZE*1,
    height: SHAPE_SIZE*1.5,
    backgroundColor: 'green',
  },
});