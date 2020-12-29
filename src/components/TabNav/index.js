/*
 * @Description: 本组件定义一个顶部Tab栏 方便切换查看
 * @Author: 谢涛
 * @LastEditors: Please set LastEditors
 * @Date: 2019-04-22 19:13:58
 * @LastEditTime: 2020-12-16 14:04:03
 */

import React from 'react';
import { DoubleLeftOutlined } from '@ant-design/icons';
import { Tabs, Button } from 'antd';
import './style.css';
const { TabPane } = Tabs;

class TabNav extends React.Component {
  constructor(props) {
    super(props);
    this.newTabIndex = 0;
    const panes = this.props.item;
    this.state = {
      panes: panes, //要展示的数据
      type: 'editable-card', //定义Tab组件的类型为可编辑卡片
      display: 'none', //定义“关闭全部”按钮的显示状态
      activeKey: this.props.activeKey,
    };
  }

  onChange = (activeKey) => {
    const { panes } = this.state;
    if (activeKey === '首页') {
      //判断当前选中tab项的key是不是首页
      this.props.history.push('/HomePage'); //是的话就展现首页组件
    }
    this.setState({ activeKey });
    this.props.checkItemChange(activeKey); //调用父组件方法 传递当前Tab上被激活得tab项
    if (panes.length > 0) {
      //如果当前Tab数组长度大于等于1，控制“关闭全部”按钮的显示状态
      this.setState({
        display: 'block',
      });
    }
    for (let item in panes) {
      if (panes[item].key === activeKey) {
        this.props.history.push(`${panes[item].content}`);
      }
    }
  };

  onEdit = (targetKey, action) => {
    //组件自带方法
    this[action](targetKey);
  };

  // add = () => {
  //   //增加tab项
  //   const { panes } = this.state;
  //   const activeKey = `newTab${this.newTabIndex++}`;
  //   panes.push({ title: 'New Tab', content: 'New Tab Pane', key: activeKey });
  //   this.setState({ panes, activeKey });
  // };

  remove = (targetKey) => {
    //移除tab项
    let { activeKey, panes } = this.state;
    let lastIndex = '';
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const targetpanes = panes.filter((pane) => pane.key !== targetKey); //panes数组除去被点击的那个小项
    if (targetpanes.length && activeKey === targetKey) {
      //如果被打开的pane还有别的项，且被删除的这项是正在显示的
      if (lastIndex >= 0) {
        //如果不是最后一项那么让新数组的最后一项显示
        activeKey = targetpanes[lastIndex].key;
      } else {
        //如果是最后一项那么显示数组中的第一项
        activeKey = targetpanes[0].key;
      }
    }
    this.setState({ panes, activeKey });
    this.props.getRemovedItem(targetKey, () => {
      if (lastIndex < 0) {
        //判断当前选中tab项的key是不是首页
        this.props.history.push('/HomePage'); //是的话就展现首页组件
        return;
      }
      for (let item in panes) {
        if (panes[item].key === activeKey) {
          this.props.history.push(`${panes[item].content}`);
          break;
        }
      }
    });
    if (panes.length === 2) {
      this.setState({
        display: 'none',
      });
    }
  };

  //确保第一时间获取panes的改变值
  UNSAFE_componentWillUpdate(props, state) {
    state.panes = props.item;
    return state;
  }

  //关闭所有
  emptyAll = () => {
    this.props.emptyAll();
    this.setState({
      display: 'none',
    });
  };

  render() {
    const { activeKey, type, panes } = this.state;
    return (
      <div className='TabNav'>
        <Tabs
          hideAdd
          onChange={this.onChange}
          activeKey={activeKey}
          type={type} //顶部标签的显示类型 底部横线、带叉号卡片、不带叉号卡片
          onEdit={this.onEdit}
          defaultActiveKey='首页'
          tabBarExtraContent={
            <Button
              onClick={this.emptyAll}
              icon={<DoubleLeftOutlined />}
              style={{
                display: `${panes.length > 3 ? 'block' : 'none'}`,
              }}
            >
              关闭全部
            </Button>
          }
        >
          {/* 首页单独拿出来，其他动态渲染 */}
          <TabPane tab='首页' key='首页' id='homePage' closable={false}></TabPane>
          {panes.map((pane) => (
            <TabPane tab={pane.title} key={pane.key}></TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}

export default TabNav;
