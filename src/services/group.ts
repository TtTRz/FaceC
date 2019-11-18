import request from '@/utils/request';
import {API} from "@/services/apis";
import PathToRegexp from 'path-to-regexp'

// 获取分组列表
export interface GroupParamsType {
  limit?: number,
  page?: number,
  title?: string,
}

export async function getGroupList(payload: GroupParamsType): Promise<any> {
  return request(API.GROUP.LIST, {
    method: 'GET',
    params: {
      limit: payload.limit,
      page: payload.page,
      title: payload.title,
    }
  });
}


// 获取分组列表信息
export interface GroupEntitiesType {
  ids: [],
}

export async function fetchList(payload: GroupEntitiesType): Promise<any> {
  return request(API.GROUP.MGET, {
    method: 'POST',
    data: {
      ids: payload.ids,
    }
  })
}

// 新增分组
export interface addGroupType {
  title: string,
  description: string,
}

export async function addGroup(payload: addGroupType): Promise<any> {
  return request(API.GROUP.ADD, {
    method: 'POST',
    data: {
      title: payload.title,
      description: payload.description,
    }
  })
}

//修改分组
export interface editGroupType {
  id: number,
  title: string,
  description: string,
}

export async function editGroup(payload: editGroupType): Promise<any> {
  const pattern = PathToRegexp.compile(API.GROUP.CURD);
  return request(pattern({ gid: payload.id }), {
    method: 'PUT',
    data: {
      title: payload.title,
      description: payload.description,
    }
  })
}

//删除分组
export interface delGroupType {
  id: number,
}

export async function delGroup(payload: delGroupType): Promise<any> {
  const pattern = PathToRegexp.compile(API.GROUP.CURD);
  return request(pattern({ gid: payload.id }), {
    method: 'DELETE',

  })
}


// 获取所有分组成员信息

export interface fetchManageListType {
  id: number,
}

export async function fetchManageList(payload: fetchManageListType): Promise<any> {
  const pattern = PathToRegexp.compile(API.GROUP.MANAGE.LIST);
  return request(pattern({ gid: payload.id }), {
    method:'GET',
  })
}

// 批量上传脸谱

export interface mpostManageListType {
  fileList: any,
  id: number,
}

export async function mpostManageList(payload: mpostManageListType): Promise<any> {
  const pattern = PathToRegexp.compile(API.GROUP.MANAGE.MPOST);
  const formData = new FormData();
  payload.fileList.forEach((file: any) => {
    console.log(file)
    formData.append('faces', file);
  });
  return request(pattern({ gid: payload.id }) + "?debug=1", {
    method: 'post',
    data: formData,
  })
}

// 批量删除脸谱

export interface delManageListType {
  ids: [],
  id: number,
}

export async function delManageList(payload: delManageListType): Promise<any> {
  const pattern = PathToRegexp.compile(API.GROUP.MANAGE.DEL);
  return request(pattern({ gid: payload.id }), {
    method: 'DELETE',
    data: {
      ids: payload.ids,
    }
  })
}

