import React from 'react'
import { Button } from '@ali/teamix-ui'

const MyElement = (props) => {
  return (
    <div>
      <h1>这是来自 React 的组件</h1>
      {/* {props.children} */}
      <Button>点击</Button>
    </div>
  )
}

export default MyElement
