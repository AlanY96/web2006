/*
 * @Description: 行政区划操作页面
 * @Author: 谢涛
 * @Date: 2019-05-13 10:45:20
 * @LastEditTime: 2020-11-10 16:07:39
 * @LastEditors: Please set LastEditors
 */

import React, { Component } from "react";
import "@ant-design/compatible/assets/index.css";
import { Form, Input, Select, Modal, Col, Row, message } from "antd";
import "@/layouts/handleList.css";
import { admDivisionApi } from "@/services/basic";

const Option = Select.Option;

class EditItem extends Component {
  constructor(props) {
    super(props);
    this.initState = {
      division: [], //上级行政区划下拉框的动态值
      initialProvince: undefined, //初始/回填省
      initialCity: undefined, //初始/回填市
      initialCounty: undefined, //初始/回填县
      initialCallbackCode: undefined, //初始/回填所有上级区划代码
      currentDiv: "", //当前行政区划
      prevDiv: "", //上级行政区划
    };
    this.state = {
      ...this.initState,
      visible: false,
      id: undefined, //后端把这个当作数据的id
      rank: 1, //用于绑定当前级别和上级行政区划
      zfbz: "1",
      handler: undefined, //当前正在执行的操作类型
      dataBook: {}, // 行政区划级别
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
      visible: false,
      id: undefined, //后端把这个当作数据的id
      rank: 1, //用于绑定当前级别和上级行政区划
      division: [], //上级行政区划下拉框的动态值
      initialProvince: undefined, //初始/回填省
      initialCity: undefined, //初始/回填市
      initialCounty: undefined, //初始/回填县
      initialCallbackCode: undefined, //初始/回填所有上级区划代码
      currentDiv: "", //当前行政区划
      prevDiv: "", //上级行政区划
      zfbz: "1",
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
    const { handler, id } = this.state;
    let newItem = this.form.getFieldsValue();
    const requestType = handler === "create" ? "post" : "put";
    newItem.id = id || null;
    if (this.state.rank === 1) newItem.sjxzqhid = "0";
    for (let item in newItem) {
      if (newItem[item] === "") {
        newItem[item] = undefined;
      }
    }
    this.form.validateFields().then((res) => {
      admDivisionApi[requestType](newItem).then((response) => {
        this.form.resetFields();
        this.hideModal();
        this.props.editItemDone();
        message.success("操作成功");
      });
    });
  };

  //查看单条
  handleView = (id) => {
    this.setState({ visible: true, id });
    if (id) {
      admDivisionApi.get(id).then((res) => {
        if (res !== null) {
          const {
            xzqhjb,
            xzqhmc,
            xzqhdm,
            bz,
            sheng,
            shi,
            xian,
            sjxzqhmc,
            sjxzqhdm,
            sjxzqhid,
            zfbz,
            zfyy,
          } = res;
          this.setState({
            id,
            rank: xzqhjb,
            zfbz: zfbz,
            division: <Option value={sjxzqhid}>{sjxzqhmc}</Option>,
          });
          this.form.setFieldsValue({
            xzqhmc,
            xzqhdm,
            bz,
            sheng,
            shi,
            xian,
            sjxzqhid,
            sjxzqhdm,
            zfbz,
            zfyy,
          });
        } else {
          message.warning("暂无数据");
        }
      });
    }
  };

  //当行政区划下拉框选中或切换某项时触发
  onDivisionChange = (value) => {
    admDivisionApi
      .find({ xzqhjb: this.state.rank, sjxzqhid: value })
      .then((res) => {
        if (res.length !== 0) {
          const { xzqhdm, xzqhmc, sheng, shi, xian } = res[0];
          this.setState(
            {
              initialCallbackCode: xzqhdm,
              initialProvince: sheng,
              initialCity: shi,
              initialCounty: xian,
              prevDiv: xzqhmc,
            },
            () =>
              this.form.setFieldsValue({
                xzqhmc: this.state.currentDiv || "",
                // xzqhmc: `${xzqhmc || ""}${this.state.currentDiv || ""}`,
                sjxzqhdm: xzqhdm,
                sheng,
                shi,
                xian,
              })
          );
        } else {
          message.warning("暂无数据");
        }
      });
  };

  //当上级行政区划下拉框输入内容时触发
  onDivisionSearch = (value, option) => {
    if (value === undefined) value = "";
    if (value.charCodeAt(value.length - 1) === 32) {
      value = value.trim();
      admDivisionApi
        .find({ xzqhjb: this.state.rank, xzqhmc: value })
        .then((res) => {
          if (res.length !== 0) {
            let division = res.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.xzqhmc}
              </Option>
            ));
            this.setState({
              division: division,
            });
          } else {
            message.warning("暂无数据");
          }
        });
    }
  };

  onRankChange = (value) => {
    //监听级别的变化 重要
    this.setState({ rank: value });
    this.setState(
      {
        ...this.state,
        ...this.initState,
        rank: value,
      },
      () => {
        this.form.resetFields();
        this.form.setFieldsValue({ xzqhjb: value });
      }
    );
    // this.form.resetFields(['xzqhdm']);
  };

  onCurrentDivBlur = () => {
    //当前行政区划失去焦点时触发
    const { xzqhmc } = this.form.getFieldsValue(["xzqhmc"]); //获取刚刚填写的当前行政区划名称
    const currentRank = this.state.rank;
    switch (currentRank) {
      case 1:
        this.form.setFieldsValue({ sheng: xzqhmc });
        break;
      case 2:
        this.form.setFieldsValue({ shi: xzqhmc });
        break;
      case 3:
        this.form.setFieldsValue({ xian: xzqhmc });
        break;
      default:
        this.form.setFieldsValue({ sheng: xzqhmc });
    }
    this.setState({
      //扔给状态
      currentDiv: xzqhmc,
    });
  };

  render() {
    const { handler } = this.state;
    const layout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    return (
      <div className="handle-header">
        <Modal
          title=""
          visible={this.state.visible}
          onCancel={this.handleCancel}
          width="1000px"
          style={{ top: 60 }}
          maskClosable={false}
          className="handleList"
          footer={this.props.modalfoot(
            handler,
            this.handleCancel,
            this.handleOk
          )}
        >
          <div className="formHeader">
            <span className="handle-title">{`${
              handler === "view"
                ? "查看"
                : handler === "create"
                ? "新增"
                : "更新"
            }行政区划`}</span>
          </div>

          <Form
            autoComplete="off"
            onSubmit={this.handleOk}
            ref={(form) => (this.form = form)}
            {...layout}
          >
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  label="级别"
                  name="xzqhjb"
                  rules={[{ required: true, message: "此为必填项" }]}
                  initialValue={this.state.rank}
                >
                  <Select
                    placeholder="请选择级别"
                    onChange={this.onRankChange}
                    disabled={handler === "create" ? false : true}
                    allowClear={handler === "view" ? false : true}
                  >
                    {this.props.bookRender("dqjb")}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="上级区划名称"
                  name="sjxzqhid"
                  rules={[
                    {
                      required: this.state.rank === 1 ? false : true,
                      message: "此为必填项",
                    },
                  ]}
                >
                  <Select
                    disabled={
                      handler === "create"
                        ? this.state.rank === 1
                          ? true
                          : false
                        : true
                    }
                    allowClear={handler === "view" ? false : true}
                    placeholder="输入关键字按空格键查询上级行政区划全称"
                    filterOption={false}
                    showSearch={true}
                    notFoundContent={null}
                    showArrow={false}
                    onChange={this.onDivisionChange}
                    onSearch={this.onDivisionSearch}
                  >
                    {this.state.division}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  label="当前区划名称"
                  name="xzqhmc"
                  rules={[{ required: true, message: "此项为必填项" }]}
                  getValueFromEvent={(event) => {
                    return event.target.value.replace(/\s+/g, "");
                  }}
                >
                  <Input
                    disabled={handler === "view" ? true : false}
                    allowClear={handler === "view" ? false : true}
                    placeholder="填写/修改/确认当前行政区划名称"
                    onBlur={this.onCurrentDivBlur}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="当前区划代码"
                  name="xzqhdm"
                  rules={[
                    {
                      required: this.state.rank === 6 ? false : true,
                      message: "此项为必填项",
                    },
                    {
                      validator: (rule, value) => {
                        let err = false;
                        const rank = this.state.rank;
                        if (rank && rank !== 6) {
                          if (rank === 4 || rank === 5) {
                            err = !/^\d{3}$/.test(value);
                          } else if (rank === 6) {
                            err = !value;
                          } else {
                            err = !/^\d{2}$/.test(value);
                          }
                        }
                        if (err) {
                          return Promise.reject(
                            "省/市/县2位数字、乡/村3位、组不填"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  getValueFromEvent={(event) => {
                    return event.target.value.replace(/\s+/g, "");
                  }}
                >
                  <Input
                    placeholder="省/市/县2位数字、乡/村3位、组不填"
                    disabled={
                      handler === "view" || this.state.rank === 6 ? true : false
                    }
                    allowClear={handler === "create" ? true : false}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  label="备注"
                  name="bz"
                  getValueFromEvent={(event) =>
                    event.target.value.replace(/\s+/g, "")
                  }
                >
                  <Input
                    disabled={handler === "view" ? true : false}
                    allowClear={handler === "view" ? false : true}
                    placeholder="请填写相关备注"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  label="回填上级区划代码"
                  name="sjxzqhdm"
                  initialValue={this.state.initialCallbackCode}
                >
                  <Input placeholder="待回填" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="省/直辖市"
                  name="sheng"
                  initialValue={this.state.initialProvince}
                >
                  <Input placeholder="待回填" disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  label="市"
                  name="shi"
                  rules={[]}
                  initialValue={this.state.initialCity}
                >
                  <Input placeholder="待回填" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="县"
                  name="xian"
                  rules={[]}
                  initialValue={this.state.initialCounty}
                >
                  <Input placeholder="待回填" disabled />
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
