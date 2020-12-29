/*
 * @Description: 用户列表操作页面
 * @Author: 谢涛
 * @Date: 2019-04-22 19:13:58
 * @LastEditTime: 2020-12-15 17:15:28
 * @LastEditors: Please set LastEditors
 */
import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Select, Modal, Col, Row, message, InputNumber, Checkbox } from 'antd';
import { userApi, departmentsApi, userGroupApi, institutionsApi, institutionsGroupApi, tagmanagementApi } from '@/services/basic';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';
import '@/layouts/handleList.css';
import './style.css';

const { TextArea } = Input;

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
      yhbs: undefined,
      imageUrl: undefined,
      wzbq: undefined,
      fwxmglList: [],
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
      yhbs: undefined,
      imageUrl: undefined,
      wzbq: undefined,
      fwxmglList: [],
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
        message.warning('请填写执业机构信息');
        return;
      }
      let newItem = this.form.getFieldsValue();
      const { handler, id, imageUrl, yhbs, fwxmglList } = this.state;
      if (yhbs === 1 && fwxmglList.length === 0) {
        message.warning('问诊方式请至少选择一项');
        return;
      }
      const requestType = handler === 'create' ? 'post' : 'put';
      const yljgInfo = this.createParams();
      userApi[requestType]({
        ...newItem,
        id,
        txurl: imageUrl,
        // yhzIds: [].concat(newItem.yhzIds),
        ksbm: yljgInfo[0].ksIds,
        yybm: yljgInfo[0].yyid,
        bqList: newItem.bqList
          ? newItem.bqList.map((i) => {
              return { id: Number(i) };
            })
          : [],
        fwxmglList,
      }).then((response) => {
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
        const {
          yhbh,
          yhxm,
          zt,
          yhsfz,
          yhxb,
          lxdh,
          bz,
          yljgzid,
          yljgzName,
          // yhzIds,
          yhzid,
          yybm,
          yymc,
          ksbm,
          ksmc,
          yhbs,
          twwzf,
          dhwzf,
          spwzf,
          ysjj,
          yssc,
          ysssyt,
          sysfzs,
          zc,
          txurl,
          bqList,
          fwxmglList,
          sfzj,
        } = {
          ...res,
        };
        const data = {
          yhbh,
          yhxm,
          zt,
          yhsfz,
          yhxb,
          lxdh,
          bz,
          yljgzid,
          yhzid,
          // yhzIds: yhzIds.length > 0 ? yhzIds[0] : '',
          yybm,
          yymc,
          ksbm,
          ksmc,
          yhbs,
          twwzf,
          dhwzf,
          spwzf,
          ysjj,
          yssc,
          ysssyt,
          sfzj,
          sysfzs,
          zc: zc ? Number(zc) : zc,
          bqList: bqList.map((i) => `${i.id}`),
          fwxmglList,
        };
        for (let item in data) {
          if (data[item] === null) {
            data[item] = '';
          }
        }
        let { yyids } = this.state;
        const params = [{ yyid: yybm, yymc, ksIds: ksbm, ksmc }];
        if (yhbs && yhbs !== 2) {
          let wzbq = bqList.map((i) => (
            <Select.Option key={i.id} value={`${i.id}`}>
              {i.bqmc}
            </Select.Option>
          ));
          this.setState({ wzbq });
        }
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
              // yhzIds,
              Yljgz: (
                <Option value={yljgzid} key={yljgzid}>
                  {yljgzName}
                </Option>
              ),
              yhbs,
              imageUrl: txurl,
              fwxmglList,
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

  handleChange = (file) => {
    this.setState({
      imageUrl: file.fullUrl,
    });
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
    if (yyids[currentIndex] !== undefined) {
      departmentsApi.getAllYyks(`${yyids[currentIndex].value}`).then((res) => {
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
    this.form.resetFields([`ksIds${k}`]);
    // this.form.resetFields([`ksIds${k}`, `yhzIds${k}`]);
    this.setState({ yyids: [{ k, value }] });
  };

  //处理生成符合格式要求的参数
  createParams = () => {
    const { keys } = this.state;
    const { length } = keys;
    const maxIndex = keys[length - 1];
    let params = [];
    let newParams = [];
    for (let i = 0; i < maxIndex + 1; i++) {
      params.push(this.form.getFieldsValue([`yyid${i}`, `ksIds${i}`]));
      // params.push(this.form.getFieldsValue([`yyid${i}`, `ksIds${i}`, `yhzIds${i}`]));
    }
    params.map((item) => {
      if (Object.values(item)[0] !== undefined) {
        newParams.push({
          yyid: Object.values(item)[0],
          ksIds: Object.values(item)[1],
          // yhzIds: Object.values(item)[2],
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
  // 机构列表
  getItems = () => {
    const { keys } = this.state;
    // eslint-disable-next-line
    const { handler } = this.state;
    let formItems = keys.map((k, index) => (
      <Row gutter={8} key={k} className='danamicForm'>
        <Col span={12}>
          <Form.Item
            {...this.formItemLayout}
            label={'医疗机构'}
            name={`yyid${k}`}
            rules={[{ required: true, message: '此项为必填项!' }]}
            validateTrigger={['onChange', 'onBlur']}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
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
            label={'科室选择'}
            name={`ksIds${k}`}
            rules={[{ required: true, message: '此项为必填项!' }]}
            validateTrigger={['onChange', 'onBlur']}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
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
  ysbschange(e) {
    this.setState({ yhbs: e, imageUrl: undefined });
    if (e === 2) {
      this.form.resetFields(['zc', 'fwxmglList', 'twwzf', 'dhwzf', 'wzwzf', 'bqList', 'ysjj', 'yssc', 'ysssyt', 'sysfzs', 'sfzj']);
      this.setState({ fwxmglList: [] });
    }
  }
  onwzbqFocus = () => {
    tagmanagementApi.getBqByLx({ bqlx: 1 }).then((res) => {
      const wzbq = res.map((i) => (
        <Select.Option key={i.id} value={`${i.id}`}>
          {i.bqmc}
        </Select.Option>
      ));
      this.setState({ wzbq });
    });
  };

  fwxmglListchange = (val) => {
    const { fwxmglList } = this.state;

    const fwxmgl = fwxmglList.find((it) => it === val);
    if (fwxmgl) {
      this.setState({ fwxmglList: fwxmglList.filter((it) => it !== val) });
    } else {
      this.setState({ fwxmglList: [].concat([...fwxmglList]).concat([val]) });
    }
  };

  // 页面渲染完成后，初始化数据请求
  componentDidMount() {
    this.getUsergroup();
  }

  // 表单布局
  formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };
  render() {
    const { handler, visible, gender, UserGroup, yhbs, imageUrl, wzbq, fwxmglList } = this.state;

    return (
      <div className='handle-header'>
        <Modal
          title=''
          visible={visible}
          onCancel={this.handleCancel}
          width='1130px'
          style={{ top: 60 }}
          maskClosable={false}
          className='handleList UsersList-handle'
          footer={this.props.modalfoot(handler, this.handleCancel, this.handleOk)}
        >
          <div className='formHeader'>
            <span className='handle-title'>{`${handler === 'view' ? '查看' : handler === 'create' ? '新增' : '更新'}用户信息`}</span>
          </div>

          <Form autoComplete='off' onSubmit={this.handleOk} ref={(form) => (this.form = form)} {...this.formItemLayout}>
            <Row gutter={8}>
              <Col span={21}>
                <Row gutter={8}>
                  <Col span={24}>
                    <div className='extraInfouserlist' style={{ marginTop: '0' }}>
                      基本信息
                    </div>
                  </Col>
                </Row>
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
                </Row>
                <Row gutter={8}>
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
                    <Form.Item label='用户性别' name='yhxb' initialValue={gender}>
                      <Select disabled placeholder='请选择性别'>
                        <Option value={1}>男</Option>
                        <Option value={2}>女</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={8}>
                    <Form.Item
                      label='联系电话'
                      name='lxdh'
                      rules={[
                        { required: true, message: '此项为必填项!' },
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
                  <Col span={8}>
                    <Form.Item label='用户标识' name='yhbs' rules={[{ required: true, message: '此项为必填项!' }]}>
                      <Select
                        disabled={handler === 'create' ? false : true}
                        allowClear={handler === 'create' ? true : false}
                        placeholder='输选择'
                        filterOption={false}
                        showSearch={true}
                        onChange={(e) => this.ysbschange(e)}
                      >
                        <Option value={1}>医生</Option>
                        <Option value={2}>药师</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label='用户组' name='yhzid' rules={[{ required: true, message: '此项为必填项!' }]}>
                      <Select
                        disabled={handler === 'view' ? true : false}
                        allowClear={handler === 'view' ? false : true}
                        filterOption={false}
                        showArrow={true}
                        placeholder='请选择用户组'
                        notFoundContent={false}
                      >
                        {UserGroup}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                {yhbs && yhbs !== 2 ? (
                  <>
                    <Row gutter={8}>
                      <Col span={24}>
                        <div className='extraInfouserlist'>岗位信息</div>
                      </Col>
                    </Row>
                    <Row gutter={8}>
                      <Col span={8}>
                        <Form.Item label='医生职称' name='zc'>
                          <Select
                            disabled={handler === 'view' ? true : false}
                            allowClear={handler === 'view' ? false : true}
                            placeholder='请选择职称'
                            rules={[{ required: true, message: '此为必填项' }]}
                          >
                            {this.props.bookRender('zc')}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label='所属业态' name='ysssyt'>
                          <Select disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请选择'>
                            {this.props.bookRender('ssyt')}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label='是否专家' name='sfzj' initialValue={0} rules={[{ required: true, message: '此为必填项' }]}>
                          <Select disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请选择'>
                            <Select.Option value={0}>否</Select.Option>
                            <Select.Option value={1}>是</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={8}>
                      <Col span={8}>
                        <Form.Item label='医生标签' name='bqList'>
                          <Select
                            mode='tags'
                            disabled={handler === 'view' ? true : false}
                            allowClear={handler === 'view' ? false : true}
                            placeholder='请选择'
                            onFocus={this.onwzbqFocus}
                          >
                            {wzbq}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label='首页展示' name='sysfzs' initialValue={0} rules={[{ required: true, message: '此为必填项' }]}>
                          <Select disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请选择'>
                            <Select.Option value={0}>否</Select.Option>
                            <Select.Option value={1}>是</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={8}>
                      <Col span={4} style={{ paddingRight: 0 }}>
                        <Form.Item label='图文问诊' labelCol={{ span: 16 }} wrapperCol={{ span: 6 }}>
                          <Checkbox
                            disabled={handler === 'view' ? true : false}
                            checked={fwxmglList.find((it) => it === '1') ? true : false}
                            onChange={() => this.fwxmglListchange('1')}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4} style={{ padding: 0 }}>
                        <Form.Item
                          label=''
                          name='twwzf'
                          style={{ paddingLeft: 0, paddingRight: '24px' }}
                          labelCol={{ span: 0 }}
                          wrapperCol={{ span: 24 }}
                          rules={[{ required: fwxmglList.find((it) => it === '1') ? true : false, message: '此为必填项' }]}
                          initialValue={0}
                        >
                          <InputNumber
                            min={0}
                            max={1000}
                            disabled={handler === 'view' ? true : false}
                            allowClear={handler === 'view' ? false : true}
                            placeholder='请输入'
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4} style={{ paddingRight: 0 }}>
                        <Form.Item label='电话问诊' labelCol={{ span: 16 }} wrapperCol={{ span: 6 }}>
                          <Checkbox
                            disabled={handler === 'view' ? true : false}
                            checked={fwxmglList.find((it) => it === '2') ? true : false}
                            onChange={() => this.fwxmglListchange('2')}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4} style={{ padding: 0 }}>
                        <Form.Item
                          label=''
                          name='dhwzf'
                          style={{ paddingLeft: 0, paddingRight: '24px' }}
                          labelCol={{ span: 0 }}
                          wrapperCol={{ span: 24 }}
                          rules={[{ required: fwxmglList.find((it) => it === '2') ? true : false, message: '此为必填项' }]}
                          initialValue={0}
                        >
                          <InputNumber
                            min={0}
                            max={1000}
                            disabled={handler === 'view' ? true : false}
                            allowClear={handler === 'view' ? false : true}
                            placeholder='请输入'
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4} style={{ paddingRight: 0 }}>
                        <Form.Item label='视频问诊' labelCol={{ span: 16 }} wrapperCol={{ span: 6 }}>
                          <Checkbox
                            disabled={handler === 'view' ? true : false}
                            checked={fwxmglList.find((it) => it === '3') ? true : false}
                            onChange={() => this.fwxmglListchange('3')}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4} style={{ padding: 0 }}>
                        <Form.Item
                          label=''
                          name='spwzf'
                          style={{ paddingLeft: 0, paddingRight: '24px' }}
                          labelCol={{ span: 0 }}
                          wrapperCol={{ span: 24 }}
                          rules={[{ required: fwxmglList.find((it) => it === '3') ? true : false, message: '此为必填项' }]}
                          initialValue={0}
                        >
                          <InputNumber
                            min={0}
                            max={1000}
                            disabled={handler === 'view' ? true : false}
                            allowClear={handler === 'view' ? false : true}
                            placeholder='请输入'
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={8}>
                      <Col span={24} style={{ padding: '0 4px 0 5px' }}>
                        <Form.Item
                          label='医生简介'
                          name='ysjj'
                          labelCol={{ span: 2 }}
                          wrapperCol={{ span: 22 }}
                          rules={[{ required: true, message: '此为必填项' }]}
                        >
                          <TextArea
                            disabled={handler === 'view' ? true : false}
                            allowClear={handler === 'view' ? false : true}
                            placeholder='请输入'
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={8}>
                      <Col span={24} style={{ padding: '0 4px 0 5px' }}>
                        <Form.Item
                          label='医生擅长'
                          name='yssc'
                          labelCol={{ span: 2 }}
                          wrapperCol={{ span: 22 }}
                          rules={[{ required: true, message: '此为必填项' }]}
                        >
                          <TextArea
                            disabled={handler === 'view' ? true : false}
                            allowClear={handler === 'view' ? false : true}
                            placeholder='请输入'
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                ) : null}
                <Row gutter={8}>
                  <Col span={24}>
                    <div className='extraInfouserlist'>执业机构信息(必填)</div>
                  </Col>
                </Row>
                {this.getItems()}
              </Col>
              <Col span={3}>
                <Row gutter={8} style={{ paddingLeft: '0' }}>
                  <Col span={24}>
                    <AliyunOSSUpload showUploadList={false} handler={handler} imageUrl={imageUrl} onChange={this.handleChange} />
                  </Col>
                  <Col span={22} style={{ textAlign: 'center' }}>
                    上传头像
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default EditItem;
