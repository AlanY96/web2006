/**
 * @author: YINJUN
 * @Date: 2020-11-13 10:37:05
 * @description: 导出表格为Excel
 */
import React, { Component } from "react";
import { Button, message } from "antd";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
class TableExport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], //data包含了总页数、当前页、页面显示条数等
    };
  }
  daochu = () => {
    const { DCdata } = this.props;
    if (DCdata.length === 0) {
      message.warning("请先查询");
      return;
    }
  };
  render() {
    const { DCdata, name, filename } = this.props;
    return (
      <div>
        {DCdata.length > 0 ? (
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="download-table-xls-button"
            table={name}
            filename={filename}
            sheet={filename}
            buttonText="导 出"
          />
        ) : (
          <Button
            className="search-button"
            onClick={() => {
              this.daochu();
            }}
          >
            导出
          </Button>
        )}
      </div>
    );
  }
}
export default TableExport;
