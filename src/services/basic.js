import axios from '../axios/index';
import { stringify } from 'qs';

// 通用请求方法
// 查 -- 分页
export const getPageApi = (url, params) => {
  const { formData, pagination } = params;
  // eslint-disable-next-line
  console.log('分页查询条件', formData);
  let queryItems = {};
  if (pagination !== undefined) {
    const { current } = pagination;
    Object.assign(queryItems, { current });
  }

  Object.assign(queryItems, formData);
  return axios.post(url, queryItems);
};
// 查 -- 详情
export const getDetailApi = (url, id) => axios.get(`${url}/${id}`);

// 删 -- 单条
export const deleteDetailApi = (url, id) => axios.del(`${url}/${id}`);

// 增
export const postDetailApi = (url, params) => {
  return axios.post(url, params);
};
// 改
export const putDetailApi = (url, params) => {
  return axios.put(url, params);
};

// 各页面请求方法

/* *************************** 菜单 ***********************/
export const menuApi = {};
// 分页  /cd/selectPage
menuApi.getPage = (params) => getPageApi('cd/selectPage', params);

// 查 /cd/selectById/{id}
menuApi.get = (id) => getDetailApi('cd/selectById', id);

// 删 /cd/delete/{id}
menuApi.delete = (id) => deleteDetailApi('cd/delete', id);

// 增 /cd/createCdb
menuApi.post = (params) => postDetailApi('cd/createCdb', params);

// 改 /cd/update
menuApi.put = (params) => putDetailApi('cd/update', params);

// 查询全部的菜单节点树 /cd
menuApi.getAll = () => axios.get('cd');
// 查询全部的菜单节点树 /cd/selectList
menuApi.getAllList = (params) => axios.post('cd/selectList', params);
menuApi.getAllFind = (params) => getPageApi('cd/selectList', params);

// 查询菜单的按钮权限 /cd/selectBtn/{id}
menuApi.getBtns = (id) => axios.get(`cd/selectBtn/${id}`);

// 查询菜单左侧菜单 /cd/selectCd
menuApi.getLeftMenu = () => axios.get('/cd/selectCd');

// 查询父级菜单 cd/selectParent/{dj}
menuApi.getParent = (dj) => axios.get(`cd/selectParent/${dj}`);

/* *************************** 系统参数 ***********************/
export const systemParaApi = {};
// 分页  xtcs/xtcsList
systemParaApi.getPage = (params) => getPageApi('xtcs/xtcsList', params);

// 查
systemParaApi.get = (id) => getDetailApi('xtcs', id);

// 删
systemParaApi.delete = (id) => deleteDetailApi('xtcs', id);

// 增 /xtcs/createXtcs
systemParaApi.post = (params) => postDetailApi('xtcs/createXtcs', params);

// 改 /xtcs/updateXtcs
systemParaApi.put = (params) => putDetailApi('xtcs/updateXtcs', params);

// 查询系统编号 /xtcs/queryNumber/{csbm}
systemParaApi.getSystemNum = (csbm) => axios.get(`xtcs/queryNumber/${csbm}`);

/* *************************** 数据字典 ***********************/
export const dataBookApi = {};
// 分页 /sjzd/selectPage
dataBookApi.getPage = (params) => getPageApi('sjzd/selectPage', params);

// 查  /sjzd/selectById/{id}
dataBookApi.get = (id) => getDetailApi('sjzd/selectById', id);

// 删   /sjzd/delete/{id}
dataBookApi.delete = (id) => deleteDetailApi('sjzd/delete', id);

// 增   /sjzd/createSjzd
dataBookApi.post = (params) => postDetailApi('sjzd/createSjzd', params);

// 改 /sjzd/updateSjzd
dataBookApi.put = (params) => putDetailApi('sjzd/updateSjzd', params);

// 数据字典搜索（科室 只查体检的） POST  /sjzd/selectSjzdByLx
dataBookApi.getByLx = (params) => axios.post('sjzd/selectSjzdByLx', params);

// 数据字典类型搜索 GET /sjzd/zdlxdm stringify
dataBookApi.getByDm = (params) => axios.get(`sjzd/zdlxdm?${stringify(params)}`);

/* *************************** 用户组 ***********************/
export const userGroupApi = {};
// 分页 /yhz/yhzList
userGroupApi.getPage = (params) => getPageApi('yhz/yhzList', params);

// 查  /yhz/{id}
userGroupApi.get = (id) => getDetailApi('yhz', id);

// 删   /yhz/deleteYhz/{id}
userGroupApi.delete = (id) => deleteDetailApi('yhz/deleteYhz', id);

// 增   /yhz/createYhz
userGroupApi.post = (params) => postDetailApi('yhz/createYhz', params);

// 改   /yhz/updateYhz
userGroupApi.put = (params) => putDetailApi('yhz/updateYhz', params);

// 分页查询 (下拉框使用)  yhzmc:可模糊   /yhz/selectPage
userGroupApi.getSelectOption = (params) => axios.post('yhz/selectPage', params);

/* *************************** 用户、 ***********************/
export const userApi = {};

userApi.getPage = (params) => getPageApi('user/selectYhPage', params);
userApi.get = (id) => getDetailApi(`user/selectYhById`, id);
userApi.delete = (id) => deleteDetailApi(`user/delYh`, id);
userApi.post = (params) => postDetailApi('user/createYh', params);
userApi.put = (params) => putDetailApi('user/updateYhInfo', params);
userApi.getAllByYyid = (yyid) => axios.get(`user/selectYhByYyId/${yyid}`);
userApi.getYhbh = (yhbh) => axios.get(`user/selectYhbh/${yhbh}`);
userApi.getValidPassWord = () => axios.get('user/isValidPassWord');
userApi.putPassWord = (params) => axios.put('user/updatePassWord', params);
userApi.ysExcel = () => axios.get('user/ys_excel');

/* *************************** 就诊人 ***********************/
export const jzrApi = {};
jzrApi.getPage = (params) => getPageApi('jzr/pc_list', params);
jzrApi.get = (id) => getDetailApi('jzr', id);

/* *************************** 行政区划 ***********************/
export const admDivisionApi = {};
// 分页  /xzqh/xzqhList
admDivisionApi.getPage = (params) => getPageApi('xzqh/xzqhList', params);

// 查  /xzqh/{id}
admDivisionApi.get = (id) => getDetailApi('xzqh', id);

// 删  /xzqh/{id}
admDivisionApi.delete = (id) => deleteDetailApi('xzqh', id);

// 增 /xzqh
admDivisionApi.post = (params) => postDetailApi('xzqh', params);

// 改 /xzqh
admDivisionApi.put = (params) => putDetailApi('xzqh', params);

// 查找行政区划 下拉列表或详情 Xzqh 表  post /xzqh/find
admDivisionApi.find = (params) => axios.post('xzqh/find', params);

/* *************************** 医院科室 ***********************/
export const departmentsApi = {};
// 分页 /ks/selectPage
departmentsApi.getPage = (params) => getPageApi('ks/selectPage', params);

// 查 /ks/{id}
departmentsApi.get = (id) => getDetailApi('ks', id);
departmentsApi.getsjks = (yybm) => getDetailApi('ks/selectKsSjid', yybm);

// 删 /ks/{id}
departmentsApi.delete = (id) => deleteDetailApi('ks', id);

// 增 /ks
departmentsApi.post = (params) => postDetailApi('ks', params);

// 改 /ks
departmentsApi.put = (params) => putDetailApi('ks', params);

// 根据医院id 查询所有的 科室id和名称  get /ks/selectAllKs/{id}
departmentsApi.getAllYyks = (id) => axios.get(`/ks/selectAllKs/${id}`);

/* *************************** 医疗机构 ***********************/
export const institutionsApi = {};
// 分页 /yljg/wsjgList
institutionsApi.getPage = (params) => getPageApi('yljg/wsjgList', params);

// 查 /yljg/{id}
institutionsApi.get = (id) => getDetailApi('yljg', id);

// 删 /yljg/deleteYljgById/{id}
institutionsApi.delete = (id) => deleteDetailApi('yljg/deleteYljgById', id);

// 增 /yljg/creatorYljg
institutionsApi.post = (params) => postDetailApi('yljg/creatorYljg', params);

// 改 /yljg/updateYljg
institutionsApi.put = (params) => putDetailApi('yljg/updateYljg', params);

// 查询所有的医疗机构编码和名称 和id GET /yljg/queryAllYljg
institutionsApi.getAll = () => axios.get('yljg/queryAllYljg');

// 查询医疗机构 搜索 POST /yljg/search
institutionsApi.search = (params) => axios.post('yljg/search', params);

// 查询全部 医疗机构id 和 医疗机构名称 创建用户时使用 GET /yljg/selectAll
institutionsApi.getSelectOption = () => axios.get('yljg/queryAllYljg');

// 查询上级医疗机构 POST /yljg/selectSjYljg
institutionsApi.getParent = (params) => axios.post('yljg/selectSjYljg', params);

// 查询医疗机构要使用的 行政区划 POST /yljg/selectYljgXzqh
institutionsApi.getAdmDivision = (params) => axios.post('yljg/selectYljgXzqh', params);

/* *************************** 机构组 ***********************/
export const institutionsGroupApi = {};
// 分页 /yljgz/yljgZuList
institutionsGroupApi.getPage = (params) => getPageApi('yljgz/yljgZuList', params);

// 查 /yljgz/selectYljgZuById/{id}
institutionsGroupApi.get = (id) => getDetailApi('yljgz/selectYljgZuById', id);

// 删 /yljgz/deleteYljgZuById/{id}
institutionsGroupApi.delete = (id) => delete ('yljgz/deleteYljgZuById', id);

// 增 /yljgz/creatYljgZu
institutionsGroupApi.post = (params) => postDetailApi('yljgz/creatYljgZu', params);

// 改  /yljgz/updateYljgZu
institutionsGroupApi.put = (params) => putDetailApi('yljgz/updateYljgZu', params);

// 查询医疗机构组 id 和名称 GET /yljgz/queryYljgZuIdAndZumc
institutionsGroupApi.getSelectOption = () => axios.get('yljgz/queryYljgZuIdAndZumc');

/* *************************** 公告 ***********************/
export const notice = {};
// 分页 /gg/list
notice.getPage = (params) => getPageApi('gg/list', params);

// 查 /gg/{id}
notice.get = (id) => getDetailApi('gg', id);

// 删 /gg/{id}
notice.delete = (id) => deleteDetailApi('gg', id);

// 增 /gg/add
notice.post = (params) => postDetailApi('gg/add', params);

// 改 /gg/update
notice.put = (params) => putDetailApi('gg/update', params);

// 查询当前日期公告 GET /gg/nowGg
notice.getLast = () => axios.get('gg/nowGg');

/* *************************** 登录 ***********************/
export const loginApi = {};

// 用户登录 POST /login
loginApi.login = (params) => postDetailApi('login', params);

// 登出  DELETE /logout
loginApi.logout = () => axios.delete('logout');

// 验证码发送到手机 GET /getCode/{phone}
loginApi.getCode = (phone) => getDetailApi('getCode', phone);

// 手机验证码登录 POST /phoneLogin
loginApi.phoneLogin = (params) => postDetailApi('phoneLogin', params);

// 根据用户名查询用户的医疗机构 POST /selectYhYljg
loginApi.getYljg = (params) => postDetailApi('selectYhYljg', params);

/* *************************** 操作日志 ***********************/
export const operationlogApi = {};

operationlogApi.getPage = (params) => getPageApi('czrz/list', params);
operationlogApi.get = (id) => getDetailApi('czrz', id);

/* *************************** 文章管理 ***********************/
export const articlemanagementApi = {};

articlemanagementApi.getPage = (params) => getPageApi('wzgl/list', params);
articlemanagementApi.get = (id) => getDetailApi('wzgl', id);
articlemanagementApi.delete = (id) => deleteDetailApi('wzgl', id);
articlemanagementApi.post = (params) => postDetailApi('wzgl', params);
articlemanagementApi.put = (params) => putDetailApi('wzgl', params);
articlemanagementApi.putfbzt = (wzglid, fbzt) => axios.put(`wzgl/updateFbzt/${wzglid}/${fbzt}`);

/* *************************** Banner管理 ***********************/
export const bannerApi = {};

bannerApi.getPage = (params) => getPageApi('banner/list', params);
bannerApi.get = (id) => getDetailApi('banner', id);
bannerApi.delete = (id) => deleteDetailApi('banner', id);
bannerApi.post = (params) => postDetailApi('banner', params);
bannerApi.put = (params) => putDetailApi('banner', params);

/* *************************** 药品管理 ***********************/
export const drugmanagementApi = {};

drugmanagementApi.getPage = (params) => getPageApi('drug/list', params);
drugmanagementApi.get = (id) => getDetailApi('drug', id);
drugmanagementApi.delete = (id) => deleteDetailApi('drug', id);
drugmanagementApi.post = (params) => postDetailApi('drug', params);
drugmanagementApi.put = (params) => putDetailApi('drug', params);

/* *************************** 排班管理 ***********************/
export const workforcemanagementApi = {};

workforcemanagementApi.getPage = (params) => getPageApi('yspb/list', params);
workforcemanagementApi.get = (id) => getDetailApi('yspb', id);
workforcemanagementApi.post = (params) => postDetailApi('yspb', params);
// /api/yspb/{ysid}/{yyrq}
workforcemanagementApi.getWorkforce = (ysid, yyrq) => axios.get(`yspb/${ysid}/${yyrq}`);

/* *************************** 标签管理 ***********************/
export const tagmanagementApi = {};

tagmanagementApi.getPage = (params) => getPageApi('bq/list', params);
tagmanagementApi.get = (id) => getDetailApi('bq', id);
tagmanagementApi.post = (params) => postDetailApi('bq', params);
tagmanagementApi.put = (params) => putDetailApi('bq', params);
tagmanagementApi.delete = (id) => deleteDetailApi('bq', id);
tagmanagementApi.getBqByLx = (params) => axios.get('bq/selBqByLx', params);

/* *************************** 文件上传 ***********************/
export const fileuploadApi = {};

fileuploadApi.get = (id) => getDetailApi('file/upload', id);
fileuploadApi.post = (params) => postDetailApi('file/upload', params);
fileuploadApi.upload = (params) => axios.upload('file/upload', params);

/* *************************** 处方 ***************************/
export const prescriptionreviewApi = {};

prescriptionreviewApi.getPage = (params) => getPageApi('yxh/cfxx/list', params);
prescriptionreviewApi.get = (id) => axios.get(`yxh/cfxx/selcfxxbyid?cfid=${id}`);
prescriptionreviewApi.post = (par) => postDetailApi(`yxh/cfxx/updateSfzt?${stringify(par)}`);
prescriptionreviewApi.updateFyzt = (params) => axios.post(`yxh/cfxx/updateFyzt?${stringify(params)}`);

/* ************************ 问诊订单统计 ***********************/
export const FinancialmanagementApi = {};

FinancialmanagementApi.order = (params) => axios.get('/bb/wzsr/rq', params);
FinancialmanagementApi.department = (params) => axios.get('/bb/wzsr/rq', params);
FinancialmanagementApi.docter = (params) => axios.get('/bb/wzsr/rq', params);
FinancialmanagementApi.drugs = (params) => axios.get('/bb/yptj/rq', params);

/* ************************ 问诊单 ***********************/
export const ConsultationorderApi = {};
ConsultationorderApi.getPage = (params) => getPageApi('wzd/list_pc', params);
ConsultationorderApi.getPagedc = (params) => getPageApi('wzd/list_pc_dc', params);
ConsultationorderApi.get = (params) => getDetailApi('wzd/forall', params);
ConsultationorderApi.post = (params) => postDetailApi('wzzj', params);
ConsultationorderApi.post = (params) => postDetailApi('wzzj', params);

/* ************************ OSS文件上传 ***********************/
export const ossApi = {};
ossApi.policy = () => axios.get('oss/policy');

/* ************************ 任务调度 ***********************/
export const RwddApi = {};
RwddApi.getPage = (params) => getPageApi('job/list', params);
RwddApi.rwzxff = () => axios.get('job/getMethod');
RwddApi.add = (params) => axios.post('job/add', params);
RwddApi.put = (params) => putDetailApi('job/edit', params);
RwddApi.del = (id) => deleteDetailApi('job', id);
RwddApi.see = (id) => axios.get(`job/${id}`);

/* ************************ 任务调度log ***********************/
export const RwddLogApi = {};
RwddLogApi.getPage = (params) => getPageApi('job-log/list', params);



