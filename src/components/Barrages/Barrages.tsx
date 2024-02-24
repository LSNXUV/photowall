'use client';
import React, { useEffect, useState } from 'react'

import styles from './Barrages.module.css';
import Image from 'next/image';
import { ossURL, serverHost } from '@/config';

const StaticBarrageData = [{
    id: 1,
    text: '高考加油！！',
    user: 'Marry'
}, {
    id: 2,
    text: '考研上岸！！！',
    user: 'Bob'
}, {
    id: 3,
    text: '爸爸妈妈我爱你！！！！！！！！！',
    user: 'Elon Musk'
}, {
    id: 4,
    text: '加油！！！',
    user: '蔡徐坤'
}, {
    id: 5,
    text: '不负韶华！！',
    user: '马嘉祺'
}]

/*
    弹幕从右往左滚动，滚动出界后随机出现在某一行
*/
const BarrageLineCount = 7;  //行数
const BarrageMargin = 30;  //行间距

const showTime = 20;  //弹幕平均显示时间,单位s
const BarrageWidth = 250;  //弹幕宽度
const maxBarrageWidth = 450;  //弹幕最大宽度

const getInterval = 5; //弹幕刷新间隔,单位s 

function Barrage({ text, user }: {
    text: string,
    user: string
}) {
    const [line, setLine] = useState(Math.floor(Math.random() * BarrageLineCount));
    const [delay, setDelay] = useState(Math.random() * 5);
    const [avatar, setAvatar] = useState(`${ossURL}/avatar/avatar/${Math.floor(1 + Math.random() * 10)}.png`)
    const [moveTime, setMoveTime] = useState(showTime - 5 + Math.random() * 10);
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: '10px',
            position: 'absolute',
            color: 'white',
            height: `calc(100% / ${BarrageLineCount} - ${BarrageMargin}px)`,
            minHeight: '60px',
            top: `calc(${line} * (100% / ${BarrageLineCount}) + ${BarrageMargin / 2}px)`,
            right: `-${maxBarrageWidth}px`,
            minWidth: `${BarrageWidth}px`,
            maxWidth: `${maxBarrageWidth}px`,
            paddingRight: '10px',
            animation: `barrageScroll linear ${moveTime}s infinite`,
            animationDelay: `${delay}s`
        }}
            onAnimationIteration={() => {
                setLine(Math.floor(Math.random() * BarrageLineCount));
            }}
        >
            <img className={styles.avatar} width={50} height={50} src={avatar} alt="avatar" />
            <span style={{
                fontSize: '20px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
            }} >{user}</span>：
            <span style={{
                fontSize: '20px',
            }}>{text}</span>
        </div>
    );
}

function Barrages() {
    const [barrages, setBarrages] = useState<{
        id: number,
        user: string,
        text: string
    }[]>(StaticBarrageData)
    const [user, setUser] = useState('')
    const userRef = React.useRef<HTMLInputElement>(null)
    const [text, setText] = useState('')
    const textRef = React.useRef<HTMLInputElement>(null)

    //每隔一段时间获取弹幕
    useEffect(() => {
        getBarrages()
        const interval = setInterval(() => {
            getBarrages()
        }, getInterval * 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])
    const getBarrages = async () => {
        /* "data": [
		{
			"id": 1,
			"user": "dfnujwqb",
			"content": "wikhqnfiqowh",
			"createdAt": "2024-02-24T06:01:12.000Z",
			"updatedAt": "2024-02-24T06:01:12.000Z"
		} */
        fetch(serverHost+'/danmu', { method: 'GET' })
            .then(response => response.json())
            .then(response => {
                console.log('刷新danmu')
                setBarrages([...StaticBarrageData, ...response.data.map((item: any) => {
                    return {
                        id: item.id,
                        user: item.user,
                        text: item.content
                    }
                })])
            })
            .catch(err => console.error(err));
    }

    const addBarrage = async () => {
        if (!userRef.current || !textRef.current) return
        //聚焦到输入框
        if (!user) {
            userRef.current.focus()
            return
        }
        if (!text) {
            textRef.current.focus()
            return
        }
        //发送弹幕
        fetch(serverHost+'/danmu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user,
                content: text
            })
        })
            .then(response => response.json())
            .then(response => {
                setBarrages([...barrages, {
                    id: response.data.id,
                    user,
                    text
                }])
            })
            .catch(err => {
                console.error(err)
                setBarrages([...barrages, {
                    id: barrages.length + Math.floor(1000*Math.random()),
                    user,
                    text
                }])
            });
        setText('')
    }
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh'
        }}>
            <div className={styles.container}>
                {barrages.map((barrage, index) => {
                    return (
                        <Barrage key={index} text={barrage.text} user={barrage.user} />
                    );
                })}
            </div>

            {/* 添加弹幕 */}
            <div className={styles.addContainer}>
                <input ref={userRef} placeholder='请输入用户名' type="text" value={user} onChange={(e) => setUser(e.target.value)}
                    className={styles.userInput}
                />
                <input ref={textRef} placeholder='请输入内容' type="text" value={text} onChange={(e) => setText(e.target.value)}
                    className={styles.textInput}
                />
                <button onClick={addBarrage} className={styles.sendBtn}
                >发送弹幕</button>
            </div>
        </div>
    )
}

export default Barrages