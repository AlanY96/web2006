/*
 * @Author: your name
 * @Date: 2020-02-19 10:53:40
 * @LastEditTime: 2020-12-16 14:33:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \jxkh-webf:\jcxm-web\src\components\MyTable\index.js
 */

import React, { Component } from 'react';
import { Table } from 'antd';

export default class MyTable extends Component {
  render() {
    const { columns, dataSource, data, setHandler, onChange } = this.props.props;
    return (
      <div style={{ padding: '10px' }}>
        <Table
          rowKey={(r) => r.id}
          columns={columns}
          dataSource={dataSource}
          hideOnSinglePage
          size='middle'
          pagination={{
            total: data.total,
            defaultPageSize: 1,
            pageSize: data.size,
            position: '',
            current: data.current,
            showQuickJumper: true,
            showSizeChanger: false,
            showTotal: (total) => `共计 ${total} 条数据`,
          }}
          onChange={onChange}
          onRow={
            setHandler
              ? (record) => {
                  return {
                    onDoubleClick: () => {
                      if (this.props.props && this.props.props.permission && !this.props.props.permission.review) {
                        return;
                      }
                      setHandler('view', record);
                    },
                  };
                }
              : null
          }
          style={{ padding: '10px' }}
        />
      </div>
    );
  }
}
