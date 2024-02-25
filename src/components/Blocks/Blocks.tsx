'use client';
import React, { useEffect, useState } from 'react'
import styles from './Blocks.module.css';
import Image from "next/image";
import { ossURL } from '@/config';


const PhotoCount = 24; //图片总数，从1.jpg到24.jpg
const LineCount = 6;  //行数
const LinePhotoCount = 8; //每行图片数

/**
 * 单行显示8张图片，高度为视口的1/6，向右无缝循环滚动。
 */
function Line({line,direction = 'right'}:{
  line: number,
  direction: 'left' | 'right'
}){
  const [imageHeight, setImageHeight] = useState(150);
  useEffect(() => {
    setImageHeight(typeof window !== 'undefined' ? window.innerHeight / 6 : 150);
  }, []);
  const Photos = () => {
    const photos = Array.from({length: LinePhotoCount}).map((_, index) => {
      return (line * LinePhotoCount + index) + 1;
    })
    return photos.map(photo => {
      return (
        <div key={photo} style={{
          position: 'relative',
          width: '200px',
          height: `${imageHeight}px`,
        }}>
          <img src={`${ossURL}/images/images/${photo}.jpg`} style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          alt="photo" />
        </div>
      );
    })
  }
  return (
    <div className={direction == 'left' ? styles.leftLine : styles.rightLine}>
      <Photos />
      <Photos />
    </div>
  );
}
  
function Blocks() {
  return (
    <div className={styles.container}>
      {Array.from({length: LineCount}).map((_, index) => {
        return (
          <Line key={index} line={index % 3} direction={index%2 == 0 ? 'left' : 'right'}/>
        );
      })}
    </div>
  );
}

export default Blocks;