import request from '@/utils/request'


// 角色管理---角色列表
export function roleList(data) {
  return request({
      url: '/company/companyRole/list',
      method: 'get',
      params:data,
      headers: {
          showLoading: true
      }
  })
}



// 角色管理---增加角色
export function insertRole(data) {
  return request({
      url: '/company/companyRole/insert',
      method: 'post',
      data,
      headers: {
          showLoading: true
      }
  })
}


// 角色管理---修改角色
export function updateRole(data) {
  return request({
      url: '/company/companyRole/update',
      method: 'put',
      data,
      headers: {
          showLoading: true
      }
  })
}


// 角色管理---删除角色
export function deleteRole(data) {
  return request({
      url: '/company/companyRole/delete',
      method: 'delete',
      params:data,
      headers: {
          showLoading: true
      }
  })
}

//角色管理--- 获取权限树
export function listTreeByClientCode(data) {
  return request({
      url: '/base/clientMenu/listTreeByClientCode',
      method: 'get',
      params:data,
      headers: {
          showLoading: true
      }
  })
}


//角色管理--- 根据角色ID获取菜单ID列表
export function roleListMenuIdByRoleId(data) {
  return request({
      url: '/company/roleMenu/listMenuIdByRoleId',
      method: 'get',
      params:data,
      headers: {
          showLoading: true
      }
  })
}


//角色管理--- 更新自定义角色菜单
export function updateCustomRoleMenu(data) {
  return request({
      url: '/company/roleMenu/updateCustomRoleMenu',
      method: 'put',
      data,
      headers: {
          showLoading: true
      }
  })
}

