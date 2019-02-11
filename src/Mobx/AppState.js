import {observable,action} from 'mobx';
const appState = observable({
    songList: [],
    isLogin: false,
    title: "music"
});
appState.addSong = action((key)=>{
    console.log(key)
    let flag = null 
    appState.songList.forEach((item,index) =>{ if(item.id === key.id) flag = index } )
    if(flag) {
        appState.songList.splice(flag,1)
    }
    appState.songList = [...appState.songList,key];
});
appState.login = action(()=>{
    appState.isLogin = true
});
appState.logout = action(()=>{
    appState.isLogin = false
});


export default appState;