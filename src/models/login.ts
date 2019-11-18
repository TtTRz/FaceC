import { Reducer } from 'redux';
import { routerRedux } from 'dva/router';
import { Effect } from 'dva';
import { stringify } from 'querystring';

import {checkLoginStatus, userLogin, userLogout} from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

export interface LoginModelState {
  logined?: boolean;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  logined?: any;
  namespace?: string;
  state?: LoginModelState;
  effects: {
    login: Effect;
    logout: Effect;
    checkLogin: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<LoginModelState>;
  };
}


const Model: LoginModelType = {
  namespace: 'login',

  state: {
    logined: false,
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield call(userLogin, payload);
      // Login successfully
      yield put({
        type: 'changeLoginStatus',
        payload: {
          logined: true,
          currentAuthority: 'admin'
        },
      });
      yield put(routerRedux.replace('/'));
    },

    *checkLogin(_, { call, put }) {
      const response = yield call(checkLoginStatus);
      const { data } = response;
      yield put({
        type: 'changeLoginStatus',
        payload: {
          logined: data.status,
          currentAuthority: 'admin'
        },
      });
      if(data.id === null) {

      } else {
        yield put({
          type: 'user/fetchCurrent',
          payload: { id: data.id }
        })
      }
    },
    *logout(_, { put, call }) {
      yield call(userLogout);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          logined: false,
          currentAuthority: 'admin'
        },
      });
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        logined: payload.logined,
      };
    },
  },
};

export default Model;
