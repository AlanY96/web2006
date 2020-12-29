import React, { Component } from 'react';
import { Table } from 'antd';

export default class MealTable extends Component {
  render() {
    const { columns, dataSource, data, setHandler, onChange} = this.props.props;
    return (
      <div style={{ padding: '10px' }}>
        <Table
          rowKey={(r) => r.id}
          columns={columns}
          dataSource={dataSource}
          hideOnSinglePage
          size='small'
          pagination={{
            total: data.total,
            defaultPageSize: 1,
            pageSize: data.size,
            position: '',
            current: data.current,
           
            // showSizeChanger:true
      
            // showTotal: (total) => `共计 ${total} 条数据`,
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