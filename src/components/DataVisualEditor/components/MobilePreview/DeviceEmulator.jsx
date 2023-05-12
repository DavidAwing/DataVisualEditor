import React from 'react';
import ReactDOM from 'react-dom';
import DeviceEmulator from 'react-device-emulator';
// import 'react-device-emulator/lib/styles/style.css';
import './DeviceEmulator.less';

function reactComponent(props) {
  const { url, type } = props
  return (
    <div className={'my-device-emulator'}>
      <DeviceEmulator  type={type} withDeviceSwitch withRotator url={url} >
        <h1>Welcome to React Device Emulator</h1>
      </DeviceEmulator>
    </div>
  )
}

export default reactComponent
