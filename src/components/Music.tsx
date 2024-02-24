'use client';

import { ossURL } from '@/config';
import React, { useEffect, useState } from 'react'
import { useAudio } from 'react-use';

function Music() {
    const [isSetVolume, setIsSetVolume] = useState(false)
    const [audio, state, controls, ref] = useAudio({
        src: ossURL + '/audio/妈妈是女儿-伴奏.mp3',
        autoPlay: true,
        loop: true
    });
    const [audio1, state1, controls1, ref1] = useAudio({
        src: ossURL +'/audio/家书.m4a',
        autoPlay: true,
        loop: true
    });
    //bgm音量小一点
    useEffect(() => {
        if (ref.current && !isSetVolume) {
            ref.current.volume = 0.7
            setIsSetVolume(true)
        }
    }, [ref, isSetVolume])

    //每隔5秒尝试播放
    useEffect(() => {
        const interval = setInterval(() => {
            
            if (state.paused) {
                controls.play()
            }
            if (state1.paused) {
                controls1.play()
            }
        }, 5000)
        return () => clearInterval(interval)
    }, [state, controls, state1, controls1])
    return (
        <div>
            {audio}
            {audio1}
        </div>
    )
}

export default Music