import React, { useEffect, useState } from 'react'
import ROSLIB from 'roslib'
import {
  Map,
  createListener,
  initialMapState,
  RobotMarkers
} from 'rosreact'
import 'rosreact/dist/index.css'

const ros = new ROSLIB.Ros({ url: 'ws://0.0.0.0:9090' })

const App = () => {
  const [mapData, setMapData] = useState(initialMapState)
  const [robotPose,setRobotPose]= useState({position:{x:0,y:0,z:0},orientation:{w:0,x:0,y:0,z:0}})
  const mapListener = createListener(ros, '/map', 'nav_msgs/OccupancyGrid')
  const poseListener= createListener(ros,'/odom','nav_msgs/Odometry')
  useEffect(() => {
    mapListener.subscribe((result) => {
      setMapData(result)
    })
    poseListener.subscribe((result)=>{
      setRobotPose(result.pose.pose)
    })
    return () => {
      mapListener.unsubscribe()
    }
  }, [])
  return (
    <div>
        <Map mapData={mapData} />
        <RobotMarkers robotPose={robotPose} mapData={mapData}/>
    </div>
  )
}

export default App
