'use client';
import { ossURL } from '@/config';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
/**
 * 一个居中显示的图片，每10秒自动切换一次
 * 切换时先缩小，再放大
 */
const changeTime = 7000; //切换时间
function getRandomSrc() {
  return ossURL + '/images/images/' + Math.floor(Math.random() * 24 + 1) + '.jpg'
}
function CenterPhoto({ initSrc }: {
  initSrc?: string
}) {
  const [src, setSrc] = useState(initSrc || getRandomSrc())
  const [animation, setAnimation] = useState<'shrink' | 'grow' | ''>('')

  //切换图片时先缩小，再放大
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimation('shrink')
      setTimeout(() => {
        const randomSrc = getRandomSrc()
        // console.log('randomSrc', randomSrc)
        setSrc(randomSrc)
        setAnimation('grow')
      }, 500)

    }, changeTime)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      width: '100vw', height: '100vh',
      position: 'fixed', top: 0, left: 0,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <img
        src={src}
        style={{
          width: '72vw', 
          maxWidth: '800px',
          height:'auto',
          objectFit: 'cover',
          boxShadow: '0 0 20px 5px rgba(0, 0, 0 ,0.62)',
          borderRadius: '10px',
          animation: animation === 'shrink' ? 'shrink 0.6s ease-in-out' : animation === 'grow' ? 'grow 0.8s ease-out' : ''
        }} alt="Center photo" />
    </div>
  )
}

export default CenterPhoto