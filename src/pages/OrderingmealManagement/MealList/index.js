import React,{Component} from 'react'
import { DeleteOutlined, FileAddOutlined, SearchOutlined ,RollbackOutlined,EditOutlined} from '@ant-design/icons';
import { Form, Col, Row, Input, Button, Popconfirm, Select,Switch,} from 'antd';
import '@ant-design/compatible/assets/index.css';
import '@/layouts/queryList.css';
// import './style.css';
import BtnPermission from '@/components/BtnPermission';
import MealTable from '@/components/MealTable';
import EditItem from './EditItem';
import { orderingmealmanagementApi } from '@/services/basic';
// import { pageSizeChangeApi } from '../../../services/basic';
const InputGroup = Input.Group;
const Option = Select.Option;
class MealList extends Component {
    constructor(props){
        super(props)
        this.state = {
          data: [],
          records:[],
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
    // console.log(pagination.pageSize)
    // orderingmealmanagementApi.pageSizeChange(pagination.pageSize,pagination.current).then((res) => {
    //   this.setState({ data: res, records: res.records });
    //   console.log(this.state.data)
    // });
    this.queryData(pagination);
    
    
  };

  // onShowSizeChange=(pagination)=>{
    
   
  // }

    //增、改一条数据后刷新列表
  editItemDone = () => {
    this.queryData();
  };

  //增查改、设置操作类型，并传入对应行数据
  setHandler = (handler, record) => {
    this.EditItemRef.showModal(handler, record);
  };

  //删除一条数据后刷新列表
  deleteItem = (record) => {
    orderingmealmanagementApi.delete(record.id).then((res) => {
      this.queryData();
    });
  };

    //查找框查找数据
    queryData = (pagination = undefined) => {
      let formData = this.form.getFieldsValue();
      orderingmealmanagementApi.getPage({ formData, pagination }).then((res) => {
        // console.log(pagination,formData,res)
        this.setState({ data: res, records: res.records });
      });
    };
    //餐品在售状态更改
    ztChange=(record)=>{
      record.zszt=Number(!record.zszt)
      orderingmealmanagementApi.put(record).then((res)=>{
        this.queryData();
        console.log(record)
      })
    }

    //餐品作废
    cpzf=(id)=>{
      orderingmealmanagementApi.change(id).then((res) => {
        console.log(id)
        this.queryData();
      });
    }
      
      render() {
        const { create, update } = this.state.handlers;
        const columns = [
          {title: '餐品名称',dataIndex: 'cpmc',className:"table-thead"},
          {
            title: '餐品类型',
            key: 'cplx',
            render:(record)=>{
              switch(record.cplx){
                case 0:
                  return '主食'
                case 1:
                  return '全荤'
                case 2:
                  return '半荤半素'
                case 3:
                  return '全素'
                case 4:
                  return '小吃'
                case 5:
                  return '汤类'
              }
                
            }  
          },
          {
            title: '价格',
            key: 'cpjg',
            render:(render)=>{
              return render.cpjg.toFixed(2)
            }
          },
          {
            title: '每日份数',
            key: 'mrtgfs',
            render:(render)=>{
              return render.mrtgfs+'份'
            }
          },
          {
            title: '剩余份数',
            key: 'mrsyfs',
            render:(render)=>{
              return render.mrsyfs+'份'
            }
          },
          {
            title: '在售状态',
            key:'zszt', 
            render:(record)=>(
              <Switch checkedChildren="在售" unCheckedChildren="下架" checked={record.zszt===1? true:false} onClick={this.ztChange.bind(this,record)}/>
            )
          },
          {
            title: '操作',
            key: 'action',
            fixed:'right',
            render: (record) => (
              <span className='handleButton'>
                <Button type="link" icon={<EditOutlined />} onClick={() => this.setHandler(update, record)}>编辑</Button>
                <Popconfirm
                      title="确定删除这条记录吗?"
                      onConfirm={() => this.deleteItem(record)}
                      // onCancel={this.cancel}
                      okText="确定"
                      cancelText="取消"
                  >
                      <Button type="link" icon={<DeleteOutlined/>}>删除</Button>
                </Popconfirm>
                
              </span>
            ),
          },
        ];
        return (
          <div className='queryList'>
          <Form autoComplete='off' ref={(form) => (this.form = form)} layout='inline'>
            <InputGroup className='input-group'>
              <Row>
                <Col span={5}>
                  <Form.Item label='餐品名称' name='cpmc' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                    <Input allowClear placeholder='输入餐品名称' />
                  </Form.Item>
                </Col>
                <Col span={4}>
                <Form.Item label='类型' name='cplx'>
                    <Select allowClear placeholder='选择餐品类型'>
                      <Option value={0}>主食</Option>
                      <Option value={1}>全荤</Option>
                      <Option value={2}>半荤半素</Option>
                      <Option value={3}>全素</Option>
                      <Option value={4}>小吃</Option>
                      <Option value={5}>汤类</Option>
                      {/* {this.props.bookRender('cddj')} */}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label='状态' name='zszt'>
                    <Select allowClear placeholder='状态'>
                      <Option value={0}>下架</Option>
                      <Option value={1}>在售</Option>
                    </Select>
                  </Form.Item>
                </Col>
                {/* <Col span={2}>
                  
                </Col> */}
                <Col span={3}>
                <span style={{marginRight:"10px",color:"#0079FE",fontWeight:"bold"}}>高级搜索</span>
                  <Button onClick={(e) => this.queryData(e)} icon={<SearchOutlined />} type="primary">
                    查询
                  </Button>
                </Col>
                <Col span={6}>
                    <Button icon={<RollbackOutlined />} style={{color:"#a9a9a9"}} onClick={() => {this.form.resetFields();}} >
                      重置
                    </Button>
                </Col>
                <Col span={2}>
                    <Button icon={<FileAddOutlined />} type="primary" onClick={() => this.setHandler(create)}>
                      新增
                    </Button>
                </Col>
              </Row>
            </InputGroup>
          </Form>
          <div>
          <MealTable
          props={{
            columns,
            dataSource: this.state.records,
            data:this.state.data,
            setHandler: this.setHandler,
            onChange: this.onChange,
            onShowSizeChange:this.onShowSizeChange,
            permission: this.props.permission,
          }}
        />
          {/* <Table
            columns={columns}
            dataSource={this.state.records}
            // rowKey={(a) => `${a.dj}${a.id}`}
            // pagination={false}
            // onRow={(record) => {
            //   return {
            //     onDoubleClick: (event) => this.setHandler('view', record),
            //   };
            // }}
          /> */}
        </div>
          
          <div>
            <EditItem
              ref={(EditItemRef) => (this.EditItemRef = EditItemRef)}
              editItemDone={this.editItemDone}
              bookRender={this.props.bookRender}
              modalfoot={this.props.modalfoot}
            />
          </div>
        </div>
         
        )
      };
      
}

export default BtnPermission(MealList);