/**
 * @author: YINJUN
 * @Date: 2020-10-22 19:58:55
 * @description: 排班详情页
 */
import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Modal, Row, Col, message, Checkbox, DatePicker, Table } from 'antd';
import '@/layouts/handleList.css';
import './style.css';
import moment from 'moment';
// import MyTable from '@/components/MyTable';
import { workforcemanagementApi } from '@/services/basic';
class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: undefined,
      visible: false,
      handler: undefined, //当前正在执行的操作类型
      columns: [],
      record: {},
      currpb: [],
    };
  }

  //弹出操作页面
  showModal = (handler, record) => {
    //如果是新增操作 那直接展示弹出框 赋值操作类型
    this.setState({ visible: true, handler, record });
    const { id } = record;
    const currdate = moment().format('YYYYMMDD');
    workforcemanagementApi.getWorkforce(id, currdate).then((res) => {
      const columns = res.map((it) => {
        const am = it.yspbmxList.find((ite) => ite.sxw === 1 && ite.jzbz === 1);
        const pm = it.yspbmxList.find((ite) => ite.sxw === 2 && ite.jzbz === 1);
        const wan = it.yspbmxList.find((ite) => ite.sxw === 3 && ite.jzbz === 1);
        let currData = {
          ...it,
          am: am ? true : false,
          pm: pm ? true : false,
          wan: wan ? true : false,
          sfsy: it.sfsy ? it.sfsy : 0,
          weekname: this.getWeekDay(it.weekday),
        };
        return currData;
      });
      this.setState({ currpb: columns });
    });
  };

  //关闭操作页面
  hideModal = () => {
    this.setState(
      {
        id: undefined,
        visible: false,
        handler: undefined, //当前正在执行的操作类型
        columns: [],
        record: {},
        currpb: [],
      },
      () => this.form.resetFields()
    );
  };

  //Modal框自带的取消操作
  handleCancel = () => {
    this.hideModal();
  };

  //Modal框自带的确认操作
  handleOk = () => {
    const { currpb } = this.state;
    const bbb = currpb.map((item) => {
      let zao = { qssj: '08:00', jzsj: '11:30', sxw: 1 };
      let xia = { qssj: '13:30', jzsj: '16:30', sxw: 2 };
      let wna = { qssj: '18:30', jzsj: '20:00', sxw: 3 };
      const ams = item.yspbmxList.find((ite) => ite.sxw === 1);
      if (item.am) {
        if (ams) {
          zao = { ...ams, jzbz: 1 };
        } else {
          zao = { ...zao, jzbz: 1 };
        }
      } else {
        zao = { ...zao, ...ams, jzbz: 0 };
      }
      const pms = item.yspbmxList.find((ite) => ite.sxw === 2);
      if (item.pm) {
        if (pms) {
          xia = { ...pms, jzbz: 1 };
        } else {
          xia = { ...xia, jzbz: 1 };
        }
      } else {
        xia = { ...xia, ...pms, jzbz: 0 };
      }
      const wans = item.yspbmxList.find((ite) => ite.sxw === 3);
      if (item.wan) {
        if (wans) {
          wna = { ...wans, jzbz: 1 };
        } else {
          wna = { ...wna, jzbz: 1 };
        }
      } else {
        wna = { ...wna, ...wans, jzbz: 0 };
      }
      item.yspbmxList = []
        .concat(zao)
        .concat(xia)
        .concat(wna)
        .filter((i) => i.qssj);
      return item;
    });
    workforcemanagementApi.post(bbb).then((res) => {
      this.props.editItemDone();
      this.hideModal();
      message.success('操作成功');
    });
  };
  /**
   * @Description: 传入星期数字，返回对应星期
   */
  getWeekDay = (week) => {
    let weekDay = '';
    switch (week) {
      case 2:
        weekDay = '星期一';
        break;
      case 3:
        weekDay = '星期二';
        break;
      case 4:
        weekDay = '星期三';
        break;
      case 5:
        weekDay = '星期四';
        break;
      case 6:
        weekDay = '星期五';
        break;
      case 7:
        weekDay = '星期六';
        break;
      case 1:
        weekDay = '星期日';
        break;
      default:
        weekDay = '';
    }
    return weekDay;
  };
  // 顺延修改
  onratechange = (key, i, val) => {
    const { currpb } = this.state;
    if (currpb[i].am || currpb[i].pm || currpb[i].wan) {
      currpb[i][key] = val ? 1 : 0;
    } else {
      message.error('请先选择排班时间');
      currpb[i][key] = 0;
    }
    this.setState({ currpb });
  };
  valchange = (key, i, val) => {
    const { currpb } = this.state;
    currpb[i][key] = val;
    if (!currpb[i].am && !currpb[i].pm && !currpb[i].wan) {
      currpb[i].sfsy = 0;
    }
    this.setState({ currpb });
  };

  render() {
    const { handler, record, currpb } = this.state;

    const columns = [
      {
        title: '顺延',
        align: 'center',
        dataIndex: 'sfsy',
        key: 'sfsy',
        render: (h, r, i) => {
          return (
            <Checkbox
              defaultChecked={0}
              disabled={handler === 'view' ? true : false}
              checked={h === 1 ? true : false}
              onChange={(e) => this.onratechange('sfsy', i, e.target.checked)}
            />
          );
        },
      },
      {
        title: '星期',
        align: 'center',
        dataIndex: 'yyrq',
        key: 'yyrq',
        render: (h, r, i) => {
          return (
            <>
              <div className='date-style'>{r.weekname}</div>
              {h ? <div className='date-style'>{moment(h, 'YYYYMMDD').format('YYYY-MM-DD')}</div> : null}
            </>
          );
        },
      },
      {
        title: '类型',
        align: 'center',
        children: [
          {
            title: (
              <>
                <div className='date-style'>上午</div> <div className='date-style'>08:00 --- 11:30</div>
              </>
            ),
            dataIndex: 'am',
            key: 'am',
            render: (h, r, i) => {
              return (
                <div className='date-style'>
                  <Checkbox
                    defaultChecked={false}
                    disabled={handler === 'view' ? true : false}
                    checked={h}
                    onChange={(e) => this.valchange('am', i, e.target.checked)}
                  />
                </div>
              );
            },
          },
          {
            title: (
              <>
                <div className='date-style'>下午</div> <div className='date-style'>13:30 --- 16:30</div>
              </>
            ),
            dataIndex: 'pm',
            key: 'pm',
            render: (h, r, i) => {
              return (
                <div className='date-style'>
                  <Checkbox
                    defaultChecked={false}
                    disabled={handler === 'view' ? true : false}
                    checked={h}
                    onChange={(e) => this.valchange('pm', i, e.target.checked)}
                  />
                </div>
              );
            },
          },
          {
            title: (
              <>
                <div className='date-style'>晚间</div> <div className='date-style'>18:30 --- 20:00</div>
              </>
            ),
            dataIndex: 'wan',
            key: 'wan',
            render: (h, r, i) => {
              return (
                <div className='date-style'>
                  <Checkbox
                    defaultChecked={false}
                    disabled={handler === 'view' ? true : false}
                    checked={h}
                    onChange={(e) => this.valchange('wan', i, e.target.checked)}
                  />
                </div>
              );
            },
          },
        ],
      },
    ];
    return (
      <div className='handle-header'>
        <Modal
          title=''
          visible={this.state.visible}
          onCancel={this.handleCancel}
          width='900px'
          style={{ top: 80 }}
          maskClosable={false}
          className='handleList'
          footer={this.props.modalfoot(handler, this.handleCancel, this.handleOk)}
        >
          <div className='formHeader'>
            <span className='handle-title'>{`${handler === 'view' ? '查看' : handler === 'create' ? '新增' : '更新'}排班`}</span>
          </div>

          <Form autoComplete='off' onSubmit={this.handleOk} ref={(form) => (this.form = form)}>
            <Row gutter={8}>
              <Col span={7}>
                <Form.Item label='操作时间'>
                  <DatePicker disabled defaultValue={moment()} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='医生姓名'>
                  <Input disabled placeholder='请输入' value={record.yhxm} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='所在科室'>
                  <Input disabled placeholder='请输入' value={record.ksmc} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>
                <Table rowKey={(r, i) => i} size='small' columns={columns} pagination={false} bordered dataSource={currpb}></Table>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default EditItem;
