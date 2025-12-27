import {createContext , useRef, useState, useEffect} from 'react'
import { songsData } from '../assets/assets'


export const PlayerContext = createContext();


const PlayerContextProvider = (props) => {

    const audioRef = useRef()
    const seekBg = useRef()
    const seekBar = useRef()

    const [track, setTrack] = useState(songsData[1]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: {
            second: 0,
            minute: 0
        },
        totalTime: {
            second: 0,
            minute: 0
        }
    })

    const play = () => audioRef.current?.play()

    const pause = () => audioRef.current?.pause()


    const playWithId = async (id) =>{
        setTrack(songsData[id])
        await audioRef.current.play()
        setPlayStatus(true)
    }

    const previous = async () => {
        if(track.id>0){
            setTrack(songsData[track.id-1])
            await audioRef.current.play()
            setPlayStatus(true)
        }
    }
    const next = async () => {
        if(track.id<songsData.length-1){
            setTrack(songsData[track.id+1])
            await audioRef.current.play()
            setPlayStatus(true)
        }
    }

    const seekSong = async (e) => {
        audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth)*audioRef.current.duration)
    }

    useEffect(() => {
        setTimeout(() => {
            audioRef.current.ontimeupdate = () => {
                seekBar.current.style.width = (Math.floor(audioRef.current.currentTime/audioRef.current.duration*100))+"%"
                setTime({
                    currentTime: {
                        second: Math.floor(audioRef.current.currentTime %60),
                        minute: Math.floor(audioRef.current.currentTime / 60)
                    },
                    totalTime:{
                        second: Math.floor(audioRef.current.duration %60),
                        minute: Math.floor(audioRef.current.duration / 60)
                    }
                })
            }
        }, 1000);
    })

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const onPlay = () => setPlayStatus(true)
        const onPause = () => setPlayStatus(false)

        audio.addEventListener('play', onPlay)
        audio.addEventListener('pause', onPause) 

        return () => {
          audio.removeEventListener('play', onPlay)
          audio.removeEventListener('pause', onPause)
        }
    }, [])

    
    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track,
        setTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        playWithId,
        previous,
        next,
        seekSong,
        play,
        pause

    }

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export default PlayerContextProvider