import React from 'react'
import { ControlPosition, Control } from './components'

export default class CustomControl extends Control {
  static defaultProps = {
    position: ControlPosition.TOP_CENTER,
    style: {},
    onEdit: () => {},
    onChoose: () => {}
  }

  render () {
    const { style, onEdit, onChoose } = this.props
    return (
      <div ref={node => (this.controlNode = node)} style={style}>
        <div className='tools'>
          <button className='tc-15-btn weak' onClick={onEdit}><i className='icon-pen' />编辑</button>
          <button className='tc-15-btn weak selected' onClick={onChoose}><i className='icon-pointer' />选择</button>
        </div>
      </div>
    )
  }
}
