'use client';

import { ossURL } from '@/config';
import React, { use, useCallback, useEffect, useState } from 'react'
import { useAudio } from 'react-use';

function Music() {

    const [audio, state, controls, ref] = useAudio({
        src: ossURL + '/audio/家书.mp3',
        autoPlay: true,
    });
    const [audio1, state1, controls1, ref1] = useAudio({
        src: ossURL +'/audio/妈妈是女儿.mp3',
        autoPlay: false,
        loop: true
    });

    //每隔2秒尝试播放家书,家书放完后循环播放妈妈是女儿
    useEffect(() => {
        const interval = setInterval(() => {
            if (state.paused) {
                controls.play()
            }
        }, 2000)
        return () => clearInterval(interval)
    }, [state, controls])


    //家书(6分15秒)放完后播放妈妈是女儿
    useEffect(() => {
        const timer = setTimeout(() => {
            if(ref1.current){
                ref1.current.play()
            }
        }, 375000)
        return () => clearTimeout(timer)
    }, [ref1])
    
    return (
        <div>
            {audio}
            {audio1}
        </div>
    )
}

export default Music