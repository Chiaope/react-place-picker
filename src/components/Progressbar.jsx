import { useEffect, useState } from "react"

const INTERVAL = 10

export default function ProgressBar({ timer }) {
    const [remainingTime, setRemainingTime] = useState(timer)

    useEffect(() => {
        const myInterval = setInterval(() => {
            setRemainingTime(prevTime => prevTime - INTERVAL)
        }, INTERVAL)
        return (() => {
            clearInterval(myInterval)
        })
    }, [])

    return (
        <progress value={remainingTime} max={timer} />
    )
}