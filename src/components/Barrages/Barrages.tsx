'use client';
import React, { useEffect, useState } from 'react'

import styles from './Barrages.module.css';
import Image from 'next/image';
import { ossURL, serverHost } from '@/config';

/*
 * {
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
}
 */

const StaticBarrageData:{
    id:number,
    user:string,
    text:string,
    isNew:boolean
}[] = []

/*
    弹幕从右往左滚动，滚动出界后随机出现在某一行
*/
const BarrageLineCount = 7;  //行数
const BarrageMargin = 30;  //行间距

const showTime = 30;  //弹幕平均显示时间,单位s
const BarrageWidth = 250;  //弹幕宽度
const maxBarrageWidth = 650;  //弹幕最大宽度

const getInterval = 5; //弹幕刷新间隔,单位s 

/**
 * 如果超过16个字符，截取前16个字符，后面加上省略号
 */
const getSliceText = (text:string) => {
    return text.length > 65 ? text.slice(0,65) + '...' : text
}

const getSliceUser = (user:string) => {
    return user.length > 3 ? user.slice(0,3) : user
}

function Barrage({ text, user,id, cycleTime,isNew }: {
    cycleTime: number,
    isNew: boolean,
    id: number,
    text: string,
    user: string
}) {
    const [line, setLine] = useState(Math.floor(Math.random() * BarrageLineCount));
    const [delay, setDelay] = useState(isNew ? 0 : (id - 17));
    const [avatar, setAvatar] = useState(`${ossURL}/avatar/avatar/${Math.floor(1 + Math.random() * 10)}.png`)
    const [moveTime, setMoveTime] = useState(showTime - 10 + Math.random() * 20);
    const [startCycle, setStartCycle] = useState(false)
    useEffect(() => {
        const timer = setTimeout(() => {
            setStartCycle(true)
            setLine(Math.floor(Math.random() * BarrageLineCount));
            setDelay(id - 17);
        },cycleTime * 1000)
        return () => {
            clearTimeout(timer)
        }
    },[])
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
            right: `-${maxBarrageWidth+50}px`,
            minWidth: `${BarrageWidth}px`,
            maxWidth: `${maxBarrageWidth}px`,
            paddingRight: '10px',
            animation: `barrageScroll linear ${moveTime}s ${startCycle ? 'infinite' : ''}`,
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
            }} >{getSliceUser(user)}</span>：
            <span style={{
                fontSize: '20px',
            }}>{getSliceText(text)}</span>
        </div>
    );
}

function Barrages() {
    const [barrages, setBarrages] = useState<{
        id: number,
        user: string,
        text: string,
        isNew: boolean
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
                setBarrages([...StaticBarrageData, ...response.data.map((item: any) => {
                    return {
                        id: item.id,
                        user: item.user,
                        text: item.content,
                        isNew: false
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
                    text,
                    isNew: true
                }])
            })
            .catch(err => {
                console.error(err)
                setBarrages([...barrages, {
                    id: barrages.length + Math.floor(1000*Math.random()),
                    user,
                    text,
                    isNew: true
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
                        <Barrage key={index} id={barrage.id} 
                            text={barrage.text} 
                            user={barrage.user} 
                            cycleTime={barrages.length + barrage.id + 19}
                            isNew={barrage.isNew}
                        />
                    );
                })}
            </div>

            {/* 添加弹幕 */}
            <div className={styles.addContainer}>
                <input ref={userRef} placeholder='用户名' type="text" value={user} onChange={(e) => setUser(e.target.value)}
                    className={styles.userInput} maxLength={4}
                />
                <input ref={textRef} placeholder='请输入内容,限30' type="text" value={text} onChange={(e) => setText(e.target.value)}
                    className={styles.textInput} maxLength={30}
                />
                <button onClick={addBarrage} className={styles.sendBtn}
                >发送弹幕</button>
            </div>
        </div>
    )
}

export default Barrages