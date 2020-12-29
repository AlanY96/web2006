/**
 * @author: YINJUN
 * @Date: 2020-10-21 11:05:52
 * @description: 标签管理编辑页
 */
import React, { Component } from "react";
import "@ant-design/compatible/assets/index.css";
import { Form, Input, Select, Modal, Col, Row, message } from "antd";
import "@/layouts/handleList.css";
import { tagmanagementApi } from "@/services/basic";

const Option = Select.Option;
class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: undefined,
      visible: false,
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
      this.setState({ visible: true, handler });
    }
  };

  //关闭操作页面
  hideModal = () => {
    this.setState({
      id: undefined,
      visible: false,
      handler: undefined, //当前正在执行的操作类型
    });
    this.form.resetFields();
  };

  //Modal框自带的取消操作
  handleCancel = () => {
    this.hideModal();
  };

  //Modalk框自带的确认操作
  handleOk = () => {
    this.form.validateFields().then((values) => {
      let newItem = this.form.getFieldsValue();
      const { handler, id } = this.state;
      const requestType = handler === "create" ? "post" : "put";
      tagmanagementApi[requestType]({ ...newItem, id }).then((res) => {
        this.props.editItemDone();
        this.form.resetFields();
        this.hideModal();
        message.success("操作成功");
      });
    });
  };

  //查看单条
  handleView = (id) => {
    this.setState({ visible: true, id });
    if (id) {
      tagmanagementApi.get(id).then((res) => {
        const { bqmc, bqlx } = res;
        this.form.setFieldsValue({ bqmc, bqlx });
      });
    }
  };

  render() {
    const { handler } = this.state;
    return (
      <div className="handle-header">
        <Modal
          title=""
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="500px"
          style={{ top: 10 }}
          maskClosable={false}
          className="handleList DataBook"
        >
          <div className="formHeader">
            <span className="handle-title">{`${
              handler === "view"
                ? "查看"
                : handler === "create"
                ? "新增"
                : "更新"
            }标签`}</span>
          </div>

          <Form
            onSubmit={this.handleOk}
            autoComplete="off"
            ref={(form) => (this.form = form)}
          >
            <Row>
              <Col span={24}>
                <Form.Item
                  label="标签名称"
                  name="bqmc"
                  rules={[{ required: true, message: "此为必填项" }]}
                  getValueFromEvent={(event) =>
                    event.target.value.replace(/\s+/g, "")
                  }
                >
                  <Input
                    disabled={handler === "view" ? true : false}
                    allowClear={handler === "view" ? false : true}
                    placeholder="请输入"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label="标签类型"
                  name="bqlx"
                  rules={[{ required: true, message: "此为必填项" }]}
                >
                  <Select
                    disabled={handler === "view" ? true : false}
                    allowClear={handler === "view" ? false : true}
                    placeholder="请选择"
                  >
                    <Option value={1}>医生标签</Option>
                    {/* <Option value={2}>患者标签</Option> */}
                    <Option value={3}>文章标签</Option>
                  </Select>
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
