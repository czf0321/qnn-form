import React, { Component } from 'react'
import { General } from './index'  

export default class index extends Component {
    state = {
        formConfig: this.props.formConfig
    } 

    render() {
        const { formConfig = [] } = this.state; 
        return (
            <div>
                {
                    formConfig.map((item, index) => {
                        // console.log(item)
                        return <General key={index} {...item}/>
                    })
                }
            </div>
        )
    }
}
