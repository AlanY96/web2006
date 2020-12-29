// file：相对通用的高阶组件，提供比如：history, 字数字典，页面设置之类的通用数据 , author: jianghainan, date: 2020-07-23
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { message, Select, Button } from 'antd';
import { dataBookApi, menuApi } from '@/services/basic';

// 新组件
const NewComponet = (props) => {
  const { Child, childParams } = props;
  // 接受传参
  const {
    dataBook, // 请求数据字典：{} 或 undefind
    permission, // 是否取消请求权限  bool  默认：false
  } = childParams;

  // 状态数据
  const [dataState, setData] = useState({
    permission: {}, // 按钮权限
    dataBook: {}, // 数据字典
  });

  // 弹窗按钮权限
  const modalfoot = (handler, hideModal, handleOk) => {
    return handler === 'view'
      ? [
        <Button key='back' onClick={hideModal}>
          关闭
          </Button>,
      ]
      : [
        <Button key='back' onClick={hideModal}>
          取消
          </Button>,
        <Button key='submit' type='primary' onClick={handleOk}>
          保存
          </Button>,
      ];
  };

  // 数据字典请求
  const getDataBook = () => {
    const keys = Object.keys(dataBook);
    const params = {
      lxs: keys.join(','),
    };
    dataBookApi.getByDm(params).then((res) => {
      const hash = {};
      res.forEach((element) => {
        const sjbm = element.sjbm;
        if (dataBook[sjbm]) {
          hash[dataBook[sjbm]] = element.sjzds;
        }
      });
      setData((state) => ({ ...state, dataBook: hash }));
    });
  };
  // 数据字典
  // sname,  字段名称
  // isNum，选项 value类型，true: 数字，false: 字符串，   默认 true
  // list，数据列表，可不传
  const bookRender = (sname, isNum = true, list) => {
    // 没传字段名称
    if (!sname) {
      return [];
    }
    const listData = list || dataState.dataBook[sname];
    // 没有当前字段数据
    if (!listData) {
      return [];
    }
    return listData.map((val) => (
      <Select.Option key={val.sjbm} value={isNum ? Number(val.sjbm) : String(val.sjbm)}>
        {val.sjmc}
      </Select.Option>
    ));
  };

  // 自定义 sessionStorage 中取值的方法
  const getSessionItem = (item, name) => {
    const sesItem = JSON.parse(sessionStorage.getItem(item));
    if (!sesItem) {
      message.warning('sessionStorage数据缺失, 请刷新页面或重新登录');
    }
    if (name) {
      return sesItem[name];
    }
    return sesItem;
  };

  // 查询菜单的按钮权限
  const getBtnPermission = async (id) => {
    const res = await menuApi.getBtns(id);
    const btns = {
      增加: 'add',
      删除: 'delete',
      修改: 'edit',
      查询: 'review',
    };
    const perm = {};
    for (const item of res) {
      const name = item.mc;
      if (btns[name]) {
        perm[btns[name]] = true;
      }
    }
    setData((state) => ({ ...state, permission: perm }));
  };

  useEffect(() => {
    // 数据字典
    if (dataBook) {
      const keys = Object.keys(dataBook);
      getDataBook({
        zdlxdmIN: keys.join(','),
        ztbz: 1,
      });
    }
    // 菜单权限
    if (!permission) {
      // 接口查询，用户当前模块的按钮权限
      const mjcds = getSessionItem('mjCds');
      const path = props.history.location.pathname;
      const curCd = mjcds.find((item) => item.tzdz === path);
      let id = '';
      if (curCd) {
        id = curCd.id;
      }
      if (id) {
        getBtnPermission(id);
      }
    }
  }, []);

  return Child ? <Child {...props} {...dataState} bookRender={bookRender} modalfoot={modalfoot} /> : <div></div>;
};
export default withRouter(NewComponet);
