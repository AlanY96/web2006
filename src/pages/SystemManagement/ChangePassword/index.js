/*
 * @Description: “菜单”页面
 * @Author: 谢涛
 * @Date: 2019-07-11 11:15:38
 * @LastEditTime: 2020-12-17 09:37:12
 * @LastEditors: Please set LastEditors
 */

import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Button, message } from 'antd';

import { userApi } from '@/services/basic';
import BtnPermission from '@/components/BtnPermission';
import '@/layouts/queryList.css';
class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], //data包含了总页数、当前页、页面显示条数等
      records: [], //records对应列表上的每条数据
      handlers: {
        create: 'create',
        view: 'view',
        update: 'update',
      }, //定义操作类型
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
    };
  }

  componentDidMount = () => {
    const { userInfo } = this.state;
    this.form.setFieldsValue({ username: userInfo.yhbh });
  };
  handleSubmit = () => {
    const { userInfo } = this.state;
    this.form.validateFields().then((values) => {
      userApi.putPassWord({ ...values, username: userInfo.yhbs === 3 ? values.username : userInfo.yhbh }).then(() => {
        if ((userInfo.yhbs === 3 && userInfo.yhbh === values.username) || userInfo.yhbs !== 3) {
          sessionStorage.clear();
          this.props.history.push('/login');
          message.success('操作成功,请重新登录');
        } else {
          message.success('操作成功');
        }
      });
    });
  };

  render() {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };
    const { userInfo } = this.state;

    return (
      <div className='queryList'>
        <Form autoComplete='off' {...layout} ref={(form) => (this.form = form)} layout='inline'>
          <Row justify='center' align='middle' style={{ width: '100%', height: 'calc(100vh - 150px)' }}>
            <Col span={12}>
              {userInfo && userInfo.yhbs === 3 ? (
                <Form.Item
                  label='用户名'
                  name='username'
                  rules={[{ required: true, message: '此为必填项' }]}
                  getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                  style={{ margin: '10px 0px' }}
                  hidden
                >
                  <Input allowClear placeholder='请输入' />
                </Form.Item>
              ) : null}
              <Form.Item
                label='新密码'
                name='password'
                rules={[{ required: true, message: '此为必填项' }]}
                getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                style={{ margin: '10px 0px' }}
              >
                <Input.Password allowClear placeholder='请输入' />
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button type='primary' onClick={this.handleSubmit} className='login-form-button' style={{ margin: '10px 0px' }}>
                  确认修改
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default BtnPermission(ChangePassword);
