/*
 * @Description: 用户组操作页面
 * @Author: 谢涛
 * @LastEditors: Please set LastEditors
 * @Date: 2019-04-22 19:13:58
 * @LastEditTime: 2020-11-28 13:31:29
 */

import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Tree, Modal, message, Select } from 'antd';
import { userGroupApi, menuApi } from '@/services/basic';
import '@/layouts/handleList.css';
import './style.css';

const { TreeNode } = Tree;
const { Option } = Select;

class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      checkedId: [], //菜单树上被选中的项目
      dataSource: [], //树的数据 也就是菜单的数据
      tree: [], //菜单树
      sourcekeys: [], //数据源
      targetKeys: [], //目标框
      yyid: undefined, //根据这个去查组外人员
      yljg: undefined, //初始医疗机构的值
      Yljg: [], //医疗机构的数据
      handler: undefined, //当前正在执行的操作类型
    };
  }

  //弹出操作页面
  showModal = (handler, record) => {
    if (record) {
      //如果有record传过来 说明一定是查看或者更新操作
      const { id } = record;
      this.setState({ visible: true, id, handler });
      this.handleView(id);
    } else {
      //如果是新增操作 那直接展示弹出框 赋值操作类型
      this.queryAllMenu();
      this.setState({ visible: true, handler });
    }
  };

  //关闭操作页面
  hideModal = () => {
    this.setState(
      {
        visible: false,
        checkedId: [], //菜单树上被选中的项目
        dataSource: [], //树的数据 也就是菜单的数据
        tree: [], //菜单树
        sourcekeys: [], //数据源
        targetKeys: [], //目标框
        yyid: undefined, //根据这个去查组外人员
        yljg: undefined, //初始医疗机构的值
        Yljg: [], //医疗机构的数据
        handler: undefined, //当前正在执行的操作类型
      },
      () => this.form.resetFields()
    );
  };

  //Modal框自带的取消操作
  handleCancel = () => {
    this.hideModal();
  };

  //Modal框自带的确认操作
  handleOk = () => {
    this.form.validateFields().then((values) => {
      let newItem = this.form.getFieldsValue();
      const { handler, id, checkedId, targetKeys } = this.state;
      const requestType = handler === 'create' ? 'post' : 'put';
      handler !== 'create' && (newItem.id = id);
      newItem.cdids = checkedId.filter((item) => item !== '0');
      newItem.yhids = targetKeys;
      if (newItem.cdids.length === 0) {
        message.warning('请至少选中一个菜单');
        return false;
      } else {
        newItem.bz = newItem.bz ? newItem.bz : '';
        userGroupApi[requestType](newItem).then((response) => {
          this.hideModal();
          this.form.resetFields();
          this.props.editItemDone();
          message.success('操作成功');
        });
      }
    });
  };

  //新增操作 进来就查所有菜单
  queryAllMenu = () => {
    this.setState({ visible: true });
    menuApi.getAll().then((res) => {
      if (res !== null) {
        let dataSource = res;
        this.setState({ dataSource }, () => {
          let tree = (
            <Tree checkable={true} multiple={true} onCheck={this.onCheck} defaultExpandedKeys={this.state.dataSource.map((item) => item.id.toString())}>
              <TreeNode title='（资源分配）全选' selectable={false} key='0'>
                {this.renderTree(this.state.dataSource)}
              </TreeNode>
            </Tree>
          );
          this.setState({ tree });
        });
      } else {
        message.error('服务器出错！');
      }
    });
  };

  //渲染树
  renderTree = (dataSource) => {
    return dataSource.map((item) => {
      if (item.hasChild) {
        return (
          <TreeNode title={item.mc} key={item.id} selectable={false}>
            {this.renderTree(item.childrens)}
          </TreeNode>
        );
      } else {
        return <TreeNode title={item.mc} key={item.id} selectable={false}></TreeNode>;
      }
    });
  };
  /**
   * @author: YINJUN
   * @description:树状数据变扁平数据
   * @param {*} treeData
   * @param {*} field
   * @return {*}
   */
  treeToArray = (treeData, field) => {
    var result = [];
    if (!field) field = 'childrens';
    for (var key in treeData) {
      var obj = treeData[key];
      var clone = JSON.parse(JSON.stringify(obj));
      delete clone[field];
      result.push(clone);
      if (obj[field]) {
        var tmp = this.treeToArray(obj[field], field);
        result = result.concat(tmp);
      }
    }
    return result;
  };
  // 并集
  bj = (ary1, ary2) => {
    return [...new Set([...ary1, ...ary2])];
  };
  // 交集
  jj = (ary1, ary2) => {
    return ary1.filter((item) => {
      return ary2.includes(item);
    });
  };
  // 差集
  cj = (ary1, ary2) => {
    return this.bj(ary1, ary2).filter((item) => {
      return !this.jj(ary1, ary2).includes(item);
    });
  };

  // 查看单条
  handleView = (id) => {
    userGroupApi.get(id).then((res) => {
      const { yyid, yymc, yhzmc, bz, yhInfoVoList } = { ...res };
      this.form.setFieldsValue({ yhzmc, bz });
      const Yljg = (
        <Option key={yyid} value={yyid}>
          {yymc}
        </Option>
      );
      const basicData = yhInfoVoList;
      //渲染穿梭框
      const targetKeys = [];
      const sourcekeys = [];
      for (let item in basicData) {
        const data = {
          key: basicData[item].yhid,
          title: `${basicData[item].yhxm}`,
          description: ``,
          chosen: basicData[item].checked,
        };
        if (data.chosen) {
          targetKeys.push(data.key);
        } //选中就往目标里推
        sourcekeys.push(data); //没选中就往来源里推
      }
      this.setState({ sourcekeys, targetKeys });

      //渲染树
      let dataSource = res.cdbList;
      let checkedId = res.cdids.filter((item) => item !== '0');
      const parentId = this.treeToArray(dataSource)
        .filter((i) => i.hasChild)
        .map((i) => {
          return String(i.id);
        });
      const jj = this.jj(checkedId, parentId);
      const cj = this.cj(checkedId, jj);
      this.setState(
        {
          dataSource,
          checkedId: cj,
        },
        () => {
          let tree = (
            <Tree
              disabled={this.state.handler === 'view' ? true : false}
              checkable={true}
              multiple={true}
              onCheck={this.onCheck}
              defaultCheckedKeys={cj}
              defaultExpandedKeys={this.state.dataSource.map((item) => item.id.toString())}
            >
              <TreeNode title='（资源分配）全选' selectable={false} key='0'>
                {this.renderTree(this.state.dataSource)}
              </TreeNode>
            </Tree>
          );
          this.setState({ tree, id, Yljg, yyid });
        }
      );
    });
  };

  onCheck = (checkedKeys, e) => {
    // eslint-disable-next-line
    let { halfCheckedKeys } = e;
    const checkedId = checkedKeys.concat(halfCheckedKeys);
    this.setState({ checkedId });
  };

  handleChange = (targetKeys) => {
    //只是目标数组种元素的增减 也就是 sourceData <-> targetData之间的数据交换
    this.setState({ targetKeys });
  };

  render() {
    const { handler } = this.state;

    return (
      <div className='handle-header'>
        <Modal
          title=''
          visible={this.state.visible}
          onCancel={this.handleCancel}
          width='800px'
          style={{ top: 20 }}
          maskClosable={false}
          className='handleList UsersGroup-handle'
          footer={this.props.modalfoot(handler, this.handleCancel, this.handleOk)}
        >
          <div className='formHeader'>
            <span className='handle-title'>{`${handler === 'view' ? '查看' : handler === 'create' ? '新增' : '更新'}用户组`}</span>
          </div>

          <Form autoComplete='off' onSubmit={this.handleOk} ref={(form) => (this.form = form)}>
            <Row gutter={10}>
              <Col span={24}>
                <Form.Item
                  label='用户组名称'
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 8 }}
                  name='yhzmc'
                  rules={[{ required: true, message: '此为必填项' }]}
                  getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                >
                  <Input disabled={handler === 'create' ? false : true} allowClear={handler === 'create' ? true : false} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={24}>
                <Form.Item label='角色描述' name='bz' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <div className='allocation'>
              <div className='tree'>{this.state.tree}</div>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default EditItem;
