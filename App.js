import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Platform, SafeAreaView, TouchableOpacity} from 'react-native';
import { useEffect, useState } from 'react';
import Header from './src/components/Header';
import Timer from './src/components/Timer';
import {Audio} from "expo-av";

const colors = ["#F8B7E7","#73E5D7","#BFEBA1"];

export default function App() {
  const [isWorking, setIsWorking] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [currentTime, setCurrentTime] = useState("POMODORO" | "SHORT" | "BREAK");
  const [isActive, setIsActive] = useState(false);


  const optionsTimes = {
    0: 25,
    1: 5,
    2: 15,
  };

  useEffect(() => {
    let interval = null;

    if(isActive){
      interval = setInterval(() => {
        setTime(time-1);
      }, 1000);
    }else{
      clearInterval(interval);
    }

    if(time === 0){
      setIsActive(false);
      setIsWorking((prev) => !prev);
      setTime(optionsTimes[currentTime] * 60);
    }

    return () => clearInterval(interval)
  },[isActive,time])

  function handleStartStop(){
    playSound();
    setIsActive(!isActive);
  }

  async function playSound(){
    const {sound} = await Audio.Sound.createAsync(
      require("./assets/boxing-bell-start.mp3")
    )
    await sound.playAsync();
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor:colors[currentTime]}]}>
      <View style={{
        paddingHorizontal:15,
        paddingTop:Platform.OS === "android" && 50,
        flex:1,
        }}>
        <Text style={styles.titulo}>
          Pomodoro   
        </Text>

        <Header 
          currentTime={currentTime} 
          setCurrentTime={setCurrentTime} 
          time={time}
          setTime={setTime}
        />

        <Timer
          time={time}
        />

        <TouchableOpacity onPress={handleStartStop} style={styles.button}>
          <Text style={{color:'white', fontWeight:'bold'}}>{isActive ? "STOP" : "START"}</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titulo: {
    fontSize:32,
    fontWeight:"bold"
  },
  button:{
    backgroundColor: "#333333",
    padding:15,
    marginTop:15,
    borderRadius:15,
    alignItems:"center"
  }
});
