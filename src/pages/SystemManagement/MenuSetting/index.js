/*
 * @Autor: zx
 * @Date: 2020-12-22 09:54:02
 * @LastEditTime: 2020-12-24 10:05:42
 * @FilePath: \fby-web\src\pages\SystemManagement\MenuSetting\index.js
 * @LastEditors: zx
 * @Description: 菜单管理
 */

import React, { Component } from 'react';
import { DeleteOutlined, FileAddOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Button, Popconfirm, Select, Table, } from 'antd';
import EditItem from './EditItem';
import { menuApi } from '@/services/basic';
import BtnPermission from '@/components/BtnPermission';
import '@/layouts/queryList.css';
const InputGroup = Input.Group;
const Option = Select.Option;

class MenuSetting extends Component {
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
    };
  }

  //组件挂载后为列表请求数据
  componentDidMount = () => {
    this.queryData();
  };

  //页码变化的时候，请求数据
  onChange = (pagination) => {
    this.queryData(pagination);
  };

  //增、改一条数据后刷新列表
  editItemDone = () => {
    this.queryData();
  };

  //增查改、设置操作类型，并传入对应行数据
  setHandler = (handler, record) => {
    this.Editor.showModal(handler, record);
  };

  //删除一条数据后刷新列表
  deleteItem = (id) => {
    menuApi.delete(id).then((res) => {
      this.queryData();
    });
  };

  /**
   * @description 扁平结构变树
   * @param {Array}  array    需要过滤的数组
   * @param {String} id       自身ID的key的名称
   * @param {String} pId      代表对应上级的key的名称
   * @param {String} children 插入的key名称
   */
  setTreeData = (array, id = 'id', pId = 'sjid', children = 'children') => {
    let arr = array.map((item) => Object.assign({}, item));
    let map = {}; // 构建map
    arr.forEach((i) => {
      map[i[id]] = i; // 构建以id为键 当前数据为值
    });
    let treeData = [];
    arr.forEach((child) => {
      let mapItem = map[child[pId]]; // 判断当前数据的pId是否存在map中
      if (mapItem) {
        (mapItem[children] || (mapItem[children] = [])).push(child);
      } else {
        // 不存在则是顶层数据
        treeData.push(child);
      }
    });
    return treeData;
  };
  //查找框查找数据
  queryData = (pagination = undefined) => {
    let formData = this.form.getFieldsValue();
    let pam = {};
    for (let i in formData) {
      if (formData[i]) {
        pam[i] = formData[i];
      }
    }
    menuApi.getAllFind({ formData, pagination }).then((res) => {
      if (Object.keys(pam).length > 0) {
        this.setState({
          data: res,
          records: res,
        });
      } else {
        this.setState({
          data: this.setTreeData(res),
          records: this.setTreeData(res),
        });
      }
    });
  };

  render () {
    const { create, update } = this.state.handlers;
    const { permission } = this.props;
    const columns = [
      { title: '菜单名称', dataIndex: 'mc' },
      { title: '上级菜单', dataIndex: 'sjName' },
      { title: '等级', dataIndex: 'djName' },
      { title: 'URL', dataIndex: 'tzdz' },
      { title: '按钮标志', dataIndex: 'btnbzmc' },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 130,
        render: (text, record) => (
          <span className='handleButton'>
            {/* 以下分别对应：改、删、等操作 */}
            {permission.add && record.btnbz !== '1' ? (
              <FileAddOutlined title='新增' onClick={() => this.setHandler(create, record)} className='update-button' />
            ) : null}
            {permission.edit ? <FormOutlined title='修改' onClick={() => this.setHandler(update, record)} className='update-button' /> : null}
            {permission.delete ? (
              <Popconfirm title='确认删除?' onConfirm={() => this.deleteItem(record.id)}>
                <DeleteOutlined title='删除' className='delete-button' />
              </Popconfirm>
            ) : null}
          </span>
        ),
      },
    ];

    let { data } = this.state;
    return (
      <div className='queryList'>
        <Form autoComplete='off' ref={(form) => (this.form = form)} layout='inline'>
          <InputGroup className='input-group'>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label='菜单名称' name='mc' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input allowClear placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='上级菜单' name='sjName' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input allowClear placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='菜单等级' name='dj'>
                  <Select allowClear placeholder='请选择'>
                    <Option value={null}>全部</Option>
                    {this.props.bookRender('cddj')}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Button onClick={(e) => this.queryData(e)} icon={<SearchOutlined />} className='search-button'>
                  查询
                </Button>
              </Col>
              {permission.add ? (
                <Col span={2}>
                  <Button icon={<FileAddOutlined />} className='addButton' onClick={() => this.setHandler(create)}>
                    新增
                  </Button>
                </Col>
              ) : null}
            </Row>
          </InputGroup>
        </Form>
        <div style={{ padding: '10px' }}>
          <Table
            columns={columns}
            dataSource={data}
            rowKey={(a) => `${a.dj}${a.id}`}
            pagination={false}
            onRow={(record) => {
              return {
                onDoubleClick: (event) => this.setHandler('view', record),
              };
            }}
          />
        </div>
        <div>
          <EditItem
            ref={(Editor) => (this.Editor = Editor)}
            editItemDone={this.editItemDone}
            bookRender={this.props.bookRender}
            modalfoot={this.props.modalfoot}
          />
        </div>
      </div>
    );
  }
}
export default BtnPermission(MenuSetting, {
  dataBook: {
    81: 'cddj', // 菜单等级
  },
});
