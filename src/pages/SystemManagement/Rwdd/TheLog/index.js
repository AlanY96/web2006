/*
 * @Autor: zx
 * @Date: 2020-12-18 14:20:47
 * @LastEditTime: 2020-12-18 14:50:35
 * @FilePath: \yxh-web\src\pages\SystemManagement\Rwdd\TheLog\index.js
 * @LastEditors: zx
 * @Description: 调度日志
 */
import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Modal, Tag, Tooltip } from 'antd';
import '@/layouts/handleList.css';
import MyTable from '@/components/MyTable';
import { RwddLogApi } from '@/services/basic';

class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], //data包含了总页数、当前页、页面显示条数等
      records: [], //records对应列表上的每条数据
      visible: false,
    };
  }

  //查找框查找数据
  queryData = (pagination = undefined) => {
    RwddLogApi.getPage({ pagination }).then(res => {
      this.setState({ data: res, records: res.records });
    })
  };

  //弹出操作页面
  showModal = () => {
    this.setState({ visible: true });
    this.queryData()
  };


  //关闭操作页面
  hideModal = () => {
    this.setState(
      {
        data: [], //data包含了总页数、当前页、页面显示条数等
        records: [], //records对应列表上的每条数据
        visible: false,
      }
    );
  };

  //页码变化的时候，请求数据
  onChange = (pagination) => {
    this.queryData(pagination);
  };

  //Modal框自带的取消操作
  handleCancel = () => {
    this.hideModal();
  };

  render() {
    const { data, visible, records } = this.state;
    const columns = [
      { title: '任务名称', dataIndex: 'jobName' },
      { title: '任务方法', dataIndex: 'methodName' },
      { title: '创建时间', dataIndex: 'cjsj' },
      {
        title: '是否异常',
        dataIndex: 'exceptionInfo',
        render(h) {
          return h ? <Tooltip title={h} overlayStyle={{ maxWidth: '1100px' }}>
            <Tag color='error'>异常</Tag>
          </Tooltip> : <Tag color='success'>无异常</Tag>;
        },
      },
    ];
    return (
      <div className='handle-header'>
        <Modal
          title=''
          visible={visible}
          onCancel={this.handleCancel}
          width='1000px'
          style={{ top: 80 }}
          maskClosable={false}
          className='handleList'
          footer={this.props.modalfoot('view', this.handleCancel)}
        >
          <div className='formHeader'>
            <span className='handle-title'>查看日志</span>
          </div>

          <MyTable
            props={{
              columns,
              dataSource: records,
              data,
              setHandler: this.setHandler,
              onChange: this.onChange,
              permission: this.props.permission,
            }}
          />
        </Modal>
      </div>
    );
  }
}
export default EditItem;
