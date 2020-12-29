/*
 * @Autor: zx
 * @Date: 2020-12-22 09:54:02
 * @LastEditTime: 2020-12-23 14:42:19
 * @FilePath: \fby-web\src\pages\Login\index.js
 * @LastEditors: zx
 * @Description: 登录页
 */

import React, { Component } from 'react';
import { BranchesOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Button, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { loginApi } from '@/services/basic';
import axios from '../../axios';
import './style.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserNameFocused: true, //账号框是否获得焦点
      PassWordFocused: false, //密码框是否获得焦点
      PhoneNumberFocused: true, //手机号码框是否获得焦点
      AuthcodeFocused: false, //验证码框是否获得焦点
      username: '', //作为医疗机构是否给与响应的判断依据
      userCode: true, //标记是否是用户名/密码方式登录
      time: 60, //倒计时时间
      authCodeSend: false, //标识验证码是否发送
    };
  }

  handleSubmit = (e) => {
    this.form.validateFields().then((values) => {
      //后台登录验证
      loginApi
        .login({
          username: values.userName,
          password: values.passWord,
        })
        .then((response) => {
          sessionStorage.setItem('userInfo', JSON.stringify(response));
          sessionStorage.setItem('isAuthenticated', true);
          axios.defaults.headers.common['AUTH-TOKEN'] = response.token;
          axios.defaults.headers.common['HEADER-USER-ID'] = response.userId;
          message.success('欢迎登录');
          this.props.history.replace('/HomePage');
        });
    });
  };

  //用户名框获得焦点
  addUserNameStyle = () => {
    this.setState({
      UserNameFocused: true,
      PassWordFocused: false,
    });
  };

  //密码框获得焦点
  addPassWordStyle = () => {
    this.setState({
      UserNameFocused: false,
      PassWordFocused: true,
    });
  };

  // 回车事件
  onEnters = () => {
    this.handleSubmit();
  };

  render () {
    return (
      <div id='components-form-demo-normal-login'>
        <Form autoComplete='off' className='login-form' ref={(form) => (this.form = form)}>
          <div className='login-header'>
            <BranchesOutlined className='login-header-icon' />
            <span className='login-header-title'>御湘湖后台管理系统</span>
          </div>
          <div className={this.state.UserNameFocused ? 'withBac' : 'withoutBac'}>
            <Form.Item
              name='userName'
              rules={[
                { required: true, message: '用户名不能为空!' },
                { pattern: /^[^ ]+$/, message: '请勿输入空格!' },
              ]}
            >
              <Input
                autoFocus
                onPressEnter={this.onEnters}
                allowClear
                onFocus={this.addUserNameStyle}
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder='用户名'
              />
            </Form.Item>
          </div>
          <div className={[this.state.PassWordFocused ? 'withBac' : 'withoutBac']}>
            <Form.Item name='passWord' rules={[{ required: true, message: '密码不能为空!' }]}>
              <Input.Password
                ref={(a) => (this.a = a)}
                type='password'
                onFocus={this.addPassWordStyle}
                onBlur={this.addUserNameStyle}
                onPressEnter={this.onEnters}
                allowClear
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder='密码'
              />
            </Form.Item>
          </div>
          <div style={{ padding: '10px' }}>
            <Form.Item>
              <Button type='primary' onClick={this.handleSubmit} className='login-form-button' style={{ margin: '10px 0px' }}>
                点击登录
              </Button>
            </Form.Item>
          </div>
          <div className='log'>浙江康略软件有限公司 @2020-2021 Tel:0571-8888888</div>
        </Form>
      </div>
    );
  }
}

export default withRouter(Login);
