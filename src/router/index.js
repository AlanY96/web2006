/**
 * @author: YINJUN
 * @Date: 2020-11-11 15:54:16
 * @description: 路由
 */
import { lazy } from 'react';
export default [
  {
    path: '/HomePage',
    children: lazy(() => import('../pages/HomePage')),
  },
  {
    path: '/ErrorPage',
    children: lazy(() => import('../pages/ErrorPage')),
  },
  {
    path: '/Institution',
    children: lazy(() => import('../pages/BasicData/Institution')),
  },
  {
    path: '/HospitalDep',
    children: lazy(() => import('../pages/BasicData/HospitalDep')),
  },
  {
    path: '/AdminDiv',
    children: lazy(() => import('../pages/BasicData/AdminDiv')),
  },
  // 数据字典
  {
    path: '/DataBook',
    children: lazy(() => import('../pages/BasicData/DataBook')),
  },
  {
    path: '/DrugManagement',
    children: lazy(() => import('../pages/BasicData/DrugManagement')),
  },
  {
    path: '/Notice',
    children: lazy(() => import('../pages/PublicityManagement/Notice')),
  },
  {
    path: '/ArticleManagement',
    children: lazy(() => import('../pages/PublicityManagement/ArticleManagement')),
  },
  {
    path: '/Banner',
    children: lazy(() => import('../pages/PublicityManagement/Banner')),
  },
  {
    path: '/NavigationMenu',
    children: lazy(() => import('../pages/PublicityManagement/NavigationMenu')),
  },
  {
    path: '/TagManagement',
    children: lazy(() => import('../pages/PublicityManagement/TagManagement')),
  },
  {
    path: '/OperationLog',
    children: lazy(() => import('../pages/SystemManagement/OperationLog')),
  },
  // 菜单设置
  {
    path: '/MenuSetting',
    children: lazy(() => import('../pages/SystemManagement/MenuSetting')),
  },
  // 角色权限
  {
    path: '/UsersGroup',
    children: lazy(() => import('../pages/SystemManagement/UsersGroup')),
  },
  {
    path: '/SystemPara',
    children: lazy(() => import('../pages/SystemManagement/SystemPara')),
  },
  {
    path: '/ChangePassword',
    children: lazy(() => import('../pages/SystemManagement/ChangePassword')),
  },
  {
    path: '/Rwdd',
    children: lazy(() => import('../pages/SystemManagement/Rwdd')),
  },
  // 菜单设置
  {
    path: '/AdminList',
    children: lazy(() => import('../pages/UserManagement/AdminList')),
  },
  {
    path: '/PatientList',
    children: lazy(() => import('../pages/UserManagement/PatientList')),
  },
  {
    path: '/UsersList',
    children: lazy(() => import('../pages/UserManagement/UsersList')),
  },
  {
    path: '/RegisteredUsers',
    children: lazy(() => import('../pages/UserManagement/RegisteredUsers')),
  },
  {
    path: '/PrescriptionReview',
    children: lazy(() => import('../pages/HealthcareManagement/PrescriptionReview')),
  },
  {
    path: '/WorkforceManagement',
    children: lazy(() => import('../pages/HealthcareManagement/WorkforceManagement')),
  },
  {
    path: '/ConsultationOrder',
    children: lazy(() => import('../pages/HealthcareManagement/ConsultationOrder')),
  },
  {
    path: '/ReportbyOrder',
    children: lazy(() => import('../pages/StatisticalAnalysis/ReportbyOrder')),
  },
  {
    path: '/ReportbyDrugs',
    children: lazy(() => import('../pages/StatisticalAnalysis/ReportbyDrugs')),
  },
  {
    path: '/ReportbyDoctor',
    children: lazy(() => import('../pages/StatisticalAnalysis/ReportbyDoctor')),
  },
  {
    path: '/ReportbyDepartment',
    children: lazy(() => import('../pages/StatisticalAnalysis/ReportbyDepartment')),
  },
  //订餐管理
  {
    path: '/MealList',
    children: lazy(() => import('../pages/OrderingmealManagement/MealList')),
  },

];
