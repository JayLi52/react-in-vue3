import React from 'react'
import reactToWebComponent from 'react-to-webcomponent'
import ReactDOM from 'react-dom'
// import MyReactComponent from '../module/InstanceList/index'
import MyReactComponent from './my-element'

const MyElement = reactToWebComponent(
    MyReactComponent,
    React,
    ReactDOM
  )
customElements.define('my-element', MyElement)