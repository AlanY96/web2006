import React,{Component} from 'react'
import {LoadingOutlined } from '@ant-design/icons';
import { Form, Col, Row, Input, Button, Popconfirm, Select,Space,Modal,message,Switch,Upload } from 'antd';
import '@ant-design/compatible/assets/index.css';
import '@/layouts/queryList.css';
import './style.css';
// import BtnPermission from '@/components/BtnPermission';
import { PlusOutlined} from '@ant-design/icons';
import { orderingmealmanagementApi } from '@/services/basic';
const Option = Select.Option;
class EditItem extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: false,
            id: undefined,
            handler:undefined,
            data: [],
            zszt:0,
            visible:false,
            columns : [
                {title: '餐品名称',dataIndex: 'name'},
                {title: '餐品类型',dataIndex: 'age'},
                {title: '价格',dataIndex: 'sex'},
                {title: '每日份数',dataIndex: 'sex',},
                {title: '剩余份数',dataIndex: 'sex'},
                {title: '在售状态', dataIndex: 'sex'},
                {
                  title: '操作',
                  key: 'action',
                  fixed:'right',
                  render: (record) => (
                    <Space size="middle">
                      <Button type="primary" onClick={this.getUserInfo.bind(this,record)}>查看</Button>
                     <Button type="primary" onClick={this.getUpdateRecord.bind(this,record)}>编辑</Button>
                      <Popconfirm
                            title="确定删除这条记录吗?"
                            onConfirm={this.delUser.bind(this,record.id)}
                            onCancel={this.cancel}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="danger">删除</Button>
                    </Popconfirm>
                      
                    </Space>
                  ),
                },
              ],
          };
    }
    //图片上传
    getBase64=(img, callback)=> {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
      }
    
      beforeUpload=(file)=> {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
      }

      handleChange = info => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          this.getBase64(info.file.originFileObj, imageUrl =>
            this.setState({
              imageUrl,
              loading: false,
            }),
          );
        }
    }

    //弹出操作页面
  showModal = (handler, record) => {
    if (record) {
      //如果有record传过来 说明一定是查看或者更新操作
      const { id } = record;
      console.log('Modal'+id)
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
            visible:false,
    })
    this.form.resetFields();
  };

  //Modal框自带的取消操作
  handleCancel = () => {
    this.hideModal();
  };

  //Modal框自带的确认操作
  handleOk=()=>{
    const requestType = this.state.handler === 'create' ? 'post' : 'put';
    let newItem = this.form.getFieldsValue();
    newItem.id=this.state.id
    newItem.zszt=this.state.zszt
    console.log(newItem)
    this.form.validateFields().then((values) => {
        orderingmealmanagementApi[requestType](newItem).then((res) => {
          this.props.editItemDone();
          this.hideModal();
          message.success('操作成功');
        });
      });
  }

   //餐品在售状态更改
   ztChange=(checked)=>{
        this.setState({zszt:Number(checked)})
    }
  

  //查看单条
  handleView = (id) => {
    this.setState({ id, visible: true });
    if (id) {
        orderingmealmanagementApi.get(id).then((res) => {
            let { cpmc,cpjg,mrtgfs,mrsyfs,jjsm,zszt,cplx,cpsx} = {...res};
            const params = [{cplx,cpsx}];
            const Cplx = params.map((item) => (
                <Option key={item.cpmc} value={item.cpmc}>
                  {item.cplx}
                </Option>
              ));
              const Cpsx = params.map((item) => (
                <Option key={item.cpmc} value={item.cpmc}>
                  {item.cpsx}
                </Option>
              ));
              this.setState({zszt:zszt})
              this.form.setFieldsValue({
                cpmc,
                cpjg,
                mrtgfs,
                mrsyfs,
                jjsm,
                cplx,
                cpsx,
                zszt
            });

      });
    }
  };

      
      render() {
        const { loading, imageUrl } = this.state;
        const uploadButton = (
          <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        );
        return (
          <div>
              <Modal
                title={`${this.state.handler === 'create' ? '新增' : '更新'}餐品`}
                visible={this.state.visible}
                onCancel={this.handleCancel}
                width='800px'
                destroyOnClose="true"
                footer={null}
                maskClosable={false}
                className='handleList'
                // footer={this.props.modalfoot(this.state.handler, this.handleCancel, this.handleOk)}
                >
                 <Form autoComplete='off' onFinish={this.handleOk} ref={(form) => (this.form = form)}>
                 
                    <Row middle="xs" gutter={32} justify="space-around">
                        <Col xs={17}>
                            <Row gutter={16}>
                                <Col span={18}>
                                    <Form.Item
                                        name="cpmc"
                                        label="餐品名称"
                                        rules={[{required: true, message:'此为必填项'}]}
                                        >
                                        <Input placeholder='请填写餐品名称' />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name="zszt"
                                        label="状态"
                                        rules={[{required: true, message:'此为必填项'}]}
                                        >
                                        <Switch checkedChildren="在售" unCheckedChildren="下架" checked={this.state.zszt===1? true:false} onChange={this.ztChange}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label='餐品类型' name='cplx' rules={[{ required: true, message: '此为必填项' }]}>
                                        <Select
                                            placeholder='请选择餐品类型'
                                        >
                                            <Select.Option value={0}>主食</Select.Option>
                                            <Select.Option value={1}>全荤</Select.Option>
                                            <Select.Option value={2}>半荤半素</Select.Option>
                                            <Select.Option value={3}>全素</Select.Option>
                                            <Select.Option value={4}>小吃</Select.Option>
                                            <Select.Option value={5}>汤类</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='餐品属性' name='cpsx' rules={[{ required: true, message: '此为必填项' }]}>
                                        <Select
                                            placeholder='请选择餐品属性'
                                        >
                                            <Select.Option value={0}>低糖</Select.Option>
                                            <Select.Option value={1}>低脂</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row> 
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label='餐品价格' name='cpjg' rules={[{ required: true, message: '此为必填项' }]}>
                                        <Input placeholder="请输入餐品价格" />
                                    </Form.Item>
                                </Col>
                            </Row> 
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label='每日限售份数' name='mrtgfs' rules={[{ required: true, message: '此为必填项' }]}>
                                        <Input placeholder="每日限售份数" />
                                    </Form.Item>
                                </Col>
                                <Col span={12} >
                                    <Form.Item label='当日剩余份数' name='mrsyfs' rules={[{ required: true, message: '此为必填项' }]}>
                                    <Input placeholder="剩余份数" />
                                    </Form.Item>
                                </Col>
                            </Row> 
                        </Col>
                        <Col xs={6}> 
                            <Form.Item
                                name="cptp"
                                label="餐品效果图"
                                // rules={[{required: true, message:'此为必填项'}]}
                                >
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    beforeUpload={this.beforeUpload}
                                    onChange={this.handleChange}
                                >
                                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' ,height:"100%"}} /> : uploadButton}
                                </Upload>
                            </Form.Item>
                        </Col>
                        
                    </Row>

                     <Row><span style={{marginBottom:"10px"}}>餐品介绍</span></Row>
                     
                     <Row>
                         <Col span={24}>
                            <Form.Item name='jjsm'>
                                <Input.TextArea placeholder="请输入介绍信息" maxLength={300} showCount="true"
                               rows={6}
                                />
                            </Form.Item>
                         </Col>
                     </Row>
                     
                      <Form.Item>
                        <div style={{display:"flex",justifyContent:"center"}}>
                          <Button type="primary" htmlType="submit" style={{marginRight:"10px",padding:"5px 40px"}}>
                            提交
                          </Button>
                          <Button htmlType="button" onClick={() => {this.form.resetFields();}} style={{padding:"5px 40px",color:"#0079FE",border:"1px solid #0079FE"}}>
                            重置
                          </Button>
                        </div>
                      </Form.Item>
                        
                </Form>
            </Modal>
          </div>
         
        )
      };
      
}

export default EditItem