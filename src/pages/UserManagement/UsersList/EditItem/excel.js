/**
 * @author: YINJUN
 * @description: 导入
 */
import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Modal, Col, Row, Upload, message, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from '@/axios';
import '@/layouts/handleList.css';
import './style.css';
const { Dragger } = Upload;

class EditItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: undefined, //标记保存的是哪一行的数据
      visible: false,
      autelToken: JSON.parse(sessionStorage.getItem('userInfo')),
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
      this.setState({ visible: true, handler });
    }
  };

  //关闭操作页面
  hideModal = () => {
    this.setState({
      id: undefined, //标记保存的是哪一行的数据
      visible: false,
    });
    this.form.resetFields();
  };

  //Modal框自带的取消操作
  handleCancel = () => {
    this.hideModal();
  };

  //Modal框自带的确认操作
  handleOk = () => {
    this.form.validateFields().then((values) => {});
  };

  //查看单条
  handleView = (id) => {};

  // 页面渲染完成后，初始化数据请求
  componentDidMount() {}

  // 表单布局
  formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };
  render() {
    const { visible, autelToken } = this.state;
    const { hideModal, props } = this;

    const prop = {
      name: 'excel',
      multiple: true,
      action: `${axios.defaults.baseURL}user/ysdr`,
      headers: {
        CZPT: '1',
        'AUTH-TOKEN': autelToken.token,
      },
      onChange(info) {
        const { status } = info.file;
        if (status === 'done') {
          hideModal();
          props.editItemDone();
          message.success('操作成功');
        } else if (status === 'error') {
          message.error(`${info.file.response.msg}`);
        }
      },
    };
    return (
      <div className='handle-header'>
        <Modal
          title=''
          visible={visible}
          onCancel={this.handleCancel}
          style={{ top: 60 }}
          maskClosable={false}
          className='handleList UsersList-handle'
          footer={
            <Button key='back' onClick={this.hideModal}>
              关闭
            </Button>
          }
        >
          <div className='formHeader'>
            <span className='handle-title'>导入医生信息</span>
          </div>

          <Form autoComplete='off' onSubmit={this.handleOk} ref={(form) => (this.form = form)} {...this.formItemLayout}>
            <Row gutter={8}>
              <Col span={24}>
                <Dragger {...prop}>
                  <p className='ant-upload-drag-icon'>
                    <InboxOutlined />
                  </p>
                  <p className='ant-upload-text'>单击或拖动文件到此区域以上载</p>
                </Dragger>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default EditItem;
