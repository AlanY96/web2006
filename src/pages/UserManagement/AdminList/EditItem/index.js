/**
 * @author: YINJUN
 * @Date: 2020-10-19 15:07:15
 * @description: 管理员列表弹窗
 */
import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Select, Modal, Col, Row, message } from 'antd';
import { userApi, departmentsApi, userGroupApi, institutionsApi, institutionsGroupApi } from '@/services/basic';
import '@/layouts/handleList.css';
import './style.css';

const Option = Select.Option;

class EditItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: undefined, //标记保存的是哪一行的数据
      visible: false,
      Institution: [], //医疗机构下拉框的动态值
      UserGroup: [], //用户组下拉框的动态值
      Office: [], //科室下拉框的动态值
      yyids: [], //用于绑定医疗机构和科室,指示当前选中了哪些医疗机构
      rowid: 1, //指示职业机构的行数，初始值为0
      params: [],
      userState: 1,
      gender: 1,
      k: undefined, //专门为解决bug设置的标识当前删除行的k值
      handler: undefined, //当前正在执行的操作类型
      keys: ['1'],
      Yljgz: [], //医院组
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
      Institution: [], //医疗机构下拉框的动态值
      Office: [], //科室下拉框的动态值
      yyids: [], //用于绑定医疗机构和科室,指示当前选中了哪些医疗机构
      rowid: 1, //指示职业机构的行数，初始值为0
      params: [],
      userState: 1,
      gender: 1,
      k: undefined, //专门为解决bug设置的标识当前删除行的k值
      handler: undefined, //当前正在执行的操作类型
      keys: ['1'],
      Yljgz: [], //医院组
    });
    this.form.resetFields();
  };

  //Modal框自带的取消操作
  handleCancel = () => {
    this.hideModal();
  };

  //Modal框自带的确认操作
  handleOk = () => {
    this.form.validateFields().then((values) => {
      if (this.state.yyids.length === 0) {
        message.warning('请至少填写一条执业机构信息');
        return;
      }
      let newItem = this.form.getFieldsValue();
      const { handler, id } = this.state;
      const requestType = handler === 'create' ? 'post' : 'put';
      newItem.id = id;
      const yljgInfo = this.createParams();
      newItem.yybm = yljgInfo[0].yyid;
      newItem.ksbm = yljgInfo[0].ksIds;
      newItem.yhbs = 3;
      userApi[requestType](newItem).then((response) => {
        this.hideModal();
        this.props.editItemDone();
        this.form.resetFields();
        message.success('操作成功');
      });
    });
  };

  //查看单条
  handleView = (id) => {
    this.setState({ id, visible: true });
    if (id) {
      userApi.get(id).then((res) => {
        const { yhbh, yhxm, zt, yhsfz, yhxb, lxdh, bz, yljgzid, yljgzName, yhzIds, yybm, yymc, ksbm, ksmc } = { ...res };
        const data = {
          yhbh,
          yhxm,
          zt,
          yhsfz,
          yhxb,
          lxdh,
          bz,
          yljgzid,
          yhzIds,
          yybm,
          yymc,
          ksbm,
          ksmc,
        };
        for (let item in data) {
          if (data[item] === null) {
            data[item] = '';
          }
        }
        let { yyids } = this.state;
        const params = [{ yyid: yybm, yymc, ksIds: ksbm, ksmc }];

        if (params && params.length !== 0) {
          const Institution = params.map((item) => (
            <Option key={item.yyid} value={item.yyid}>
              {item.yymc}
            </Option>
          ));
          const Office = params.map((item) => (
            <Option key={item.ksIds} value={item.ksIds}>
              {item.ksmc}
            </Option>
          ));
          const rowid = params.length;
          const keys = [];
          params.map((item, index) => yyids.push({ k: index, value: item.yyid }));
          for (let i = 0; i < rowid; i++) {
            keys.push(i);
          }
          this.setState(
            {
              params,
              Institution,
              Office,
              yyids,
              rowid,
              keys,
              yhzIds,
              Yljgz: (
                <Option value={yljgzid} key={yljgzid}>
                  {yljgzName}
                </Option>
              ),
            },
            () => {
              for (let i = 0; i < rowid; i++) {
                this.form.setFieldsValue({
                  [`yyid${i}`]: params[i].yyid,
                  [`ksIds${i}`]: params[i].ksIds,
                });
              }
            }
          );
        }
        this.form.setFieldsValue({ ...data });
      });
    }
  };

  //医疗机构下拉框获得焦点时的回调
  onInstitutionFocus = (k) => {
    institutionsApi.getSelectOption().then((res) => {
      if (res && res.length !== 0) {
        const Institution = res.map((item) => (
          <Option key={item.id} value={item.yybm}>
            {item.yymc}
          </Option>
        ));
        this.setState({ Institution });
      }
    });
  };

  //当科室下拉框获取焦点时的回调
  onOfficeFocus = (k) => {
    const { yyids } = this.state;
    const currentIndex = yyids.findIndex((item) => item.k === k);
    if (this.state.yyids[currentIndex] !== undefined) {
      departmentsApi.getAllYyks(`${this.state.yyids[currentIndex].value}`).then((res) => {
        if (res && res.length !== 0) {
          const Office = res.map((item) => (
            <Option key={item.id} value={item.ksbm}>
              {item.ksmc}
            </Option>
          ));
          this.setState({ Office });
        } else {
          message.warning('该机构下无科室');
        }
      });
    } else {
      message.warning('请先选择对应的医疗机构');
    }
  };

  //用户组获取焦点时回调
  getUsergroup = () => {
    userGroupApi.getSelectOption({}).then((res) => {
      if (res.records && res.records.length !== 0) {
        const UserGroup = res.records.map((item) => (
          <Option key={item.id} value={item.id}>
            {item.yhzmc}
          </Option>
        ));
        this.setState({ UserGroup });
      }
    });
  };

  //医疗机构下拉框的值发生改变时的回调
  onInstitutionChange = (value, option, k) => {
    this.form.resetFields([`ksIds${k}`, `yhzIds${k}`]);
    this.setState({ yyids: [{ k, value }] });
  };

  //处理生成符合格式要求的参数
  createParams = () => {
    const keys = this.state.keys;
    const { length } = keys;
    const maxIndex = keys[length - 1];
    let params = [];
    let newParams = [];
    for (let i = 0; i < maxIndex + 1; i++) {
      params.push(this.form.getFieldsValue([`yyid${i}`, `ksIds${i}`, `yhzIds${i}`]));
    }
    params.map((item) => {
      if (Object.values(item)[0] !== undefined) {
        newParams.push({
          yyid: Object.values(item)[0],
          ksIds: Object.values(item)[1],
          yhzIds: Object.values(item)[2],
        });
      }
      return undefined;
    });
    return newParams;
  };

  onUserStateChange = (value) => {
    this.setState({ userState: value });
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

  onYljgzSearch = () => {
    institutionsGroupApi.getSelectOption().then((res) => {
      if (res !== null && res.length !== 0) {
        const Yljgz = res.map((item) => (
          <Option value={item.id} key={item.id}>
            {item.yyzmc}
          </Option>
        ));
        this.setState({ Yljgz });
      } else {
        message.warning('暂无数据');
      }
    });
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
  // 机构列表
  getItems = () => {
    const { handler, keys } = this.state;
    let formItems = keys.map((k, index) => (
      <Row key={k} className='danamicForm'>
        <Col span={12}>
          <Form.Item
            {...this.formItemLayout}
            label={'医疗机构'}
            name={`yyid${k}`}
            rules={[{ required: true, message: '此项为必填项!' }]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <Select
              disabled={handler === 'create' ? false : true}
              allowClear={handler === 'view' ? false : true}
              placeholder='请选择机构'
              filterOption={false}
              showSearch={true}
              notFoundContent={false}
              onChange={(value, option) => this.onInstitutionChange(value, option, k)}
              onFocus={() => this.onInstitutionFocus(k)}
              onBlur={() => this.setState({ Institution: [] })}
            >
              {this.state.Institution}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            {...this.formItemLayout}
            label={'科室选择'}
            name={`ksIds${k}`}
            rules={[{ required: true, message: '此项为必填项!' }]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <Select
              disabled={handler === 'create' ? false : true}
              allowClear={handler === 'view' ? false : true}
              placeholder='请选择科室'
              notFoundContent={false}
              filterOption={false}
              showSearch={true}
              showArrow={true}
              onFocus={() => this.onOfficeFocus(k)}
              onBlur={() => this.setState({ Office: [] })}
            >
              {this.state.Office}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    ));
    return formItems;
  };
  // 页面渲染完成后，初始化数据请求
  componentDidMount () {
    // 数据字典
    // 公共用户组
    this.getUsergroup();
  }

  render () {
    const { handler } = this.state;

    return (
      <div className='handle-header'>
        <Modal
          title=''
          visible={this.state.visible}
          onCancel={this.handleCancel}
          width='1000px'
          style={{ top: 60 }}
          maskClosable={false}
          className='handleList UsersList-handle'
          footer={this.props.modalfoot(handler, this.handleCancel, this.handleOk)}
        >
          <div className='formHeader'>
            <span className='handle-title'>{`${handler === 'view' ? '查看' : handler === 'create' ? '新增' : '更新'}用户信息`}</span>
          </div>

          <Form autoComplete='off' onSubmit={this.handleOk} ref={(form) => (this.form = form)}>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item
                  label='用户编号'
                  name='yhbh'
                  rules={[{ required: true, message: '此为必填项' }]}
                  getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                >
                  <Input disabled={handler === 'create' ? false : true} allowClear={handler === 'create' ? true : false} placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label='用户姓名'
                  name='yhxm'
                  rules={[{ required: true, message: '此项为必填项' }]}
                  getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                >
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={8}>
              <Col span={8}>
                <Form.Item
                  label='身份证号'
                  name='yhsfz'
                  rules={[
                    { required: true, message: '必填项' },
                    {
                      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                      message: '请输入正确的身份证号!',
                    },
                  ]}
                  getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                >
                  <Input
                    disabled={handler === 'view' ? true : false}
                    allowClear={handler === 'view' ? false : true}
                    onBlur={this.onIdentityBlur}
                    placeholder='请输入'
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='用户性别' name='yhxb' initialValue={this.state.gender}>
                  <Select disabled placeholder='请选择性别'>
                    <Option value={1}>男</Option>
                    <Option value={2}>女</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label='联系电话'
                  name='lxdh'
                  rules={[
                    {
                      pattern: /^1[345789]\d{9}$/,
                      message: '请输入正确的手机号',
                    },
                  ]}
                  getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                >
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                <Form.Item label='备注' name='bz'>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} className='extraInfo'>
                执业机构信息(必填)
              </Col>
            </Row>
            {this.getItems()}
          </Form>
        </Modal>
      </div>
    );
  }
}
export default EditItem;
