// file：权限---高阶组件，给组件滞按钮权限，如：增，删，改，查, author: jianghainan, date: 2020-07-20

// 针对列表页面和详情页面耦合度过高，详情页面无法使用高阶组件的情况，在此方法添加详情页面需要的属性和数据，
// 提供比如：history, 字数字典，页面设置之类的通用数据 , author: jianghainan, date: 2020-07-23
import React from 'react'

// import { withRouter } from 'react-router-dom'
// import { message } from 'antd'
// import { menuApi } from '@/services/basic'
import NewComponet from './newComponent'


const BtnPermission = (Child, childParams = {}) => {

    // return withRouter(Permission)
    return () =>   <NewComponet Child={Child} childParams={childParams} />

}


export default BtnPermission