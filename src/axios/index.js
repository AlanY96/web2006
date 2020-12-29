/**
 * @author: YINJUN
 * @Date: 2020-11-12 09:33:50
 * @description: 数据请求封装
 */
import axios from 'axios';
import { message } from 'antd';

//全局的 axios 默认值
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = `http://192.168.8.107:8081/api/`;
  // axios.defaults.baseURL = `http://abc123.vaiwan.com/api/`;
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = `${window.location.origin}/api/`;
}

const autelToken = sessionStorage.getItem('userInfo');
if (autelToken) {
  const { token, userId } = JSON.parse(autelToken);
  axios.defaults.headers.common['AUTH-TOKEN'] = token;
  axios.defaults.headers.common['HEADER-USER-ID'] = userId;
}
axios.defaults.headers.common['CZPT'] = '1';
//请求类型
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
//配置超时时间
axios.defaults.timeout = 15000;
// 添加一个请求拦截器
axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 添加一个响应拦截器
axios.interceptors.response.use(
  (res) => {
    if (res.data !== null) {
      return res;
    }
  },
  (err) => {
    if (err.response) {
      if (err.response.status !== 200 && err.response.status !== 401) {
        message.error(err.response.data.msg);
      } else if (err.response.status === 401) {
        window.location.pathname = '/login';
        sessionStorage.clear();
      }
    } else {
      message.error('服务器连接超时，可尝试刷新页面，若无效请联系管理员');
    }
    return Promise.reject(err);
  }
);
axios.get = (url, params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url,
      params,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res && res.data && res.data.code === '0') {
          resolve(res.data.data);
        } else {
          message.error(res.data.msg);
          reject(res.data.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
axios.post = (url, data, params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url,
      data,
      params,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res && res.data && res.data.code === '0') {
          resolve(res.data.data);
        } else {
          message.error(res.data.msg);
          reject(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
axios.put = (url, data, params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'PUT',
      url,
      data,
      params,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res && res.data && res.data.code === '0') {
          resolve(res.data.data);
        } else {
          message.error(res.data.msg);
          reject(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
axios.del = (url, params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'DELETE',
      url,
      params,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res && res.data && res.data.code === '0') {
          resolve(res.data.data);
          message.success(res.data.msg);
        } else {
          message.error(res.data.msg);
          // reject(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
axios.upload = (url, data, params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url,
      data,
      params,
      headers: {
        'Content-Type': 'multipart/form-data',
      }, //原生获取上传进度的事件
      onUploadProgress: function (progressEvent) {
        // return (((progressEvent.loaded / progressEvent.total) * 100) | 0) + "%";
      },
    })
      .then((res) => {
        if (res && res.data && res.data.code === '0') {
          resolve(res.data.data);
        } else {
          message.error(res.data.msg);
          reject(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const baseURL = axios.defaults.baseURL;
export default axios;
