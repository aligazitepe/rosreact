import React, { useState } from 'react'
import ROSLIB from 'roslib'
import { ColorPicker, useColor } from 'react-color-palette'
import { ReactComponent as ReactLogo } from './assets/palette.svg'
import { ReactComponent as CarLogo } from './assets/carIcon.svg'

import 'react-color-palette/lib/css/styles.css'
import styles from './styles.module.css'

export const ExampleComponent = ({ text }) => {
  return <div className={styles.test}>Example Component: {text}</div>
}

export const createListener = (ros, topicName, messageType) => {
  const listener = new ROSLIB.Topic({
    ros,
    name: topicName,
    messageType
  })
  return listener
}

export const Map = ({ mapData }) => {
  const canvasRef = React.useRef(null)
  const [color, setColor] = useColor('hex', '#65c2ac')
  const [color1, setColor1] = useState({
    hex: '#61bda7',
    rgb: { r: 97, g: 189, b: 167 }
  })
  const [color2, setColor2] = useState({
    hex: '#ffd57e',
    rgb: { r: 255, g: 213, b: 126 }
  })
  const [color3, setColor3] = useState({
    hex: '#71e088',
    rgb: { r: 113, g: 224, b: 136 }
  })
  const [open, setOpen] = React.useState(false)
  const handleClick = () => {
    setOpen(!open)
  }
  const handleSelect = (event) => {
    console.log(color)
    if (open) {
      switch (event.target.id) {
        case '1':
          setColor1(color)
          break
        case '2':
          setColor2(color)
          break
        case '3':
          setColor3(color)
          break
        default:
          console.log(color, color1, color2, color3)
      }
    }
  }
  React.useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.width = mapData.info.width || 1
    canvas.height = mapData.info.height || 1
    //first drawing
    const imageData = context.createImageData(canvas.width, canvas.height)
    for (let i = 0; i < mapData.data.length; i += 1) {
      // Modify pixel data
      let index =
        ((canvas.height - Math.floor(i / canvas.width) - 1) * canvas.width +
          (i % canvas.width)) *
        4
      if (mapData.data[i] == -1) {
        imageData.data[index + 0] = color1.rgb.r //|| 25 // R value
        imageData.data[index + 1] = color1.rgb.g //|| 75 // G value
        imageData.data[index + 2] = color1.rgb.b //|| 200 // B value
        imageData.data[index + 3] = 255 // A value
      } else if (mapData?.data[i] == 0) {
        imageData.data[index + 0] = color2.rgb.r //190 + (i % 10) // R value
        imageData.data[index + 1] = color2.rgb.g //0 + ((3 * i) % 200) // G value
        imageData.data[index + 2] = color2.rgb.b //110 + ((2 * i) % 200) // B value
        imageData.data[index + 3] = 255 // A value
      } else if (mapData?.data[i] == 100) {
        imageData.data[index + 0] = color3.rgb.r // 0// R value
        imageData.data[index + 1] = color3.rgb.g //0 // G value
        imageData.data[index + 2] = color3.rgb.b //0 // B value
        imageData.data[index + 3] = 255 // A value
      }
    }
    context.putImageData(imageData, 0, 0)
  }, [mapData, color, canvasRef.current, color1, color2, color3])

  return (
    <div>
      <p>Patika Robotics</p>
      <div>
        <canvas
          ref={canvasRef}
          style={{
            zIndex: -1,
            borderRadius: '10px',
            position: 'relative'
          }}
        />
        {open && (
          <ColorPicker
            width={canvasRef.current?.width}
            height={50}
            color={color}
            onChange={setColor}
            hideHSV
            hideHEX
            hideRGB
            dark
            style={{ position: 'absolute', top: mapData.info.height }}
          />
        )}
        <ReactLogo
          onClick={handleClick}
          style={{
            zIndex: 1,
            position: 'absolute',
            top: mapData.info.height,
            left: 0,
            cursor: 'pointer'
          }}
        ></ReactLogo>
        {open && (
          <div>
            <div
              id='1'
              onClick={handleSelect}
              className={styles.rectangle}
              style={{
                position: 'absolute',
                top: mapData.info.height + 7.5,
                left: 50,
                backgroundColor: color1.hex
              }}
            ></div>
            <div
              id='2'
              onClick={handleSelect}
              className={styles.rectangle}
              style={{
                position: 'absolute',
                top: mapData.info.height + 7.5,
                left: 100,
                backgroundColor: color2.hex
              }}
            ></div>
            <div
              id='3'
              onClick={handleSelect}
              className={styles.rectangle}
              style={{
                position: 'absolute',
                top: mapData.info.height + 7.5,
                left: 150,
                backgroundColor: color3.hex
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  )
}
const calculateEuler = (qw, qx, qy, qz) => {
  let x = 0
  let y = 0
  let z = 0
  const qw2 = qw * qw
  const qx2 = qx * qx
  const qy2 = qy * qy
  const qz2 = qz * qz
  const test = qx * qy + qz * qw
  if (test > 0.499) {
    y = (360 / Math.PI) * Math.atan2(qx, qw)
    z = 90
    x = 0
    const res = { x, y, z }

    return res
  }
  if (test < -0.499) {
    y = (-360 / Math.PI) * Math.atan2(qx, qw)
    z = -90
    x = 0
    const res = { x, y, z }
    return res
  }
  const h = Math.atan2(2 * qy * qw - 2 * qx * qz, 1 - 2 * qy2 - 2 * qz2)
  const a = Math.asin(2 * qx * qy + 2 * qz * qw)
  const b = Math.atan2(2 * qx * qw - 2 * qy * qz, 1 - 2 * qx2 - 2 * qz2)
  y = Math.round((h * 180) / Math.PI)
  z = Math.round((a * 180) / Math.PI)
  x = Math.round((b * 180) / Math.PI)
  const res = { x, y, z }
  return res
}

export const RobotMarkers = ({ robotPose, mapData }) => {
  const [orientation, setOrientation] = React.useState('0')
  const iconWidth = 16
  const iconHeight = -32
  React.useEffect(() => {
    console.log(mapData)
    setOrientation(
      -calculateEuler(
        robotPose.orientation.w,
        robotPose.orientation.z,
        robotPose.orientation.y,
        robotPose.orientation.x
      ).x + 90
    )
  }, [
    robotPose.orientation.w,
    robotPose.orientation.z,
    robotPose.orientation.y,
    robotPose.orientation.x
  ])
  return (
    <div>
      <CarLogo
        style={{
          //zoom:2.0,
          position: 'absolute',
          left:
            -iconWidth +
            (robotPose.position.x - mapData.info.origin?.position.x) /
              mapData.info.resolution,
          top:
            -iconHeight +
            mapData.info.height -
            (robotPose.position.y - mapData.info.origin?.position.y) /
              mapData.info.resolution,
          transform: `rotate(${orientation}deg)`
        }}
      />
    </div>
  )
}

export const initialMapState = {
  info: { origin: { position: { x: 1, y: 1, z: 1 } }, resolution: 1 },
  data: []
}
