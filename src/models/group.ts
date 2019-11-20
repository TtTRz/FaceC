import { Reducer } from 'redux';
// import { routerRedux } from 'dva/router';
import { Effect } from 'dva';
// import { stringify } from 'querystring';
import { message } from 'antd';
import {
  addGroup,
  delGroup, delManageList,
  editGroup,
  fetchList,
  fetchManageList,
  getGroupList,
  mpostManageList
} from "@/services/group";

export interface PaginationType {
  limit?: number,
  page?: number,
  total?: number,
}
export interface GroupListItemType {
  title: string,
  description: string,
  update_time: number,
  create_time: number,
  id: number,
  author: {
    nickname: string,
    id: number,
  },
}

export interface ManageListItemType {
  name: string,
  code: string,
  id: number,
  update_time: number,
  create_time: number,
}

export interface GroupModelState {
  group_list: {
    list: GroupListItemType[],
    pagination: PaginationType,
  }
  manage_list: {
    list: ManageListItemType[],
    // pagination: PaginationType,
  }
}

export interface GroupModelType {
  namespace: 'group';
  state: GroupModelState;
  effects: {
    fetchGroupListEffect: Effect;
    addGroupEffect: Effect;
    delGroupEffect: Effect;
    editGroupEffect: Effect;
    fetchManageListEffect: Effect;
    mpostManageListEffect: Effect;
    delManageListEffect: Effect;
  },
  reducers: {
    saveGroupList: Reducer<GroupModelState>
    saveManageList: Reducer<GroupModelState>
  }
}

const GroupModel: GroupModelType = {
  namespace: 'group',

  state: {
    group_list: {
      list: [],
      pagination: {},
    },
    manage_list: {
      list: [],
      // pagination: {},
    }
  },

  effects: {
    *fetchGroupListEffect({ payload }, { call, put }) {
      const response = yield call(getGroupList, payload);
      const { data } = response;
      const { groups } = data;
      // @ts-ignore
      const entities = yield call(fetchList, {ids: groups.map(item => item.id)});
      const list = entities.data;
      const { pagination } = data;
      yield put({
        type: 'saveGroupList',
        payload: {
          pagination,
          list,
        }
      })
    },
    *addGroupEffect({ payload }, { call }) {
      const response = yield call(addGroup, payload);
      console.log(response);
    },
    *delGroupEffect({ payload }, { call }) {
      const response = yield call(delGroup, payload);
      console.log(response);
    },
    *editGroupEffect({ payload }, { call }) {
      const response = yield call(editGroup, payload);
      console.log(response);
    },

    *fetchManageListEffect({ payload }, { call, put }) {
      const response = yield call(fetchManageList, payload);
      const { data } = response;
      yield put({
        type: 'saveManageList',
        payload: {
          list: data,
        }
      })
    },

    *mpostManageListEffect({ payload }, { call }) {
      const response = yield call(mpostManageList, payload);
      const { data } = response;
      payload.onSuccess(true);

    },

    *delManageListEffect({ payload }, { call, put }) {
      try {
        const response = yield call(delManageList, payload);
        console.log(response);
      } catch (e) {
        message.error(e);
      }
    },
  },

  reducers: {
    saveGroupList(state, { payload }): GroupModelState {
      // @ts-ignore
      return {
        ...state,
        group_list: {
          list: payload.list,
          pagination: payload.pagination,
        },
      }
    },
    saveManageList(state, { payload }): GroupModelState {
      // @ts-ignore
      return {
        ...state,
        manage_list: {
          list: payload.list,
          // pagination: payload.pagination,
        }
      }
    }
  }
};

export default GroupModel;
