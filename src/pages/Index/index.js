/*
 * @Description: 这是后台管理系统的Index页面（所有子页面都在本组件的Content部分展示与切换）
 * @Author: 谢涛
 * @LastEditors: zx
 * @Date: 2019-04-22 19:13:58
 * @LastEditTime: 2020-12-23 16:26:22
 */

import React, { Component, Suspense } from 'react';
import Icon, { PoweroffOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Button, Modal, message } from 'antd';
import MySider from '../../components/MySider';
import { withRouter, Route, Switch } from 'react-router-dom';
import TabNav from '../../components/TabNav';
import { loginApi } from '@/services/basic';
import { menuApi } from '@/services/basic';

import routes from '../../router';
import './style.css';

const { Header, Content, Sider } = Layout;

class Index extends Component {
  constructor(props) {
    super(props);
    const { history } = props;
    const path = history.location.pathname;
    let activeKey = '';
    let initRoute = '';
    let panel = JSON.parse(sessionStorage.getItem('panel')) || [];

    if (path === '/HomePage') {
      initRoute = routes.find((item) => item.path === path);
    } else {
      for (let item of panel) {
        if (item.content === path) {
          activeKey = item.key;
          initRoute = routes.find((item) => item.path === path);
          break;
        }
      }
    }
    this.state = {
      collapsed: false,
      panel: JSON.parse(sessionStorage.getItem('panel')) || [], //设置顶部标签默认打开的选项 默认是左侧导航的第一项
      activeKey: activeKey || '首页', //这个很重要 起着衔接左侧导航和顶部标签的同步交互的作用
      host: '',
      sub: [],
      openTabs: JSON.parse(sessionStorage.getItem('openTabs')) || {}, // 打开的tabs
      routes: initRoute ? [initRoute] : [],
      topMenus: [], // 菜单列表
      topMenusId: "", // 当前选中的菜单id
    };
  }

  getSiderItem (e) {
    const props = e.item.props.children[1].props;
    const obj = {}; //创建一个临时的对象 用来接收左侧被点击的选项 需要从e中取到3个属性 如下
    obj.title = props.children;
    obj.content = props.to;
    obj.key = e.key;
    const openTabs = JSON.parse(sessionStorage.getItem('openTabs')) || {};
    if (!openTabs.key) {
      openTabs[e.key] = { title: props.children, to: props.to };
    }
    sessionStorage.setItem('openTabs', JSON.stringify(openTabs));

    this.setState({
      activeKey: e.key, //设置当前选中的项
      openTabs, // 打开的tabs
    });
    this.TabNavRef.onChange(e.key); //调用TavNav组件的方法 让他同步变化当前选中的项
    let currentPanel = this.state.panel.slice(0); //复制当前的panel数组
    if (currentPanel.length === 0) {
      currentPanel.push(obj);
    } else {
      for (let item in currentPanel) {
        //遍历当前panel
        //向panel中push 不重复的obj 如果传来的是一个重复属性的obj 不push 中断本次循环
        if (currentPanel[item].key === obj.key) {
          break;
        }
        if (parseInt(item) === currentPanel.length - 1) {
          //确保遍历了一圈 都没有重复的key选项出现
          currentPanel.push(obj);
        }
      }
    }
    this.setState(
      {
        panel: currentPanel,
      },
      () => {
        sessionStorage.setItem('panel', JSON.stringify(currentPanel));
      }
    );
  }

  jump () {
    this.props.history.push('Login');
  }

  checkItemChange = (activeKey) => {
    this.MySiderRef.onItemChange(activeKey);
    this.setState({
      activeKey: activeKey,
    });
  };

  getRemovedItem = (targetKey, callback) => {
    let tempPanel = this.state.panel.slice(0);
    let routes = this.state.routes.slice(0);

    if (tempPanel.length > 0) {
      for (let item in tempPanel) {
        if (tempPanel[item].key === targetKey) {
          //找到现在所有的pane中key值等于删除的这个的key值
          let panel = tempPanel.splice(item, 1);
          let path = panel[0].content;
          for (let index in routes) {
            let item = routes[index];
            if (item.path === path) {
              routes.splice(index, 1);
              break;
            }
          }
          if (targetKey === this.state.activeKey) {
            //如果叉掉的这个项目的key等于当前正在显示的项目的key
            if (item > 0) {
              //如果这一项不是第一项，就让他往前跑
              this.setState(
                {
                  activeKey: tempPanel[item - 1].key,
                },
                () => {
                  this.MySiderRef.onItemChange(this.state.activeKey);
                }
              );
            } else if (item === 0 && tempPanel.length > 0) {
              //如果被叉掉的这一项 是第一项 而且操作完的数组至少还剩1个元素
              this.setState(
                {
                  activeKey: tempPanel[item].key, //为什么让他等于item.key而不是item+1.key呢 是因为这时候数组已经变了 之前排在他后面的索引取代了他
                },
                () => {
                  this.MySiderRef.onItemChange(this.state.activeKey);
                }
              );
            }
          }
        }
      }

      this.setState(
        {
          panel: tempPanel,
          routes,
        },
        () => {
          sessionStorage.setItem('panel', JSON.stringify(tempPanel));
          if (callback) {
            callback();
          }
        }
      );
    } else if (tempPanel.length === 1) {
      this.setState({ panel: [] }, () => {
        this.MySiderRef.onItemChange('首页');
        sessionStorage.setItem('panel', JSON.stringify([]));
      });
      this.props.history.push('/HomePage');
    }
  };

  UNSAFE_componentWillUpdate (props, state) {
    if (state && state.panel.length > 0) {
      state.type = 'editable-card';
    } else {
      state.type = 'card';
    }
    return state;
  }

  onQuit = () => {
    Modal.confirm({
      title: '您确定要退出吗？',
      content: '退出后需要重新登录，请确保相应操作已经保存',
      onOk: () => {
        //真实接口时用下面的
        loginApi.logout().then((res) => {
          sessionStorage.clear();
        });
        this.props.history.push('/login');
      },
    });
  };

  emptyAll = () => {
    this.setState(
      {
        panel: [],
        routes: [],
      },
      () => {
        this.props.history.push('/HomePage');
        sessionStorage.setItem('panel', JSON.stringify([]));
      }
    );
  };

  componentDidMount () {
    //   监听路由
    this.unlisten = this.props.history.listen((route) => {
      const { pathname } = route;
      if (pathname === '/HomePage') {
        this.MySiderRef.setState({
          current: '首页',
        });
        this.TabNavRef.setState({
          activeKey: '首页',
        });
      }
      const ownRoute = this.state.routes.find((item) => item.path === pathname);
      const unownRoute = routes.find((item) => item.path === pathname);
      if (!ownRoute && unownRoute) {
        this.setState({
          routes: [...this.state.routes, unownRoute],
        });
      }
    });
    menuApi.getLeftMenu().then((res) => {
      if (res && res.length !== 0) {
        // 判断接受到的数组是否为空
        let newSub = res.slice(0); // 将数组复制一份
        if (newSub.filter((item) => item.bs === true).length === 0) {
          message.warning('该用户尚未分配菜单权限 请联系管理员');
          return false;
        }
        this.setState({
          topMenus: res,
        });
      } else {
        this.setState({
          topMenus: [],
        });
      }
    });
  }
  componentWillUnmount () {
    this.unlisten();
  }

  /**
   * @author: zx
   * @param {*}
   * @description: 顶部菜单栏
   */
  onTopMenuChange = (id, childrens) => {
    this.setState({ topMenusId: id })
    this.MySiderRef.fetchSub(childrens)
  }

  render () {
    const Logo = () => <img src={require('./logo.png')} width='40px' height='40px' style={{ margin: '-10px 10px 0px 0px' }} alt='' />;

    const LogoIcon = (props) => <Icon component={Logo} {...props} />;

    const { yymc, yhxm } = JSON.parse(sessionStorage.getItem('userInfo'));
    const { topMenus, topMenusId } = this.state
    return (
      <Layout className='scroll_content'>
        <Header className='top-header'>
          <div style={{ display: 'flex' }}>
            <div className='sys-ifo'>
              <LogoIcon />
            妇保院后台管理系统
            </div>
            <div className="user-topmenus">
              {topMenus.length > 0 && topMenus.map(res => {
                return <div key={res.id} className={topMenusId === res.id ? 'bgtopmenus' : ''} onClick={() => this.onTopMenuChange(res.id, res.childrens)}>
                  {res.mc}
                </div>
              })}
            </div>
          </div>
          <div className='user-bar'>
            <Button icon={<UserOutlined />} className='user-info'>{`${yymc} ${yhxm}`}</Button>
            <Button onClick={this.onQuit} icon={<PoweroffOutlined />} className='quit-button'>
              退出
            </Button>
          </div>
        </Header>
        <Layout>
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
            <MySider
              getSiderItem={this.getSiderItem.bind(this)}
              ref={(MySiderRef) => {
                this.MySiderRef = MySiderRef;
              }}
              sub={this.state.sub}
              activeKey={this.state.activeKey}
            />
          </Sider>
          <Layout style={{ overflowY: 'auto' }}>
            <Header className='content-header'>
              <TabNav
                history={this.props.history}
                item={this.state.panel}
                type={this.state.type}
                ref={(TabNavRef) => {
                  this.TabNavRef = TabNavRef;
                }}
                checkItemChange={this.checkItemChange}
                getRemovedItem={this.getRemovedItem}
                emptyAll={this.emptyAll}
                activeKey={this.state.activeKey}
              />
            </Header>
            <Content className='content-content'>
              <div style={{ height: 'calc(100vh - 120px)' }}>
                <Suspense fallback={null}>
                  {this.state.routes.map((item, index) => {
                    return (
                      <Route
                        path={item.path}
                        children={({ match, ...res }) => (
                          <div style={{ display: match ? 'block' : 'none' }}>
                            <item.children {...res} />
                          </div>
                        )}
                        key={index}
                      />
                    );
                  })}
                </Suspense>
                <Switch></Switch>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(Index);
