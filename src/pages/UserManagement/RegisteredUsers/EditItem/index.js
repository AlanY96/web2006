/**
 * @author: YINJUN
 * @Date: 2020-10-19 15:07:15
 * @description: 患者列表编辑页
 */
import React, { Component } from "react";
import "@ant-design/compatible/assets/index.css";
import { Form, Input, Modal, Col, Row } from "antd";
import { userApi } from "@/services/basic";
import "@/layouts/handleList.css";
import "./style.css";

class EditItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: undefined, //标记保存的是哪一行的数据
      visible: false,
      handler: undefined, //当前正在执行的操作类型
      record: {},
    };
  }

  //弹出操作页面
  showModal = (handler, record) => {
    if (record) {
      //如果有record传过来 说明一定是查看或者更新操作
      this.setState({ visible: true, handler, record });
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
      handler: undefined, //当前正在执行的操作类型
      record: {},
    });
    this.form.resetFields();
  };

  //Modal框自带的取消操作
  handleCancel = () => {
    this.hideModal();
  };

  //查看单条
  handleView = (id) => {
    this.setState({ id, visible: true });
    if (id) {
      userApi.get(id).then((res) => {
        const { yhxm, yhsfz, yhxb, sjh, jzklx, jzkh } = { ...res };
        const data = { yhxm, yhsfz, yhxb, sjh, jzklx, jzkh };
        for (let item in data) {
          if (data[item] === null) {
            data[item] = "";
          }
        }
        this.form.setFieldsValue({ ...data });
      });
    }
  };
  onIdentityBlur = () => {
    const { yhsfz } = this.form.getFieldsValue();
    if (yhsfz) {
      const mark = yhsfz[yhsfz.length - 2];
      const dynamicSex = mark % 2 === 0 ? 2 : 1;
      this.form.setFieldsValue({ yhxb: dynamicSex });
      this.setState({ gender: dynamicSex });
    }
  };

  // 表单布局
  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };

  render() {
    const { handler, visible, record } = this.state;

    return (
      <div className="handle-header">
        <Modal
          title=""
          visible={visible}
          onCancel={this.handleCancel}
          width="1000px"
          style={{ top: 60 }}
          maskClosable={false}
          className="handleList UsersList-handle"
          footer={this.props.modalfoot(handler, this.handleCancel)}
        >
          <div className="formHeader">
            <span className="handle-title">{`${
              handler === "view"
                ? "查看"
                : handler === "create"
                ? "新增"
                : "更新"
            }用户信息`}</span>
          </div>

          <Form autoComplete="off" ref={(form) => (this.form = form)}>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item label="用户姓名">
                  <Input disabled value={record.yhxm} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="用户编号">
                  <Input disabled value={record.yhbh} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item label="OpenId">
                  <Input disabled value={record.openid} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="联系电话">
                  <Input disabled value={record.lxdh} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default EditItem;
