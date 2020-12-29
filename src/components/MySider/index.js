/*
 * @Description: 本文件为管理系统的左侧菜单列表
 * @Author: 谢涛
 * @LastEditors: zx
 * @Date: 2019-04-22 19:13:58
 * @LastEditTime: 2020-12-23 16:11:39
 */

import React from 'react';
import { Menu, message } from 'antd';
import { Link } from 'react-router-dom';

import './style.css';

const SubMenu = Menu.SubMenu;

class MySider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: this.props.activeKey || 'homePage', //定义初始展示的页面为homePage组件
      openKeys: [], //定义默认打开第二组菜单
      sub: [], //第一级菜单
      rootSubmenuKeys: [],
      collapsed: 'true',
    };
  }
  // 获取子菜单
  getChildMenu = (item) => {
    const children = [];
    const { mjbz, btnbz, hasChild, childrens } = item;
    if (mjbz === '1' && btnbz === '0') {
      children.push(item);
      return children;
    }
    if (mjbz === '0' && hasChild) {
      for (let child of childrens) {
        children.push(...this.getChildMenu(child));
      }
    }
    return children;
  };

  fetchSub = (menus) => {
    console.log('menus===>', menus)
    // //获取菜单
    if (menus && menus.length !== 0) {
      // 判断接受到的数组是否为空
      let newSub = menus.slice(0); // 将数组复制一份
      let rootSubmenuKeys = [];
      if (newSub.filter((item) => item.bs === true).length === 0) {
        message.warning('该用户尚未分配菜单权限 请联系管理员');
        return false;
      }
      // 抽出末级菜单 --- 递归
      const mjCds = [];
      for (let item in newSub) {
        if (newSub[item] && newSub[item].bs) {
          mjCds.push(...this.getChildMenu(newSub[item]));
          rootSubmenuKeys.push(`${newSub[item].id}`);
        }
      }
      sessionStorage.setItem('mjCds', JSON.stringify(mjCds));

      newSub = this.renderMenu(newSub);
      this.setState({
        sub: newSub,
        openKeys: [`${menus[0].id}`],
        rootSubmenuKeys: rootSubmenuKeys,
      });
    } else {
      this.setState({
        sub: [],
      });
    }
  };

  // componentDidMount() {
  //   if (1) {
  //     this.fetchSub(); //默认取到所有一级菜单
  //   }
  // }

  handleClick = (e) => {
    // eslint-disable-next-line
    this.setState({ current: e.key });
    this.props.getSiderItem(e); //把当前点击了的菜单项信息传给父组件（Index）
  };

  onItemChange = (item) => {
    this.setState({ current: item });
  };

  onOpenChange = (openKeys) => {
    //新老openKeys对比 找到当前老的状态中没有的那个key
    const latestOpenKey = openKeys.find((key) => this.state.openKeys.indexOf(key) === -1);
    //如果这个最新打开的key 在rootSubmenuKeys中(也就是一级菜单中没有) 那么就用这个新的openkeys替换老的openkeys
    //可以理解为打开了某个二级菜单
    if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      //否则 如果latestOpenKey存在就让openKeys只剩这一个打开的latestOpenKey，若不存在就都不打开
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };

  //渲染菜单
  renderMenu = (sub) => {
    return sub.map((item) => {
      if (item.hasChild) {
        return (
          <SubMenu
            key={item.id}
            title={
              <span>
                <span>{item.mc}</span>
              </span>
            }
            style={{ display: item.bs ? 'block' : 'none' }}
          >
            {this.renderMenu(item.childrens)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={item.id} title={item.mc}>
            <Link to={item.tzdz || ''} onClick={this.onMenuClick}>
              {item.mc}
            </Link>
          </Menu.Item>
        );
      }
    });
  };

  render () {
    const { sub } = this.state; //存在且不为空时取值
    return (
      <div id='components-layout-demo-custom-trigger'>
        <Menu
          mode='inline'
          theme='dark'
          collapsed={this.state.collapsed}
          openKeys={this.state.openKeys} //指示哪个key是默认打开着的
          selectedKeys={[this.state.current]} //只是哪个key是被选中着的
          onOpenChange={this.onOpenChange} //打开的key变化时
          onClick={this.handleClick} //点击key时
        >
          {sub}
        </Menu>
      </div>
    );
  }
}

export default MySider;
