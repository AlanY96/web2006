/*
 * @Author: your name
 * @Date: 2020-02-28 13:52:33
 * @LastEditTime: 2020-12-16 11:58:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \jxkh-webf:\jcxm-web\src\components\MyRangeDate\index.js
 */
//年份范围暂时不好使 用mode='year'的方式 无法选中对应年份

import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, DatePicker, Col } from 'antd';
const { MonthPicker } = DatePicker;

export default class MyRangeDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null,
      endOpen: false,
      startOpen: false,
    };
  }

  componentWillUnmount = () => {
    this.setState = {
      startValue: null,
      endValue: null,
      endOpen: false,
      startOpen: false,
    };
  };

  //以下为控制起始时间的模块
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onDateChange = (field, value) => {
    this.setState({ [field]: value });
  };

  onStartChange = (value) => {
    this.onDateChange('startValue', value);
    this.setState({ startOpen: false });
  };

  onEndChange = (value) => {
    this.onDateChange('endValue', value);
    this.setState({ endOpen: false });
  };

  handleStartOpenChange = (open) => {
    this.setState({ startOpen: open });
  };

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };

  render() {
    const { startTime, endTime, colSpan, format, type, allowClear, disabled } = this.props;
    let { startValue, endValue, startOpen, endOpen } = this.state;

    return (
      <>
        {type !== 'month' ? (
          <>
            <Col span={colSpan}>
              <Form.Item label='开始时间' name={`${startTime}`} initialValue={startValue}>
                <DatePicker
                  allowClear={allowClear ? allowClear : true}
                  disabled={disabled ? disabled : false}
                  disabledDate={this.disabledStartDate}
                  onChange={this.onStartChange}
                  onOpenChange={this.handleStartOpenChange}
                  format={format}
                  open={startOpen}
                  placeholder='请选择'
                  style={{ minWidth: '150px' }}
                />
              </Form.Item>
            </Col>
            <Col span={colSpan}>
              <Form.Item label='结束时间' name={`${endTime}`} initialValue={endValue}>
                <DatePicker
                  allowClear={allowClear ? allowClear : true}
                  disabled={disabled ? disabled : false}
                  format={format}
                  placeholder='请选择'
                  disabledDate={this.disabledEndDate}
                  onChange={this.onEndChange}
                  open={endOpen}
                  onOpenChange={this.handleEndOpenChange}
                  style={{ minWidth: '150px' }}
                />
              </Form.Item>
            </Col>
          </>
        ) : (
          <>
            <Col span={colSpan}>
              <Form.Item label='开始时间' name={`${startTime}`} rules={[]} initialValue={startValue}>
                <MonthPicker
                  showTime
                  allowClear={allowClear ? allowClear : true}
                  disabled={disabled ? disabled : false}
                  disabledDate={this.disabledStartDate}
                  onChange={this.onStartChange}
                  onOpenChange={this.handleStartOpenChange}
                  format={format}
                  open={startOpen}
                  placeholder='请选择'
                  style={{ minWidth: '150px' }}
                />
              </Form.Item>
            </Col>
            <Col span={colSpan}>
              <Form.Item label='结束时间' name={`${endTime}`} rules={[]} initialValue={endValue}>
                <MonthPicker
                  showTime
                  allowClear={allowClear ? allowClear : true}
                  disabled={disabled ? disabled : false}
                  format={format}
                  placeholder='请选择'
                  disabledDate={this.disabledEndDate}
                  onChange={this.onEndChange}
                  open={endOpen}
                  onOpenChange={this.handleEndOpenChange}
                  style={{ minWidth: '150px' }}
                />
              </Form.Item>
            </Col>
          </>
        )}
      </>
    );
  }
}
