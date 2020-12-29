import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
// import { NotificationOutlined } from '@ant-design/icons';
import './style.css';
import { Col, Row, Layout } from 'antd';

const { Content } = Layout;
let timer = null;
class HomePage extends Component {
  state = {
    title: '',
    content: '',
    orderReportoption: {},
    orderReportrecords: [],
    orderReportloading: false,
    userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
  };

  onChartReadyCallback () { }

  onChartClick (param, myEcharts) { }

  componentDidMount () {
  }

  componentWillUnmount = () => {
    clearInterval(timer);
  };

  stopRunning = () => {
    clearInterval(timer);
  };

  keepRunning = () => {
    let noticeWidth = this.state.noticeWidth || -this.notice.offsetWidth;
    let boxWidth = this.noticeBox.offsetWidth;
    this.setState(
      {
        noticeWidth,
        boxWidth,
        time: 0,
      },
      () => {
        timer = setInterval(() => {
          let { noticeWidth, boxWidth } = this.state;
          noticeWidth += 50;
          if (noticeWidth - boxWidth < 0) {
            this.setState({ noticeWidth, time: 1 });
          } else {
            clearInterval(timer);
            this.setState({ noticeWidth: -this.notice.offsetWidth, time: 0 }, () => {
              this.keepRunning();
            });
          }
        }, 1000);
      }
    );
  };

  render () {
    const { /*noticeWidth, time, title, content,*/ orderReportoption } = this.state;

    return (
      <Layout>
        {/* <div className='HomePage'>
          <div className='topBar' onMouseEnter={this.stopRunning} onMouseLeave={this.keepRunning}>
            <NotificationOutlined className='topBarIcon' />
            <div ref={(ref) => (this.noticeBox = ref)} className='noticeBox'>
              <span
                ref={(ref) => (this.notice = ref)}
                style={{
                  marginRight: noticeWidth + 'px',
                  transition: 'all ' + time + 's linear',
                }}
              >
                {title !== '' && content !== '' ? `${title}：${content}` : '暂无公告'}
              </span>
            </div>
          </div>
        </div> */}
        <Content>
          <Row>
            <Col span={24}>
              <div className='orderReportoption'>
                <ReactEcharts
                  option={orderReportoption}
                  notMerge={true}
                  lazyUpdate={true}
                  theme={'theme_name'}
                  onChartReady={this.onChartReadyCallback}
                />
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}

export default HomePage;
