export const getEnums = {
  url: 'workcommon/apiEnums',
  desc: '查询枚举'
}

export const groupTeamQueryList = {
  url: 'groupTeam/query/list',
  desc: '查询组队单'
}

export const groupTeamDetails = {
  url: 'groupTeam/groupTeamDetails/',
  desc: '根据id查询组队单'
}

export const listSearchHistory = {
  url: 'groupTeam/search/history/pageQuery',
  desc: '获取查询历史'
}

export const groupTeamSearch = {
  url: 'groupTeam/search/byKeyWord',
  desc: '组队单搜索'
}

export const getFileToken = {
  url: 'file/token',
  desc: '文件/图片上传获取token'
}

export const groupTeamQueryUsers = {
  url: 'pss/group/attendees',
  desc: '查询参与当前组队单的用户信息'
}

export const labelList = {
  url: 'pss/label/list',
  desc: '查询所有标签'
}

export const phone = {
  url: 'wx/phone',
  desc: '绑定手机号'
}

export const login = {
  url: 'wx/login',
  desc: '注册'
}

export const getUserInfo = {
  url: 'user/getUserInfo',
  desc: '获取登录用户信息'
}

export const groupTeamQueryInvolveGroups = {
  url: 'groupTeam/query/involveGroups',
  desc: '我参与过的组队单'
}

export const groupTeamQueryViewedGroups = {
  url: 'groupTeam/query/viewedGroups',
  desc: '我浏览过的组队单'
}

export const groupTeamQueryListByUser = {
  url: 'groupTeam/query/listByUser',
  desc: '我创建的组队单'
}

export const groupTeamRelationList = {
  url: '/pss/group/list',
  desc: '相关模块统一接口'
}

export const updateUserInfo = {
  url: 'user/updateUserInfo',
  desc: '更新用户信息'
}

export const groupTeamSaveTeam = {
  url: 'groupTeam/saveTeam',
  desc: '保存/更新用户信息'
}

export const getUserInfoById = {
  url: 'user/getUserInfoById',
  desc: '根据用户id获取用户信息'
}

export const groupTeamSelelctGroupTeamUserStatus = {
  url: (id) => `groupTeam/selelctGroupTeamUserStatus/${id}`,
  desc: '获取用户与组队单关系'
}